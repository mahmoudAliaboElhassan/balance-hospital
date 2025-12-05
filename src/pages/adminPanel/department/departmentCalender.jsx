import React, { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { getDepartmentRosterCalender } from "../../../state/act/actDepartment" // Adjust path
import { formatDate } from "../../../utils/formtDate"
import CollapsibleDateCardForDepartment from "./collapsingDateForDepartment"
import LoadingGetData from "../../../components/LoadingGetData"
import * as ExcelJS from "exceljs"
import { Download } from "lucide-react"
import i18next from "i18next"

function DepartmentCalender() {
  const { rosterId, depId: id } = useParams()
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()

  const {
    departmentRosterData,
    rosterLookup,
    loadinGetDepartmentCalender,
    error,
  } = useSelector((state) => state.department) // Adjust state path as needed

  const { mymode } = useSelector((state) => state.mode)

  const isDark = mymode === "dark"
  const isRTL = i18n.language === "ar"
  const departmentName = isRTL
    ? localStorage.getItem("departmentArabicName")
    : localStorage.getItem("departmentEnglishName")

  useEffect(() => {
    dispatch(
      getDepartmentRosterCalender({
        departmentId: id,
        ids: [rosterId],
      })
    )
  }, [rosterId])

  if (loadinGetDepartmentCalender) {
    return <LoadingGetData text={t("gettingData.departmentCalendar")} />
  }
  console.log("departmentRosterData", departmentRosterData?.[0]?.stats)
  console.log("departmentRosterData for showing", departmentRosterData)

  const formatTime = (timeString) => {
    if (!timeString) return ""
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    )
  }

  const getFillColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400"
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getFillBgColor = (percentage) => {
    if (percentage >= 90) return "bg-green-600 dark:bg-green-500"
    if (percentage >= 70) return "bg-yellow-600 dark:bg-yellow-500"
    return "bg-red-600 dark:bg-red-500"
  }

  // Stats component
  const StatsSection = ({ stats }) => {
    const completionPercentage = stats?.completionPercentage || 0

    const statsCards = [
      {
        key: "totalDays",
        value: stats?.totalDays || 0,
        label: t("stats.totalDays", "Total Days"),
        icon: "📅",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-800 dark:text-blue-200",
        borderColor: "border-blue-200 dark:border-blue-800",
      },
      {
        key: "completeDays",
        value: stats?.completeDays || 0,
        label: t("stats.completeDays", "Complete Days"),
        icon: "✅",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-800 dark:text-green-200",
        borderColor: "border-green-200 dark:border-green-800",
      },
      {
        key: "partialDays",
        value: stats?.partialDays || 0,
        label: t("stats.partialDays", "Partial Days"),
        icon: "⏳",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        textColor: "text-yellow-800 dark:text-yellow-200",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      },
      {
        key: "emptyDays",
        value: stats?.emptyDays || 0,
        label: t("stats.emptyDays", "Empty Days"),
        icon: "❌",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-800 dark:text-red-200",
        borderColor: "border-red-200 dark:border-red-800",
      },
    ]

    return (
      <div className="mb-6">
        {/* Overall Completion */}
        <div
          className={`rounded-lg p-6 mb-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("stats.overallCompletion", "Overall Completion")}
            </h3>
            <span
              className={`text-2xl font-bold ${getFillColor(
                completionPercentage
              )}`}
            >
              {completionPercentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className={`w-full h-3 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${getFillBgColor(
                completionPercentage
              )}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card) => (
            <div
              key={card.key}
              className={`rounded-lg p-4 border ${card.bgColor} ${card.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${card.textColor} opacity-80`}
                  >
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
                <div className="text-2xl opacity-70">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} p-6`}
      >
        <div className="flex items-center justify-center h-64">
          <div
            className={`text-lg text-red-600 ${isDark ? "text-red-400" : ""}`}
          >
            {t("common.error")}: {error}
          </div>
        </div>
      </div>
    )
  }

  if (!departmentRosterData || departmentRosterData.length === 0) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} p-6`}
      >
        <div className="container mx-auto">
          <h1
            className={`text-2xl font-bold mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("roster.departmentCalendar")}
          </h1>
          <div className="flex items-center justify-center h-64">
            <div
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("roster.noDataFound")}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Extract days from the filtered roster data
  const daysList = departmentRosterData.reduce((acc, roster) => {
    if (roster.days && Array.isArray(roster.days)) {
      return [...acc, ...roster.days]
    }
    return acc
  }, [])

  console.log("day list", daysList)

  const currentLang = i18n.language
  const stats = departmentRosterData?.[0]?.stats

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(
      currentLang === "ar" ? "جدول العمل" : "Working Hours"
    )

    const currentYear = new Date().getFullYear()
    const rosterTitle = departmentRosterData?.[0]?.rosterTitle || "Roster"

    // Get all unique shifts and contracting types
    const shiftsMap = new Map()
    const allDates = new Set()

    daysList.forEach((dayData) => {
      allDates.add(dayData.date)
      dayData.shifts.forEach((shift) => {
        if (!shiftsMap.has(shift.shiftNameEn)) {
          shiftsMap.set(shift.shiftNameEn, {
            nameEn: shift.shiftNameEn,
            nameAr: shift.shiftNameAr,
            contractingTypes: new Set(),
          })
        }
        const shiftData = shiftsMap.get(shift.shiftNameEn)
        shiftData.contractingTypes.add(
          currentLang === "ar"
            ? shift.contractingTypeNameAr
            : shift.contractingTypeNameEn
        )
      })
    })

    const sortedDates = Array.from(allDates).sort()
    const shifts = Array.from(shiftsMap.values())

    // Calculate total columns
    let totalCols = 2 // Date + Day
    shifts.forEach((shift) => {
      totalCols += shift.contractingTypes.size
    })

    // Row 1: Year header
    let yearRow = worksheet.getRow(1)
    yearRow.height = 30
    worksheet.mergeCells(1, 1, 1, totalCols)
    const yearCell = worksheet.getCell(1, 1)
    yearCell.value = currentYear.toString()
    yearCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    }
    yearCell.font = {
      bold: true,
      size: 16,
      color: { argb: "FFFFFFFF" },
      name: "Arial",
    }
    yearCell.alignment = { horizontal: "center", vertical: "middle" }
    yearCell.border = {
      top: { style: "thick", color: { argb: "FF1E3A8A" } },
      bottom: { style: "thick", color: { argb: "FF1E3A8A" } },
      left: { style: "thick", color: { argb: "FF1E3A8A" } },
      right: { style: "thick", color: { argb: "FF1E3A8A" } },
    }
    yearCell.protection = { locked: false }

    // Row 2: Department name
    let deptRow = worksheet.getRow(2)
    deptRow.height = 30
    worksheet.mergeCells(2, 1, 2, totalCols)
    const deptCell = worksheet.getCell(2, 1)
    deptCell.value = `${departmentName} - ${rosterTitle}`
    deptCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    }
    deptCell.font = {
      bold: true,
      size: 13,
      color: { argb: "FFFFFFFF" },
      name: "Arial",
    }
    deptCell.alignment = { horizontal: "center", vertical: "middle" }
    deptCell.border = {
      top: { style: "medium", color: { argb: "FF1E40AF" } },
      bottom: { style: "medium", color: { argb: "FF1E40AF" } },
      left: { style: "medium", color: { argb: "FF1E40AF" } },
      right: { style: "medium", color: { argb: "FF1E40AF" } },
    }
    deptCell.protection = { locked: false }

    // Row 3: Shift names
    let currentCol = 1
    let shiftRow = worksheet.getRow(3)
    shiftRow.height = 30

    // Date column (merge rows 3-5)
    worksheet.mergeCells(3, 1, 5, 1)
    const dateHeaderCell = worksheet.getCell(3, 1)
    dateHeaderCell.value = currentLang === "ar" ? "التاريخ" : "Date"
    dateHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF60A5FA" },
    }
    dateHeaderCell.font = {
      bold: true,
      size: 11,
      color: { argb: "FFFFFFFF" },
      name: "Arial",
    }
    dateHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    dateHeaderCell.border = {
      top: { style: "medium", color: { argb: "FF2563EB" } },
      bottom: { style: "medium", color: { argb: "FF2563EB" } },
      left: { style: "medium", color: { argb: "FF2563EB" } },
      right: { style: "medium", color: { argb: "FF2563EB" } },
    }
    dateHeaderCell.protection = { locked: false }

    // Day column (merge rows 3-5)
    worksheet.mergeCells(3, 2, 5, 2)
    const dayHeaderCell = worksheet.getCell(3, 2)
    dayHeaderCell.value = currentLang === "ar" ? "اليوم" : "Day"
    dayHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF60A5FA" },
    }
    dayHeaderCell.font = {
      bold: true,
      size: 11,
      color: { argb: "FFFFFFFF" },
      name: "Arial",
    }
    dayHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    dayHeaderCell.border = {
      top: { style: "medium", color: { argb: "FF2563EB" } },
      bottom: { style: "medium", color: { argb: "FF2563EB" } },
      left: { style: "medium", color: { argb: "FF2563EB" } },
      right: { style: "medium", color: { argb: "FF2563EB" } },
    }
    dayHeaderCell.protection = { locked: false }

    currentCol = 3

    // Shift headers
    shifts.forEach((shift) => {
      const shiftStartCol = currentCol
      const shiftEndCol = currentCol + shift.contractingTypes.size - 1

      worksheet.mergeCells(3, shiftStartCol, 3, shiftEndCol)
      const shiftCell = worksheet.getCell(3, shiftStartCol)
      shiftCell.value = currentLang === "ar" ? shift.nameAr : shift.nameEn
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

    // Row 4: Contracting type headers
    currentCol = 3
    let ctRow = worksheet.getRow(4)
    ctRow.height = 30

    shifts.forEach((shift) => {
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

    // Row 5: Sub-headers (Count)
    currentCol = 3
    let subHeaderRow = worksheet.getRow(5)
    subHeaderRow.height = 25

    shifts.forEach((shift) => {
      shift.contractingTypes.forEach(() => {
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

    // Data rows
    let currentRow = 6
    sortedDates.forEach((date) => {
      const dayData = daysList.find((d) => d.date === date)

      if (dayData) {
        const countRow = worksheet.getRow(currentRow)
        const doctorsRow = worksheet.getRow(currentRow + 1)
        countRow.height = 22
        doctorsRow.height = 40

        // Date cell (merged)
        worksheet.mergeCells(currentRow, 1, currentRow + 1, 1)
        const dateCell = worksheet.getCell(currentRow, 1)
        const formattedDate = new Date(date).toLocaleDateString(
          currentLang === "ar" ? "ar-EG" : "en-US",
          { month: "short", day: "numeric" }
        )
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

        // Day cell (merged)
        worksheet.mergeCells(currentRow, 2, currentRow + 1, 2)
        const dayCell = worksheet.getCell(currentRow, 2)
        dayCell.value =
          currentLang === "ar"
            ? dayData.dayOfWeekNameAr
            : dayData.dayOfWeekNameEn
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

        currentCol = 3

        // For each shift
        shifts.forEach((shiftInfo) => {
          const types = Array.from(shiftInfo.contractingTypes)

          types.forEach((typeName) => {
            const shiftData = dayData.shifts.find((s) => {
              const shiftName =
                currentLang === "ar" ? s.shiftNameAr : s.shiftNameEn
              const ctName =
                currentLang === "ar"
                  ? s.contractingTypeNameAr
                  : s.contractingTypeNameEn
              return (
                shiftName ===
                  (currentLang === "ar"
                    ? shiftInfo.nameAr
                    : shiftInfo.nameEn) && ctName === typeName
              )
            })

            if (shiftData) {
              const assigned = shiftData.assignedDoctors
              const required = shiftData.requiredDoctors
              const doctors = shiftData.doctors || []

              // Count cell
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

              // Doctors cell
              const doctorNames = doctors
                .map((doctor) =>
                  currentLang === "ar"
                    ? doctor.doctorNameAr
                    : doctor.doctorNameEn
                )
                .join(currentLang === "ar" ? " - " : " - ")

              const doctorsCell = worksheet.getCell(currentRow + 1, currentCol)
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
              const doctorsCell = worksheet.getCell(currentRow + 1, currentCol)
              doctorsCell.value = ""
              doctorsCell.protection = { locked: false }
            }
            currentCol++
          })
        })

        currentRow += 2
      }
    })

    // Set column widths
    worksheet.getColumn(1).width = 12 // Date
    worksheet.getColumn(2).width = 12 // Day
    for (let i = 3; i <= totalCols; i++) {
      worksheet.getColumn(i).width = 25
    }

    // Protect worksheet with full formatting permissions
    await worksheet.protect("", {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: true,
      formatColumns: true,
      formatRows: true,
      insertRows: true,
      insertColumns: true,
      deleteRows: true,
      deleteColumns: true,
      sort: true,
      autoFilter: true,
      pivotTables: true,
      insertHyperlinks: true,
    })

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${departmentName}_${rosterTitle}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} p-6`}
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className={`text-2xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.departmentCalendar")} {departmentName}
              </h1>

              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {departmentRosterData[0].rosterTitle}
              </p>
            </div>

            {/* Download Button */}
            <button
              onClick={exportToExcel}
              disabled={daysList.length === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                daysList.length === 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <Download size={16} />
              {currentLang === "ar" ? "تحميل Excel" : "Download Excel"}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        {stats && <StatsSection stats={stats} />}

        {/* Calendar Days */}
        <div className="space-y-4">
          {daysList.map((dayData, index) => (
            <CollapsibleDateCardForDepartment
              key={`${dayData.date}-${index}`}
              dayData={dayData}
              formatDate={formatDate}
              formatTime={formatTime}
              getFillColor={getFillColor}
              getFillBgColor={getFillBgColor}
            />
          ))}
        </div>

        {daysList.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("roster.noDaysFound")}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DepartmentCalender
