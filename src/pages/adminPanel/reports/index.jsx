import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { getCategories } from "../../../state/act/actCategory"
import { getDepartments } from "../../../state/act/actDepartment"
import { getContractingTypesForSignup } from "../../../state/act/actContractingType"
import LoadingGetData from "../../../components/LoadingGetData"
import { useTranslation } from "react-i18next"
import { Calendar, Filter, FileText, Eye } from "lucide-react"
import { clearReports, clearReportsError } from "../../../state/slices/reports"
import { getReports, getReportsAttend } from "../../../state/act/actReports"
import { getAvailbleScientficDegrees } from "../../../state/act/actRosterManagement"
import { getUserSummaries } from "../../../state/act/actUsers"
import ExportReportsDropdown from "./exportFullReport"
import ExportDoctorAttendanceReport from "./exportDoctorsAttend"

function Reports() {
  const { categoryManagerId: id } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  // Redux state
  const { contractingTypes, loadingGetContractingTypes } = useSelector(
    (state) => state.contractingType
  )

  const { loginRoleResponseDto } = useSelector((state) => state.auth)

  const {
    contractingTypesForSignup: contracting,
    loadingGetContractingTypesForSignup: loadingContract,
  } = useSelector((state) => state.contractingType)

  console.log("contracting", contracting)

  const { users, loading } = useSelector((state) => state.users)

  const { departments, loadingGetDepartments } = useSelector(
    (state) => state.department
  )
  const { categories, loadingGetCategories } = useSelector(
    (state) => state.category
  )
  const { mymode } = useSelector((state) => state.mode)
  const {
    reports,
    loadingGetReports,
    getReportsError,
    totalPages,
    getReportsAttendError,
    reportsAttend,
    loadingGetReportsAttend,
  } = useSelector((state) => state.reports)

  // Local state for filters
  const currentDate = new Date()
  const isSystemAdmin =
    loginRoleResponseDto.roleNameEn === "System Administrator"

  const [filters, setFilters] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    categoryId: isSystemAdmin ? null : id,
    departmentId: null,
    doctorId: null,
    scientificDegreeId: null,
    contractingTypeId: null,
    page: 1,
    pageSize: 20,
  })

  // UI state
  const isRTL = i18n.language === "ar"
  const currentLang = i18n.language || "ar"
  const isDark = mymode === "dark"

  // Fetch initial data
  useEffect(() => {
    dispatch(getContractingTypesForSignup())
    dispatch(getAvailbleScientficDegrees())
    dispatch(getDepartments({ pageSize: 1000, page: 1 }))
    dispatch(
      getUserSummaries({
        page: 1,
        pageSize: 1000,
        categoryId: filters.categoryId,
      })
    )
    if (isSystemAdmin) {
      dispatch(getCategories())
    }

    return () => {
      dispatch(clearReports())
      dispatch(clearReportsError())
    }
  }, [dispatch, id, isSystemAdmin])

  // Fetch departments and doctors when category changes
  useEffect(() => {
    if (filters.categoryId) {
      dispatch(
        getUserSummaries({
          page: 1,
          pageSize: 1000,
          categoryId: filters.categoryId,
        })
      )
    }
  }, [dispatch, filters.categoryId])

  // Fetch reports when filters change
  useEffect(() => {
    if (filters.month && filters.year) {
      const params = { ...filters }
      // Remove null values
      Object.keys(params).forEach((key) => {
        if (params[key] === null || params[key] === "") {
          delete params[key]
        }
      })
      dispatch(getReports(params))
      dispatch(getReportsAttend(params))
    }
  }, [dispatch, filters])

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page on filter change
      // Reset dependent filters when category changes
      ...(name === "categoryId" && { departmentId: null, doctorId: null }),
    }))
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }))
  }

  // Generate month options
  const monthOptions = [
    { value: 1, labelEn: "January", labelAr: "يناير" },
    { value: 2, labelEn: "February", labelAr: "فبراير" },
    { value: 3, labelEn: "March", labelAr: "مارس" },
    { value: 4, labelEn: "April", labelAr: "أبريل" },
    { value: 5, labelEn: "May", labelAr: "مايو" },
    { value: 6, labelEn: "June", labelAr: "يونيو" },
    { value: 7, labelEn: "July", labelAr: "يوليو" },
    { value: 8, labelEn: "August", labelAr: "أغسطس" },
    { value: 9, labelEn: "September", labelAr: "سبتمبر" },
    { value: 10, labelEn: "October", labelAr: "أكتوبر" },
    { value: 11, labelEn: "November", labelAr: "نوفمبر" },
    { value: 12, labelEn: "December", labelAr: "ديسمبر" },
  ]

  // Generate year options (current year ± 5 years)
  const yearOptions = Array.from(
    { length: 11 },
    (_, i) => currentDate.getFullYear() - 5 + i
  )

  // Loading state
  if (
    loadingGetContractingTypes ||
    loadingContract ||
    loadingGetDepartments ||
    loading?.list ||
    loadingGetCategories
  ) {
    return <LoadingGetData text={t("gettingData.wait-data")} />
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isDark
          ? "from-gray-900 via-gray-800 to-gray-900"
          : "from-blue-50 via-indigo-50 to-purple-50"
      } p-6 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-1">
                  {t("reports.title") || "Monthly Reports"}
                </h1>
                <p
                  className={`mt-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("reports.subtitle") ||
                    "View and manage monthly attendance reports"}
                </p>
              </div>{" "}
              {/* Add Export Button Here */}
              <div className="flex flex-col gap-1 justify-center items-center">
                {reports?.rows && reports.rows.length > 0 && (
                  <ExportReportsDropdown
                    filters={filters}
                    onExportStart={(format) => {
                      console.log("Export started:", format)
                    }}
                    onExportSuccess={(format, label) => {
                      // Optional: Show success toast/notification
                      console.log("Export successful:", label)
                    }}
                    onExportError={(error, format) => {
                      // Optional: Show error toast/notification
                      console.error("Export failed:", error)
                    }}
                  />
                )}
                {reportsAttend?.rows && reportsAttend.rows.length > 0 && (
                  <ExportDoctorAttendanceReport
                    reportsAttend={reportsAttend}
                    loadingGetReportsAttend={loadingGetReportsAttend}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6 mb-8`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`w-10 h-10 ${
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              } rounded-lg flex items-center justify-center`}
            >
              <Filter
                className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("reports.filters") || "Filters"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter - Only for System Admin */}
            {isSystemAdmin && (
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {t("adminPanel.categories") || "Category"}
                </label>
                <select
                  value={filters.categoryId || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "categoryId",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">
                    {t("categories.filters.all") || "Select Category"}
                  </option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {currentLang === "ar" ? cat.nameArabic : cat.nameEnglish}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Month Filter */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                <Calendar size={16} className="inline mr-1" />
                {t("reports.month") || "Month"}
              </label>
              <select
                value={filters.month}
                onChange={(e) =>
                  handleFilterChange("month", parseInt(e.target.value))
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {currentLang === "ar" ? month.labelAr : month.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                <Calendar size={16} className="inline mr-1" />
                {t("reports.year") || "Year"}
              </label>
              <select
                value={filters.year}
                onChange={(e) =>
                  handleFilterChange("year", parseInt(e.target.value))
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                {t("reports.department") || "Department"}
              </label>
              <select
                value={filters.departmentId || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "departmentId",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">
                  {t("reports.allDepartments") || "All Departments"}
                </option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {currentLang === "ar" ? dept.nameArabic : dept.nameEnglish}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Filter */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                {t("reports.doctor") || "Doctor"}
              </label>
              <select
                value={filters.doctorId || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "doctorId",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">
                  {t("reports.allDoctors") || "All Doctors"}
                </option>
                {users?.map((request) => (
                  <option key={request.id} value={request.id}>
                    {currentLang === "ar"
                      ? request.nameArabic
                      : request.nameEnglish}
                  </option>
                ))}
              </select>
            </div>

            {/* Scientific Degree Filter */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                {t("reports.scientificDegree") || "Scientific Degree"}
              </label>
              <select
                value={filters.scientificDegreeId || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "scientificDegreeId",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">
                  {t("reports.allDegrees") || "All Degrees"}
                </option>
                {contractingTypes?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {currentLang === "ar" ? type.nameArabic : type.nameEnglish}
                  </option>
                ))}
              </select>
            </div>

            {/* Contracting Type Filter */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                {t("reports.contractingType") || "Contracting Type"}
              </label>
              <select
                value={filters.contractingTypeId || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "contractingTypeId",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">{t("reports.allTypes") || "All Types"}</option>
                {contracting?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {currentLang === "ar" ? type.nameArabic : type.nameEnglish}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        {loadingGetReports || loadingGetReportsAttend ? (
          <LoadingGetData text={t("reports.loading") || "Loading reports..."} />
        ) : getReportsError || getReportsAttendError ? (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 text-center`}
          >
            <div
              className={`w-20 h-20 ${
                isDark ? "bg-red-900/30" : "bg-red-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <FileText className="w-10 h-10 text-red-500" />
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("reports.error") || "Error Loading Reports"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {getReportsError.message}
            </p>
          </div>
        ) : !reports?.rows || reports.rows.length === 0 ? (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 text-center`}
          >
            <div
              className={`w-20 h-20 ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <FileText
                className={`w-10 h-10 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("reports.noData") || "No Reports Found"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } text-lg`}
            >
              {t("reports.noDataDescription") ||
                "No reports available for the selected filters."}
            </p>
          </div>
        ) : (
          <>
            {/* Report Summary */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6 mb-8`}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                {currentLang === "ar" ? reports.monthName : reports.monthEn}{" "}
                {reports.year}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className={`p-4 ${
                    isDark ? "bg-blue-900/20" : "bg-blue-50"
                  } rounded-xl`}
                >
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("reports.totalDoctors") || "Total Doctors"}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {reports.totalDoctors}
                  </p>
                </div>
                <div
                  className={`p-4 ${
                    isDark ? "bg-purple-900/20" : "bg-purple-50"
                  } rounded-xl`}
                >
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("reports.totalRecords") || "Total Records"}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {reports.totalRecords}
                  </p>
                </div>
                <div
                  className={`p-4 ${
                    isDark ? "bg-green-900/20" : "bg-green-50"
                  } rounded-xl`}
                >
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("reports.startDate") || "Start Date"}
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {reports.startDate}
                  </p>
                </div>
                <div
                  className={`p-4 ${
                    isDark ? "bg-orange-900/20" : "bg-orange-50"
                  } rounded-xl`}
                >
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("reports.endDate") || "End Date"}
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  >
                    {reports.endDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl overflow-hidden`}
            >
              {/* Single scroll container */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                    <tr>
                      {/* Doctor Info Headers */}
                      <th
                        className={`px-4 py-4 text-${
                          currentLang === "ar" ? "right" : "left"
                        } text-xs font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } uppercase tracking-wider whitespace-nowrap sticky ${
                          currentLang === "ar" ? "right-0" : "left-0"
                        } z-30 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                        style={{ minWidth: "180px" }}
                      >
                        {t("reports.table.doctor") || "Doctor"}
                      </th>
                      <th
                        className={`px-4 py-4 text-${
                          currentLang === "ar" ? "right" : "left"
                        } text-xs font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } uppercase tracking-wider whitespace-nowrap sticky ${
                          currentLang === "ar"
                            ? "right-[180px]"
                            : "left-[180px]"
                        } z-30 ${
                          isDark ? "bg-gray-700" : "bg-gray-50"
                        } hidden sm:table-cell ${
                          currentLang === "ar" ? "border-l-2" : "border-r-2"
                        } border-gray-300 dark:border-gray-600`}
                        style={{ minWidth: "130px" }}
                      >
                        {t("reports.table.category") || "Category"}
                      </th>
                      <th
                        className={`px-4 py-4 text-${
                          currentLang === "ar" ? "right" : "left"
                        } text-xs font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } uppercase tracking-wider whitespace-nowrap sticky ${
                          currentLang === "ar"
                            ? "right-[180px] sm:right-[310px]"
                            : "left-[180px] sm:left-[310px]"
                        } z-30 ${
                          isDark ? "bg-gray-700" : "bg-gray-50"
                        } hidden md:table-cell ${
                          currentLang === "ar" ? "border-l-2" : "border-r-2"
                        } border-gray-300 dark:border-gray-600`}
                        style={{ minWidth: "140px" }}
                      >
                        {t("reports.table.department") || "Department"}
                      </th>

                      {/* Daily shift columns (1-31) */}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <th
                            key={day}
                            className={`px-2 py-4 text-center text-xs font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } uppercase tracking-wider whitespace-nowrap`}
                            style={{ minWidth: "80px" }}
                          >
                            {t("reports.table.day") || "Day"} {day}
                          </th>
                        )
                      )}

                      {/* Actions Header */}
                      <th
                        className={`px-4 py-4 text-center text-xs font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } uppercase tracking-wider whitespace-nowrap sticky ${
                          currentLang === "ar" ? "left-0" : "right-0"
                        } z-30 ${isDark ? "bg-gray-700" : "bg-gray-50"} ${
                          currentLang === "ar"
                            ? "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            : "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                        }`}
                        style={{ minWidth: "80px" }}
                      >
                        {t("categories.table.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    className={`${
                      isDark ? "bg-gray-800" : "bg-white"
                    } divide-y ${
                      isDark ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    {reports.rows.map((row, index) => {
                      const shiftMap = {}
                      row.dailyShifts?.forEach((shift) => {
                        shiftMap[shift.day] = shift
                      })

                      return (
                        <tr
                          key={`${row.doctorId}-${row.departmentId}-${index}`}
                          className={`${
                            isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"
                          } transition-colors`}
                        >
                          {/* Doctor Name - Sticky */}
                          <td
                            className={`px-4 py-4 whitespace-nowrap sticky ${
                              currentLang === "ar" ? "right-0" : "left-0"
                            } z-20 ${isDark ? "bg-gray-800" : "bg-white"} ${
                              currentLang === "ar"
                                ? "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                                : "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            }`}
                            // style={{ minWidth: "180px" }}
                          >
                            <div>
                              <div
                                className={`text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {currentLang === "ar"
                                  ? row.doctorNameAr
                                  : row.doctorNameEn}
                              </div>
                              <div
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {t("reports.table.printNumber") || "Print"}:{" "}
                                {row.printNumber}
                              </div>
                              {/* Show category on mobile */}
                              <div
                                className={`text-xs sm:hidden mt-1 ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {currentLang === "ar"
                                  ? row.categoryNameAr
                                  : row.categoryNameEn}
                              </div>
                            </div>
                          </td>

                          {/* Category - Sticky */}
                          <td
                            className={`px-4 py-4 text-sm hidden sm:table-cell sticky ${
                              currentLang === "ar"
                                ? "right-[180px]"
                                : "left-[180px]"
                            } z-20 ${
                              isDark
                                ? "bg-gray-800 text-gray-300"
                                : "bg-white text-gray-900"
                            } ${
                              currentLang === "ar" ? "border-l-2" : "border-r-2"
                            } border-gray-300 dark:border-gray-600 ${
                              currentLang === "ar"
                                ? "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                                : "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            }`}
                            style={{ minWidth: "130px" }}
                          >
                            {currentLang === "ar"
                              ? row.categoryNameAr
                              : row.categoryNameEn}
                          </td>

                          {/* Department - Sticky */}
                          <td
                            className={`px-4 py-4 text-sm hidden md:table-cell sticky ${
                              currentLang === "ar"
                                ? "right-[180px] sm:right-[310px]"
                                : "left-[180px] sm:left-[310px]"
                            } z-20 ${
                              isDark
                                ? "bg-gray-800 text-gray-300"
                                : "bg-white text-gray-900"
                            } ${
                              currentLang === "ar" ? "border-l-2" : "border-r-2"
                            } border-gray-300 dark:border-gray-600 ${
                              currentLang === "ar"
                                ? "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                                : "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            }`}
                            style={{ minWidth: "140px" }}
                          >
                            {currentLang === "ar"
                              ? row.departmentsJoinedAr
                              : row.departmentsJoinedEn}
                          </td>

                          {/* Daily shift columns (1-31) */}
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(
                            (day) => {
                              const shift = shiftMap[day]
                              return (
                                <td
                                  key={day}
                                  className={`px-2 py-4 text-center text-xs whitespace-nowrap ${
                                    isDark ? "text-gray-300" : "text-gray-900"
                                  }`}
                                  style={{ minWidth: "80px" }}
                                  title={
                                    shift
                                      ? currentLang === "ar"
                                        ? shift.departmentAr
                                        : shift.departmentEn
                                      : ""
                                  }
                                >
                                  {shift ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="font-semibold text-sm">
                                        {shift.code}
                                      </span>
                                      <span
                                        className={`text-[10px] ${
                                          isDark
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {currentLang === "ar"
                                          ? shift.departmentAr
                                          : shift.departmentEn}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              )
                            }
                          )}

                          {/* Actions Column - Sticky on right */}
                          <td
                            className={`px-4 py-4 sticky ${
                              currentLang === "ar" ? "left-0" : "right-0"
                            } z-20 ${isDark ? "bg-gray-800" : "bg-white"} ${
                              currentLang === "ar"
                                ? "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                                : "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            }`}
                            style={{ minWidth: "80px" }}
                          >
                            <div className="text-center">
                              <Link
                                to={`/admin-panel/reports/doctor/${row.doctorId}`}
                              >
                                <button
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                                  title={t("categories.actions.view")}
                                >
                                  <Eye size={16} />
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Reports
