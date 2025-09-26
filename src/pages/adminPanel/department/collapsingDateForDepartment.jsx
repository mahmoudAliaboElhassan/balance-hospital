import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const CollapsibleDateCardForDepartment = ({
  dayData,
  formatDate,
  formatTime,
  getFillColor,
  getFillBgColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, i18n } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);

  const isDark = mymode === "dark";
  const isRTL = i18n.language === "ar";

  // Calculate completion percentage based on assigned vs required doctors
  const completionPercentage =
    dayData.totalRequired > 0
      ? Math.round((dayData.totalAssigned / dayData.totalRequired) * 100)
      : 0;

  // Extract shifts data (equivalent to working hours)
  const shifts = dayData.shifts || [];
  const totalRequired = dayData.totalRequired || 0;
  const totalAssigned = dayData.totalAssigned || 0;
  const totalShortfall = dayData.totalShortfall || 0;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`
        rounded-lg shadow-md border transition-all duration-200 
        ${
          isDark
            ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
        ${isRTL ? "text-right" : "text-left"}
      `}
    >
      {/* Header - Always visible */}
      <div
        className={`
          p-4 cursor-pointer flex items-center justify-between
          ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}
          rounded-lg transition-colors duration-150
        `}
        onClick={toggleExpansion}
      >
        {/* Date and basic info */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {/* Date */}
            <div>
              <h3
                className={`
                  text-lg font-semibold
                  ${isDark ? "text-white" : "text-gray-900"}
                `}
              >
                {formatDate(dayData.date)}
              </h3>
              <p
                className={`
                  text-sm
                  ${isDark ? "text-gray-400" : "text-gray-600"}
                `}
              >
                {i18n.language === "ar"
                  ? dayData.dayOfWeekNameAr
                  : dayData.dayOfWeekNameEn}
              </p>
            </div>

            {/* Staffing Summary */}
            <div className="flex items-center gap-4">
              {/* Completion Percentage */}
              <div className="flex items-center gap-2">
                <div
                  className={`
                    w-3 h-3 rounded-full
                    ${getFillBgColor(completionPercentage)}
                  `}
                />
                <span
                  className={`
                    text-sm font-medium
                    ${getFillColor(completionPercentage)}
                  `}
                >
                  {completionPercentage}%
                </span>
              </div>

              {/* Doctor Count */}
              <div
                className={`
                  text-sm
                  ${isDark ? "text-gray-300" : "text-gray-700"}
                `}
              >
                {totalAssigned}/{totalRequired} {t("roster.doctors")}
              </div>

              {/* Status Badge */}
              <div
                className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${
                    dayData.isComplete
                      ? isDark
                        ? "bg-green-900 text-green-200"
                        : "bg-green-100 text-green-800"
                      : isDark
                      ? "bg-yellow-900 text-yellow-200"
                      : "bg-yellow-100 text-yellow-800"
                  }
                `}
              >
                {dayData.isComplete
                  ? t("roster.completed")
                  : t("roster.incomplete")}
              </div>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronUpIcon
              className={`
                w-5 h-5 transition-transform duration-200
                ${isDark ? "text-gray-400" : "text-gray-600"}
              `}
            />
          ) : (
            <ChevronDownIcon
              className={`
                w-5 h-5 transition-transform duration-200
                ${isDark ? "text-gray-400" : "text-gray-600"}
              `}
            />
          )}
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div
          className={`
            p-4 pt-0 border-t
            ${isDark ? "border-gray-700" : "border-gray-200"}
          `}
        >
          {/* Shifts Details */}
          {shifts && shifts.length > 0 ? (
            <div className="space-y-3">
              <h4
                className={`
                  text-sm font-medium
                  ${isDark ? "text-gray-300" : "text-gray-700"}
                `}
              >
                {t("roster.shifts")} ({shifts.length})
              </h4>

              {shifts.map((shift, index) => (
                <div
                  key={`${shift.workingHoursId}-${index}`}
                  className={`
                    p-3 rounded-md border
                    ${
                      isDark
                        ? "bg-gray-750 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    {/* Shift Details */}
                    <div className="flex-1">
                      <h5
                        className={`
                          font-medium text-sm
                          ${isDark ? "text-white" : "text-gray-900"}
                        `}
                      >
                        {i18n.language === "ar"
                          ? shift.shiftNameAr
                          : shift.shiftNameEn}
                      </h5>
                      <p
                        className={`
                          text-xs mt-1
                          ${isDark ? "text-gray-400" : "text-gray-600"}
                        `}
                      >
                        {i18n.language === "ar"
                          ? shift.contractingTypeNameAr
                          : shift.contractingTypeNameEn}
                      </p>
                      <p
                        className={`
                          text-xs mt-1
                          ${isDark ? "text-gray-400" : "text-gray-600"}
                        `}
                      >
                        {formatTime(shift.startTime)} -{" "}
                        {formatTime(shift.endTime)}
                      </p>
                    </div>

                    {/* Shift Stats */}
                    <div className="text-right ml-3">
                      <p
                        className={`
                          text-sm font-medium
                          ${isDark ? "text-gray-300" : "text-gray-700"}
                        `}
                      >
                        {shift.assignedDoctors}/{shift.requiredDoctors}
                      </p>
                      <p
                        className={`
                          text-xs
                          ${isDark ? "text-gray-400" : "text-gray-500"}
                        `}
                      >
                        {t("department.assigned")}
                      </p>
                      {shift.shortfallDoctors > 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          -{shift.shortfallDoctors} {t("roster.shortfall")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Assigned Doctors */}
                  {shift.doctors && shift.doctors.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-300 dark:border-gray-600">
                      <p
                        className={`
                          text-xs font-medium mb-2
                          ${isDark ? "text-gray-400" : "text-gray-600"}
                        `}
                      >
                        {t("roster.assignedDoctors")}:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {shift.doctors.map((doctor, docIndex) => (
                          <span
                            key={`${doctor.doctorId}-${docIndex}`}
                            className={`
                              inline-flex items-center px-2 py-1 rounded-full text-xs
                              ${
                                doctor.assignmentStatus === "Approved"
                                  ? isDark
                                    ? "bg-green-900 text-green-200"
                                    : "bg-green-100 text-green-800"
                                  : isDark
                                  ? "bg-yellow-900 text-yellow-200"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            `}
                          >
                            {i18n.language === "ar"
                              ? doctor.doctorNameAr
                              : doctor.doctorNameEn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div
                      className={`
                        w-full h-2 rounded-full
                        ${isDark ? "bg-gray-600" : "bg-gray-200"}
                      `}
                    >
                      <div
                        className={`
                          h-2 rounded-full transition-all duration-300
                          ${getFillBgColor(
                            shift.requiredDoctors > 0
                              ? Math.round(
                                  (shift.assignedDoctors /
                                    shift.requiredDoctors) *
                                    100
                                )
                              : 0
                          )}
                        `}
                        style={{
                          width: `${
                            shift.requiredDoctors > 0
                              ? Math.round(
                                  (shift.assignedDoctors /
                                    shift.requiredDoctors) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`
                text-center py-6
                ${isDark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              <p>{t("roster.noShifts")}</p>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p
                  className={`
                    text-lg font-semibold
                    ${isDark ? "text-green-400" : "text-green-600"}
                  `}
                >
                  {totalAssigned}
                </p>
                <p
                  className={`
                    text-xs
                    ${isDark ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  {t("roster.assigned")}
                </p>
              </div>
              <div>
                <p
                  className={`
                    text-lg font-semibold
                    ${isDark ? "text-blue-400" : "text-blue-600"}
                  `}
                >
                  {totalRequired}
                </p>
                <p
                  className={`
                    text-xs
                    ${isDark ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  {t("roster.required")}
                </p>
              </div>
              <div>
                <p
                  className={`
                    text-lg font-semibold
                    ${
                      totalShortfall > 0
                        ? isDark
                          ? "text-red-400"
                          : "text-red-600"
                        : isDark
                        ? "text-green-400"
                        : "text-green-600"
                    }
                  `}
                >
                  {totalShortfall}
                </p>
                <p
                  className={`
                    text-xs
                    ${isDark ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  {t("roster.shortfall")}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Day Information */}
          {dayData.notes && (
            <div className="mt-4">
              <h4
                className={`
                  text-sm font-medium mb-2
                  ${isDark ? "text-gray-300" : "text-gray-700"}
                `}
              >
                {t("roster.notes")}
              </h4>
              <p
                className={`
                  text-sm p-3 rounded-md
                  ${
                    isDark
                      ? "bg-gray-750 text-gray-300 border border-gray-600"
                      : "bg-blue-50 text-gray-700 border border-blue-200"
                  }
                `}
              >
                {dayData.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleDateCardForDepartment;
