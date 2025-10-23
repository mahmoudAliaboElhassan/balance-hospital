import React, { useState } from "react"
import {
  Users,
  ChevronDown,
  ChevronRight,
  Calendar,
  RefreshCw,
  Clock,
  Building,
} from "lucide-react"

const CollapsibleSwapCard = ({
  swap,
  isDark,
  isRTL,
  currentLang,
  t,
  formatDate,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return isDark
          ? "bg-green-900/30 text-green-400 border-green-700"
          : "bg-green-100 text-green-700 border-green-300"
      case "pending":
        return isDark
          ? "bg-yellow-900/30 text-yellow-400 border-yellow-700"
          : "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "rejected":
        return isDark
          ? "bg-red-900/30 text-red-400 border-red-700"
          : "bg-red-100 text-red-700 border-red-300"
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return t("doctorReport.swapRecords.approved")
      case "pending":
        return t("doctorReport.swapRecords.pending")
      case "rejected":
        return t("doctorReport.swapRecords.rejected")
      default:
        return status
    }
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {/* Swap Header - Collapsible */}
      <div
        className={`p-4 cursor-pointer hover:${
          isDark ? "bg-gray-700/50" : "bg-gray-100"
        } transition-colors ${isDark ? "bg-gray-750" : "bg-gray-50"}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <RefreshCw
              className={`w-5 h-5 ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <div className="flex-1">
              <div
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {currentLang === "en" ? swap.swapWithEn : swap.swapWith}
              </div>
              <div
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {formatDate(swap.fromDate)} - {formatDate(swap.toDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                swap.status
              )}`}
            >
              {getStatusText(swap.status)}
            </span>

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
        <div className="p-4 space-y-3">
          {/* Swap Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar
                  className={`w-4 h-4 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("doctorReport.swapRecords.dateRange")}
                </span>
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {formatDate(swap.fromDate)} - {formatDate(swap.toDate)}
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock
                  className={`w-4 h-4 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("doctorReport.swapRecords.shiftType")}
                </span>
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {currentLang === "en"
                  ? swap.shiftTypeNameEn
                  : swap.shiftTypeNameAr}
              </div>
            </div>
          </div>

          {/* Department */}
          <div
            className={`p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Building
                className={`w-4 h-4 ${
                  isDark ? "text-orange-400" : "text-orange-600"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.swapRecords.department")}
              </span>
            </div>
            <div
              className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {currentLang === "en"
                ? swap.departmentNameEn
                : swap.departmentNameAr}
            </div>
          </div>

          {/* Reason */}
          {swap.reason && (
            <div
              className={`p-3 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`text-xs font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.swapRecords.reason")}
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {swap.reason}
              </div>
            </div>
          )}

          {/* Created Date */}
          <div
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            {t("doctorReport.swapRecords.createdAt")}:{" "}
            {new Date(swap.createdAt).toLocaleDateString(
              currentLang === "en" ? "en-US" : "ar-EG",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const SwapRecordsSection = ({
  report,
  isDark,
  isRTL,
  currentLang,
  t,
  formatDate,
}) => {
  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg p-6`}
    >
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users
            className={`w-5 h-5 ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}
          />
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("doctorReport.swapRecords.title")}
          </h3>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            className={`p-3 rounded-lg text-center ${
              isDark ? "bg-gray-750" : "bg-gray-50"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {report.stats.totalSwapRequests}
            </div>
            <div
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("doctorReport.swapRecords.total")}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg text-center ${
              isDark ? "bg-green-900/20" : "bg-green-50"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            >
              {report.stats.approvedSwaps}
            </div>
            <div
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("doctorReport.swapRecords.approved")}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg text-center ${
              isDark ? "bg-yellow-900/20" : "bg-yellow-50"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                isDark ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              {report.stats.pendingSwaps}
            </div>
            <div
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("doctorReport.swapRecords.pending")}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg text-center ${
              isDark ? "bg-red-900/20" : "bg-red-50"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              {report.stats.rejectedSwaps}
            </div>
            <div
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("doctorReport.swapRecords.rejected")}
            </div>
          </div>
        </div>
      </div>

      {/* Swap Records List */}
      {report.swapRecords && report.swapRecords.length > 0 ? (
        <div className="space-y-3">
          {report.swapRecords.map((swap) => (
            <CollapsibleSwapCard
              key={swap.swapId}
              swap={swap}
              isDark={isDark}
              isRTL={isRTL}
              currentLang={currentLang}
              t={t}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users
            className={`w-12 h-12 mx-auto mb-3 ${
              isDark ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {t("doctorReport.swapRecords.noRecords")}
          </p>
        </div>
      )}
    </div>
  )
}

export default SwapRecordsSection
