import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { getSubDepartmentById } from "../../../state/act/actSubDepartment"
import {
  clearSingleSubDepartment,
  clearSingleSubDepartmentError,
} from "../../../state/slices/subDepartment"
import { useTranslation } from "react-i18next"
import LoadingGetData from "../../../components/LoadingGetData"
import { formatDate } from "../../../utils/formtDate"

function SpecificSubDepartment() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    selectedSubDepartment,
    loadingGetSingleSubDepartment,
    singleSubDepartmentError,
  } = useSelector((state) => state.subDepartment)

  // Get departments for displaying department name
  const { departments } = useSelector((state) => state.department)

  // Get mode and translation function
  const { mymode } = useSelector((state) => state.mode)
  const { t, i18n } = useTranslation()

  // Get current language direction
  const isRTL = i18n.language === "ar"
  const currentLang = i18n.language || "ar"
  const isDark = mymode === "dark"

  useEffect(() => {
    if (id) {
      // Clear previous data before fetching
      dispatch(clearSingleSubDepartment())
      dispatch(getSubDepartmentById(id))
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSingleSubDepartment())
      dispatch(clearSingleSubDepartmentError())
    }
  }, [dispatch, id])

  // Handle error cases
  useEffect(() => {
    if (singleSubDepartmentError) {
      if (singleSubDepartmentError.status === 404) {
        console.error("SubDepartment not found")
      } else if (singleSubDepartmentError.status === 403) {
        console.error("Access denied")
      }
    }
  }, [singleSubDepartmentError, navigate])

  // Get subDepartment name based on current language
  const getSubDepartmentName = () => {
    if (!selectedSubDepartment) return ""
    return currentLang === "en"
      ? selectedSubDepartment.nameEnglish
      : selectedSubDepartment.nameArabic
  }

  // Get subDepartment secondary name (opposite language)
  const getSubDepartmentSecondaryName = () => {
    if (!selectedSubDepartment) return ""
    return currentLang === "en"
      ? selectedSubDepartment.nameArabic
      : selectedSubDepartment.nameEnglish
  }

  // Get department name based on current language
  const getDepartmentName = () => {
    if (!selectedSubDepartment?.department && !departments) return ""

    if (selectedSubDepartment?.department) {
      return currentLang === "en"
        ? selectedSubDepartment.department.nameEnglish
        : selectedSubDepartment.department.nameArabic
    }

    // Fallback to find department from departments list
    const department = departments?.find(
      (dept) => dept.id === selectedSubDepartment?.departmentId
    )
    if (department) {
      return currentLang === "en"
        ? department.nameEnglish
        : department.nameArabic
    }

    return t("subDepartment.details.noDepartmentInfo")
  }

  // Format date based on language

  // Loading Component
  if (loadingGetSingleSubDepartment) {
    return <LoadingGetData text={t("gettingData.subDepartmentData")} />
  }

  // Error Component
  if (singleSubDepartmentError) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-red-50 to-pink-100"
        } p-6`}
      >
        <div className="max-w-2xl mx-auto">
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
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("subDepartment.error.title") || "Error"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {singleSubDepartmentError.message}
            </p>
            <button
              onClick={() => navigate("/admin-panel/sub-departments")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("subDepartment.details.backToSubDepartments") ||
                "Back to Sub Departments"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Not Found Component
  if (!selectedSubDepartment) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-gray-50 to-gray-100"
        } p-6`}
      >
        <div className="max-w-2xl mx-auto">
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
              <svg
                className="w-10 h-10 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("subDepartment.empty.title") || "Sub Department Not Found"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {t("subDepartment.error.notFound") ||
                "The requested sub department was not found."}
            </p>
            <button
              onClick={() => navigate("/admin-panel/sub-departments")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("subDepartment.details.backToSubDepartments") ||
                "Back to Sub Departments"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Component
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isDark
          ? "from-gray-900 via-gray-800 to-gray-900"
          : "from-blue-50 via-indigo-50 to-purple-50"
      } p-6 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin-panel/sub-departments")}
            className={`inline-flex items-center ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            } transition-colors duration-200 mb-4 group`}
          >
            <svg
              className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"} transform ${
                isRTL
                  ? "group-hover:translate-x-1 rotate-180"
                  : "group-hover:-translate-x-1"
              } transition-transform duration-200`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("subDepartment.details.backToSubDepartments") ||
              "Back to Sub Departments"}
          </button>

          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 mb-8`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {getSubDepartmentName()}
                </h1>
                {/* <p
                  className={`text-xl ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {getSubDepartmentSecondaryName()}
                </p> */}
                <p
                  className={`text-lg ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } mt-2`}
                >
                  {t("subDepartment.table.department")}: {getDepartmentName()}
                </p>
              </div>

              <div
                className={`flex items-center space-x-4 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedSubDepartment.isActive
                      ? `bg-green-100 text-green-800 ${
                          isDark
                            ? "dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }`
                      : `bg-red-100 text-red-800 ${
                          isDark ? "dark:bg-red-900/30 dark:text-red-400" : ""
                        }`
                  }`}
                >
                  {selectedSubDepartment.isActive
                    ? t("subDepartment.status.active")
                    : t("subDepartment.status.inactive")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6`}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6 flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                {t("subDepartment.details.information")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("subDepartment.form.fields.nameArabic.label")}
                  </label>
                  <p
                    className={`text-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                    dir="rtl"
                  >
                    {selectedSubDepartment.nameArabic}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("subDepartment.form.fields.nameEnglish.label")}
                  </label>
                  <p
                    className={`text-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {selectedSubDepartment.nameEnglish}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("subDepartment.form.fields.department.label")}
                  </label>
                  <p
                    className={`text-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {getDepartmentName()}
                  </p>
                </div>

                {selectedSubDepartment.location && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mb-2`}
                    >
                      {t("subDepartment.form.fields.location.label")}
                    </label>
                    <p
                      className={`text-lg ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {selectedSubDepartment.location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            {selectedSubDepartment.description && (
              <div
                className={`${
                  isDark ? "bg-gray-800" : "bg-white"
                } rounded-2xl shadow-xl p-6`}
              >
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  } mb-4 flex items-center`}
                >
                  <div
                    className={`w-8 h-8 ${
                      isDark ? "bg-purple-900/30" : "bg-purple-100"
                    } rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.664-2.226M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  {t("subDepartment.form.fields.description.label")}
                </h2>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed text-lg`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {selectedSubDepartment.description}
                </p>
              </div>
            )}
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                {t("subDepartment.details.statistics")}
              </h2>

              <div className="space-y-4">
                {selectedSubDepartment.statistics?.totalEmployees !==
                  undefined && (
                  <div
                    className={`flex items-center justify-between p-4 ${
                      isDark ? "bg-blue-900/20" : "bg-blue-50"
                    } rounded-xl`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 ${
                          isDark ? "bg-blue-900/30" : "bg-blue-100"
                        } rounded-lg flex items-center justify-center ${
                          isRTL ? "mr-3" : "ml-3"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-medium`}
                      >
                        {t("subDepartment.statistics.totalEmployees")}
                      </span>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {selectedSubDepartment.statistics.totalEmployees}
                    </span>
                  </div>
                )}

                {selectedSubDepartment.statistics?.activeEmployees !==
                  undefined && (
                  <div
                    className={`flex items-center justify-between p-4 ${
                      isDark ? "bg-green-900/20" : "bg-green-50"
                    } rounded-xl`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 ${
                          isDark ? "bg-green-900/30" : "bg-green-100"
                        } rounded-lg flex items-center justify-center ${
                          isRTL ? "mr-3" : "ml-3"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            isDark ? "text-green-400" : "text-green-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-medium`}
                      >
                        {t("subDepartment.statistics.activeEmployees")}
                      </span>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {selectedSubDepartment.statistics.activeEmployees}
                    </span>
                  </div>
                )}

                {selectedSubDepartment.doctorsCount !== undefined && (
                  <div
                    className={`flex items-center justify-between p-4 ${
                      isDark ? "bg-purple-900/20" : "bg-purple-50"
                    } rounded-xl`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 ${
                          isDark ? "bg-purple-900/30" : "bg-purple-100"
                        } rounded-lg flex items-center justify-center ${
                          isRTL ? "mr-3" : "ml-3"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            isDark ? "text-purple-400" : "text-purple-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-medium`}
                      >
                        {t("subDepartment.table.doctors")}
                      </span>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {selectedSubDepartment.doctorsCount}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Card */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                {t("subDepartment.details.information")}
              </h2>

              <div className="space-y-4 text-sm">
                <div
                  className={`border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } pb-3`}
                >
                  <div
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("subDepartment.details.createdAt")}
                  </div>
                  <div
                    className={`${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {formatDate(selectedSubDepartment.createdAt)}
                  </div>
                </div>

                {selectedSubDepartment.createdByName && (
                  <div
                    className={`border-b ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    } pb-3`}
                  >
                    <div
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("subDepartment.details.createdBy")}
                    </div>
                    <div
                      className={`${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {selectedSubDepartment.createdByName}
                    </div>
                  </div>
                )}

                {selectedSubDepartment.updatedAt && (
                  <>
                    <div
                      className={`border-b ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      } pb-3`}
                    >
                      <div
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                      >
                        {t("subDepartment.details.updatedAt")}
                      </div>
                      <div
                        className={`${
                          isDark ? "text-white" : "text-gray-900"
                        } font-medium`}
                      >
                        {formatDate(selectedSubDepartment.updatedAt)}
                      </div>
                    </div>

                    {selectedSubDepartment.updatedByName && (
                      <div>
                        <div
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          } mb-1`}
                        >
                          {t("subDepartment.details.updatedBy")}
                        </div>
                        <div
                          className={`${
                            isDark ? "text-white" : "text-gray-900"
                          } font-medium`}
                        >
                          {selectedSubDepartment.updatedByName}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecificSubDepartment
