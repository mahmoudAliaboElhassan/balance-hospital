import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import {
  Calendar,
  Users,
  Building,
  AlertCircle,
  CheckCircle,
  User,
  Target,
  FileText,
  Eye,
  Briefcase,
  UserCheck,
  Edit,
  UserPlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const CollapsibleDateCard = ({
  dayData,
  formatDate,
  formatTime,
  getFillColor,
  getFillBgColor,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)

  console.log("day data", dayData)

  const isRTL = i18n.language === "ar"
  const currentLang = i18n.language || "ar"
  const isDark = mymode === "dark"

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-sm border ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {/* Collapsible Date Header */}
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
            <div
              className={`p-3 ${
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              } rounded-lg`}
            >
              <Calendar
                className={`h-6 w-6 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {formatDate(dayData.date)}
              </h2>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {dayData.dayOfWeekName}
              </p>
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

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-6 space-y-6">
          {dayData.departments.map((department) => (
            <div key={department.departmentId} className="space-y-4">
              {/* Department Header */}
              <div className="flex items-center gap-3">
                <Building
                  className={`h-5 w-5 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {department.departmentName}
                </h3>
              </div>

              {/* Shifts for this department */}
              <div className="space-y-4 ml-8">
                {department.shifts.map((shift) => (
                  <div key={shift.shiftId} className="space-y-3">
                    {/* Shift Header */}
                    <div className="flex items-center gap-3">
                      <Briefcase
                        className={`h-4 w-4 ${
                          isDark ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <div>
                        <h4
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {shift.shiftName}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {shift.shiftPeriod} ({shift.hours}h) •{" "}
                          {formatTime(shift.startTime)} -{" "}
                          {formatTime(shift.endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Contracting Types for this shift */}
                    <div className="space-y-3 ml-6">
                      {shift.contractingTypes.map((contractingType) => {
                        const detail = contractingType.workingHourDetail
                        return (
                          <div
                            key={`${contractingType.contractingTypeId}-${detail.id}`}
                            className={`p-4 rounded-lg border ${
                              isDark
                                ? "bg-gray-700/50 border-gray-600"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              {/* Contracting Type Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <User
                                    className={`h-4 w-4 ${
                                      isDark
                                        ? "text-orange-400"
                                        : "text-orange-600"
                                    }`}
                                  />
                                  <span
                                    className={`font-medium ${
                                      isDark ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {contractingType.contractingTypeName}
                                  </span>
                                </div>

                                {/* Assignment Stats */}
                                <div className="flex flex-wrap items-center gap-4 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Users
                                      className={`h-4 w-4 ${
                                        isDark
                                          ? "text-blue-400"
                                          : "text-blue-600"
                                      }`}
                                    />
                                    <span
                                      className={`text-sm ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {detail.currentAssignedDoctors}/
                                      {detail.requiredDoctors}{" "}
                                      {t("roster.required")}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Target
                                      className={`h-4 w-4 ${getFillColor(
                                        detail.fillPercentage
                                      )}`}
                                    />
                                    <span
                                      className={`text-sm font-medium ${getFillColor(
                                        detail.fillPercentage
                                      )}`}
                                    >
                                      {Math.round(detail.fillPercentage)}%{" "}
                                      {t("roster.filled")}
                                    </span>
                                  </div>

                                  <span
                                    className={`text-sm ${
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                                  >
                                    {t("roster.workingHours.fields.maxDoctors")}
                                    : {detail.maxDoctors}
                                  </span>

                                  <span
                                    className={`text-sm ${
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                                  >
                                    {t("roster.remainingSlots")}:{" "}
                                    {detail.remainingSlots}
                                  </span>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-wrap items-center gap-2">
                                  {detail.isFullyBooked && (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                      <CheckCircle
                                        size={12}
                                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                                      />
                                      {t("roster.fullyBooked")}
                                    </span>
                                  )}

                                  {detail.isOverBooked && (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                      <AlertCircle
                                        size={12}
                                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                                      />
                                      {t("roster.overBooked")}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Progress & Actions */}
                              <div className="flex flex-col items-end gap-4">
                                {/* Progress Bar */}
                                <div className="w-full lg:w-32">
                                  <div className="flex justify-between items-center mb-1">
                                    <span
                                      className={`text-xs ${
                                        isDark
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {t("roster.progress")}
                                    </span>
                                    <span
                                      className={`text-xs font-semibold ${getFillColor(
                                        detail.fillPercentage
                                      )}`}
                                    >
                                      {Math.round(detail.fillPercentage)}%
                                    </span>
                                  </div>
                                  <div
                                    className={`w-full ${
                                      isDark ? "bg-gray-600" : "bg-gray-200"
                                    } rounded-full h-2`}
                                  >
                                    <div
                                      className={`h-2 rounded-full transition-all duration-300 ${getFillBgColor(
                                        detail.fillPercentage
                                      )}`}
                                      style={{
                                        width: `${Math.min(
                                          detail.fillPercentage,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      navigate(
                                        `/admin-panel/rosters/working-hours/${detail.id}`
                                      )
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Eye size={14} />
                                    {t("common.view")}
                                  </button>
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/admin-panel/rosters/working-hours/${detail.id}/edit`
                                      )
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                                  >
                                    <Edit size={14} />
                                    {t("common.edit")}
                                  </button>

                                  <button
                                    onClick={() => {
                                      localStorage.setItem(
                                        "scientficDoctorRequired",
                                        contractingType.contractingTypeNameEn
                                      )

                                      navigate(
                                        `/admin-panel/rosters/working-hours/${detail.id}/assign-doctors`
                                      )
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                                    aria-label={t(
                                      "roster.actions.assignDoctor"
                                    )}
                                    title={t("roster.actions.assignDoctor")}
                                  >
                                    <UserPlus size={14} />
                                    {t("roster.actions.assignDoctor")}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Assigned Doctors */}
                            {detail.assignedDoctors &&
                              detail.assignedDoctors.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5
                                      className={`text-sm font-medium ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {t("roster.assignedDoctors")} (
                                      {detail.assignedDoctors.length})
                                    </h5>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {detail.assignedDoctors
                                      .slice(0, 4)
                                      .map((doctor, index) => (
                                        <span
                                          key={index}
                                          className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                            isDark
                                              ? "bg-gray-600 text-gray-200"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
                                          <User
                                            size={10}
                                            className={`${
                                              isRTL ? "ml-1" : "mr-1"
                                            }`}
                                          />
                                          {currentLang === "en"
                                            ? doctor.doctorNameEn
                                            : doctor.doctorNameAr}
                                        </span>
                                      ))}
                                    {detail.assignedDoctors.length > 4 && (
                                      <span
                                        className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                          isDark
                                            ? "bg-blue-600 text-blue-200"
                                            : "bg-blue-100 text-blue-800"
                                        }`}
                                      >
                                        +{detail.assignedDoctors.length - 4}{" "}
                                        {t("common.more")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Notes */}
                            {detail.notes && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-start gap-2">
                                  <FileText
                                    className={`h-4 w-4 mt-0.5 ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  />
                                  <div>
                                    <p
                                      className={`text-sm font-medium ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      } mb-1`}
                                    >
                                      {t("common.notes")}
                                    </p>
                                    <p
                                      className={`text-sm ${
                                        isDark
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {detail.notes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CollapsibleDateCard
