import React, { useState } from "react"
import { FileText, ChevronDown, ChevronRight } from "lucide-react"
import i18next from "i18next"

export const CollapsibleRosterCard = ({
  roster,
  isDark,
  isRTL,
  currentLang,
  t,
  formatDate,
  getAttendanceStatusColor,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={`border rounded-xl overflow-hidden ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {/* Roster Header - Collapsible */}
      <div
        className={`p-6 cursor-pointer hover:${
          isDark ? "bg-gray-700/50" : "bg-gray-100"
        } transition-colors ${isDark ? "bg-gray-750" : "bg-gray-50"}`}
        onClick={toggleCollapse}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {roster.rosterTitle}
            </h3>
            <div className="flex flex-wrap gap-3">
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatDate(roster.rosterStartDate)} -{" "}
                {formatDate(roster.rosterEndDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Summary Stats */}
            <div className="flex flex-wrap gap-3">
              <div
                className={`px-4 py-2 rounded-lg ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <div
                  className={`text-xs ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  } mb-1`}
                >
                  {t("doctorReport.rosterAssignments.totalShifts")}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {roster.totalShiftsInRoster}
                </div>
              </div>

              <div
                className={`px-4 py-2 rounded-lg ${
                  isDark ? "bg-green-900/30" : "bg-green-100"
                }`}
              >
                <div
                  className={`text-xs ${
                    isDark ? "text-green-300" : "text-green-600"
                  } mb-1`}
                >
                  {t("doctorReport.rosterAssignments.completed")}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {roster.completedShiftsInRoster}
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

      {/* Shifts Table - Collapsible Content */}
      {!isCollapsed && roster.shifts && roster.shifts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <th
                  className={`${isRTL ? "text-right" : "text-left"}
                  } p-4 font-semibold text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("doctorReport.rosterAssignments.date")}
                </th>
                <th
                  className={`text-${
                    isRTL ? "right" : "left"
                  } p-4 font-semibold text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("doctorReport.rosterAssignments.department")}
                </th>
                <th
                  className={`text-${
                    isRTL ? "right" : "left"
                  } p-4 font-semibold text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("doctorReport.rosterAssignments.shiftType")}
                </th>
                <th
                  className={`text-${
                    isRTL ? "right" : "left"
                  } p-4 font-semibold text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("doctorReport.rosterAssignments.time")}
                </th>
                <th
                  className={`text-${
                    isRTL ? "right" : "left"
                  } p-4 font-semibold text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("doctorReport.rosterAssignments.attendanceStatus")}
                </th>
              </tr>
            </thead>
            <tbody>
              {roster.shifts.map((shift) => (
                <tr
                  key={shift.scheduleId}
                  className={`border-b ${
                    isDark
                      ? "border-gray-700 hover:bg-gray-750"
                      : "border-gray-200 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td
                    className={`p-4 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <div className="font-medium">
                      {formatDate(shift.shiftDate)}
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {currentLang === "en" ? shift.dayNameEn : shift.dayNameAr}
                    </div>
                  </td>
                  <td
                    className={`p-4 text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {currentLang === "en"
                      ? shift.departmentNameEn
                      : shift.departmentNameAr}
                  </td>
                  <td
                    className={`p-4 text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <div>
                      {currentLang === "en"
                        ? shift.shiftTypeNameEn
                        : shift.shiftTypeNameAr}
                    </div>
                    {shift.shiftHours > 0 && (
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {shift.shiftHours} {t("doctorReport.stats.hours")}
                      </div>
                    )}
                  </td>
                  <td
                    className={`p-4 text-sm ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {shift.startTime} - {shift.endTime}
                  </td>
                  <td className="p-4">
                    {shift.attendanceStatus === "لا توجد سجلات" ? (
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {shift.attendanceStatus}
                      </span>
                    ) : (
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(
                            shift.attendanceStatus
                          )}`}
                        >
                          {shift.attendanceStatus}
                        </span>
                        {shift.lateMinutes > 0 && (
                          <div
                            className={`text-xs mt-1 ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {shift.lateMinutes}{" "}
                            {t("doctorReport.attendanceRecords.minutesLate")}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
