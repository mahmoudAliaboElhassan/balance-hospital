import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import i18next from "i18next"
import { getDepartmentMonthView } from "../../../state/act/actDepartment"
import { formatDate } from "../../../utils/formtDate"
import LoadingGetData from "../../../components/LoadingGetData"

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
        <h1
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } mb-2`}
        >
          {getDepartmentName()}
        </h1>
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
