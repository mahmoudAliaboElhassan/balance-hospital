import ExcelJS from "exceljs"
import { Download } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"

const ExportDoctorAttendanceReport = ({ reportsAttend, filters }) => {
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)
  const currentLang = i18n.language || "ar"
  const isArabic = currentLang === "ar"
  const isDark = mymode === "dark"

  const exportToExcel = async () => {
    if (!reportsAttend?.rows || reportsAttend.rows.length === 0) {
      alert(t("reports.noDataToExport") || "No data to export")
      return
    }

    const workbook = new ExcelJS.Workbook()
    workbook.creator = "Hospital Management System"
    workbook.created = new Date()

    // ============ SHEET 1: Monthly Summary ============
    const summarySheet = workbook.addWorksheet(
      isArabic ? "ملخص الحضور الشهري" : "Monthly Attendance Summary"
    )

    // Title
    summarySheet.mergeCells("A1:N1")
    const titleCell = summarySheet.getCell("A1")
    titleCell.value = isArabic
      ? `تقرير الحضور - ${reportsAttend.monthNameAr} ${reportsAttend.year}`
      : `Attendance Report - ${reportsAttend.monthNameEn} ${reportsAttend.year}`
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    }
    titleCell.font = {
      bold: true,
      size: 18,
      color: { argb: "FFFFFFFF" },
      name: "Arial",
    }
    titleCell.alignment = { horizontal: "center", vertical: "middle" }
    summarySheet.getRow(1).height = 35

    // Report Info
    let currentRow = 3
    const addInfoRow = (label, value) => {
      summarySheet.getCell(`A${currentRow}`).value = label
      summarySheet.getCell(`A${currentRow}`).font = { bold: true, size: 11 }
      summarySheet.getCell(`A${currentRow}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE5E7EB" },
      }

      summarySheet.mergeCells(`B${currentRow}:N${currentRow}`)
      summarySheet.getCell(`B${currentRow}`).value = value
      summarySheet.getCell(`B${currentRow}`).font = { size: 11 }
      summarySheet.getCell(`B${currentRow}`).border = {
        top: { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        left: { style: "thin", color: { argb: "FFD1D5DB" } },
        right: { style: "thin", color: { argb: "FFD1D5DB" } },
      }
      currentRow++
    }

    addInfoRow(
      isArabic ? "الشهر" : "Month",
      isArabic ? reportsAttend.monthNameAr : reportsAttend.monthNameEn
    )
    addInfoRow(isArabic ? "السنة" : "Year", reportsAttend.year)
    addInfoRow(
      isArabic ? "تاريخ البداية" : "Start Date",
      reportsAttend.startDate
    )
    addInfoRow(isArabic ? "تاريخ النهاية" : "End Date", reportsAttend.endDate)
    addInfoRow(
      isArabic ? "عدد الأيام" : "Days in Month",
      reportsAttend.daysInMonth
    )

    currentRow += 2

    // Table Headers
    const headers = [
      isArabic ? "اسم الطبيب" : "Doctor Name",
      isArabic ? "الرقم القومي" : "National ID",
      isArabic ? "رقم الطباعة" : "Print Number",
      isArabic ? "الدرجة العلمية" : "Scientific Degree",
      isArabic ? "نوع التعاقد" : "Contract Type",
      isArabic ? "التخصص" : "Category",
      isArabic ? "القسم" : "Department",
      isArabic ? "إجمالي الأيام المجدولة" : "Total Scheduled Days",
      isArabic ? "الساعات المجدولة" : "Scheduled Hours",
      isArabic ? "الساعات الفعلية" : "Actual Hours",
      isArabic ? "أيام العمل" : "Days Worked",
      isArabic ? "أيام الغياب" : "Days Absent",
      isArabic ? "أيام التأخير" : "Days Late",
      isArabic ? "أيام في الوقت المحدد" : "Days On Time",
    ]

    headers.forEach((header, idx) => {
      const cell = summarySheet.getCell(currentRow, idx + 1)
      cell.value = header
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF60A5FA" },
      }
      cell.font = {
        bold: true,
        size: 11,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      }
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      }
      cell.border = {
        top: { style: "medium", color: { argb: "FF2563EB" } },
        bottom: { style: "medium", color: { argb: "FF2563EB" } },
        left: { style: "thin", color: { argb: "FF2563EB" } },
        right: { style: "thin", color: { argb: "FF2563EB" } },
      }
      cell.protection = { locked: false }
    })
    summarySheet.getRow(currentRow).height = 30
    currentRow++

    // Data Rows
    reportsAttend.rows.forEach((row, rowIndex) => {
      const rowData = [
        isArabic ? row.doctorNameAr : row.doctorNameEn,
        row.nationalId,
        row.printNumber,
        isArabic ? row.scientificDegreeName : row.scientificDegreeNameEn,
        isArabic ? row.contractingTypeName : row.contractingTypeNameEn,
        isArabic ? row.categoryNameAr : row.categoryNameEn,
        isArabic ? row.departmentNameAr : row.departmentNameEn,
        row.totalScheduledDays,
        row.totalScheduledHours,
        row.totalActualHours,
        row.daysWorked,
        row.daysAbsent,
        row.daysLate,
        row.daysOnTime,
      ]

      rowData.forEach((value, idx) => {
        const cell = summarySheet.getCell(currentRow, idx + 1)
        cell.value = value
        cell.alignment = { horizontal: "center", vertical: "middle" }

        // Alternate row colors
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowIndex % 2 === 0 ? "FFFFFFFF" : "FFF3F4F6" },
        }

        cell.border = {
          top: { style: "thin", color: { argb: "FFD1D5DB" } },
          bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        }
        cell.protection = { locked: false }
      })

      currentRow++
    })

    // Set column widths
    summarySheet.getColumn(1).width = 25
    summarySheet.getColumn(2).width = 15
    summarySheet.getColumn(3).width = 15
    summarySheet.getColumn(4).width = 20
    summarySheet.getColumn(5).width = 20
    summarySheet.getColumn(6).width = 30
    summarySheet.getColumn(7).width = 30
    summarySheet.getColumn(8).width = 18
    summarySheet.getColumn(9).width = 18
    summarySheet.getColumn(10).width = 18
    summarySheet.getColumn(11).width = 15
    summarySheet.getColumn(12).width = 15
    summarySheet.getColumn(13).width = 15
    summarySheet.getColumn(14).width = 18

    // ============ SHEET 2: Daily Attendance Details ============
    reportsAttend.rows.forEach((doctor) => {
      const baseName = isArabic
        ? doctor.doctorNameAr.substring(0, 20)
        : doctor.doctorNameEn.substring(0, 20)
      const randomSuffix = Math.random().toString(36).substring(2, 6)
      const sheetName = `${baseName}_${randomSuffix}`

      const detailSheet = workbook.addWorksheet(sheetName)

      // Doctor Header
      detailSheet.mergeCells("A1:K1")
      const doctorTitle = detailSheet.getCell("A1")
      doctorTitle.value = isArabic
        ? `تفاصيل حضور: ${doctor.doctorNameAr}`
        : `Attendance Details: ${doctor.doctorNameEn}`
      doctorTitle.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E40AF" },
      }
      doctorTitle.font = {
        bold: true,
        size: 16,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      }
      doctorTitle.alignment = { horizontal: "center", vertical: "middle" }
      doctorTitle.border = {
        top: { style: "thick", color: { argb: "FF1E3A8A" } },
        bottom: { style: "thick", color: { argb: "FF1E3A8A" } },
        left: { style: "thick", color: { argb: "FF1E3A8A" } },
        right: { style: "thick", color: { argb: "FF1E3A8A" } },
      }
      detailSheet.getRow(1).height = 30

      // Doctor Info
      let detailRow = 3
      const addDoctorInfo = (label, value) => {
        detailSheet.getCell(`A${detailRow}`).value = label
        detailSheet.getCell(`A${detailRow}`).font = { bold: true, size: 11 }
        detailSheet.getCell(`A${detailRow}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE5E7EB" },
        }
        detailSheet.getCell(`A${detailRow}`).alignment = {
          horizontal: "left",
          vertical: "middle",
        }

        detailSheet.mergeCells(`B${detailRow}:K${detailRow}`)
        detailSheet.getCell(`B${detailRow}`).value = value
        detailSheet.getCell(`B${detailRow}`).font = { size: 11 }
        detailSheet.getCell(`B${detailRow}`).alignment = {
          horizontal: "left",
          vertical: "middle",
        }
        detailSheet.getCell(`B${detailRow}`).border = {
          top: { style: "thin", color: { argb: "FFD1D5DB" } },
          bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
          left: { style: "thin", color: { argb: "FFD1D5DB" } },
          right: { style: "thin", color: { argb: "FFD1D5DB" } },
        }
        detailRow++
      }

      addDoctorInfo(
        isArabic ? "الرقم القومي" : "National ID",
        doctor.nationalId
      )
      addDoctorInfo(
        isArabic ? "رقم الطباعة" : "Print Number",
        doctor.printNumber
      )
      addDoctorInfo(isArabic ? "الهاتف" : "Mobile", doctor.mobile)
      addDoctorInfo(
        isArabic ? "الدرجة العلمية" : "Scientific Degree",
        isArabic ? doctor.scientificDegreeName : doctor.scientificDegreeNameEn
      )

      detailRow += 2

      // Daily Attendance Table Headers
      const dailyHeaders = [
        isArabic ? "اليوم" : "Day",
        isArabic ? "الحالة" : "Status",
        isArabic ? "القسم" : "Department",
        isArabic ? "الساعات المجدولة" : "Scheduled Hours",
        isArabic ? "الساعات الفعلية" : "Actual Hours",
        isArabic ? "وقت الدخول" : "Time In",
        isArabic ? "وقت الخروج" : "Time Out",
        isArabic ? "دقائق التأخير" : "Late Minutes",
        isArabic ? "حالة التحقق" : "Verification Status",
        isArabic ? "استثناء" : "Exception",
        isArabic ? "حالة الاستثناء" : "Exception Status",
      ]

      dailyHeaders.forEach((header, idx) => {
        const cell = detailSheet.getCell(detailRow, idx + 1)
        cell.value = header
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF60A5FA" },
        }
        cell.font = {
          bold: true,
          size: 11,
          color: { argb: "FFFFFFFF" },
          name: "Arial",
        }
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        }
        cell.border = {
          top: { style: "medium", color: { argb: "FF2563EB" } },
          bottom: { style: "medium", color: { argb: "FF2563EB" } },
          left: { style: "thin", color: { argb: "FF2563EB" } },
          right: { style: "thin", color: { argb: "FF2563EB" } },
        }
        cell.protection = { locked: false }
      })
      detailSheet.getRow(detailRow).height = 25
      detailRow++

      // Daily Attendance Data
      if (doctor.dailyAttendanceList && doctor.dailyAttendanceList.length > 0) {
        doctor.dailyAttendanceList.forEach((attendance, attendanceIndex) => {
          const data = attendance.data
          const formatTime = (dateStr) => {
            if (!dateStr) return "-"
            try {
              return new Date(dateStr).toLocaleTimeString(
                isArabic ? "ar-EG" : "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            } catch {
              return "-"
            }
          }

          const departmentNames =
            data.segments
              ?.map((seg) =>
                isArabic ? seg.departmentNameAr : seg.departmentNameEn
              )
              .join(", ") || "-"

          const statusTranslation = {
            OnTime: isArabic ? "في الوقت المحدد" : "On Time",
            Late: isArabic ? "متأخر" : "Late",
            Absent: isArabic ? "غائب" : "Absent",
            EarlyCheckout: isArabic ? "خروج مبكر" : "Early Checkout",
            Incomplete: isArabic ? "غير مكتمل" : "Incomplete",
          }

          const verificationTranslation = {
            AutoVerified: isArabic ? "تحقق تلقائي" : "Auto Verified",
            Pending: isArabic ? "معلق" : "Pending",
            Verified: isArabic ? "محقق" : "Verified",
          }

          const rowData = [
            attendance.day,
            statusTranslation[data.status] || data.status,
            departmentNames,
            data.scheduledHours || 0,
            data.actualHours || 0,
            formatTime(data.timeIn),
            formatTime(data.timeOut),
            data.lateMinutes || 0,
            verificationTranslation[data.verificationStatus] ||
              data.verificationStatus ||
              "-",
            data.hasException
              ? isArabic
                ? "نعم"
                : "Yes"
              : isArabic
              ? "لا"
              : "No",
            data.exceptionStatus || "-",
          ]

          rowData.forEach((value, idx) => {
            const cell = detailSheet.getCell(detailRow, idx + 1)
            cell.value = value
            cell.alignment = { horizontal: "center", vertical: "middle" }
            cell.font = { size: 10, name: "Arial" }

            // Color code status column
            if (idx === 1) {
              if (data.status === "OnTime") {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFD1FAE5" },
                }
                cell.font = {
                  color: { argb: "FF065F46" },
                  bold: true,
                  size: 10,
                }
              } else if (data.status === "Late") {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFEF3C7" },
                }
                cell.font = {
                  color: { argb: "FF92400E" },
                  bold: true,
                  size: 10,
                }
              } else if (data.status === "Absent") {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFEE2E2" },
                }
                cell.font = {
                  color: { argb: "FF991B1B" },
                  bold: true,
                  size: 10,
                }
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: {
                    argb: attendanceIndex % 2 === 0 ? "FFFFFFFF" : "FFF3F4F6",
                  },
                }
              }
            } else {
              // Alternate row colors for other columns
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                  argb: attendanceIndex % 2 === 0 ? "FFFFFFFF" : "FFF3F4F6",
                },
              }
            }

            cell.border = {
              top: { style: "thin", color: { argb: "FFD1D5DB" } },
              bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
              left: { style: "thin", color: { argb: "FFE5E7EB" } },
              right: { style: "thin", color: { argb: "FFE5E7EB" } },
            }
            cell.protection = { locked: false }
          })

          detailRow++
        })
      } else {
        detailSheet.getCell(`A${detailRow}`).value = isArabic
          ? "لا توجد بيانات حضور"
          : "No attendance data"
        detailSheet.mergeCells(`A${detailRow}:K${detailRow}`)
        detailSheet.getCell(`A${detailRow}`).alignment = {
          horizontal: "center",
          vertical: "middle",
        }
        detailSheet.getCell(`A${detailRow}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEF3C7" },
        }
        detailSheet.getCell(`A${detailRow}`).font = {
          italic: true,
          color: { argb: "FF92400E" },
        }
      }

      // Set column widths
      detailSheet.getColumn(1).width = 10
      detailSheet.getColumn(2).width = 18
      detailSheet.getColumn(3).width = 30
      detailSheet.getColumn(4).width = 18
      detailSheet.getColumn(5).width = 18
      detailSheet.getColumn(6).width = 15
      detailSheet.getColumn(7).width = 15
      detailSheet.getColumn(8).width = 15
      detailSheet.getColumn(9).width = 20
      detailSheet.getColumn(10).width = 15
      detailSheet.getColumn(11).width = 20
    })

    // Protect all sheets with full formatting permissions
    workbook.eachSheet((sheet) => {
      sheet.protect("", {
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
    })

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const monthName = isArabic
      ? reportsAttend.monthNameAr
      : reportsAttend.monthNameEn
    link.download = `Attendance_Report_${monthName}_${reportsAttend.year}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportToExcel}
      disabled={!reportsAttend?.rows || reportsAttend.rows.length === 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isDark
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-green-500 hover:bg-green-600 text-white"
      } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
    >
      <Download size={20} />
      <span className="font-medium">
        {isArabic ? "تصدير تقرير الحضور" : "Export Attendance Report"}
      </span>
    </button>
  )
}

export default ExportDoctorAttendanceReport
