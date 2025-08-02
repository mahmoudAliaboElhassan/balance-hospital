import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getShiftHoursTypeById } from "../../../state/act/actShiftHours";
import {
  clearSingleShiftHoursType,
  clearSingleShiftHoursTypeError,
} from "../../../state/slices/shiftHours";
import LoadingGetData from "../../../components/LoadingGetData";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Hash,
  Info,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Timer,
  MapPin,
} from "lucide-react";

function SpecificShiftHoursType() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedShiftHoursType,
    loadingGetSingleShiftHoursType,
    singleShiftHoursTypeError,
  } = useSelector((state) => state.shiftHour);

  const { mymode } = useSelector((state) => state.mode);
  const { t, i18n } = useTranslation();

  // Get current language direction
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (id) {
      dispatch(clearSingleShiftHoursType());
      dispatch(getShiftHoursTypeById(id));
    }

    return () => {
      dispatch(clearSingleShiftHoursType());
      dispatch(clearSingleShiftHoursTypeError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (singleShiftHoursTypeError) {
      if (singleShiftHoursTypeError.status === 404) {
        console.error("ShiftHoursType not found");
      } else if (singleShiftHoursTypeError.status === 403) {
        console.error("Access denied");
      }
    }
  }, [singleShiftHoursTypeError, navigate]);

  // Get shift hours type name based on current language
  const getShiftHoursTypeName = () => {
    if (!selectedShiftHoursType) return "";
    return currentLang === "en"
      ? selectedShiftHoursType.nameEnglish
      : selectedShiftHoursType.nameArabic;
  };

  // Get shift hours type secondary name (opposite language)
  const getShiftHoursTypeSecondaryName = () => {
    if (!selectedShiftHoursType) return "";
    return currentLang === "en"
      ? selectedShiftHoursType.nameArabic
      : selectedShiftHoursType.nameEnglish;
  };

  // Get user name based on current language
  const getUserName = (user) => {
    if (!user) return "";
    return currentLang === "en" ? user.nameEnglish : user.nameArabic;
  };

  // Format date
  const formatDate = (dateString) => {
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

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "-";
    const [hours, minutes] = timeString.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get period icon
  const getPeriodIcon = (period) => {
    switch (period?.toLowerCase()) {
      case "morning":
        return Sunrise;
      case "afternoon":
        return Sun;
      case "evening":
        return Sunset;
      case "night":
        return Moon;
      default:
        return Clock;
    }
  };

  // Get period color
  const getPeriodColor = (period) => {
    switch (period?.toLowerCase()) {
      case "morning":
        return "text-yellow-500";
      case "afternoon":
        return "text-orange-500";
      case "evening":
        return "text-purple-500";
      case "night":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  if (loadingGetSingleShiftHoursType) return <LoadingGetData />;

  if (singleShiftHoursTypeError) {
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
              <div className="text-red-500 text-lg mb-4">
                {singleShiftHoursTypeError?.message ||
                  t("shiftHoursTypes.fetchError")}
              </div>
              <Link
                to="/admin-panel/shift-hours-types"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("shiftHoursTypes.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedShiftHoursType) {
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
                {t("shiftHoursTypes.notFound")}
              </div>
              <Link
                to="/admin-panel/shift-hours-types"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("shiftHoursTypes.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const PeriodIcon = getPeriodIcon(selectedShiftHoursType.period);

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/admin-panel/shift-hours-types"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("shiftHoursTypes.backToList")}
              </span>
            </Link>

            <Link
              to={`/admin-panel/shift-hours-types/edit/${selectedShiftHoursType.id}`}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center">
                <Edit size={16} className={`${isRTL ? "ml-2" : "mr-2"}`} />
                {t("shiftHoursTypes.actions.edit")}
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-blue-100"
              } rounded-lg`}
            >
              <PeriodIcon
                className={`h-8 w-8 ${
                  isDark
                    ? "text-blue-400"
                    : getPeriodColor(selectedShiftHoursType.period)
                }`}
              />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {getShiftHoursTypeName()}
              </h1>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {getShiftHoursTypeSecondaryName()}
              </p>
              {selectedShiftHoursType.code && (
                <div className="flex items-center mt-2">
                  <Hash
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } ${isRTL ? "ml-1" : "mr-1"}`}
                  />
                  <span
                    className={`text-sm font-mono px-2 py-1 rounded ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedShiftHoursType.code}
                  </span>
                </div>
              )}
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
                {t("shiftHoursTypes.details.basicInfo")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("shiftHoursTypes.form.nameArabic")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                    dir="rtl"
                  >
                    {selectedShiftHoursType.nameArabic}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("shiftHoursTypes.form.nameEnglish")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                    dir="ltr"
                  >
                    {selectedShiftHoursType.nameEnglish}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("shiftHoursTypes.form.period")}
                  </label>
                  <div className="flex items-center">
                    <PeriodIcon
                      className={`${getPeriodColor(
                        selectedShiftHoursType.period
                      )} ${isRTL ? "ml-2" : "mr-2"}`}
                      size={18}
                    />
                    <span
                      className={`text-base ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {selectedShiftHoursType.period}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("shiftHoursTypes.form.hoursCount")}
                  </label>
                  <div className="flex items-center">
                    <Timer
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
                      {selectedShiftHoursType.hours}{" "}
                      {t("shiftHoursTypes.hours")}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("shiftHoursTypes.table.status")}
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedShiftHoursType.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {selectedShiftHoursType.isActive ? (
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
                    {selectedShiftHoursType.isActive
                      ? t("shiftHoursTypes.status.active")
                      : t("shiftHoursTypes.status.inactive")}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Information */}
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
                <Clock
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("shiftHoursTypes.details.timeInfo")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("shiftHoursTypes.form.startTime")}
                  </label>
                  <div className="flex items-center">
                    <div
                      className={`p-2 ${
                        isDark ? "bg-green-900/20" : "bg-green-100"
                      } rounded-lg ${isRTL ? "ml-3" : "mr-3"}`}
                    >
                      <Sunrise
                        className={`h-5 w-5 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-lg font-mono ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-bold`}
                    >
                      {formatTime(selectedShiftHoursType.startTime)}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("shiftHoursTypes.form.endTime")}
                  </label>
                  <div className="flex items-center">
                    <div
                      className={`p-2 ${
                        isDark ? "bg-red-900/20" : "bg-red-100"
                      } rounded-lg ${isRTL ? "ml-3" : "mr-3"}`}
                    >
                      <Sunset
                        className={`h-5 w-5 ${
                          isDark ? "text-red-400" : "text-red-600"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-lg font-mono ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-bold`}
                    >
                      {formatTime(selectedShiftHoursType.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="mt-6">
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  } mb-4`}
                >
                  {t("shiftHoursTypes.details.timeline")}
                </label>
                <div
                  className={`relative h-16 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } rounded-lg overflow-hidden`}
                >
                  {/* 24 hour timeline background */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 border-r ${
                          isDark ? "border-gray-600" : "border-gray-200"
                        } last:border-r-0 relative`}
                      >
                        <span
                          className={`absolute top-1 left-1 text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {i.toString().padStart(2, "0")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shift duration bar */}
                  {selectedShiftHoursType.startTime &&
                    selectedShiftHoursType.endTime && (
                      <div
                        className={`absolute top-6 h-6 bg-gradient-to-r ${
                          selectedShiftHoursType.period?.toLowerCase() ===
                          "morning"
                            ? "from-yellow-400 to-orange-400"
                            : selectedShiftHoursType.period?.toLowerCase() ===
                              "afternoon"
                            ? "from-orange-400 to-red-400"
                            : selectedShiftHoursType.period?.toLowerCase() ===
                              "evening"
                            ? "from-purple-400 to-blue-400"
                            : "from-blue-400 to-indigo-400"
                        } rounded`}
                        style={{
                          left: `${
                            (parseInt(
                              selectedShiftHoursType.startTime.split(":")[0]
                            ) /
                              24) *
                            100
                          }%`,
                          width: `${
                            (selectedShiftHoursType.hours / 24) * 100
                          }%`,
                        }}
                      >
                        <div className="flex items-center justify-center h-full text-white text-xs font-bold">
                          {selectedShiftHoursType.hours}h
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
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
                <Timer
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("shiftHoursTypes.details.quickStats")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="flex items-center">
                    <Timer
                      className={`h-5 w-5 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("shiftHoursTypes.form.hoursCount")}
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-bold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {selectedShiftHoursType.hours}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="flex items-center">
                    <PeriodIcon
                      className={`h-5 w-5 ${
                        isDark ? "text-green-400" : "text-green-600"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("shiftHoursTypes.form.period")}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded ${
                      isDark
                        ? "bg-green-900/40 text-green-300"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {selectedShiftHoursType.period}
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
                <Calendar
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("shiftHoursTypes.details.auditInfo")}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("shiftHoursTypes.details.createdAt")}
                  </label>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {formatDate(selectedShiftHoursType.createdAt)}
                  </p>
                </div>

                {selectedShiftHoursType.createdByUser && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("shiftHoursTypes.details.createdBy")}
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
                        {getUserName(selectedShiftHoursType.createdByUser)}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {selectedShiftHoursType.createdByUser.role} •{" "}
                      {selectedShiftHoursType.createdByUser.email}
                    </p>
                  </div>
                )}

                {selectedShiftHoursType.updatedAt && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("shiftHoursTypes.details.updatedAt")}
                    </label>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatDate(selectedShiftHoursType.updatedAt)}
                    </p>
                  </div>
                )}

                {selectedShiftHoursType.updatedByUser && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("shiftHoursTypes.details.updatedBy")}
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
                        {getUserName(selectedShiftHoursType.updatedByUser)}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {selectedShiftHoursType.updatedByUser.role} •{" "}
                      {selectedShiftHoursType.updatedByUser.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecificShiftHoursType;
