import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import LoadingGetData from "../LoadingGetData"
import { getDepartmentMonthList } from "../../state/act/actDepartment"
import { useTranslation } from "react-i18next"
import i18next from "i18next"
import { formatDate } from "../../utils/formtDate"

function RosterDepartmentMonths() {
  const {
    departmentMonthList, // Add this
    loadingGetDepartmentMonthList, // Add this
    departmentMonthListError, // Add this
  } = useSelector((state) => state.department)

  const { depId: id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const currentLang = i18next.language
  const isRTL = currentLang === "ar"

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getDepartmentMonthList({ departmentId: id }))
  }, [dispatch, id])

  const getMonthName = (monthNameAr, month, year) => {
    if (currentLang === "ar") {
      return monthNameAr
    }
    // English month names
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
    return monthNames[month - 1]
  }

  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-xl p-6`}
    >
      <h2
        className={`text-xl font-bold ${
          isDark ? "text-white" : "text-gray-900"
        } mb-6 flex items-center`}
      >
        <div
          className={`w-8 h-8 ${
            isDark ? "bg-green-900/30" : "bg-green-100"
          } rounded-lg flex items-center justify-center ${
            isRTL ? "mr-3" : "ml-3"
          }`}
        >
          <svg
            className={`w-4 h-4 ${
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        {t("department.monthlyStats.title") || "Monthly Performance"}
      </h2>

      {loadingGetDepartmentMonthList ? (
        <LoadingGetData
          text={
            t("gettingData.monthlyStats") || "Loading monthly statistics..."
          }
        />
      ) : departmentMonthListError ? (
        <div className="text-center p-4">
          <p className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
            {t("department.monthlyStats.error") ||
              "Failed to load monthly statistics"}
          </p>
        </div>
      ) : !departmentMonthList || departmentMonthList.length === 0 ? (
        <div className="text-center p-4">
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("department.monthlyStats.noData") || "No monthly data available"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {departmentMonthList.map((monthData, index) => (
            <div
              key={`${monthData.year}-${monthData.month}`}
              onClick={() => navigate(`${monthData.month}/${monthData.year}`)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                isDark
                  ? "border-gray-700 bg-gray-750 hover:bg-gray-700"
                  : "border-gray-200 bg-gray-50 hover:bg-white"
              } ${index === 0 ? "ring-2 ring-green-500 ring-opacity-20" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {getMonthName(
                      monthData.monthNameAr,
                      monthData.month,
                      monthData.year
                    )}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {monthData.year}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${
                      monthData.completionPercentage === 100
                        ? "text-green-500"
                        : monthData.completionPercentage >= 80
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {monthData.completionPercentage}%
                  </div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("department.monthlyStats.completion") || "Completion"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {monthData.categoriesCount}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("department.monthlyStats.categories") || "Categories"}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {monthData.rostersCount}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("department.monthlyStats.rosters") || "Rosters"}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${
                      isDark ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  >
                    {monthData.shiftsCount}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("department.monthlyStats.shifts") || "Shifts"}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${
                      monthData.shortfallDoctors === 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {monthData.shortfallDoctors}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("department.monthlyStats.shortfall") || "Shortfall"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                <div
                  className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  <span className="font-medium">
                    {monthData.assignedDoctors}/{monthData.requiredDoctors}
                  </span>{" "}
                  {t("department.monthlyStats.doctorsAssigned") ||
                    "doctors assigned"}
                </div>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t("department.monthlyStats.lastUpdated") || "Updated"}:{" "}
                  {formatDate(monthData.lastUpdatedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RosterDepartmentMonths
