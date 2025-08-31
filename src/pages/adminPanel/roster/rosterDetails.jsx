import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  addWorkingHours,
  getRosterById,
} from "../../../state/act/actRosterManagement";
import { useTranslation } from "react-i18next";
import LoadingGetData from "../../../components/LoadingGetData";
import ModalUpdateRosterStatus from "../../../components/ModalUpdateRosterStatus";
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Calendar,
  Clock,
  Users,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  User,
  Layers,
  Timer,
  Target,
  AlertCircle,
  Building,
  Briefcase,
  TrendingUp,
  Info,
  Activity,
  PlusCircle,
  Archive,
  PenTool,
  Send,
} from "lucide-react";

function RosterDetails() {
  const { rosterId } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  // Modal states
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState({
    id: null,
    title: "",
    currentStatus: "",
  });

  const { selectedRoster, loading, errors } = useSelector(
    (state) => state.rosterManagement
  );
  const { mymode } = useSelector((state) => state.mode);

  // Get current language direction
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (rosterId) {
      dispatch(getRosterById({ rosterId }));
    }
  }, [dispatch, rosterId, statusModalOpen]);

  // Get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      DRAFT_BASIC: {
        name: t("roster.status.draftBasic"),
        color: isDark
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-800",
        icon: FileText,
      },
      DRAFT_PARTIAL: {
        name: t("roster.status.draftPartial"),
        color: isDark
          ? "bg-yellow-900/40 text-yellow-300"
          : "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      DRAFT: {
        name: t("roster.status.draft"),
        color: isDark
          ? "bg-blue-900/40 text-blue-300"
          : "bg-blue-100 text-blue-800",
        icon: PenTool,
      },
      DRAFT_READY: {
        name: t("roster.status.draftReady"),
        color: isDark
          ? "bg-purple-900/40 text-purple-300"
          : "bg-purple-100 text-purple-800",
        icon: Send,
      },
      PUBLISHED: {
        name: t("roster.status.published"),
        color: isDark
          ? "bg-green-900/40 text-green-300"
          : "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      CLOSED: {
        name: t("roster.status.closed"),
        color: isDark
          ? "bg-red-900/40 text-red-300"
          : "bg-red-100 text-red-800",
        icon: XCircle,
      },
      ARCHIVED: {
        name: t("roster.status.archived"),
        color: isDark
          ? "bg-red-900/40 text-red-300"
          : "bg-red-100 text-red-800",
        icon: Archive,
      },
    };
    return statusMap[status] || statusMap.DRAFT_BASIC;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get progress color
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading.fetch) {
    return <LoadingGetData text={t("gettingData.roster")} />;
  }

  if (errors.general) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">{errors.general}</div>
              <Link
                to="/admin-panel/rosters"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("roster.actions.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedRoster) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <div
                className={`text-lg mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("roster.notFound")}
              </div>
              <Link
                to="/admin-panel/rosters"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("roster.actions.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(selectedRoster.status);
  console.log("statusInfo", statusInfo);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <Link
              to="/admin-panel/rosters"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("roster.actions.backToList")}
              </span>
            </Link>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link to={`/admin-panel/rosters/${selectedRoster.id}/edit`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
                  <Edit size={16} />
                  {t("roster.actions.edit")}
                </button>
              </Link>
              <Link
                to={`/admin-panel/rosters/${selectedRoster.id}/working-hours`}
              >
                <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center">
                  <Clock size={16} />
                  {t("roster.workingHours.title")}
                </button>
              </Link>

              <Link to={`/admin-panel/rosters/departments`}>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
                  <Building size={16} />
                  {t("roster.actions.manageRoster")}
                </button>
              </Link>

              <button
                onClick={() => {
                  setStatusToUpdate({
                    id: selectedRoster.id,
                    title: selectedRoster.title,
                    currentStatus: selectedRoster.status,
                  });
                  setStatusModalOpen(true);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80 cursor-pointer ${statusInfo.color} flex items-center gap-2 w-full sm:w-auto justify-center`}
                title={t("roster.actions.updateStatus")}
              >
                <StatusIcon size={16} />
                {statusInfo.name}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-blue-100"
              } rounded-lg`}
            >
              <Calendar
                className={`h-8 w-8 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                {selectedRoster.title}
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Layers
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {selectedRoster.categoryName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {formatDate(selectedRoster.startDate)} -{" "}
                    {formatDate(selectedRoster.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6 flex items-center`}
              >
                <Info
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("roster.details.basicInfo")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("roster.form.title")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {selectedRoster.title}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("roster.form.category")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {selectedRoster.categoryName}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("roster.form.month")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {selectedRoster.month}/{selectedRoster.year}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("roster.dayss")}
                  </label>
                  <div className="flex items-center">
                    <Calendar
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                      size={18}
                    />
                    <span
                      className={`text-base ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {selectedRoster.totalDays} {t("roster.dayss")}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("roster.form.submissionDeadline")}
                  </label>
                  <div className="flex items-center">
                    <AlertCircle
                      className={`${
                        isDark ? "text-orange-400" : "text-orange-500"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                      size={18}
                    />
                    <span
                      className={`text-base ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {formatDate(selectedRoster.submissionDeadline)}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("roster.table.status")}
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}
                  >
                    <StatusIcon
                      size={14}
                      className={`${isRTL ? "ml-1" : "mr-1"}`}
                    />
                    {statusInfo.name}
                  </span>
                </div>

                {selectedRoster.description && (
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-2`}
                    >
                      {t("roster.form.description")}
                    </label>
                    <div
                      className={`p-3 ${
                        isDark ? "bg-gray-700" : "bg-gray-50"
                      } rounded-lg border ${
                        isDark ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start">
                        <FileText
                          className={`h-5 w-5 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          } ${isRTL ? "ml-2" : "mr-2"} mt-0.5 flex-shrink-0`}
                        />
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } leading-relaxed`}
                        >
                          {selectedRoster.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress and Statistics */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6 flex items-center`}
              >
                <TrendingUp
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("roster.details.progress")}
              </h2>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("roster.completionPercentage")}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {Math.round(selectedRoster.completionPercentage)}%
                  </span>
                </div>
                <div
                  className={`w-full ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  } rounded-full h-3`}
                >
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                      selectedRoster.completionPercentage
                    )}`}
                    style={{ width: `${selectedRoster.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <Building
                    className={`h-6 w-6 mx-auto mb-2 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {selectedRoster.departmentsCount}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("roster.departments")}
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <Briefcase
                    className={`h-6 w-6 mx-auto mb-2 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {selectedRoster.shiftsCount}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("roster.shifts")}
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <Timer
                    className={`h-6 w-6 mx-auto mb-2 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {selectedRoster.workingHoursCount}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("roster.workingHours.title")}
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                  <Target
                    className={`h-6 w-6 mx-auto mb-2 ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  />
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  >
                    {Math.round(selectedRoster.completionPercentage)}%
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("roster.completed")}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6 flex items-center`}
              >
                <Settings
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("roster.details.settings")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("roster.form.allowLeaveRequests")}
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedRoster.allowLeaveRequests
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {selectedRoster.allowLeaveRequests ? (
                      <CheckCircle
                        size={14}
                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                      />
                    ) : (
                      <XCircle
                        size={14}
                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                      />
                    )}
                    {selectedRoster.allowLeaveRequests
                      ? t("roster.allowed")
                      : t("roster.notAllowed")}
                  </span>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("roster.form.allowSwapRequests")}
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedRoster.allowSwapRequests
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {selectedRoster.allowSwapRequests ? (
                      <CheckCircle
                        size={14}
                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                      />
                    ) : (
                      <XCircle
                        size={14}
                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                      />
                    )}
                    {selectedRoster.allowSwapRequests
                      ? t("roster.allowed")
                      : t("roster.notAllowed")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4 flex items-center`}
              >
                <Activity
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("roster.details.quickActions")}
              </h3>

              <div className="space-y-3">
                <Link to={`/admin-panel/rosters/departments`} className="block">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105">
                    <Building size={18} />
                    {t("roster.actions.manageRoster")}
                  </button>
                </Link>

                <button
                  onClick={() => {
                    setStatusToUpdate({
                      id: selectedRoster.id,
                      title: selectedRoster.title,
                      currentStatus: selectedRoster.status,
                    });
                    setStatusModalOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
                >
                  <Settings size={18} />
                  {t("roster.actions.updateStatus")}
                </button>

                <Link
                  to={`/admin-panel/rosters/${selectedRoster.id}/edit`}
                  className="block"
                >
                  <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105">
                    <Edit size={18} />
                    {t("roster.actions.editRoster")}
                  </button>
                </Link>

                <Link
                  to={`/admin-panel/rosters/${selectedRoster.id}/working-hours`}
                >
                  <button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105">
                    <Clock size={16} />
                    {t("roster.workingHours.title")}
                  </button>
                </Link>
              </div>
            </div>

            {/* Date Information */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4 flex items-center`}
              >
                <Calendar
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("roster.details.dateInfo")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="flex items-center">
                    <PlusCircle
                      className={`h-5 w-5 ${
                        isDark ? "text-green-400" : "text-green-600"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.details.startDate")}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {formatDate(selectedRoster.startDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                  <div className="flex items-center">
                    <XCircle
                      className={`h-5 w-5 ${
                        isDark ? "text-red-400" : "text-red-600"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.details.endDate")}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {formatDate(selectedRoster.endDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle
                      className={`h-5 w-5 ${
                        isDark ? "text-orange-400" : "text-orange-600"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.details.deadline")}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  >
                    {formatDate(selectedRoster.submissionDeadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4 flex items-center`}
              >
                <Clock
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("roster.details.auditInfo")}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("roster.details.createdAt")}
                  </label>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {formatDateTime(selectedRoster.createdAt)}
                  </p>
                </div>

                {selectedRoster.createdByName && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("roster.details.createdBy")}
                    </label>
                    <div className="flex items-center">
                      <User
                        className={`h-4 w-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedRoster.createdByName}
                      </span>
                    </div>
                  </div>
                )}

                {selectedRoster.updatedAt && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("roster.details.updatedAt")}
                    </label>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatDateTime(selectedRoster.updatedAt)}
                    </p>
                  </div>
                )}

                {selectedRoster.updatedByName && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("roster.details.updatedBy")}
                    </label>
                    <div className="flex items-center">
                      <User
                        className={`h-4 w-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedRoster.updatedByName}
                      </span>
                    </div>
                  </div>
                )}

                {selectedRoster.publishedAt && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("roster.details.publishedAt")}
                    </label>
                    <div className="flex items-center">
                      <CheckCircle
                        className={`h-4 w-4 ${
                          isDark ? "text-green-400" : "text-green-500"
                        } ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatDateTime(selectedRoster.publishedAt)}
                      </span>
                    </div>
                  </div>
                )}

                {selectedRoster.closedAt && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("roster.details.closedAt")}
                    </label>
                    <div className="flex items-center">
                      <XCircle
                        className={`h-4 w-4 ${
                          isDark ? "text-red-400" : "text-red-500"
                        } ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatDateTime(selectedRoster.closedAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <ModalUpdateRosterStatus
          setStatusModalOpen={setStatusModalOpen}
          statusToUpdate={statusToUpdate}
          setStatusToUpdate={setStatusToUpdate}
        />
      )}
    </div>
  );
}

export default RosterDetails;
