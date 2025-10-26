import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import {
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { exportExcel } from "../../../state/act/actReports"

/**
 * ExportReportsDropdown Component
 *
 * A reusable dropdown component for exporting reports in multiple formats (Excel, PDF, CSV)
 *
 * @param {Object} filters - The current filter state containing month, year, categoryId, etc.
 * @param {Function} onExportStart - Optional callback when export starts
 * @param {Function} onExportSuccess - Optional callback when export succeeds
 * @param {Function} onExportError - Optional callback when export fails
 */
function ExportReportsDropdown({
  filters,
  onExportStart,
  onExportSuccess,
  onExportError,
}) {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)
  const { loadingExportExcel } = useSelector((state) => state.reports)

  const [showExportMenu, setShowExportMenu] = useState(false)
  const [exportingFormat, setExportingFormat] = useState(null)

  const currentLang = i18n.language || "ar"
  const isDark = mymode === "dark"
  const isRTL = currentLang === "ar"

  // Export options configuration
  const exportOptions = [
    {
      format: 0,
      label: t("reports.export.excel") || "Export Excel",
      icon: FileSpreadsheet,
      color: "green",
      fileType: ".xlsx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    //   {
    //     format: 1,
    //     label: t("reports.export.pdf") || "Export PDF",
    //     icon: FileText,
    //     color: "red",
    //     fileType: ".pdf",
    //     mimeType: "application/pdf",
    //   },
    //   {
    //     format: 2,
    //     label: t("reports.export.csv") || "Export CSV",
    //     icon: FileSpreadsheet,
    //     color: "blue",
    //     fileType: ".csv",
    //     mimeType: "text/csv",
    //   },
  ]

  // Handle export action
  const handleExport = async (format, formatLabel) => {
    setShowExportMenu(false)
    setExportingFormat(format)

    // Call onExportStart callback if provided
    if (onExportStart) {
      onExportStart(format)
    }

    const exportParams = {
      month: filters.month,
      year: filters.year,
      categoryId: filters.categoryId,
      departmentId: filters.departmentId,
      doctorId: filters.doctorId,
      scientificDegreeId: filters.scientificDegreeId,
      contractingTypeId: filters.contractingTypeId,
      language: currentLang === "ar" ? 0 : 1,
      format: format,
    }

    // Remove null/undefined values
    Object.keys(exportParams).forEach((key) => {
      if (exportParams[key] === null || exportParams[key] === undefined) {
        delete exportParams[key]
      }
    })

    try {
      const result = await dispatch(exportExcel(exportParams)).unwrap()

      // Handle both cases: blob wrapped in object or blob directly
      const blob = result?.blob || result

      if (blob instanceof Blob) {
        const selectedOption = exportOptions.find(
          (opt) => opt.format === format
        )

        // Generate filename
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
        const monthName = monthNames[exportParams.month - 1]
        const filename = `Report_${monthName}_${exportParams.year}${selectedOption.fileType}`

        // Create and trigger download
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }

      // Call onExportSuccess callback if provided
      if (onExportSuccess) {
        onExportSuccess(format, formatLabel)
      }
    } catch (error) {
      console.error("Export failed:", error)

      // Call onExportError callback if provided
      if (onExportError) {
        onExportError(error, format)
      }
    } finally {
      setExportingFormat(null)
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest(".export-dropdown")) {
        setShowExportMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showExportMenu])

  return (
    <div className="relative export-dropdown">
      {/* Main Export Button */}
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        disabled={loadingExportExcel}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isDark
            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        } ${
          loadingExportExcel
            ? "opacity-50 cursor-not-allowed"
            : "shadow-lg hover:shadow-xl"
        }`}
      >
        {loadingExportExcel ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>{t("reports.export.exporting") || "Exporting..."}</span>
          </>
        ) : (
          <>
            <Download size={20} />
            <span>{t("reports.export.title") || "Export Report"}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showExportMenu ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {showExportMenu && !loadingExportExcel && (
        <div
          className={`absolute ${
            isRTL ? "left-0" : "right-0"
          } mt-2 w-56 rounded-xl shadow-2xl ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          } overflow-hidden z-50 animate-fadeIn`}
        >
          <div
            className={`px-4 py-3 border-b ${
              isDark
                ? "border-gray-700 bg-gray-750"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("reports.export.selectFormat") || "Select Export Format"}
            </p>
          </div>

          <div className="py-2">
            {exportOptions.map((option) => {
              const Icon = option.icon
              const isExporting = exportingFormat === option.format

              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format, option.label)}
                  disabled={isExporting}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-200"
                      : "hover:bg-gray-50 text-gray-700"
                  } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isExporting ? (
                    <Loader2 size={18} className="animate-spin text-blue-500" />
                  ) : (
                    <Icon size={18} className={`text-${option.color}-500`} />
                  )}
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium`}>{option.label}</p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {option.fileType}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <div
            className={`px-4 py-2 border-t ${
              isDark
                ? "border-gray-700 bg-gray-750"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {t("reports.export.note") || "Download will start automatically"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportReportsDropdown
