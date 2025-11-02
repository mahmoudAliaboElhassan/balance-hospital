import { useTranslation } from "react-i18next"
import i18next from "i18next"
import {
  Clock,
  Award,
  Building,
  FileText,
  BarChart3,
  Shield,
  Briefcase,
  PieChart as PieChartIcon,
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

const COLORS = [
  "#3B82F6", // Bright Blue
  "#10B981", // Emerald Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
]

export const DashboardCharts = ({ dashboardData, isDark, t }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl"

  if (!dashboardData) return null

  const usersDistributionData = [
    {
      name: t("dashboard.sections.users.doctorsCount") || "Doctors",
      value: dashboardData.users?.doctorsCount || 0,
    },
    {
      name: t("dashboard.sections.users.residentsCount") || "Residents",
      value: dashboardData.users?.residentsCount || 0,
    },
    {
      name: t("dashboard.sections.users.pendingUsers") || "Pending",
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
      name:
        t("dashboard.sections.pendingRequests.pendingLeaveRequests") || "Leave",
      value: dashboardData.pendingRequests?.pendingLeaveRequests || 0,
    },
    {
      name:
        t("dashboard.sections.pendingRequests.pendingSwapRequests") || "Swap",
      value: dashboardData.pendingRequests?.pendingSwapRequests || 0,
    },
    {
      name:
        t("dashboard.sections.pendingRequests.pendingDoctorJoinRequests") ||
        "Join",
      value: dashboardData.pendingRequests?.pendingDoctorJoinRequests || 0,
    },
    {
      name: t("dashboard.sections.pendingRequests.urgentRequests") || "Urgent",
      value: dashboardData.pendingRequests?.urgentRequests || 0,
    },
    {
      name:
        t("dashboard.sections.pendingRequests.overdueRequests") || "Overdue",
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
          dir={isRTL ? "rtl" : "ltr"}
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

  // RTL-aware Y-Axis tick component
  const CustomYAxisTick = ({ x, y, payload, val }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={isRTL ? val : -10}
          y={0}
          dy={4}
          textAnchor={isRTL ? "start" : "end"}
          fill={isDark ? "#9CA3AF" : "#6B7280"}
          fontSize={12}
        >
          {payload.value}
        </text>
      </g>
    )
  }

  // Custom X-Axis tick component
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={isDark ? "#9CA3AF" : "#6B7280"}
          fontSize={12}
        >
          {payload.value}
        </text>
      </g>
    )
  }

  // Calculate margins based on RTL direction
  const getBarChartMargins = (hasRotatedLabels = false) => {
    if (isRTL) {
      return {
        top: 20,
        right: 80,
        bottom: hasRotatedLabels ? 80 : 40,
        left: 20,
      }
    }
    return {
      top: 20,
      right: 20,
      bottom: hasRotatedLabels ? 80 : 40,
      left: 80,
    }
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
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={usersDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
                >
                  {usersDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                {/* 🎯 Custom color-dot legend only (no default Recharts shapes) */}
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={0} // hides default icons completely
                  formatter={(value, entry, index) => {
                    const color = COLORS[index % COLORS.length]
                    const item = usersDistributionData[index]
                    return (
                      <span
                        className={`flex items-center gap-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } text-sm`}
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        ></span>
                        {`${item.name}: ${item.value}`}
                      </span>
                    )
                  }}
                />

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

            <ResponsiveContainer width="100%" height={320}>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={rolesDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
                >
                  {rolesDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                {/* 🟣 Color-synced legend with role names & values */}
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconSize={0} // hides default Recharts icons
                  formatter={(value, entry, index) => {
                    const color = COLORS[index % COLORS.length]
                    const item = rolesDistributionData[index]
                    return (
                      <span
                        className={`flex items-center gap-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } text-sm`}
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        ></span>
                        {`${item.name}: ${item.value}`}
                      </span>
                    )
                  }}
                />

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
            <BarChart
              data={categoriesDoctorsData}
              margin={getBarChartMargins()}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="name"
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomXAxisTick />}
              />
              <YAxis
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomYAxisTick val={20} />}
                orientation={isRTL ? "right" : "left"}
              />
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
            <BarChart
              data={departmentsActivityData}
              margin={getBarChartMargins()}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="name"
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomXAxisTick />}
              />
              <YAxis
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomYAxisTick val={30} />}
                orientation={isRTL ? "right" : "left"}
              />
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
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={pendingRequestsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={false} // disable overlapping built-in labels
                >
                  {pendingRequestsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                {/* 🎯 Custom color-dot legend, no Recharts rectangles */}
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={0} // hides default icon
                  formatter={(value, entry, index) => {
                    const color = COLORS[index % COLORS.length]
                    const item = pendingRequestsData[index]
                    return (
                      <span
                        className={`flex items-center gap-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } text-sm`}
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        ></span>
                        {`${item.name}: ${item.value}`}
                      </span>
                    )
                  }}
                />

                <Tooltip content={<CustomTooltip />} />
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
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={degreesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="users"
                  label={false} // disable overlapping labels
                >
                  {degreesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                {/* 🎯 Custom legend with color dots only */}
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={0} // hides Recharts default icons
                  formatter={(value, entry, index) => {
                    const color = COLORS[index % COLORS.length]
                    const item = degreesData[index]
                    return (
                      <span
                        className={`flex items-center gap-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } text-sm`}
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        ></span>
                        {`${item.name}: ${item.users}`}
                      </span>
                    )
                  }}
                />

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
            <BarChart
              data={contractingTypesData}
              margin={getBarChartMargins(true)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="name"
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                angle={0}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomYAxisTick val={20} />}
                orientation={isRTL ? "right" : "left"}
              />
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
            <BarChart data={shiftTypesData} margin={getBarChartMargins()}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="name"
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomXAxisTick />}
              />
              <YAxis
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomYAxisTick val={20} />}
                orientation={isRTL ? "right" : "left"}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={({ payload }) => (
                  <ul className="flex flex-wrap gap-4 mt-3 justify-center">
                    {payload.map((entry, index) => (
                      <li
                        key={`item-${index}`}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        ></span>
                        <span>{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />
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
            <BarChart
              data={rostersCompletionData}
              margin={getBarChartMargins()}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="name"
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomXAxisTick />}
              />
              <YAxis
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                tick={<CustomYAxisTick val={20} />}
                orientation={isRTL ? "right" : "left"}
              />
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
