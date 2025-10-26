import ExcelJS from "exceljs"
import { formatDate } from "../../../utils/formtDate"

export const exportDoctorReportToExcel = async (report, currentLang, t) => {
  const workbook = new ExcelJS.Workbook()

  // Set workbook properties
  workbook.creator = "Hospital Management System"
  workbook.created = new Date()

  const isArabic = currentLang === "ar"

  // ============ SHEET 1: Doctor Information & Summary ============
  const summarySheet = workbook.addWorksheet(
    isArabic ? "معلومات الطبيب" : "Doctor Information"
  )

  // Doctor Info Section
  summarySheet.mergeCells("A1:F1")
  const titleCell = summarySheet.getCell("A1")
  titleCell.value = isArabic ? "تقرير الطبيب" : "Doctor Report"
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

  // Personal Information
  let currentRow = 3
  const addInfoRow = (label, value) => {
    summarySheet.getCell(`A${currentRow}`).value = label
    summarySheet.getCell(`A${currentRow}`).font = { bold: true, size: 11 }
    summarySheet.getCell(`A${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" },
    }

    summarySheet.mergeCells(`B${currentRow}:F${currentRow}`)
    summarySheet.getCell(`B${currentRow}`).value = value
    summarySheet.getCell(`B${currentRow}`).font = { size: 11 }
    currentRow++
  }

  addInfoRow(
    isArabic ? "الاسم" : "Name",
    isArabic ? report.nameAr : report.nameEn
  )
  addInfoRow(isArabic ? "البريد الإلكتروني" : "Email", report.email)
  addInfoRow(isArabic ? "رقم الهاتف" : "Phone", report.mobile)
  addInfoRow(isArabic ? "الرقم القومي" : "National ID", report.nationalId)
  addInfoRow(
    isArabic ? "التخصص" : "Category",
    isArabic ? report.categoryNameAr : report.categoryNameEn
  )
  addInfoRow(
    isArabic ? "الدرجة العلمية" : "Scientific Degree",
    isArabic ? report.scientificDegreeNameAr : report.scientificDegreeNameEn
  )
  addInfoRow(
    isArabic ? "نوع التعاقد" : "Contracting Type",
    isArabic ? report.contractingTypeNameAr : report.contractingTypeNameEn
  )

  currentRow += 2

  // Statistics Section
  summarySheet.mergeCells(`A${currentRow}:F${currentRow}`)
  const statsTitle = summarySheet.getCell(`A${currentRow}`)
  statsTitle.value = isArabic ? "الإحصائيات" : "Statistics"
  statsTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2563EB" },
  }
  statsTitle.font = {
    bold: true,
    size: 14,
    color: { argb: "FFFFFFFF" },
  }
  statsTitle.alignment = { horizontal: "center", vertical: "middle" }
  summarySheet.getRow(currentRow).height = 25
  currentRow++

  const stats = [
    [
      isArabic ? "إجمالي النوبات المجدولة" : "Total Scheduled Shifts",
      report.stats.totalScheduledShifts,
    ],
    [
      isArabic ? "النوبات المنجزة" : "Completed Shifts",
      report.stats.completedShifts,
    ],
    [
      isArabic ? "النوبات الملغاة" : "Cancelled Shifts",
      report.stats.cancelledShifts,
    ],
    [
      isArabic ? "النوبات المعلقة" : "Pending Shifts",
      report.stats.pendingShifts,
    ],
    [isArabic ? "أيام الحضور" : "Present Days", report.stats.totalPresentDays],
    [isArabic ? "أيام التأخير" : "Late Days", report.stats.totalLateDays],
    [isArabic ? "أيام الغياب" : "Absent Days", report.stats.totalAbsentDays],
    [
      isArabic ? "أيام الخروج المبكر" : "Early Checkout Days",
      report.stats.totalEarlyCheckoutDays,
    ],
    [
      isArabic ? "الساعات المخصصة" : "Assigned Hours",
      report.stats.totalAssignedHours,
    ],
    [
      isArabic ? "ساعات العمل الفعلية" : "Worked Hours",
      report.stats.totalWorkedHours,
    ],
    [
      isArabic ? "نسبة الحضور" : "Attendance Rate",
      `${report.stats.attendanceRate}%`,
    ],
    [
      isArabic ? "طلبات الإجازة" : "Leave Requests",
      report.stats.totalLeaveRequests,
    ],
    [
      isArabic ? "الإجازات المعتمدة" : "Approved Leaves",
      report.stats.approvedLeaves,
    ],
    [
      isArabic ? "الإجازات المعلقة" : "Pending Leaves",
      report.stats.pendingLeaves,
    ],
    [
      isArabic ? "الإجازات المرفوضة" : "Rejected Leaves",
      report.stats.rejectedLeaves,
    ],
    [
      isArabic ? "طلبات التبديل" : "Swap Requests",
      report.stats.totalSwapRequests,
    ],
    [
      isArabic ? "التبديلات المعتمدة" : "Approved Swaps",
      report.stats.approvedSwaps,
    ],
    [
      isArabic ? "التبديلات المعلقة" : "Pending Swaps",
      report.stats.pendingSwaps,
    ],
    [
      isArabic ? "التبديلات المرفوضة" : "Rejected Swaps",
      report.stats.rejectedSwaps,
    ],
  ]

  stats.forEach(([label, value]) => {
    summarySheet.getCell(`A${currentRow}`).value = label
    summarySheet.getCell(`A${currentRow}`).font = { bold: true, size: 11 }
    summarySheet.getCell(`A${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3F4F6" },
    }

    summarySheet.mergeCells(`B${currentRow}:F${currentRow}`)
    summarySheet.getCell(`B${currentRow}`).value = value
    summarySheet.getCell(`B${currentRow}`).font = { size: 11, bold: true }
    summarySheet.getCell(`B${currentRow}`).alignment = { horizontal: "center" }
    currentRow++
  })

  // Set column widths for summary sheet
  summarySheet.getColumn(1).width = 30
  for (let i = 2; i <= 6; i++) {
    summarySheet.getColumn(i).width = 15
  }

  // ============ SHEET 2: Hours Analysis ============
  const hoursSheet = workbook.addWorksheet(
    isArabic ? "تحليل الساعات" : "Hours Analysis"
  )

  // Header
  hoursSheet.mergeCells("A1:E1")
  const hoursTitle = hoursSheet.getCell("A1")
  hoursTitle.value = isArabic ? "تحليل ساعات العمل" : "Working Hours Analysis"
  hoursTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E40AF" },
  }
  hoursTitle.font = {
    bold: true,
    size: 16,
    color: { argb: "FFFFFFFF" },
  }
  hoursTitle.alignment = { horizontal: "center", vertical: "middle" }
  hoursSheet.getRow(1).height = 30

  // Summary
  currentRow = 3
  const hoursSummary = [
    [
      isArabic ? "إجمالي الساعات المخصصة" : "Total Assigned Hours",
      report.hoursAnalysis.totalAssignedHours,
    ],
    [
      isArabic ? "إجمالي ساعات العمل" : "Total Worked Hours",
      report.hoursAnalysis.totalWorkedHours,
    ],
    [
      isArabic ? "الساعات الإضافية" : "Overtime Hours",
      report.hoursAnalysis.totalOvertimeHours,
    ],
    [
      isArabic ? "نقص الساعات" : "Shortfall Hours",
      report.hoursAnalysis.shortfallHours,
    ],
    [
      isArabic ? "نسبة الامتثال" : "Compliance Percentage",
      `${report.hoursAnalysis.compliancePercentage.toFixed(1)}%`,
    ],
    [
      isArabic ? "حالة الامتثال" : "Compliance Status",
      isArabic
        ? report.hoursAnalysis.complianceStatusAr
        : report.hoursAnalysis.complianceStatus,
    ],
  ]

  hoursSummary.forEach(([label, value]) => {
    hoursSheet.getCell(`A${currentRow}`).value = label
    hoursSheet.getCell(`A${currentRow}`).font = { bold: true, size: 11 }
    hoursSheet.getCell(`A${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" },
    }

    hoursSheet.mergeCells(`B${currentRow}:E${currentRow}`)
    hoursSheet.getCell(`B${currentRow}`).value = value
    hoursSheet.getCell(`B${currentRow}`).font = { size: 11 }
    currentRow++
  })

  currentRow += 2

  // Roster Details Table
  const rosterHeaders = [
    isArabic ? "الجدول" : "Roster",
    isArabic ? "الساعات المخصصة" : "Assigned Hours",
    isArabic ? "ساعات العمل" : "Worked Hours",
    isArabic ? "نسبة الامتثال" : "Compliance %",
  ]

  rosterHeaders.forEach((header, idx) => {
    const cell = hoursSheet.getCell(currentRow, idx + 1)
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
    }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.border = {
      top: { style: "medium" },
      bottom: { style: "medium" },
      left: { style: "thin" },
      right: { style: "thin" },
    }
  })
  hoursSheet.getRow(currentRow).height = 25
  currentRow++

  // Roster data
  report.hoursAnalysis.rosterDetails.forEach((roster) => {
    hoursSheet.getCell(currentRow, 1).value = roster.rosterTitle
    hoursSheet.getCell(currentRow, 2).value = roster.assignedHours
    hoursSheet.getCell(currentRow, 2).alignment = { horizontal: "center" }
    hoursSheet.getCell(currentRow, 3).value = roster.workedHours
    hoursSheet.getCell(currentRow, 3).alignment = { horizontal: "center" }
    hoursSheet.getCell(
      currentRow,
      4
    ).value = `${roster.compliancePercentage.toFixed(1)}%`
    hoursSheet.getCell(currentRow, 4).alignment = { horizontal: "center" }

    // Color code compliance
    const complianceCell = hoursSheet.getCell(currentRow, 4)
    if (roster.compliancePercentage >= 90) {
      complianceCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD1FAE5" },
      }
      complianceCell.font = { color: { argb: "FF065F46" } }
    } else if (roster.compliancePercentage >= 70) {
      complianceCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEF3C7" },
      }
      complianceCell.font = { color: { argb: "FF92400E" } }
    } else {
      complianceCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEE2E2" },
      }
      complianceCell.font = { color: { argb: "FF991B1B" } }
    }

    currentRow++
  })

  // Set column widths
  hoursSheet.getColumn(1).width = 50
  hoursSheet.getColumn(2).width = 20
  hoursSheet.getColumn(3).width = 20
  hoursSheet.getColumn(4).width = 20

  // ============ SHEET 3: Attendance Chart ============
  const chartSheet = workbook.addWorksheet(
    isArabic ? "مخطط الحضور" : "Attendance Chart"
  )

  // Header
  chartSheet.mergeCells("A1:B1")
  const chartTitle = chartSheet.getCell("A1")
  chartTitle.value = isArabic ? "مخطط الحضور" : "Attendance Chart"
  chartTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E40AF" },
  }
  chartTitle.font = {
    bold: true,
    size: 16,
    color: { argb: "FFFFFFFF" },
  }
  chartTitle.alignment = { horizontal: "center", vertical: "middle" }
  chartSheet.getRow(1).height = 30

  currentRow = 3
  const chartData = [
    [isArabic ? "في الوقت المحدد" : "On Time", report.attendanceChart.onTime],
    [isArabic ? "متأخر" : "Late", report.attendanceChart.late],
    [isArabic ? "غائب" : "Absent", report.attendanceChart.absent],
    [
      isArabic ? "خروج مبكر" : "Early Checkout",
      report.attendanceChart.earlyCheckout,
    ],
    [isArabic ? "غير مكتمل" : "Incomplete", report.attendanceChart.incomplete],
  ]

  chartData.forEach(([label, value]) => {
    const labelCell = chartSheet.getCell(currentRow, 1)
    labelCell.value = label
    labelCell.font = { bold: true, size: 11 }
    labelCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" },
    }

    const valueCell = chartSheet.getCell(currentRow, 2)
    valueCell.value = value
    valueCell.font = { size: 11, bold: true }
    valueCell.alignment = { horizontal: "center" }

    currentRow++
  })

  chartSheet.getColumn(1).width = 25
  chartSheet.getColumn(2).width = 15

  // ============ SHEET 4: Attendance Records ============
  if (report.attendanceRecords && report.attendanceRecords.length > 0) {
    const attendanceSheet = workbook.addWorksheet(
      isArabic ? "سجلات الحضور" : "Attendance Records"
    )

    // Header
    attendanceSheet.mergeCells("A1:I1")
    const attendanceTitle = attendanceSheet.getCell("A1")
    attendanceTitle.value = isArabic ? "سجلات الحضور" : "Attendance Records"
    attendanceTitle.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    }
    attendanceTitle.font = {
      bold: true,
      size: 16,
      color: { argb: "FFFFFFFF" },
    }
    attendanceTitle.alignment = { horizontal: "center", vertical: "middle" }
    attendanceSheet.getRow(1).height = 30

    // Table headers
    const attendanceHeaders = [
      isArabic ? "التاريخ" : "Date",
      isArabic ? "اليوم" : "Day",
      isArabic ? "القسم" : "Department",
      isArabic ? "نوع النوبة" : "Shift Type",
      isArabic ? "وقت الدخول" : "Time In",
      isArabic ? "وقت الخروج" : "Time Out",
      isArabic ? "ساعات العمل" : "Worked Hours",
      isArabic ? "دقائق التأخير" : "Late Minutes",
      isArabic ? "الحالة" : "Status",
    ]

    attendanceHeaders.forEach((header, idx) => {
      const cell = attendanceSheet.getCell(3, idx + 1)
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
      }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "medium" },
        bottom: { style: "medium" },
        left: { style: "thin" },
        right: { style: "thin" },
      }
    })
    attendanceSheet.getRow(3).height = 25

    // Data rows
    currentRow = 4
    report.attendanceRecords.forEach((record) => {
      const formatTime = (dateStr) => {
        if (!dateStr) return "-"
        return new Date(dateStr).toLocaleTimeString(
          isArabic ? "ar-EG" : "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      }

      attendanceSheet.getCell(currentRow, 1).value = formatDate(record.workDate)
      attendanceSheet.getCell(currentRow, 2).value = isArabic
        ? record.dayNameAr
        : record.dayNameEn
      attendanceSheet.getCell(currentRow, 3).value = isArabic
        ? record.departmentNameAr
        : record.departmentNameEn
      attendanceSheet.getCell(currentRow, 4).value = isArabic
        ? record.shiftTypeNameAr
        : record.shiftTypeNameEn
      attendanceSheet.getCell(currentRow, 5).value = formatTime(record.timeIn)
      attendanceSheet.getCell(currentRow, 6).value = formatTime(record.timeOut)
      attendanceSheet.getCell(currentRow, 7).value = record.workedHours
      attendanceSheet.getCell(currentRow, 7).alignment = {
        horizontal: "center",
      }
      attendanceSheet.getCell(currentRow, 8).value = record.lateMinutes || 0
      attendanceSheet.getCell(currentRow, 8).alignment = {
        horizontal: "center",
      }

      const statusCell = attendanceSheet.getCell(currentRow, 9)
      statusCell.value = record.status
      statusCell.alignment = { horizontal: "center" }

      // Color code status
      if (record.status === "OnTime") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD1FAE5" },
        }
        statusCell.font = { color: { argb: "FF065F46" }, bold: true }
      } else if (record.status === "Late") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEF3C7" },
        }
        statusCell.font = { color: { argb: "FF92400E" }, bold: true }
      } else if (record.status === "Absent") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEE2E2" },
        }
        statusCell.font = { color: { argb: "FF991B1B" }, bold: true }
      }

      currentRow++
    })

    // Set column widths
    attendanceSheet.getColumn(1).width = 15
    attendanceSheet.getColumn(2).width = 15
    attendanceSheet.getColumn(3).width = 25
    attendanceSheet.getColumn(4).width = 25
    attendanceSheet.getColumn(5).width = 15
    attendanceSheet.getColumn(6).width = 15
    attendanceSheet.getColumn(7).width = 15
    attendanceSheet.getColumn(8).width = 15
    attendanceSheet.getColumn(9).width = 15
  }

  // ============ SHEET 5: Monthly Distribution ============
  const monthlySheet = workbook.addWorksheet(
    isArabic ? "التوزيع الشهري" : "Monthly Distribution"
  )

  // Header
  monthlySheet.mergeCells("A1:E1")
  const monthlyTitle = monthlySheet.getCell("A1")
  monthlyTitle.value = isArabic
    ? "التوزيع الشهري للنوبات"
    : "Monthly Shift Distribution"
  monthlyTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E40AF" },
  }
  monthlyTitle.font = {
    bold: true,
    size: 16,
    color: { argb: "FFFFFFFF" },
  }
  monthlyTitle.alignment = { horizontal: "center", vertical: "middle" }
  monthlySheet.getRow(1).height = 30

  // Table headers
  const monthlyHeaders = [
    isArabic ? "الشهر" : "Month",
    isArabic ? "إجمالي النوبات" : "Total Shifts",
    isArabic ? "النوبات المنجزة" : "Completed Shifts",
    isArabic ? "النوبات الملغاة" : "Cancelled Shifts",
    isArabic ? "ساعات العمل" : "Working Hours",
  ]

  monthlyHeaders.forEach((header, idx) => {
    const cell = monthlySheet.getCell(3, idx + 1)
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
    }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.border = {
      top: { style: "medium" },
      bottom: { style: "medium" },
      left: { style: "thin" },
      right: { style: "thin" },
    }
  })
  monthlySheet.getRow(3).height = 25

  // Data rows
  currentRow = 4
  report.monthlyRosterDistribution.months.forEach((month) => {
    monthlySheet.getCell(currentRow, 1).value = month.monthName
    monthlySheet.getCell(currentRow, 2).value = month.totalShifts
    monthlySheet.getCell(currentRow, 2).alignment = { horizontal: "center" }
    monthlySheet.getCell(currentRow, 3).value = month.completedShifts
    monthlySheet.getCell(currentRow, 3).alignment = { horizontal: "center" }
    monthlySheet.getCell(currentRow, 4).value = month.cancelledShifts
    monthlySheet.getCell(currentRow, 4).alignment = { horizontal: "center" }
    monthlySheet.getCell(currentRow, 5).value = month.workingHours
    monthlySheet.getCell(currentRow, 5).alignment = { horizontal: "center" }
    currentRow++
  })

  // Set column widths
  monthlySheet.getColumn(1).width = 25
  monthlySheet.getColumn(2).width = 20
  monthlySheet.getColumn(3).width = 20
  monthlySheet.getColumn(4).width = 20
  monthlySheet.getColumn(5).width = 20

  // ============ SHEET 6: Roles History ============
  if (report.rolesHistory && report.rolesHistory.length > 0) {
    const rolesSheet = workbook.addWorksheet(
      isArabic ? "تاريخ الأدوار" : "Roles History"
    )

    // Header
    rolesSheet.mergeCells("A1:H1")
    const rolesTitle = rolesSheet.getCell("A1")
    rolesTitle.value = isArabic ? "تاريخ الأدوار" : "Roles History"
    rolesTitle.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    }
    rolesTitle.font = {
      bold: true,
      size: 16,
      color: { argb: "FFFFFFFF" },
    }
    rolesTitle.alignment = { horizontal: "center", vertical: "middle" }
    rolesSheet.getRow(1).height = 30

    // Table headers
    const rolesHeaders = [
      isArabic ? "الدور" : "Role",
      isArabic ? "نشط" : "Active",
      isArabic ? "منتهي" : "Expired",
      isArabic ? "تاريخ التعيين" : "Assigned At",
      isArabic ? "تاريخ الانتهاء" : "Expires At",
      isArabic ? "السياق" : "Context",
      isArabic ? "المعين من قبل" : "Assigned By",
      isArabic ? "الملاحظات" : "Notes",
    ]

    rolesHeaders.forEach((header, idx) => {
      const cell = rolesSheet.getCell(3, idx + 1)
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
      }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "medium" },
        bottom: { style: "medium" },
        left: { style: "thin" },
        right: { style: "thin" },
      }
    })
    rolesSheet.getRow(3).height = 25

    // Data rows
    currentRow = 4
    report.rolesHistory.forEach((role) => {
      rolesSheet.getCell(currentRow, 1).value = isArabic
        ? role.roleNameAr
        : role.role
      rolesSheet.getCell(currentRow, 2).value = role.isActive
        ? isArabic
          ? "نعم"
          : "Yes"
        : isArabic
        ? "لا"
        : "No"
      rolesSheet.getCell(currentRow, 2).alignment = { horizontal: "center" }
      rolesSheet.getCell(currentRow, 3).value = role.isExpired
        ? isArabic
          ? "نعم"
          : "Yes"
        : isArabic
        ? "لا"
        : "No"
      rolesSheet.getCell(currentRow, 3).alignment = { horizontal: "center" }
      rolesSheet.getCell(currentRow, 4).value = formatDate(role.assignedAt)
      rolesSheet.getCell(currentRow, 5).value = formatDate(role.expiresAt)
      rolesSheet.getCell(currentRow, 6).value = role.contextText || "-"
      rolesSheet.getCell(currentRow, 7).value = role.assignedByName || "-"
      rolesSheet.getCell(currentRow, 8).value = role.notes || "-"

      currentRow++
    })

    // Set column widths
    rolesSheet.getColumn(1).width = 25
    rolesSheet.getColumn(2).width = 10
    rolesSheet.getColumn(3).width = 10

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const doctorName = isArabic ? report.nameAr : report.nameEn
    link.download = `Doctor_Report_${doctorName.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  }
}
