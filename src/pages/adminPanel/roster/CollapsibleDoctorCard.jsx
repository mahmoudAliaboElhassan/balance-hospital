import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronRight,
  User,
  Stethoscope,
  Clock,
  Users,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  Timer,
  AlertCircle,
  MapPin,
  Briefcase,
} from "lucide-react";

const CollapsibleDoctorCard = ({ doctorData }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { t, i18n } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);

  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "ar";
  const isDark = mymode === "dark";

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Helper function to get status color
  const getStatusColor = (count, type) => {
    if (type === "present" && count > 0)
      return "text-green-600 dark:text-green-400";
    if (type === "noShow" && count > 0) return "text-red-600 dark:text-red-400";
    if (type === "late" && count > 0)
      return "text-yellow-600 dark:text-yellow-400";
    return isDark ? "text-gray-400" : "text-gray-600";
  };

  // Helper function to get status icon
  const getStatusIcon = (type) => {
    switch (type) {
      case "present":
        return <CheckCircle className="h-4 w-4" />;
      case "noShow":
        return <XCircle className="h-4 w-4" />;
      case "late":
        return <Timer className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-sm border ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {/* Doctor Header - Collapsible */}
      <div
        className={`p-6 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        } cursor-pointer hover:${
          isDark ? "bg-gray-700/50" : "bg-gray-50"
        } transition-colors`}
        onClick={toggleCollapse}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Doctor Avatar */}
            <div
              className={`p-3 ${
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              } rounded-lg`}
            >
              <User
                className={`h-6 w-6 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>

            {/* Doctor Info */}
            <div>
              <h3
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {currentLang === "en"
                  ? doctorData.doctorNameEn
                  : doctorData.doctorNameAr}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Stethoscope
                  className={`h-4 w-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {currentLang === "en"
                    ? doctorData.specialtyEn
                    : doctorData.specialtyAr}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin
                  className={`h-4 w-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {currentLang === "en"
                    ? doctorData.categoryNameEn
                    : doctorData.categoryNameAr}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Stats & Chevron */}
          <div className="flex items-center gap-6">
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-4 text-sm">
              <div className="text-center">
                <div
                  className={`font-bold text-lg ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {doctorData.totalAssignments}
                </div>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.assignments")}
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`font-bold text-lg ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {doctorData.totalHours}
                </div>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.hours")}
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`font-bold text-lg ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {doctorData.totalDepartments}
                </div>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.departments")}
                </div>
              </div>
            </div>

            {/* Chevron Icon */}
            <div className="flex items-center">
              {isCollapsed ? (
                <ChevronRight
                  className={`h-5 w-5 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } transition-transform duration-200`}
                />
              ) : (
                <ChevronDown
                  className={`h-5 w-5 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } transition-transform duration-200`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {!isCollapsed && (
        <div className="p-6 space-y-6">
          {/* Overview Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users
                  className={`h-4 w-4 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.assignments")}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {doctorData.totalAssignments}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock
                  className={`h-4 w-4 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.hours")}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {doctorData.totalHours}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Building
                  className={`h-4 w-4 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.departments")}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {doctorData.totalDepartments}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText
                  className={`h-4 w-4 ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.requests")}
                </span>
              </div>
              <div
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {doctorData.requestsApproved +
                  doctorData.requestsRejected +
                  doctorData.requestsPending}
              </div>
            </div>
          </div>

          {/* Attendance Stats */}
          <div
            className={`p-4 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <h4
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.attendanceStats")}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={getStatusColor(doctorData.presentCount, "present")}
                >
                  {getStatusIcon("present")}
                </div>
                <div>
                  <div
                    className={`font-bold ${getStatusColor(
                      doctorData.presentCount,
                      "present"
                    )}`}
                  >
                    {doctorData.presentCount}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.present")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={getStatusColor(doctorData.noShowCount, "noShow")}
                >
                  {getStatusIcon("noShow")}
                </div>
                <div>
                  <div
                    className={`font-bold ${getStatusColor(
                      doctorData.noShowCount,
                      "noShow"
                    )}`}
                  >
                    {doctorData.noShowCount}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.noShow")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={getStatusColor(doctorData.lateCount, "late")}>
                  {getStatusIcon("late")}
                </div>
                <div>
                  <div
                    className={`font-bold ${getStatusColor(
                      doctorData.lateCount,
                      "late"
                    )}`}
                  >
                    {doctorData.lateCount}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.late")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-blue-600 dark:text-blue-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    {doctorData.requestsPending}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.pending")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.byDepartment")}
            </h4>
            <div className="grid gap-3">
              {Object.entries(doctorData.byDepartment).map(([dept, data]) => (
                <div
                  key={dept}
                  className={`p-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-700/30 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building
                        className={`h-4 w-4 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {dept}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {data.assignments} {t("roster.assignments")}
                      </span>
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {data.hours} {t("roster.hours")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Type Breakdown */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.byShiftType")}
            </h4>
            <div className="grid gap-3">
              {Object.entries(doctorData.byShiftType).map(
                ([shiftType, data]) => (
                  <div
                    key={shiftType}
                    className={`p-3 rounded-lg border ${
                      isDark
                        ? "bg-gray-700/30 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Briefcase
                          className={`h-4 w-4 ${
                            isDark ? "text-purple-400" : "text-purple-600"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {shiftType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span
                          className={`${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {data.assignments} {t("roster.assignments")}
                        </span>
                        <span
                          className={`${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {data.hours} {t("roster.hours")}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Request Summary */}
          <div
            className={`p-4 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <h4
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.requestSummary")}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {doctorData.requestsApproved}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.approved")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {doctorData.requestsRejected}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.rejected")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {doctorData.requestsPending}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.pending")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleDoctorCard;
