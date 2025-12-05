import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import i18next from "i18next"
import { getDepartmentMonthView } from "../../../state/act/actDepartment"
import { formatDate } from "../../../utils/formtDate"
import LoadingGetData from "../../../components/LoadingGetData"
import * as ExcelJS from "exceljs"

function DepartmentMonth() {
  const { depId: id, month, year } = useParams()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const currentLang = i18next.language
  const isRTL = currentLang === "ar"

  const navigate = useNavigate()

  const getRosterIds = (departmentMonthView) => {
    if (!departmentMonthView || !departmentMonthView.categories) {
      return []
    }

    const rosterIds = []

    departmentMonthView.categories.forEach((category) => {
      if (category.rosters && Array.isArray(category.rosters)) {
        category.rosters.forEach((roster) => {
          rosterIds.push(roster.rosterId)
        })
      }
    })

    return rosterIds
  }

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  // Get state from Redux store
  const {
    departmentMonthView,
    loadingGetDepartmentMonthView,
    currentDepartment,
    departmentCategories,
    departmentTotals,
    error,
  } = useSelector((state) => state.department) // Adjust selector path as needed

  useEffect(() => {
    dispatch(getDepartmentMonthView({ departmentId: id, month, year }))
      .unwrap()
      .then((res) => {
        const rosterIds = getRosterIds(res.data)
      })
  }, [dispatch, id, month, year])

  // Helper function to get localized department name
  const getDepartmentName = () => {
    if (!currentDepartment) return t("department.title")
    return isRTL ? currentDepartment.nameAr : currentDepartment.nameEn
  }

  // Excel Export Function
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(
      currentLang === "ar" ? "ملخص القسم" : "Department Summary"
    )

    const departmentName = isRTL
      ? departmentMonthView.departmentNameAr
      : departmentMonthView.departmentNameEn

    // Row 1: Year and Month header
    worksheet.mergeCells(1, 1, 1, 8)
    const headerCell = worksheet.getCell(1, 1)
    headerCell.value = `${departmentName} - ${month}/${year}`
    headerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    }
    headerCell.font = {
      bold: true,
      size: 16,
      color: { argb: "FFFFFFFF" },
      name: "Arial",
    }
    headerCell.alignment = { horizontal: "center", vertical: "middle" }
    headerCell.border = {
      top: { style: "thick", color: { argb: "FF1E3A8A" } },
      bottom: { style: "thick", color: { argb: "FF1E3A8A" } },
      left: { style: "thick", color: { argb: "FF1E3A8A" } },
      right: { style: "thick", color: { argb: "FF1E3A8A" } },
    }
    worksheet.getRow(1).height = 35

    // Row 2: Summary Totals Header
    worksheet.mergeCells(2, 1, 2, 8)
    const summaryHeaderCell = worksheet.getCell(2, 1)
    summaryHeaderCell.value =
      currentLang === "ar" ? "الملخص الإجمالي" : "Overall Summary"
    summaryHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    }
    summaryHeaderCell.font = {
      bold: true,
      size: 13,
      color: { argb: "FFFFFFFF" },
      name: "Arial",
    }
    summaryHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    summaryHeaderCell.border = {
      top: { style: "medium", color: { argb: "FF1E40AF" } },
      bottom: { style: "medium", color: { argb: "FF1E40AF" } },
      left: { style: "medium", color: { argb: "FF1E40AF" } },
      right: { style: "medium", color: { argb: "FF1E40AF" } },
    }
    worksheet.getRow(2).height = 30

    // Row 3: Totals Data
    const totalsHeaders = [
      currentLang === "ar" ? "إجمالي الالروسترات" : "Total Rosters",
      currentLang === "ar" ? "إجمالي الشفتات" : "Total Shifts",
      currentLang === "ar" ? "الأطباء المطلوبون" : "Required Doctors",
      currentLang === "ar" ? "الأطباء المعينون" : "Assigned Doctors",
      currentLang === "ar" ? "الحد الأقصى" : "Max Doctors",
      currentLang === "ar" ? "النقص" : "Shortfall",
      currentLang === "ar" ? "نسبة الإكتمال" : "Completion %",
      currentLang === "ar" ? "آخر تحديث" : "Last Updated",
    ]

    totalsHeaders.forEach((header, idx) => {
      const cell = worksheet.getCell(3, idx + 1)
      cell.value = header
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF60A5FA" },
      }
      cell.font = {
        bold: true,
        size: 10,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "thin", color: { argb: "FF2563EB" } },
        bottom: { style: "thin", color: { argb: "FF2563EB" } },
        left: { style: "thin", color: { argb: "FF2563EB" } },
        right: { style: "thin", color: { argb: "FF2563EB" } },
      }
    })
    worksheet.getRow(3).height = 25

    // Row 4: Totals Values
    const totalsData = departmentMonthView.totals || departmentTotals
    const totalsValues = [
      departmentMonthView.totalRosters,
      totalsData.shiftsCount,
      totalsData.requiredDoctors,
      totalsData.assignedDoctors,
      totalsData.maxDoctors,
      totalsData.shortfallDoctors,
      `${totalsData.completionPercentage}%`,
      new Date(departmentMonthView.lastUpdated).toLocaleDateString(
        currentLang === "ar" ? "ar-EG" : "en-US"
      ),
    ]

    totalsValues.forEach((value, idx) => {
      const cell = worksheet.getCell(4, idx + 1)
      cell.value = value
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      }
      cell.font = {
        size: 10,
        color: { argb: "FF111827" },
        name: "Arial",
      }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "medium", color: { argb: "FF9CA3AF" } },
        left: { style: "thin", color: { argb: "FFD1D5DB" } },
        right: { style: "thin", color: { argb: "FFD1D5DB" } },
      }
    })
    worksheet.getRow(4).height = 25

    // Row 5: Empty spacing
    worksheet.getRow(5).height = 15

    // Row 6: Categories Header
    worksheet.mergeCells(6, 1, 6, 10)
    const categoriesHeaderCell = worksheet.getCell(6, 1)
    categoriesHeaderCell.value =
      currentLang === "ar" ? "تفاصيل التخصصات" : "Categories Details"
    categoriesHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    }
    categoriesHeaderCell.font = {
      bold: true,
      size: 13,
      color: { argb: "FFFFFFFF" },
      name: "Arial",
    }
    categoriesHeaderCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    }
    categoriesHeaderCell.border = {
      top: { style: "medium", color: { argb: "FF1E40AF" } },
      bottom: { style: "medium", color: { argb: "FF1E40AF" } },
      left: { style: "medium", color: { argb: "FF1E40AF" } },
      right: { style: "medium", color: { argb: "FF1E40AF" } },
    }
    worksheet.getRow(6).height = 30

    // Row 7: Category Column Headers
    const categoryHeaders = [
      currentLang === "ar" ? "اسم الفئة" : "Category Name",
      currentLang === "ar" ? "عدد الشفتات" : "Shifts Count",
      currentLang === "ar" ? "المطلوب" : "Required",
      currentLang === "ar" ? "المعين" : "Assigned",
      currentLang === "ar" ? "الحد الأقصى" : "Max",
      currentLang === "ar" ? "الإكتمال %" : "Completion %",
      currentLang === "ar" ? "عنوان الوردية" : "Roster Title",
      currentLang === "ar" ? "الحالة" : "Status",
      currentLang === "ar" ? "النقص" : "Shortfall",
      currentLang === "ar" ? "إكتمال الوردية %" : "Roster Completion %",
    ]

    categoryHeaders.forEach((header, idx) => {
      const cell = worksheet.getCell(7, idx + 1)
      cell.value = header
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF60A5FA" },
      }
      cell.font = {
        bold: true,
        size: 10,
        color: { argb: "FFFFFFFF" },
        name: "Arial",
      }
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      }
      cell.border = {
        top: { style: "thin", color: { argb: "FF2563EB" } },
        bottom: { style: "thin", color: { argb: "FF2563EB" } },
        left: { style: "thin", color: { argb: "FF2563EB" } },
        right: { style: "thin", color: { argb: "FF2563EB" } },
      }
    })
    worksheet.getRow(7).height = 30

    // Data Rows: Categories and Rosters
    let currentRow = 8
    const categories =
      departmentCategories || departmentMonthView.categories || []

    categories.forEach((category) => {
      const rosters = category.rosters || []
      const rowSpan = rosters.length || 1

      // Merge category cells vertically if multiple rosters
      if (rowSpan > 1) {
        worksheet.mergeCells(currentRow, 1, currentRow + rowSpan - 1, 1)
        worksheet.mergeCells(currentRow, 2, currentRow + rowSpan - 1, 2)
        worksheet.mergeCells(currentRow, 3, currentRow + rowSpan - 1, 3)
        worksheet.mergeCells(currentRow, 4, currentRow + rowSpan - 1, 4)
        worksheet.mergeCells(currentRow, 5, currentRow + rowSpan - 1, 5)
        worksheet.mergeCells(currentRow, 6, currentRow + rowSpan - 1, 6)
      }

      // Category data
      const categoryName = getCategoryName(category)
      worksheet.getCell(currentRow, 1).value = categoryName
      worksheet.getCell(currentRow, 2).value = category.shiftsCount
      worksheet.getCell(currentRow, 3).value = category.requiredDoctors
      worksheet.getCell(currentRow, 4).value = category.assignedDoctors
      worksheet.getCell(currentRow, 5).value = category.maxDoctors
      worksheet.getCell(
        currentRow,
        6
      ).value = `${category.completionPercentage}%`

      // Style category cells
      for (let col = 1; col <= 6; col++) {
        const cell = worksheet.getCell(currentRow, col)
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE5E7EB" },
        }
        cell.font = {
          bold: true,
          size: 10,
          color: { argb: "FF111827" },
          name: "Arial",
        }
        cell.alignment = { horizontal: "center", vertical: "middle" }
        cell.border = {
          top: { style: "thin", color: { argb: "FF9CA3AF" } },
          bottom: { style: "thin", color: { argb: "FF9CA3AF" } },
          left: { style: "thin", color: { argb: "FF9CA3AF" } },
          right: { style: "thin", color: { argb: "FF9CA3AF" } },
        }
      }

      // Roster data
      rosters.forEach((roster, rosterIdx) => {
        const rosterRow = currentRow + rosterIdx

        const rosterTitle = isRTL
          ? roster.rosterTitle.split("|")[1]?.trim() || roster.rosterTitle
          : roster.rosterTitle.split("|")[0]?.trim() || roster.rosterTitle

        worksheet.getCell(rosterRow, 7).value = rosterTitle
        worksheet.getCell(rosterRow, 8).value = roster.rosterStatus
        worksheet.getCell(rosterRow, 9).value = roster.shortfallDoctors
        worksheet.getCell(
          rosterRow,
          10
        ).value = `${roster.completionPercentage}%`

        // Style roster cells
        for (let col = 7; col <= 10; col++) {
          const cell = worksheet.getCell(rosterRow, col)
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          }
          cell.font = {
            size: 9,
            color: { argb: "FF374151" },
            name: "Arial",
          }
          cell.alignment = { horizontal: "center", vertical: "middle" }
          cell.border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          }
        }
        worksheet.getRow(rosterRow).height = 22
      })

      currentRow += rowSpan
    })

    // Set column widths
    worksheet.getColumn(1).width = 35 // Category Name
    worksheet.getColumn(2).width = 12 // Shifts Count
    worksheet.getColumn(3).width = 12 // Required
    worksheet.getColumn(4).width = 12 // Assigned
    worksheet.getColumn(5).width = 12 // Max
    worksheet.getColumn(6).width = 15 // Completion %
    worksheet.getColumn(7).width = 40 // Roster Title
    worksheet.getColumn(8).width = 18 // Status
    worksheet.getColumn(9).width = 12 // Shortfall
    worksheet.getColumn(10).width = 18 // Roster Completion %

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${departmentName}_${month}_${year}_Summary.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Helper function to get localized category name
  const getCategoryName = (category) => {
    return isRTL ? category.categoryNameAr : category.categoryNameEn
  }

  // Loading state
  if (loadingGetDepartmentMonthView) {
    return (
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}
      >
        <LoadingGetData
          text={
            t("gettingData.departmentMonthView") || "Loading department data..."
          }
        />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}
      >
        <div className="text-center p-4">
          <p className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
            {t("common.error")}: {error.message || error}
          </p>
        </div>
      </div>
    )
  }

  // No data state
  if (!departmentMonthView) {
    return (
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}
      >
        <div className="text-center p-4">
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("department.noData")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-xl p-6`}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            {getDepartmentName()}
          </h1>
          <button
            onClick={exportToExcel}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            {currentLang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}
          </button>
        </div>
        <div
          className={`flex items-center gap-4 text-sm ${
            isDark ? "text-gray-400" : "text-gray-500"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <span>
            {t("department.month")}: {month}/{year}
          </span>
          <span>
            {t("department.totalRosters")}: {departmentMonthView.totalRosters}
          </span>
          <span>
            {t("department.lastUpdated")}:{" "}
            {formatDate(departmentMonthView.lastUpdated)}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      {departmentTotals && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className={`${
              isDark ? "bg-gray-750" : "bg-white"
            } rounded-xl shadow p-6 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-500"
              } mb-2`}
            >
              {t("department.totalShifts")}
            </h3>
            <p
              className={`text-3xl font-bold ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {departmentTotals.shiftsCount}
            </p>
          </div>
          <div
            className={`${
              isDark ? "bg-gray-750" : "bg-white"
            } rounded-xl shadow p-6 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-500"
              } mb-2`}
            >
              {t("department.requiredDoctors")}
            </h3>
            <p
              className={`text-3xl font-bold ${
                isDark ? "text-yellow-400" : "text-orange-600"
              }`}
            >
              {departmentTotals.requiredDoctors}
            </p>
          </div>
          <div
            className={`${
              isDark ? "bg-gray-750" : "bg-white"
            } rounded-xl shadow p-6 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-500"
              } mb-2`}
            >
              {t("department.assignedDoctors")}
            </h3>
            <p
              className={`text-3xl font-bold text-green-${
                isDark ? "400" : "600"
              }`}
            >
              {departmentTotals.assignedDoctors}
            </p>
          </div>
          <div
            className={`${
              isDark ? "bg-gray-750" : "bg-white"
            } rounded-xl shadow p-6 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-500"
              } mb-2`}
            >
              {t("department.completion")}
            </h3>
            <p
              className={`text-3xl font-bold ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {departmentTotals.completionPercentage}%
            </p>
          </div>
        </div>
      )}

      {/* Warnings */}
      {departmentMonthView.warnings &&
        departmentMonthView.warnings.length > 0 && (
          <div
            className={`${
              isDark
                ? "bg-yellow-900/20 border-yellow-600/30"
                : "bg-yellow-50 border-yellow-400"
            } border-l-4 p-4 mb-6`}
          >
            <h3
              className={`${
                isDark ? "text-yellow-400" : "text-yellow-800"
              } font-medium mb-2`}
            >
              {t("common.warnings")}
            </h3>
            <ul
              className={`${
                isDark ? "text-yellow-300" : "text-yellow-700"
              } text-sm`}
            >
              {departmentMonthView.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

      {/* Categories */}
      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } mb-4`}
        >
          {t("department.categories")}
        </h2>

        {departmentCategories &&
          departmentCategories.map((category) => (
            <div
              key={category.categoryId}
              onClick={() =>
                navigate(
                  `/admin-panel/department/calender/${id}/${category.rosters[0].rosterId}`
                )
              }
              className={`${
                isDark
                  ? "border-gray-700 bg-gray-750 hover:bg-gray-700"
                  : "border-gray-200 bg-gray-50 hover:bg-white"
              } rounded-xl shadow border cursor-pointer`}
            >
              <div
                className={`p-6 ${
                  isDark ? "border-gray-700" : "border-gray-200"
                } border-b`}
              >
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <h3
                    className={`text-xl font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {getCategoryName(category)}
                  </h3>
                  <div
                    className={`flex items-center gap-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("department.completion")}:{" "}
                      {category.completionPercentage}%
                    </span>
                    <div
                      className={`w-20 ${
                        isDark ? "bg-gray-600" : "bg-gray-200"
                      } rounded-full h-2`}
                    >
                      <div
                        className={`${
                          category.completionPercentage === 100
                            ? "bg-green-500"
                            : category.completionPercentage >= 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        } h-2 rounded-full`}
                        style={{ width: `${category.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Category Statistics */}
                <div
                  className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("department.shifts")}
                    </p>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {category.shiftsCount}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("department.required")}
                    </p>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-yellow-400" : "text-orange-600"
                      }`}
                    >
                      {category.requiredDoctors}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("department.assigned")}
                    </p>
                    <p
                      className={`font-semibold text-green-${
                        isDark ? "400" : "600"
                      }`}
                    >
                      {category.assignedDoctors}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("department.maxDoctors")}
                    </p>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {category.maxDoctors}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rosters */}
              <div className="p-6">
                <h4
                  className={`text-lg font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  } mb-3`}
                >
                  {t("department.rosters")}
                </h4>
                <div className="space-y-3">
                  {category.rosters.map((roster) => (
                    <div
                      key={roster.rosterId}
                      className={`border rounded-xl p-4 transition-all duration-200 ${
                        isDark
                          ? "border-gray-700 bg-gray-750 hover:bg-gray-700"
                          : "border-gray-200 bg-gray-50 hover:bg-white"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div>
                          <h5
                            className={`font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {isRTL
                              ? roster.rosterTitle.split("|")[1]?.trim()
                              : roster.rosterTitle.split("|")[0]?.trim()}
                          </h5>
                          <div
                            className={`flex items-center gap-2 mt-1 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                roster.rosterStatus === "PUBLISHED"
                                  ? "bg-green-100 text-green-800"
                                  : isDark
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {t(
                                `roster.status.${roster.rosterStatus.toLowerCase()}`
                              )}
                            </span>
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("department.completion")}:{" "}
                              {roster.completionPercentage}%
                            </span>
                          </div>
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          } ${isRTL ? "text-left" : "text-right"}`}
                        >
                          <p>
                            {t("department.shifts")}: {roster.shiftsCount}
                          </p>
                          <p>
                            {t("department.assigned")}: {roster.assignedDoctors}
                            /{roster.requiredDoctors}
                          </p>
                          {roster.shortfallDoctors > 0 && (
                            <p
                              className={`${
                                isDark ? "text-red-400" : "text-red-600"
                              }`}
                            >
                              {t("department.shortfall")}:{" "}
                              {roster.shortfallDoctors}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default DepartmentMonth
