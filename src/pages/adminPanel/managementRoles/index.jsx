import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users,
  UserCheck,
  Crown,
  Building2,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Settings,
  Eye,
  UserPlus,
} from "lucide-react";

// Redux actions
import {
  getRoleStatistics,
  getCategoriesManagersSummary,
  getCategoriesWithManagers,
  getCurrentManagers,
  getDepartmentHeads,
  getManagerHistory,
} from "../../../state/act/actManagementRole";

// Hooks
import i18next from "i18next";

const ManagementRoles = () => {
  const { t } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const language = i18next.language;
  const isRTL = language === "ar";
  const dispatch = useDispatch();

  // Redux state
  const {
    roleStatistics,
    categoriesManagersSummary,
    categoriesWithManagers,
    currentManagers,
    departmentHeads,
    managerHistory,
    loadingRoleStatistics,
    loadingCategoriesSummary,
    loadingCategoriesWithManagers,
    loadingCurrentManagers,
    loadingDepartmentHeads,
    loadingManagerHistory,
    roleStatisticsError,
    categoriesSummaryError,
    categoriesWithManagersError,
  } = useSelector((state) => state.role);

  // Local state
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [dispatch]);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(getRoleStatistics()),
        dispatch(getCategoriesManagersSummary()),
        dispatch(getCategoriesWithManagers()),
        dispatch(getCurrentManagers()),
        dispatch(getDepartmentHeads({ limit: 5 })), // Get only recent 5
        dispatch(getManagerHistory({ limit: 5 })), // Get only recent 5
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Statistics cards data
  const getStatisticsCards = () => {
    if (!roleStatistics || !categoriesManagersSummary) return [];

    return [
      {
        title: t("managementRoles.statistics.totalUsers"),
        value: roleStatistics.totalUsers || 0,
        icon: Users,
        color: "blue",
        change: "+5%",
        changeType: "positive",
      },
      {
        title: t("managementRoles.statistics.totalManagers"),
        value: roleStatistics.managerCount || 0,
        icon: UserCheck,
        color: "green",
        change: "+2",
        changeType: "positive",
      },
      {
        title: t("managementRoles.statistics.departmentHeads"),
        value: roleStatistics.departmentHeadCount || 0,
        icon: Crown,
        color: "purple",
        change: "+1",
        changeType: "positive",
      },
      {
        title: t("managementRoles.statistics.categoriesWithManagers"),
        value: categoriesManagersSummary.categoriesWithManagers || 0,
        icon: Building2,
        color: "orange",
        change: `${categoriesManagersSummary.totalCategories || 0} ${t(
          "managementRoles.statistics.total"
        )}`,
        changeType: "neutral",
      },
    ];
  };

  // Quick actions data
  const getQuickActions = () => [
    {
      title: t("managementRoles.actions.assignManager"),
      description: t("managementRoles.actions.assignManagerDesc"),
      icon: UserPlus,
      color: "blue",
      path: "/admin-panel/management-roles/managers/assign",
    },
    {
      title: t("managementRoles.actions.assignDepartmentHead"),
      description: t("managementRoles.actions.assignDepartmentHeadDesc"),
      icon: Crown,
      color: "purple",
      path: "/admin-panel/management-roles/department-heads/assign",
    },
    {
      title: t("managementRoles.actions.viewStatistics"),
      description: t("managementRoles.actions.viewStatisticsDesc"),
      icon: BarChart3,
      color: "green",
      path: "/admin-panel/management-roles/statistics",
    },
    {
      title: t("managementRoles.actions.manageCategories"),
      description: t("managementRoles.actions.manageCategoriesDesc"),
      icon: Settings,
      color: "orange",
      path: "/admin-panel/management-roles/categories-managers",
    },
  ];

  // Loading skeleton component
  const LoadingSkeleton = ({ className }) => (
    <div className={`animate-pulse ${className}`}>
      <div
        className={`h-4 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded mb-2`}
      ></div>
      <div
        className={`h-4 ${
          isDark ? "bg-gray-700" : "bg-gray-200"
        } rounded w-3/4`}
      ></div>
    </div>
  );

  // Error message component
  const ErrorMessage = ({ error, title }) => (
    <div
      className={`p-4 rounded-lg border ${
        isDark
          ? "bg-red-900/20 border-red-800 text-red-400"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-1 text-sm">
        {language === "ar"
          ? error?.messageAr
          : error?.messageEn || "An error occurred"}
      </p>
    </div>
  );

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("managementRoles.title")}
              </h1>
              <p
                className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("managementRoles.description")}
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors ${
                isRTL ? "space-x-reverse" : ""
              }`}
            >
              <Activity
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""} ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              {t("managementRoles.refresh")}
            </button>
          </div>
        </div>

        {/* Error Messages */}
        {(roleStatisticsError ||
          categoriesSummaryError ||
          categoriesWithManagersError) && (
          <div className="mb-6 space-y-4">
            {roleStatisticsError && (
              <ErrorMessage
                error={roleStatisticsError}
                title={t("managementRoles.errors.statisticsError")}
              />
            )}
            {categoriesSummaryError && (
              <ErrorMessage
                error={categoriesSummaryError}
                title={t("managementRoles.errors.summaryError")}
              />
            )}
            {categoriesWithManagersError && (
              <ErrorMessage
                error={categoriesWithManagersError}
                title={t("managementRoles.errors.categoriesError")}
              />
            )}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatisticsCards().map((stat, index) => (
            <div
              key={index}
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-xl shadow-sm p-6 transition-all hover:shadow-md`}
            >
              {loadingRoleStatistics || loadingCategoriesSummary ? (
                <LoadingSkeleton className="h-20" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
                    >
                      <stat.icon
                        className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                      />
                    </div>
                    {stat.changeType !== "neutral" && (
                      <div
                        className={`text-sm font-medium ${
                          stat.changeType === "positive"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stat.value.toLocaleString()}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } mt-1`}
                    >
                      {stat.title}
                    </p>
                    {stat.changeType === "neutral" && (
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        } mt-1`}
                      >
                        {stat.change}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-xl shadow-sm p-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                {t("managementRoles.quickActions")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getQuickActions().map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className={`group p-4 rounded-lg border transition-all hover:shadow-md ${
                      isDark
                        ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon
                          className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400`}
                        />
                      </div>
                      <div className={`${isRTL ? "mr-3" : "ml-3"} flex-1`}>
                        <h3
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          } group-hover:text-${
                            action.color
                          }-600 dark:group-hover:text-${
                            action.color
                          }-400 transition-colors`}
                        >
                          {action.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          } mt-1`}
                        >
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Overview */}
            <div
              className={`mt-6 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-xl shadow-sm p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("managementRoles.categoriesOverview")}
                </h2>
                <Link
                  to="/admin-panel/management-roles/categories-managers"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  {t("managementRoles.viewAll")}
                </Link>
              </div>

              {loadingCategoriesWithManagers ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <LoadingSkeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {categoriesWithManagers?.slice(0, 5).map((category) => (
                    <div
                      key={category.categoryId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {language === "ar"
                            ? category.categoryNameArabic
                            : category.categoryNameEnglish}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {category.doctorsCount} {t("managementRoles.doctors")}{" "}
                          • {category.departmentsCount}{" "}
                          {t("managementRoles.departments")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {category.hasManager ? (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">
                              {t("managementRoles.hasManager")}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center text-orange-600 dark:text-orange-400">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">
                              {t("managementRoles.noManager")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-xl shadow-sm p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("managementRoles.recentActivity")}
                </h2>
                <Link
                  to="/admin-panel/management-roles/managers/history"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  {t("managementRoles.viewAll")}
                </Link>
              </div>

              {loadingManagerHistory ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <LoadingSkeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {managerHistory?.slice(0, 5).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 space-x-reverse"
                    >
                      <div
                        className={`p-1 rounded-full ${
                          activity.isActive
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {activity.isActive ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          <span className="font-medium">
                            {language === "ar"
                              ? activity.userNameArabic
                              : activity.userNameEnglish}
                          </span>{" "}
                          {activity.isActive
                            ? t("managementRoles.wasAssignedAs")
                            : t("managementRoles.wasRemovedFrom")}{" "}
                          {activity.managerType === "MANAGER"
                            ? t("managementRoles.manager")
                            : t("managementRoles.departmentHead")}
                        </p>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          } mt-1`}
                        >
                          {new Date(
                            activity.assignedAt || activity.revokedAt
                          ).toLocaleDateString(
                            language === "ar" ? "ar-SA" : "en-US"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-xl shadow-sm p-6`}
            >
              <h2
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                {t("managementRoles.quickStats")}
              </h2>

              {loadingCurrentManagers || loadingDepartmentHeads ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <LoadingSkeleton key={i} className="h-8" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("managementRoles.activeManagers")}
                    </span>
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {currentManagers?.length || 0}
                      </span>
                      <Link
                        to="/admin-panel/management-roles/managers"
                        className="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("managementRoles.activeDepartmentHeads")}
                    </span>
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {departmentHeads?.filter((head) => head.isActive)
                          ?.length || 0}
                      </span>
                      <Link
                        to="/admin-panel/management-roles/department-heads"
                        className="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementRoles;
