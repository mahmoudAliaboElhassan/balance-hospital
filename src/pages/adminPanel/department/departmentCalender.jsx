import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getDepartmentRosterCalender } from "../../../state/act/actDepartment"; // Adjust path
import { formatDate } from "../../../utils/formtDate";
import CollapsibleDateCardForDepartment from "./collapsingDateForDepartment";
import LoadingGetData from "../../../components/LoadingGetData";

function DepartmentCalender() {
  const { rosterId, depId: id } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const {
    departmentRosterData,
    rosterLookup,
    loadinGetDepartmentCalender,
    error,
  } = useSelector((state) => state.department); // Adjust state path as needed

  const { mymode } = useSelector((state) => state.mode);

  const isDark = mymode === "dark";
  const isRTL = i18n.language === "ar";
  const departmentName = isRTL
    ? localStorage.getItem("departmentArabicName")
    : localStorage.getItem("departmentEnglishName");

  useEffect(() => {
    dispatch(
      getDepartmentRosterCalender({
        departmentId: id,
        ids: [rosterId],
      })
    );
  }, [rosterId]);

  if (loadinGetDepartmentCalender) {
    return <LoadingGetData text={t("gettingData.departmentCalendar")} />;
  }
  console.log("departmentRosterData", departmentRosterData?.[0]?.stats);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  const getFillColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getFillBgColor = (percentage) => {
    if (percentage >= 90) return "bg-green-600 dark:bg-green-500";
    if (percentage >= 70) return "bg-yellow-600 dark:bg-yellow-500";
    return "bg-red-600 dark:bg-red-500";
  };

  // Stats component
  const StatsSection = ({ stats }) => {
    const completionPercentage = stats?.completionPercentage || 0;

    const statsCards = [
      {
        key: "totalDays",
        value: stats?.totalDays || 0,
        label: t("stats.totalDays", "Total Days"),
        icon: "📅",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-800 dark:text-blue-200",
        borderColor: "border-blue-200 dark:border-blue-800",
      },
      {
        key: "completeDays",
        value: stats?.completeDays || 0,
        label: t("stats.completeDays", "Complete Days"),
        icon: "✅",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-800 dark:text-green-200",
        borderColor: "border-green-200 dark:border-green-800",
      },
      {
        key: "partialDays",
        value: stats?.partialDays || 0,
        label: t("stats.partialDays", "Partial Days"),
        icon: "⏳",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        textColor: "text-yellow-800 dark:text-yellow-200",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      },
      {
        key: "emptyDays",
        value: stats?.emptyDays || 0,
        label: t("stats.emptyDays", "Empty Days"),
        icon: "❌",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-800 dark:text-red-200",
        borderColor: "border-red-200 dark:border-red-800",
      },
    ];

    return (
      <div className="mb-6">
        {/* Overall Completion */}
        <div
          className={`rounded-lg p-6 mb-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("stats.overallCompletion", "Overall Completion")}
            </h3>
            <span
              className={`text-2xl font-bold ${getFillColor(
                completionPercentage
              )}`}
            >
              {completionPercentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className={`w-full h-3 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${getFillBgColor(
                completionPercentage
              )}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card) => (
            <div
              key={card.key}
              className={`rounded-lg p-4 border ${card.bgColor} ${card.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${card.textColor} opacity-80`}
                  >
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
                <div className="text-2xl opacity-70">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} p-6`}
      >
        <div className="flex items-center justify-center h-64">
          <div
            className={`text-lg text-red-600 ${isDark ? "text-red-400" : ""}`}
          >
            {t("common.error")}: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!departmentRosterData || departmentRosterData.length === 0) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} p-6`}
      >
        <div className="container mx-auto">
          <h1
            className={`text-2xl font-bold mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("roster.departmentCalendar")}
          </h1>
          <div className="flex items-center justify-center h-64">
            <div
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("roster.noDataFound")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract days from the filtered roster data
  const daysList = departmentRosterData.reduce((acc, roster) => {
    if (roster.days && Array.isArray(roster.days)) {
      return [...acc, ...roster.days];
    }
    return acc;
  }, []);

  const stats = departmentRosterData?.[0]?.stats;

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} p-6`}
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("roster.departmentCalendar")} {departmentName}
          </h1>

          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {departmentRosterData[0].rosterTitle}
          </p>
        </div>

        {/* Stats Section */}
        {stats && <StatsSection stats={stats} />}

        {/* Calendar Days */}
        <div className="space-y-4">
          {daysList.map((dayData, index) => (
            <CollapsibleDateCardForDepartment
              key={`${dayData.date}-${index}`}
              dayData={dayData}
              formatDate={formatDate}
              formatTime={formatTime}
              getFillColor={getFillColor}
              getFillBgColor={getFillBgColor}
            />
          ))}
        </div>

        {daysList.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("roster.noDaysFound")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepartmentCalender;
