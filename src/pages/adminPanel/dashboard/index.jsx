import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import i18next from "i18next"
import {
  Users,
  UserCheck,
  Clock,
  Bell,
  AlertTriangle,
  TrendingUp,
  Mail,
  Settings,
  Calendar,
  Award,
  Building,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Activity,
  Shield,
  Briefcase,
  PieChart as PieChartIcon,
  ExternalLink,
  MapPin,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import LoadingGetData from "../../../components/LoadingGetData"
import { StatCard } from "../../../components/stateCard"
import { getDashboardData } from "../../../state/act/actReports"
import { clearDashboardError } from "../../../state/slices/reports"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../../utils/formtDate"

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
]

const DashboardCharts = ({ dashboardData, isDark, t }) => {
  if (!dashboardData) return null

  const usersDistributionData = [
    {
      name: t("dashboard.sections.users.doctorsCount"),
      value: dashboardData.users?.doctorsCount || 0,
    },
    {
      name: t("dashboard.sections.users.residentsCount"),
      value: dashboardData.users?.residentsCount || 0,
    },
    {
      name: t("dashboard.sections.users.pendingUsers"),
      value: dashboardData.users?.pendingUsers || 0,
    },
  ].filter((item) => item.value > 0)

  const rolesDistributionData =
    dashboardData.roles?.distribution
      ?.map((role) => ({
        name: i18next.language === "ar" ? role.roleNameAr : role.roleNameEn,
        value: role.activeUsersCount,
      }))
      .filter((item) => item.value > 0) || []

  const categoriesDoctorsData =
    dashboardData.categories?.topActiveCategories?.map((cat) => ({
      name: cat.code,
      id: cat.id,
      doctors: cat.doctorsCount,
      departments: cat.departmentsCount,
      rosters: cat.activeRostersCount,
      fullName: i18next.language === "ar" ? cat.nameArabic : cat.nameEnglish,
    })) || []

  const departmentsActivityData =
    dashboardData.departments?.topActiveDepartments?.map((dept) => ({
      name: dept.code,
      schedules: dept.activeSchedulesCount,
      doctors: dept.assignedDoctorsCount,
      fullName: i18next.language === "ar" ? dept.nameArabic : dept.nameEnglish,
    })) || []

  const pendingRequestsData = [
    {
      name: t("dashboard.sections.pendingRequests.pendingLeaveRequests"),
      value: dashboardData.pendingRequests?.pendingLeaveRequests || 0,
    },
    {
      name: t("dashboard.sections.pendingRequests.pendingSwapRequests"),
      value: dashboardData.pendingRequests?.pendingSwapRequests || 0,
    },
    {
      name: t("dashboard.sections.pendingRequests.pendingDoctorJoinRequests"),
      value: dashboardData.pendingRequests?.pendingDoctorJoinRequests || 0,
    },
    {
      name: t("dashboard.sections.pendingRequests.urgentRequests"),
      value: dashboardData.pendingRequests?.urgentRequests || 0,
    },
    {
      name: t("dashboard.sections.pendingRequests.overdueRequests"),
      value: dashboardData.pendingRequests?.overdueRequests || 0,
    },
  ].filter((item) => item.value > 0)

  const contractingTypesData =
    dashboardData.configurationSummary?.contractingTypes?.map((type) => ({
      name:
        i18next.language === "ar"
          ? type.nameArabic?.substring(0, 15)
          : type.nameEnglish?.split(" ")[0],
      users: type.usersCount,
      maxHours: type.maxHoursPerWeek,
      fullName: i18next.language === "ar" ? type.nameArabic : type.nameEnglish,
    })) || []

  const shiftTypesData =
    dashboardData.configurationSummary?.shiftTypes?.map((shift) => ({
      name:
        i18next.language === "ar"
          ? shift.nameArabic?.substring(0, 20)
          : shift.nameEnglish?.replace(" Shift", ""),
      usage: shift.usageToday,
      hours: shift.totalTime,
      fullName:
        i18next.language === "ar" ? shift.nameArabic : shift.nameEnglish,
    })) || []

  const rostersCompletionData =
    dashboardData.rosters?.activeRosters?.items?.map((roster) => ({
      name:
        i18next.language === "ar"
          ? roster.categoryName?.substring(0, 15)
          : roster.categoryName?.split(" ")[0],
      completion: parseFloat(roster.completionPercent),
      emptyShifts: roster.emptyShiftsCount,
      doctors: roster.assignedDoctorsCount,
      fullName: roster.categoryName,
    })) || []

  const degreesData =
    dashboardData.configurationSummary?.topDegreesByUsers?.map((degree) => ({
      name: i18next.language === "ar" ? degree.nameArabic : degree.nameEnglish,
      users: degree.usersCount,
    })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-lg ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <p
            className={`font-semibold mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 mb-6">
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}
      >
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } flex items-center gap-3 mb-2`}
        >
          <BarChart3 className="w-6 h-6 text-blue-500" />
          {t("dashboard.charts.title") || "Dashboard Analytics"}
        </h2>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {t("dashboard.charts.subtitle") ||
            "Visual insights and data analytics"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {usersDistributionData.length > 0 && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6`}
          >
            <h3
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <PieChartIcon className="w-5 h-5 text-blue-500" />
              {t("dashboard.charts.usersDistribution") || "Users Distribution"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usersDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {usersDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {rolesDistributionData.length > 0 && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6`}
          >
            <h3
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Shield className="w-5 h-5 text-purple-500" />
              {t("dashboard.charts.rolesDistribution") || "Roles Distribution"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rolesDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rolesDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {categoriesDoctorsData.length > 0 && (
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Briefcase className="w-5 h-5 text-green-500" />
            {t("dashboard.charts.categoriesResources") ||
              "Categories - Doctors & Resources"}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoriesDoctorsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis dataKey="name" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
              <YAxis stroke={isDark ? "#9CA3AF" : "#6B7280"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="doctors"
                fill="#3B82F6"
                name={t("dashboard.charts.doctors") || "Doctors"}
              />
              <Bar
                dataKey="departments"
                fill="#10B981"
                name={t("dashboard.charts.departments") || "Departments"}
              />
              <Bar
                dataKey="rosters"
                fill="#8B5CF6"
                name={t("dashboard.charts.activeRosters") || "Active Rosters"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {departmentsActivityData.length > 0 && (
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Building className="w-5 h-5 text-blue-500" />
            {t("dashboard.charts.departmentsActivity") ||
              "Departments Activity"}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={departmentsActivityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis dataKey="name" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
              <YAxis stroke={isDark ? "#9CA3AF" : "#6B7280"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="schedules"
                fill="#F59E0B"
                name={
                  t("dashboard.charts.activeSchedules") || "Active Schedules"
                }
              />
              <Bar
                dataKey="doctors"
                fill="#10B981"
                name={
                  t("dashboard.charts.assignedDoctors") || "Assigned Doctors"
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pendingRequestsData.length > 0 && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6`}
          >
            <h3
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Clock className="w-5 h-5 text-orange-500" />
              {t("dashboard.charts.pendingRequestsBreakdown") ||
                "Pending Requests Breakdown"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pendingRequestsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => value}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pendingRequestsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {degreesData.length > 0 && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6`}
          >
            <h3
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Award className="w-5 h-5 text-purple-500" />
              {t("dashboard.charts.degreesDistribution") ||
                "Degrees Distribution"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={degreesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="users"
                >
                  {degreesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {contractingTypesData.length > 0 && (
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <FileText className="w-5 h-5 text-blue-500" />
            {t("dashboard.charts.contractingTypes") ||
              "Contracting Types - Users & Max Hours"}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={contractingTypesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="name"
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke={isDark ? "#9CA3AF" : "#6B7280"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="users"
                fill="#3B82F6"
                name={t("dashboard.charts.usersCount") || "Users Count"}
              />
              <Bar
                dataKey="maxHours"
                fill="#10B981"
                name={t("dashboard.charts.maxHoursWeek") || "Max Hours/Week"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {shiftTypesData.length > 0 && (
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Clock className="w-5 h-5 text-orange-500" />
            {t("dashboard.charts.shiftTypesUsage") ||
              "Shift Types - Today's Usage"}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={shiftTypesData} layout="horizontal">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis type="number" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
              <YAxis
                type="category"
                dataKey="name"
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                width={150}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="usage"
                fill="#F59E0B"
                name={t("dashboard.charts.usageToday") || "Usage Today"}
              />
              <Bar
                dataKey="hours"
                fill="#8B5CF6"
                name={t("dashboard.charts.shiftHours") || "Shift Hours"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {rostersCompletionData.length > 0 && (
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <BarChart3 className="w-5 h-5 text-green-500" />
            {t("dashboard.charts.rostersCompletion") ||
              "Active Rosters - Completion Progress"}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={rostersCompletionData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis dataKey="name" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
              <YAxis stroke={isDark ? "#9CA3AF" : "#6B7280"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="completion"
                fill="#10B981"
                name={t("dashboard.charts.completionPercent") || "Completion %"}
              />
              <Bar
                dataKey="emptyShifts"
                fill="#EF4444"
                name={t("dashboard.charts.emptyShifts") || "Empty Shifts"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

const Dashboard = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)

  const {
    dashboardData,
    loadingGetDashboardData,
    dashboardError,
    lastUpdated,
  } = useSelector((state) => state.reports)

  const navigate = useNavigate()
  console.log("dashboardError", dashboardError)
  const [expandedSections, setExpandedSections] = useState({
    users: false,
    pendingRequests: false,
    notifications: false,
    systemAlerts: false,
    quickStats: false,
    configuration: false,
    shiftInsights: false,
    roles: false,
    emailQueue: false,
    categories: false,
    departments: false,
    managers: false,
    rosters: false,
    charts: false,
  })

  const isDark = mymode === "dark"
  const isRTL = i18next.language === "ar"

  useEffect(() => {
    dispatch(getDashboardData())

    return () => {
      dispatch(clearDashboardError())
    }
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(getDashboardData())
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (loadingGetDashboardData && !dashboardData) {
    return <LoadingGetData text={t("dashboard.loading")} />
  }

  if (dashboardError && !dashboardData) {
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
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("dashboard.error.title")}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {dashboardError.message}
            </p>
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <RefreshCw size={20} />
              {t("dashboard.error.retry")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {t("dashboard.title")}
                </h1>
                {lastUpdated && (
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("dashboard.lastUpdated")}: {formatDate(lastUpdated)}
                  </p>
                )}
              </div>
              <button
                onClick={handleRefresh}
                disabled={loadingGetDashboardData}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  size={20}
                  className={loadingGetDashboardData ? "animate-spin" : ""}
                />
                {t("dashboard.refresh")}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Charts Section */}
        {expandedSections.charts && (
          <DashboardCharts
            dashboardData={dashboardData}
            isDark={isDark}
            t={t}
          />
        )}

        {/* Users Section */}
        {dashboardData.users && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6 mb-6`}
          >
            <div
              className="flex items-center justify-between mb-6 cursor-pointer"
              onClick={() => toggleSection("users")}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <Users
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
                {t("dashboard.sections.users.title")}
              </h2>
              {expandedSections.users ? (
                <ChevronUp
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <ChevronDown
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </div>

            {expandedSections.users && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={Users}
                  label={t("dashboard.sections.users.totalUsers")}
                  value={dashboardData.users.totalUsers}
                  color="blue"
                  isDark={isDark}
                />
                <StatCard
                  icon={UserCheck}
                  label={t("dashboard.sections.users.activeUsers")}
                  value={dashboardData.users.activeUsers}
                  color="green"
                  isDark={isDark}
                />
                <StatCard
                  icon={Award}
                  label={t("dashboard.sections.users.doctorsCount")}
                  value={dashboardData.users.doctorsCount}
                  color="purple"
                  isDark={isDark}
                />
                <StatCard
                  icon={Users}
                  label={t("dashboard.sections.users.residentsCount")}
                  value={dashboardData.users.residentsCount}
                  color="orange"
                  isDark={isDark}
                />
                <StatCard
                  icon={Activity}
                  label={t("dashboard.sections.users.onlineUsers")}
                  value={dashboardData.users.onlineUsers}
                  color="green"
                  isDark={isDark}
                />
                <StatCard
                  icon={TrendingUp}
                  label={t("dashboard.sections.users.newUsersThisMonth")}
                  value={dashboardData.users.newUsersThisMonth}
                  color="blue"
                  isDark={isDark}
                />
                <StatCard
                  icon={Clock}
                  label={t("dashboard.sections.users.pendingUsers")}
                  value={dashboardData.users.pendingUsers}
                  color="yellow"
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        )}

        {/* Pending Requests Section */}
        {dashboardData.pendingRequests && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6 mb-6`}
          >
            <div
              className="flex items-center justify-between mb-6 cursor-pointer"
              onClick={() => toggleSection("pendingRequests")}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-orange-900/30" : "bg-orange-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <Clock
                    className={`w-4 h-4 ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  />
                </div>
                {t("dashboard.sections.pendingRequests.title")}
              </h2>
              {expandedSections.pendingRequests ? (
                <ChevronUp
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <ChevronDown
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </div>

            {expandedSections.pendingRequests && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <StatCard
                    icon={Clock}
                    label={t(
                      "dashboard.sections.pendingRequests.totalPendingRequests"
                    )}
                    value={dashboardData.pendingRequests.totalPendingRequests}
                    color="orange"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={Calendar}
                    label={t(
                      "dashboard.sections.pendingRequests.pendingLeaveRequests"
                    )}
                    value={dashboardData.pendingRequests.pendingLeaveRequests}
                    color="blue"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={RefreshCw}
                    label={t(
                      "dashboard.sections.pendingRequests.pendingSwapRequests"
                    )}
                    value={dashboardData.pendingRequests.pendingSwapRequests}
                    color="purple"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={UserCheck}
                    label={t(
                      "dashboard.sections.pendingRequests.pendingDoctorJoinRequests"
                    )}
                    value={
                      dashboardData.pendingRequests.pendingDoctorJoinRequests
                    }
                    color="green"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={AlertTriangle}
                    label={t(
                      "dashboard.sections.pendingRequests.urgentRequests"
                    )}
                    value={dashboardData.pendingRequests.urgentRequests}
                    color="red"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={Clock}
                    label={t(
                      "dashboard.sections.pendingRequests.overdueRequests"
                    )}
                    value={dashboardData.pendingRequests.overdueRequests}
                    color="red"
                    isDark={isDark}
                  />
                </div>

                {dashboardData.pendingRequests.recentRequests?.length > 0 && (
                  <div className="mt-6">
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("dashboard.sections.pendingRequests.recentRequests")}
                    </h3>
                    <div className="space-y-3">
                      {dashboardData.pendingRequests.recentRequests.map(
                        (request) => (
                          <div
                            key={request.id}
                            className={`p-4 rounded-lg border ${
                              isDark
                                ? "bg-gray-700 border-gray-600"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p
                                  className={`font-medium ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {request.requesterName}
                                </p>
                                <p
                                  className={`text-sm ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {request.description}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isDark ? "text-gray-500" : "text-gray-500"
                                  }`}
                                >
                                  {formatDate(request.requestDate)}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  request.priority === "High"
                                    ? "bg-red-100 text-red-800"
                                    : request.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {request.priority}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Quick Stats Section */}
        {dashboardData.quickStats && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6 mb-6`}
          >
            <div
              className="flex items-center justify-between mb-6 cursor-pointer"
              onClick={() => toggleSection("quickStats")}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-purple-900/30" : "bg-purple-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <BarChart3
                    className={`w-4 h-4 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                </div>
                {t("dashboard.sections.quickStats.title")}
              </h2>
              {expandedSections.quickStats ? (
                <ChevronUp
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <ChevronDown
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </div>

            {expandedSections.quickStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                  icon={Activity}
                  label={t("dashboard.sections.quickStats.dailyAttendanceRate")}
                  value={`${dashboardData.quickStats.dailyAttendanceRate}%`}
                  color="green"
                  isDark={isDark}
                />
                <StatCard
                  icon={TrendingUp}
                  label={t(
                    "dashboard.sections.quickStats.userSatisfactionRate"
                  )}
                  value={`${dashboardData.quickStats.userSatisfactionRate}%`}
                  color="blue"
                  isDark={isDark}
                />
                <StatCard
                  icon={BarChart3}
                  label={t("dashboard.sections.quickStats.taskCompletionRate")}
                  value={`${dashboardData.quickStats.taskCompletionRate}%`}
                  color="purple"
                  isDark={isDark}
                />
                <StatCard
                  icon={Clock}
                  label={t("dashboard.sections.quickStats.averageResponseTime")}
                  value={`${dashboardData.quickStats.averageResponseTime}h`}
                  color="orange"
                  isDark={isDark}
                />
                <StatCard
                  icon={Mail}
                  label={t("dashboard.sections.quickStats.emailsSentToday")}
                  value={dashboardData.quickStats.emailsSentToday}
                  color="blue"
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        )}

        {/* Categories Section */}
        {dashboardData.categories && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6 mb-6`}
          >
            <div
              className="flex items-center justify-between mb-6 cursor-pointer"
              onClick={() => toggleSection("categories")}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-green-900/30" : "bg-green-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <Briefcase
                    className={`w-4 h-4 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  />
                </div>
                {t("dashboard.sections.categories.title")}
              </h2>
              {expandedSections.categories ? (
                <ChevronUp
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <ChevronDown
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </div>

            {expandedSections.categories && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    icon={Briefcase}
                    label={t("dashboard.sections.categories.totalCategories")}
                    value={dashboardData.categories.totalCategories}
                    color="green"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={UserCheck}
                    label={t("dashboard.sections.categories.activeCategories")}
                    value={dashboardData.categories.activeCategories}
                    color="blue"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={Shield}
                    label={t(
                      "dashboard.sections.categories.categoriesWithManagers"
                    )}
                    value={dashboardData.categories.categoriesWithManagers}
                    color="purple"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={Users}
                    label={t(
                      "dashboard.sections.categories.totalDoctorsInCategories"
                    )}
                    value={dashboardData.categories.totalDoctorsInCategories}
                    color="orange"
                    isDark={isDark}
                  />
                </div>

                {dashboardData.categories.topActiveCategories?.length > 0 && (
                  <div className="mt-6">
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("dashboard.sections.categories.topActiveCategories") ||
                        "Top Active Categories"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dashboardData.categories.topActiveCategories.map(
                        (category) => (
                          <div
                            key={category.id}
                            className={`p-4 rounded-lg border ${
                              isDark
                                ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            } transition-colors cursor-pointer`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-xs font-mono px-2 py-1 rounded ${
                                      isDark
                                        ? "bg-green-900/30 text-green-400"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {category.code}
                                  </span>
                                  <ExternalLink
                                    onClick={() =>
                                      navigate(
                                        `/admin-panel/category/${category.id}`
                                      )
                                    }
                                    className="w-4 h-4 text-gray-400"
                                  />
                                </div>
                                <p
                                  className={`font-medium text-sm ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {i18next.language === "ar"
                                    ? category.nameArabic
                                    : category.nameEnglish}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div>
                                <p
                                  className={`text-2xl font-bold ${
                                    isDark ? "text-blue-400" : "text-blue-600"
                                  }`}
                                >
                                  {category.doctorsCount}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t("dashboard.sections.categories.doctors") ||
                                    "Doctors"}
                                </p>
                              </div>
                              <div>
                                <p
                                  className={`text-2xl font-bold ${
                                    isDark
                                      ? "text-purple-400"
                                      : "text-purple-600"
                                  }`}
                                >
                                  {category.departmentsCount}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t(
                                    "dashboard.sections.categories.departments"
                                  ) || "Departments"}
                                </p>
                              </div>
                              <div>
                                <p
                                  className={`text-2xl font-bold ${
                                    isDark ? "text-green-400" : "text-green-600"
                                  }`}
                                >
                                  {category.activeRostersCount}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t("dashboard.sections.categories.rosters") ||
                                    "Rosters"}
                                </p>
                              </div>
                            </div>
                            {category.managerName && (
                              <div
                                className={`mt-3 pt-3 border-t ${
                                  isDark ? "border-gray-600" : "border-gray-200"
                                }`}
                              >
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t("dashboard.sections.categories.manager") ||
                                    "Manager"}
                                  :{" "}
                                  <span
                                    className={
                                      isDark ? "text-gray-300" : "text-gray-700"
                                    }
                                  >
                                    {category.managerName}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {dashboardData.categories.categoryAlerts?.length > 0 && (
                  <div className="mt-6">
                    <h3
                      className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      {t("dashboard.sections.categories.alerts") ||
                        "Category Alerts"}
                    </h3>
                    <div className="space-y-2">
                      {dashboardData.categories.categoryAlerts.map(
                        (alert, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 ${
                              alert.severity === "Warning"
                                ? isDark
                                  ? "bg-yellow-900/20 border-yellow-500"
                                  : "bg-yellow-50 border-yellow-500"
                                : isDark
                                ? "bg-red-900/20 border-red-500"
                                : "bg-red-50 border-red-500"
                            }`}
                          >
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {alert.message}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Configuration Summary Section */}
        {dashboardData.configurationSummary && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6 mb-6`}
          >
            <div
              className="flex items-center justify-between mb-6 cursor-pointer"
              onClick={() => toggleSection("configuration")}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-indigo-900/30" : "bg-indigo-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <Settings
                    className={`w-4 h-4 ${
                      isDark ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  />
                </div>
                {t("dashboard.sections.configuration.title") ||
                  "Configuration Summary"}
              </h2>
              {expandedSections.configuration ? (
                <ChevronUp
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <ChevronDown
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </div>

            {expandedSections.configuration && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard
                    icon={Award}
                    label={
                      t("dashboard.sections.configuration.activeDegrees") ||
                      "Active Degrees"
                    }
                    value={dashboardData.configurationSummary.activeDegrees}
                    color="purple"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={FileText}
                    label={
                      t(
                        "dashboard.sections.configuration.activeContractingTypes"
                      ) || "Contracting Types"
                    }
                    value={
                      dashboardData.configurationSummary.activeContractingTypes
                    }
                    color="blue"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={Clock}
                    label={
                      t("dashboard.sections.configuration.activeShiftTypes") ||
                      "Shift Types"
                    }
                    value={dashboardData.configurationSummary.activeShiftTypes}
                    color="orange"
                    isDark={isDark}
                  />
                </div>

                {dashboardData.configurationSummary.contractingTypes?.length >
                  0 && (
                  <div className="mt-6">
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("dashboard.sections.configuration.contractingTypes") ||
                        "Contracting Types"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dashboardData.configurationSummary.contractingTypes.map(
                        (type) => (
                          <div
                            key={type.id}
                            className={`p-4 rounded-lg border ${
                              isDark
                                ? "bg-gray-700 border-gray-600"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p
                                  className={`font-medium text-sm mb-1 ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {i18next.language === "ar"
                                    ? type.nameArabic
                                    : type.nameEnglish}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      type.allowOvertimeHours
                                        ? isDark
                                          ? "bg-green-900/30 text-green-400"
                                          : "bg-green-100 text-green-700"
                                        : isDark
                                        ? "bg-gray-600 text-gray-300"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {type.allowOvertimeHours
                                      ? t(
                                          "dashboard.sections.configuration.overtimeAllowed"
                                        ) || "Overtime ✓"
                                      : t(
                                          "dashboard.sections.configuration.noOvertime"
                                        ) || "No Overtime"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p
                                  className={`text-2xl font-bold ${
                                    isDark ? "text-blue-400" : "text-blue-600"
                                  }`}
                                >
                                  {type.usersCount}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t(
                                    "dashboard.sections.configuration.users"
                                  ) || "Users"}
                                </p>
                              </div>
                              <div>
                                <p
                                  className={`text-2xl font-bold ${
                                    isDark
                                      ? "text-orange-400"
                                      : "text-orange-600"
                                  }`}
                                >
                                  {type.maxHoursPerWeek}h
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t(
                                    "dashboard.sections.configuration.usageToday"
                                  ) || "Usage Today"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Departments Section */}
        {dashboardData.departments && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6 mb-6`}
          >
            <div
              className="flex items-center justify-between mb-6 cursor-pointer"
              onClick={() => toggleSection("departments")}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <Building
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
                {t("dashboard.sections.departments.title")}
              </h2>
              {expandedSections.departments ? (
                <ChevronUp
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <ChevronDown
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </div>

            {expandedSections.departments && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    icon={Building}
                    label={t("dashboard.sections.departments.totalDepartments")}
                    value={dashboardData.departments.totalDepartments}
                    color="blue"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={UserCheck}
                    label={t(
                      "dashboard.sections.departments.activeDepartments"
                    )}
                    value={dashboardData.departments.activeDepartments}
                    color="green"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={Shield}
                    label={t(
                      "dashboard.sections.departments.departmentsWithManagers"
                    )}
                    value={dashboardData.departments.departmentsWithManagers}
                    color="purple"
                    isDark={isDark}
                  />
                  <StatCard
                    icon={Calendar}
                    label={t(
                      "dashboard.sections.departments.totalActiveSchedules"
                    )}
                    value={dashboardData.departments.totalActiveSchedules}
                    color="orange"
                    isDark={isDark}
                  />
                </div>

                {dashboardData.departments.topActiveDepartments?.length > 0 && (
                  <div className="mt-6">
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t(
                        "dashboard.sections.departments.topActiveDepartments"
                      ) || "Top Active Departments"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dashboardData.departments.topActiveDepartments.map(
                        (dept) => (
                          <div
                            key={dept.id}
                            className={`p-4 rounded-lg border ${
                              isDark
                                ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            } transition-colors cursor-pointer`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`text-xs font-mono px-2 py-1 rounded ${
                                      isDark
                                        ? "bg-blue-900/30 text-blue-400"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {dept.code}
                                  </span>
                                  {dept.hasGeoFence && (
                                    <MapPin className="w-4 h-4 text-green-500" />
                                  )}
                                  <ExternalLink
                                    onClick={() =>
                                      navigate(
                                        `/admin-panel/department/${dept.id}`
                                      )
                                    }
                                    className="w-4 h-4 text-gray-400"
                                  />
                                </div>
                                <p
                                  className={`font-medium text-sm mb-1 ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {i18next.language === "ar"
                                    ? dept.nameArabic
                                    : dept.nameEnglish}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {dept.location}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center mb-3">
                              <div>
                                <p
                                  className={`text-2xl font-bold ${
                                    isDark
                                      ? "text-orange-400"
                                      : "text-orange-600"
                                  }`}
                                >
                                  {dept.activeSchedulesCount}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t(
                                    "dashboard.sections.departments.schedules"
                                  ) || "Schedules"}
                                </p>
                              </div>
                              <div>
                                <p
                                  className={`text-2xl font-bold ${
                                    isDark ? "text-blue-400" : "text-blue-600"
                                  }`}
                                >
                                  {dept.assignedDoctorsCount}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t(
                                    "dashboard.sections.departments.doctors"
                                  ) || "Doctors"}
                                </p>
                              </div>
                              <div>
                                <p
                                  className={`text-2xl font-bold ${
                                    isDark
                                      ? "text-purple-400"
                                      : "text-purple-600"
                                  }`}
                                >
                                  {dept.categoriesCount}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {t(
                                    "dashboard.sections.departments.categories"
                                  ) || "Categories"}
                                </p>
                              </div>
                            </div>
                            {dept.geoFenceInfo && (
                              <div
                                className={`pt-3 border-t ${
                                  isDark ? "border-gray-600" : "border-gray-200"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <p
                                    className={`text-xs ${
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                                  >
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {dept.geoFenceInfo.name}
                                  </p>
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      dept.geoFenceInfo.isActive
                                        ? isDark
                                          ? "bg-green-900/30 text-green-400"
                                          : "bg-green-100 text-green-700"
                                        : isDark
                                        ? "bg-gray-600 text-gray-300"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {dept.geoFenceInfo.radiusMeters}m
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {dashboardData.departments.departmentAlerts?.length > 0 && (
                  <div className="mt-6">
                    <h3
                      className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      {t("dashboard.sections.departments.alerts") ||
                        "Department Alerts"}
                    </h3>
                    <div className="space-y-2">
                      {dashboardData.departments.departmentAlerts.map(
                        (alert, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 ${
                              alert.severity === "Warning"
                                ? isDark
                                  ? "bg-yellow-900/20 border-yellow-500"
                                  : "bg-yellow-50 border-yellow-500"
                                : isDark
                                ? "bg-red-900/20 border-red-500"
                                : "bg-red-50 border-red-500"
                            }`}
                          >
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {alert.message}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {dashboardData.departments.departmentsWithGeoFence > 0 && (
                  <div className="mt-6">
                    <div
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin
                            className={`w-5 h-5 ${
                              isDark ? "text-blue-400" : "text-blue-600"
                            }`}
                          />
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {t(
                                "dashboard.sections.departments.geoFenceCoverage"
                              ) || "GeoFence Coverage"}
                            </p>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {
                                dashboardData.departments
                                  .departmentsWithGeoFence
                              }{" "}
                              of {dashboardData.departments.totalDepartments}{" "}
                              departments
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-2xl font-bold ${
                              isDark ? "text-green-400" : "text-green-600"
                            }`}
                          >
                            {dashboardData.departments.geoFenceCoverageRate}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Rosters Section */}
        {dashboardData.rosters && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6 mb-6`}
          >
            <div
              className="flex items-center justify-between mb-6 cursor-pointer"
              onClick={() => toggleSection("rosters")}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-purple-900/30" : "bg-purple-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <FileText
                    className={`w-4 h-4 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                </div>
                {t("dashboard.sections.rosters.title")}
              </h2>
              {expandedSections.rosters ? (
                <ChevronUp
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <ChevronDown
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </div>

            {expandedSections.rosters && dashboardData.rosters.generalStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={FileText}
                  label={t("dashboard.sections.rosters.totalRosters")}
                  value={dashboardData.rosters.generalStats.totalRosters}
                  color="purple"
                  isDark={isDark}
                />
                <StatCard
                  icon={Calendar}
                  label={t("dashboard.sections.rosters.upcomingRostersCount")}
                  value={
                    dashboardData.rosters.generalStats.upcomingRostersCount
                  }
                  color="blue"
                  isDark={isDark}
                />
                <StatCard
                  icon={BarChart3}
                  label={t("dashboard.sections.rosters.overallCompletionRate")}
                  value={`${dashboardData.rosters.generalStats.overallCompletionRate}%`}
                  color="green"
                  isDark={isDark}
                />
                <StatCard
                  icon={AlertTriangle}
                  label={t("dashboard.sections.rosters.expiredRosters")}
                  value={dashboardData.rosters.generalStats.expiredRosters}
                  color="red"
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
