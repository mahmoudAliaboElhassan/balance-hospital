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
  // Filter data by rosterId

  useEffect(() => {
    dispatch(
      getDepartmentRosterCalender({
        departmentId: id,
        ids: [rosterId],
      })
    );
  }, [departmentRosterData, rosterLookup, rosterId]);

  // Utility functions for CollapsibleDateCard

  console.log("departmentRosterData", departmentRosterData);

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

  // Load data if not available
  //   useEffect(() => {
  //     if (!departmentRosterData || departmentRosterData.length === 0) {
  //       dispatch(
  //         getDepartmentRosterCalender({
  //           departmentId: id,
  //           ids: rosterId,
  //         })
  //       );
  //     }
  //   }, [dispatch, departmentRosterData]);

  if (loadinGetDepartmentCalender) {
    return <LoadingGetData text={t("gettingData.departmentCalendar")} />;
  }

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
