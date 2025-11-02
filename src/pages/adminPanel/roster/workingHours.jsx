import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getWorkingHours } from "../../../state/act/actRosterManagement"
import { useTranslation } from "react-i18next"
import LoadingGetData from "../../../components/LoadingGetData"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Search,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Timer,
  UserCheck,
  Download,
} from "lucide-react"
import { getDepartments } from "../../../state/act/actDepartment"
import CollapsibleDateCard from "./collapsWorkingHour"
import i18next from "i18next"
import * as ExcelJS from "exceljs"
import { formatDate } from "../../../utils/formtDate"

function WorkingHours() {
  const { rosterId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const rosterTitle = localStorage.getItem("rosterTitle")

  // State for filters
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    departmentId: "",
  })

  const [showFilters, setShowFilters] = useState(false)

  const { workingHours, loading, errors, rosterDepartments } = useSelector(
    (state) => state.rosterManagement
  )

  const { departments } = useSelector((state) => state.department)
  const { mymode } = useSelector((state) => state.mode)

  // Get current language direction
  const isRTL = i18n.language === "ar"
  const currentLang = i18n.language || "ar"
  const isDark = mymode === "dark"

  useEffect(() => {
    if (rosterId) {
      dispatch(getWorkingHours({ rosterId, params: filters }))
      // Load departments for filter dropdown
      dispatch(getDepartments())
    }
  }, [dispatch, rosterId])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Apply filters
  const applyFilters = () => {
    dispatch(getWorkingHours({ rosterId, params: filters }))
  }

  // Clear filters
  const clearFilters = () => {
    const clearedFilters = {
      startDate: "",
      endDate: "",
      departmentId: "",
    }
    setFilters(clearedFilters)
    dispatch(getWorkingHours({ rosterId, params: clearedFilters }))
  }

  // Format date

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "-"
    const time = new Date(timeString)
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Get fill percentage color
  const getFillColor = (percentage) => {
    if (percentage >= 80) return isDark ? "text-green-400" : "text-green-600"
    if (percentage >= 50) return isDark ? "text-yellow-400" : "text-yellow-600"
    if (percentage >= 25) return isDark ? "text-orange-400" : "text-orange-600"
    return isDark ? "text-red-400" : "text-red-600"
  }

  // Get fill background color
  const getFillBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 50) return "bg-yellow-500"
    if (percentage >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  // Group working hours by date
  const getWorkingHoursByDate = () => {
    if (!workingHours?.data?.departments) return {}

    const groupedByDate = {}

    workingHours.data.departments.forEach((department) => {
      department.shifts.forEach((shift) => {
        shift.contractingTypes.forEach((contractingType) => {
          contractingType.workingHoursDetails.forEach((detail) => {
            const dateKey = detail.shiftDate
            if (!groupedByDate[dateKey]) {
              groupedByDate[dateKey] = {
                date: dateKey,
                dayOfWeek: detail.dayOfWeek,
                dayOfWeekName:
                  currentLang === "en"
                    ? detail.dayOfWeekNameEn
                    : detail.dayOfWeekNameAr,
                departments: [],
              }
            }

            // Find or create department in this date
            let deptGroup = groupedByDate[dateKey].departments.find(
              (d) => d.departmentId === department.departmentId
            )
            if (!deptGroup) {
              deptGroup = {
                departmentId: department.departmentId,
                departmentName:
                  currentLang === "en"
                    ? department.departmentNameEn
                    : department.departmentNameAr,
                shifts: [],
              }
              groupedByDate[dateKey].departments.push(deptGroup)
            }

            // Find or create shift in this department
            let shiftGroup = deptGroup.shifts.find(
              (s) => s.shiftId === shift.shiftId
            )
            if (!shiftGroup) {
              shiftGroup = {
                shiftId: shift.shiftId,
                shiftName:
                  currentLang === "en" ? shift.shiftNameEn : shift.shiftNameAr,
                shiftPeriod: shift.shiftPeriod,
                startTime: shift.startTime,
                endTime: shift.endTime,
                hours: shift.hours,
                contractingTypes: [],
              }
              deptGroup.shifts.push(shiftGroup)
            }

            // Add contracting type with working hour detail
            shiftGroup.contractingTypes.push({
              contractingTypeId: contractingType.contractingTypeId,
              contractingTypeName:
                currentLang === "en"
                  ? contractingType.contractingTypeNameEn
                  : contractingType.contractingTypeNameAr,
              contractingTypeNameEn: contractingType.contractingTypeNameEn,
              workingHourDetail: detail,
            })
          })
        })
      })
    })

    // Sort dates
    return Object.keys(groupedByDate)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = groupedByDate[key]
        return sorted
      }, {})
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(
      currentLang === "ar" ? "جدول العمل" : "Working Hours"
    )

    const groupedData = getWorkingHoursByDate()

    // Get all unique departments, shifts, and contracting types
    const departmentsMap = new Map()
    const allDates = new Set()

    Object.values(groupedData).forEach((dayData) => {
      allDates.add(dayData.date)
      dayData.departments.forEach((dept) => {
        if (!departmentsMap.has(dept.departmentId)) {
          const shiftsMap = new Map()
          departmentsMap.set(dept.departmentId, {
            id: dept.departmentId,
            name: dept.departmentName,
            shifts: shiftsMap,
            dateData: new Map(),
          })
        }

        const deptData = departmentsMap.get(dept.departmentId)
        deptData.dateData.set(dayData.date, {
          dayOfWeekName: dayData.dayOfWeekName,
          department: dept,
        })

        dept.shifts.forEach((shift) => {
          if (!deptData.shifts.has(shift.shiftId)) {
            deptData.shifts.set(shift.shiftId, {
              id: shift.shiftId,
              name: shift.shiftName,
              contractingTypes: new Set(),
            })
          }
          shift.contractingTypes.forEach((ct) => {
            deptData.shifts
              .get(shift.shiftId)
              .contractingTypes.add(ct.contractingTypeName)
          })
        })
      })
    })

    const sortedDates = Array.from(allDates).sort()
    const departments = Array.from(departmentsMap.values())

    const deptColumns = []
    departments.forEach((dept) => {
      const shifts = Array.from(dept.shifts.values())
      let totalCols = 2
      shifts.forEach((shift) => {
        totalCols += shift.contractingTypes.size
      })
      deptColumns.push({
        dept,
        shifts,
        totalCols,
      })
    })

    let currentCol = 1
    const currentYear = new Date().getFullYear()

    // Row 1: Year header
    let yearRow = worksheet.getRow(1)
    yearRow.height = 30
    deptColumns.forEach((deptCol, idx) => {
      if (idx > 0) currentCol++ // gap column

      const startCol = currentCol
      const endCol = startCol + deptCol.totalCols - 1

      worksheet.mergeCells(1, startCol, 1, endCol)
      const cell = worksheet.getCell(1, startCol)
      cell.value = currentYear.toString()
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E40AF" },
      }
      cell.font = {
        bold: true,
        size: 16,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "thick", color: { argb: "FF1E3A8A" } },
        bottom: { style: "thick", color: { argb: "FF1E3A8A" } },
        left: { style: "thick", color: { argb: "FF1E3A8A" } },
        right: { style: "thick", color: { argb: "FF1E3A8A" } },
      }
      cell.protection = { locked: false }

      currentCol += deptCol.totalCols
    })

    // Row 2: Department names
    currentCol = 1
    let deptRow = worksheet.getRow(2)
    deptRow.height = 30
    deptColumns.forEach((deptCol, idx) => {
      if (idx > 0) currentCol++ // gap column

      const startCol = currentCol
      const endCol = startCol + deptCol.totalCols - 1

      worksheet.mergeCells(2, startCol, 2, endCol)
      const cell = worksheet.getCell(2, startCol)
      cell.value = deptCol.dept.name
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2563EB" },
      }
      cell.font = {
        bold: true,
        size: 13,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "medium", color: { argb: "FF1E40AF" } },
        bottom: { style: "medium", color: { argb: "FF1E40AF" } },
        left: { style: "medium", color: { argb: "FF1E40AF" } },
        right: { style: "medium", color: { argb: "FF1E40AF" } },
      }
      cell.protection = { locked: false }

      currentCol += deptCol.totalCols
    })

    // Row 3: Shift names
    currentCol = 1
    let shiftRow = worksheet.getRow(3)
    shiftRow.height = 30
    deptColumns.forEach((deptCol, idx) => {
      if (idx > 0) currentCol++ // gap column

      const startCol = currentCol

      // Merge Date column (rows 3-5)
      worksheet.mergeCells(3, startCol, 5, startCol)
      const dateCell = worksheet.getCell(3, startCol)
      dateCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF60A5FA" },
      }
      dateCell.font = {
        bold: true,
        size: 11,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      }
      dateCell.alignment = { horizontal: "center", vertical: "middle" }
      dateCell.border = {
        top: { style: "medium", color: { argb: "FF2563EB" } },
        bottom: { style: "medium", color: { argb: "FF2563EB" } },
        left: { style: "medium", color: { argb: "FF2563EB" } },
        right: { style: "medium", color: { argb: "FF2563EB" } },
      }
      dateCell.protection = { locked: false }

      // Merge Day column (rows 3-5)
      worksheet.mergeCells(3, startCol + 1, 5, startCol + 1)
      const dayCell = worksheet.getCell(3, startCol + 1)
      dayCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF60A5FA" },
      }
      dayCell.font = {
        bold: true,
        size: 11,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      }
      dayCell.alignment = { horizontal: "center", vertical: "middle" }
      dayCell.border = {
        top: { style: "medium", color: { argb: "FF2563EB" } },
        bottom: { style: "medium", color: { argb: "FF2563EB" } },
        left: { style: "medium", color: { argb: "FF2563EB" } },
        right: { style: "medium", color: { argb: "FF2563EB" } },
      }
      dayCell.protection = { locked: false }

      currentCol += 2

      deptCol.shifts.forEach((shift) => {
        const shiftStartCol = currentCol
        const shiftEndCol = currentCol + shift.contractingTypes.size - 1

        worksheet.mergeCells(3, shiftStartCol, 3, shiftEndCol)
        const shiftCell = worksheet.getCell(3, shiftStartCol)
        shiftCell.value = shift.name
        shiftCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF60A5FA" },
        }
        shiftCell.font = {
          bold: true,
          size: 11,
          color: { argb: "FFFFFFFF" },
          name: "Arial",
        }
        shiftCell.alignment = { horizontal: "center", vertical: "middle" }
        shiftCell.border = {
          top: { style: "medium", color: { argb: "FF2563EB" } },
          bottom: { style: "medium", color: { argb: "FF2563EB" } },
          left: { style: "medium", color: { argb: "FF2563EB" } },
          right: { style: "medium", color: { argb: "FF2563EB" } },
        }
        shiftCell.protection = { locked: false }

        currentCol += shift.contractingTypes.size
      })
    })

    // Row 4: Contracting type headers
    currentCol = 1
    let ctRow = worksheet.getRow(4)
    ctRow.height = 30
    deptColumns.forEach((deptCol, idx) => {
      if (idx > 0) currentCol++ // gap column

      currentCol += 2 // Skip date and day

      deptCol.shifts.forEach((shift) => {
        const types = Array.from(shift.contractingTypes)
        types.forEach((typeName) => {
          const cell = worksheet.getCell(4, currentCol)
          cell.value = typeName
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF93C5FD" },
          }
          cell.font = {
            bold: true,
            size: 10,
            color: { argb: "FF1E3A8A" },
            name: "Arial",
          }
          cell.alignment = { horizontal: "center", vertical: "middle" }
          cell.border = {
            top: { style: "thin", color: { argb: "FF60A5FA" } },
            bottom: { style: "thin", color: { argb: "FF60A5FA" } },
            left: { style: "thin", color: { argb: "FF60A5FA" } },
            right: { style: "thin", color: { argb: "FF60A5FA" } },
          }
          cell.protection = { locked: false }
          currentCol++
        })
      })
    })

    // Row 5: Sub-headers (Date/Day/Count)
    currentCol = 1
    let subHeaderRow = worksheet.getRow(5)
    subHeaderRow.height = 25
    deptColumns.forEach((deptCol, idx) => {
      if (idx > 0) currentCol++ // gap column

      // Date header
      const dateCell = worksheet.getCell(5, currentCol)
      dateCell.value = currentLang === "ar" ? "التاريخ" : "Date"
      dateCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD1D5DB" },
      }
      dateCell.font = {
        bold: true,
        size: 10,
        color: { argb: "FF1F2937" },
        name: "Arial",
      }
      dateCell.alignment = { horizontal: "center", vertical: "middle" }
      dateCell.border = {
        top: { style: "thin", color: { argb: "FF9CA3AF" } },
        bottom: { style: "medium", color: { argb: "FF6B7280" } },
        left: { style: "thin", color: { argb: "FF9CA3AF" } },
        right: { style: "thin", color: { argb: "FF9CA3AF" } },
      }
      dateCell.protection = { locked: false }
      currentCol++

      // Day header
      const dayCell = worksheet.getCell(5, currentCol)
      dayCell.value = currentLang === "ar" ? "اليوم" : "Day"
      dayCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD1D5DB" },
      }
      dayCell.font = {
        bold: true,
        size: 10,
        color: { argb: "FF1F2937" },
        name: "Arial",
      }
      dayCell.alignment = { horizontal: "center", vertical: "middle" }
      dayCell.border = {
        top: { style: "thin", color: { argb: "FF9CA3AF" } },
        bottom: { style: "medium", color: { argb: "FF6B7280" } },
        left: { style: "thin", color: { argb: "FF9CA3AF" } },
        right: { style: "thin", color: { argb: "FF9CA3AF" } },
      }
      dayCell.protection = { locked: false }
      currentCol++

      deptCol.shifts.forEach((shift) => {
        const types = Array.from(shift.contractingTypes)
        types.forEach(() => {
          const cell = worksheet.getCell(5, currentCol)
          cell.value = currentLang === "ar" ? "العدد" : "Count"
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1D5DB" },
          }
          cell.font = {
            bold: true,
            size: 10,
            color: { argb: "FF1F2937" },
            name: "Arial",
          }
          cell.alignment = { horizontal: "center", vertical: "middle" }
          cell.border = {
            top: { style: "thin", color: { argb: "FF9CA3AF" } },
            bottom: { style: "medium", color: { argb: "FF6B7280" } },
            left: { style: "thin", color: { argb: "FF9CA3AF" } },
            right: { style: "thin", color: { argb: "FF9CA3AF" } },
          }
          cell.protection = { locked: false }
          currentCol++
        })
      })
    })

    // Data rows
    let currentRow = 6
    sortedDates.forEach((date) => {
      const dayData = groupedData[date]

      const countRow = worksheet.getRow(currentRow)
      const doctorsRow = worksheet.getRow(currentRow + 1)
      countRow.height = 22
      doctorsRow.height = 40

      currentCol = 1

      deptColumns.forEach((deptCol, deptIdx) => {
        if (deptIdx > 0) currentCol++ // gap column

        const deptDayData = deptCol.dept.dateData.get(date)

        if (deptDayData) {
          const formattedDate = new Date(date).toLocaleDateString(
            currentLang === "ar" ? "ar-EG" : "en-US",
            { month: "short", day: "numeric" }
          )

          const dateColIndex = currentCol

          // Merge date cell
          worksheet.mergeCells(
            currentRow,
            dateColIndex,
            currentRow + 1,
            dateColIndex
          )
          const dateCell = worksheet.getCell(currentRow, dateColIndex)
          dateCell.value = formattedDate
          dateCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE5E7EB" },
          }
          dateCell.font = {
            bold: true,
            size: 10,
            color: { argb: "FF111827" },
            name: "Arial",
          }
          dateCell.alignment = { horizontal: "center", vertical: "middle" }
          dateCell.border = {
            top: { style: "thin", color: { argb: "FF9CA3AF" } },
            bottom: { style: "thin", color: { argb: "FF9CA3AF" } },
            left: { style: "medium", color: { argb: "FF9CA3AF" } },
            right: { style: "medium", color: { argb: "FF9CA3AF" } },
          }
          dateCell.protection = { locked: false }
          currentCol++

          // Merge day cell
          worksheet.mergeCells(
            currentRow,
            currentCol,
            currentRow + 1,
            currentCol
          )
          const dayCell = worksheet.getCell(currentRow, currentCol)
          dayCell.value = deptDayData.dayOfWeekName
          dayCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE5E7EB" },
          }
          dayCell.font = {
            bold: true,
            size: 10,
            color: { argb: "FF111827" },
            name: "Arial",
          }
          dayCell.alignment = { horizontal: "center", vertical: "middle" }
          dayCell.border = {
            top: { style: "thin", color: { argb: "FF9CA3AF" } },
            bottom: { style: "thin", color: { argb: "FF9CA3AF" } },
            left: { style: "medium", color: { argb: "FF9CA3AF" } },
            right: { style: "medium", color: { argb: "FF9CA3AF" } },
          }
          dayCell.protection = { locked: false }
          currentCol++

          // For each shift
          deptCol.shifts.forEach((shiftInfo) => {
            const shiftData = deptDayData.department.shifts.find(
              (s) => s.shiftId === shiftInfo.id
            )

            const types = Array.from(shiftInfo.contractingTypes)
            types.forEach((typeName) => {
              if (shiftData) {
                const ctData = shiftData.contractingTypes.find(
                  (ct) => ct.contractingTypeName === typeName
                )

                if (ctData) {
                  const assigned =
                    ctData.workingHourDetail.currentAssignedDoctors
                  const required = ctData.workingHourDetail.requiredDoctors
                  const doctors = ctData.workingHourDetail.assignedDoctors || []

                  // Count cell - EDITABLE
                  const countCell = worksheet.getCell(currentRow, currentCol)
                  countCell.value = `${assigned}/${required}`
                  countCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF3F4F6" },
                  }
                  countCell.font = {
                    size: 10,
                    color: { argb: "FF111827" },
                    name: "Arial",
                  }
                  countCell.alignment = {
                    horizontal: "center",
                    vertical: "middle",
                  }
                  countCell.border = {
                    top: { style: "thin", color: { argb: "FFD1D5DB" } },
                    bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
                    left: { style: "thin", color: { argb: "FFD1D5DB" } },
                    right: { style: "thin", color: { argb: "FFD1D5DB" } },
                  }
                  countCell.protection = { locked: false }

                  // Doctors cell - EDITABLE
                  const doctorNames = doctors
                    .map((doctor) =>
                      currentLang === "ar"
                        ? doctor.doctorNameAr
                        : doctor.doctorNameEn
                    )
                    .join(currentLang === "ar" ? " - " : " - ")

                  const doctorsCell = worksheet.getCell(
                    currentRow + 1,
                    currentCol
                  )
                  doctorsCell.value = doctorNames || ""
                  doctorsCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFFFFF" },
                  }
                  doctorsCell.font = {
                    size: 9,
                    color: { argb: "FF374151" },
                    name: "Arial",
                  }
                  doctorsCell.alignment = {
                    horizontal: "left",
                    vertical: "middle",
                    wrapText: true,
                    indent: 1,
                  }
                  doctorsCell.border = {
                    top: { style: "thin", color: { argb: "FFE5E7EB" } },
                    bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
                    left: { style: "thin", color: { argb: "FFE5E7EB" } },
                    right: { style: "thin", color: { argb: "FFE5E7EB" } },
                  }
                  doctorsCell.protection = { locked: false }
                } else {
                  const countCell = worksheet.getCell(currentRow, currentCol)
                  countCell.value = ""
                  countCell.protection = { locked: false }
                  const doctorsCell = worksheet.getCell(
                    currentRow + 1,
                    currentCol
                  )
                  doctorsCell.value = ""
                  doctorsCell.protection = { locked: false }
                }
              } else {
                const countCell = worksheet.getCell(currentRow, currentCol)
                countCell.value = ""
                countCell.protection = { locked: false }
                const doctorsCell = worksheet.getCell(
                  currentRow + 1,
                  currentCol
                )
                doctorsCell.value = ""
                doctorsCell.protection = { locked: false }
              }
              currentCol++
            })
          })
        } else {
          for (let i = 0; i < deptCol.totalCols; i++) {
            const countCell = worksheet.getCell(currentRow, currentCol)
            countCell.value = ""
            countCell.protection = { locked: false }
            const doctorsCell = worksheet.getCell(currentRow + 1, currentCol)
            doctorsCell.value = ""
            doctorsCell.protection = { locked: false }
            currentCol++
          }
        }
      })

      currentRow += 2
    })

    // Set column widths
    currentCol = 1
    deptColumns.forEach((deptCol, idx) => {
      if (idx > 0) {
        worksheet.getColumn(currentCol).width = 2
        currentCol++
      }
      worksheet.getColumn(currentCol).width = 12
      currentCol++
      worksheet.getColumn(currentCol).width = 12
      currentCol++

      deptCol.shifts.forEach((shift) => {
        shift.contractingTypes.forEach(() => {
          worksheet.getColumn(currentCol).width = 25
          currentCol++
        })
      })
    })

    // Protect worksheet with FULL FORMATTING permissions
    await worksheet.protect("", {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: true, // Allow formatting cells
      formatColumns: true, // Allow formatting columns
      formatRows: true, // Allow formatting rows
      insertRows: true, // Allow inserting rows
      insertColumns: true, // Allow inserting columns
      deleteRows: true, // Allow deleting rows
      deleteColumns: true, // Allow deleting columns
      sort: true, // Allow sorting
      autoFilter: true, // Allow auto filter
      pivotTables: true, // Allow pivot tables
      insertHyperlinks: true, // Allow inserting hyperlinks
    })

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${rosterTitle}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const groupedWorkingHours = getWorkingHoursByDate()
  const totalWorkingHoursCount = Object.values(groupedWorkingHours).reduce(
    (count, day) =>
      count +
      day.departments.reduce(
        (deptCount, dept) =>
          deptCount +
          dept.shifts.reduce(
            (shiftCount, shift) => shiftCount + shift.contractingTypes.length,
            0
          ),
        0
      ),
    0
  )

  if (loading.fetch) {
    return <LoadingGetData text={t("gettingData.workingHours")} />
  }

  if (errors.general) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-red-500 text-lg mb-4">{errors.general}</div>
              <Link
                to={`/admin-panel/rosters/${rosterId}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("roster.actions.backToRoster")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <Link
              to={`/admin-panel/rosters/${rosterId}`}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("roster.actions.backToRoster")}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors flex items-center gap-2 ${
                  showFilters
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Filter size={16} />
                {t("common.filters")}
              </button>

              <button
                onClick={exportToExcel}
                disabled={Object.keys(groupedWorkingHours).length === 0}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  Object.keys(groupedWorkingHours).length === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <Download size={16} />
                {currentLang === "ar" ? "تحميل Excel" : "Download Excel"}
              </button>

              <button
                onClick={applyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={16} />
                {t("common.refresh")}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-purple-100"
              } rounded-lg`}
            >
              <Clock
                className={`h-8 w-8 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                {t("roster.workingHours.title")}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("roster.workingHours.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6 mb-6`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {t("common.startDate")}
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {t("common.endDate")}
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {t("common.department")}
                </label>
                <select
                  value={filters.departmentId}
                  onChange={(e) =>
                    handleFilterChange("departmentId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">{t("common.allDepartments")}</option>
                  {departments?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {currentLang === "en"
                        ? dept?.nameEnglish
                        : dept?.nameArabic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Search size={16} />
                  {t("common.apply")}
                </button>
                <button
                  onClick={clearFilters}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t("common.clear")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {workingHours?.data?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {totalWorkingHoursCount}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.totalShifts")}
                  </p>
                </div>
                <Timer
                  className={`h-8 w-8 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
            </div>

            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {workingHours.data.summary.totalAssignedDoctors}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.assignedDoctors")}
                  </p>
                </div>
                <UserCheck
                  className={`h-8 w-8 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
            </div>

            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {Object.keys(groupedWorkingHours).length}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.totalDays")}
                  </p>
                </div>
                <Calendar
                  className={`h-8 w-8 ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                />
              </div>
            </div>

            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {Math.round(
                      workingHours.data.summary.overallFillPercentage
                    )}
                    %
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.averageFill")}
                  </p>
                </div>
                <TrendingUp
                  className={`h-8 w-8 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Working Hours by Date */}
        <div className="space-y-6">
          {Object.keys(groupedWorkingHours).length === 0 ? (
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-12 text-center`}
            >
              <Clock
                className={`h-12 w-12 mx-auto mb-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <p
                className={`text-lg ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("roster.noWorkingHours")}
              </p>
            </div>
          ) : (
            Object.values(groupedWorkingHours).map((dayData) => (
              <CollapsibleDateCard
                key={dayData.date}
                dayData={dayData}
                formatDate={formatDate}
                formatTime={formatTime}
                getFillColor={getFillColor}
                getFillBgColor={getFillBgColor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkingHours
