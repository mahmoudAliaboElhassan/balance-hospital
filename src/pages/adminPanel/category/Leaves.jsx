import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  Clock,
  FileText,
  CalendarDays,
  Filter,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import {
  getLeaves,
  approveLeave,
  rejectLeave,
  clearError,
  clearActionError,
  setFilter,
  clearLastAction,
  clearLeaves,
} from "../../../state/slices/leaves"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import i18next from "i18next"
import { formatDate } from "../../../utils/formtDate"
import { reviewReview } from "../../../state/act/actLeaves"

const Leaves = () => {
  const dispatch = useDispatch()
  const { catId: categoryId } = useParams()
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)

  const {
    leaves,
    loading,
    actionLoading,
    error,
    actionError,
    currentFilter,
    lastAction,
  } = useSelector((state) => state.leaves)

  const isDark = mymode === "dark"
  const isRTL = i18n.language === "ar"
  const currentLang = i18n.language || "ar"

  const [showLeaves, setShowLeaves] = useState(true)
  const [localFilters, setLocalFilters] = useState({ status: "" })

  // Get first and last day of current month
  const getCurrentMonthDates = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 2)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return {
      fromDate: firstDay.toISOString().split("T")[0],
      toDate: lastDay.toISOString().split("T")[0],
    }
  }

  const [dateFilters, setDateFilters] = useState(getCurrentMonthDates())

  // Fetch leaves on component mount
  useEffect(() => {
    if (categoryId && !isNaN(categoryId)) {
      dispatch(
        getLeaves({
          categoryId,
          fromDate: dateFilters.fromDate,
          toDate: dateFilters.toDate,
        })
      )
    }
  }, [dispatch, categoryId])
  // Handle last action success
  useEffect(() => {
    if (lastAction) {
      if (categoryId && !isNaN(categoryId)) {
        dispatch(
          getLeaves({
            categoryId,
            fromDate: dateFilters.fromDate,
            toDate: dateFilters.toDate,
          })
        )
      }
      const timer = setTimeout(() => {
        dispatch(clearLastAction())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [lastAction, categoryId, dispatch])
  // Handle status filter change
  const handleStatusChange = (status) => {
    setLocalFilters((prev) => ({ ...prev, status }))
    dispatch(setFilter(status))
  }

  // Handle refresh
  const handleDateChange = (field, value) => {
    setDateFilters((prev) => ({ ...prev, [field]: value }))
  }

  // Handle apply date filters
  const handleApplyDateFilters = () => {
    if (categoryId && !isNaN(categoryId)) {
      dispatch(
        getLeaves({
          categoryId,
          fromDate: dateFilters.fromDate,
          toDate: dateFilters.toDate,
        })
      )
        .unwrap()
        .catch((err) => {
          const errorMsg = err.message
          Swal.fire({
            icon: "error",
            title:
              i18next.language === "ar" ? "فشل العملية" : "Operation Failed",
            text: errorMsg,
            confirmButtonText: i18next.language === "ar" ? "حسناً" : "OK",
          })
        })
      dispatch(clearLeaves())
    }
  }
  const handleRefresh = () => {
    if (categoryId && !isNaN(categoryId)) {
      dispatch(
        getLeaves({
          categoryId,
          fromDate: dateFilters.fromDate,
          toDate: dateFilters.toDate,
        })
      )
    }
  }
  // Handle approve/reject actions

  const handleApproveRequest = async (requestId, status) => {
    try {
      if (status !== 4) {
        await dispatch(reviewReview({ id: requestId })).unwrap()
      }
      const res = await dispatch(approveLeave({ id: requestId })).unwrap()
      // لو فشل الطلب
      console.log("res", res)
      console.log("res leav", res.leave.data)

      if (res?.leave?.data === false) {
        const message =
          i18next.language === "ar"
            ? res.response.data.messageAr || "حدث خطأ أثناء الموافقة على الطلب"
            : res.response.data.messageEn ||
              "An error occurred while approving the request"
        Swal.fire({
          icon: "error",
          title: i18next.language === "ar" ? "فشل العملية" : "Operation Failed",
          text: message,
          confirmButtonText: i18next.language === "ar" ? "حسناً" : "OK",
        })
        return
      }
      // في حالة النجاح
      const successMsg =
        i18next.language === "ar"
          ? res.leave.messageAr || "تمت الموافقة بنجاح"
          : res.leave.messageEn || "Approved successfully"
      toast.success(successMsg, {
        duration: 3000,
        position: "top-right",
      })
      handleStatusChange("")
    } catch (err) {
      console.log("err", err)
      const errorMsg =
        i18next.language === "ar"
          ? err.response?.data.messageAr || "حدث خطأ أثناء قبول الطلب"
          : err.response?.data.messageEn ||
            "An error occurred while approving the request"
      Swal.fire({
        icon: "error",
        title: i18next.language === "ar" ? "خطأ في النظام" : "System Error",
        text: errorMsg,
        confirmButtonText: i18next.language === "ar" ? "حسناً" : "OK",
      })
    }
  }

  const handleRejectRequest = async (requestId, status) => {
    try {
      if (status !== 4) {
        await dispatch(reviewReview({ id: requestId })).unwrap()
      }
      const res = await dispatch(rejectLeave({ id: requestId })).unwrap()
      console.log("res", res)
      console.log("res leav", res.leave.data)
      if (res?.leave?.data === false) {
        const message =
          i18next.language === "ar"
            ? res.data.messageAr || "حدث خطأ أثناء رفض الطلب"
            : res.data.messageEn ||
              "An error occurred while rejecting the request"

        Swal.fire({
          icon: "error",
          title: i18next.language === "ar" ? "فشل العملية" : "Operation Failed",
          text: message,
          confirmButtonText: i18next.language === "ar" ? "حسناً" : "OK",
        })
        return
      }

      const successMsg =
        i18next.language === "ar"
          ? res.leave.messageAr || "تم رفض الطلب بنجاح"
          : res.leave.messageEn || "Request rejected successfully"

      toast.success(successMsg, {
        duration: 3000,
        position: "top-right",
      })
      handleStatusChange("")
    } catch (err) {
      console.log("err", err)

      const errorMsg =
        i18next.language === "ar"
          ? err.response.data.messageAr || "حدث خطأ أثناء رفض الطلب"
          : err.response.data.messageEn ||
            "An error occurred while rejecting the request"

      Swal.fire({
        icon: "error",
        title: i18next.language === "ar" ? "خطأ في النظام" : "System Error",
        text: errorMsg,
        confirmButtonText: i18next.language === "ar" ? "حسناً" : "OK",
      })
    }
  }
  // Get status configuration
  const getStatusConfig = (statusCode) => {
    const configs = {
      0: {
        className: isDark
          ? "bg-yellow-900/30 text-yellow-400 border-yellow-700"
          : "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: t("leaves.status.pending"),
        icon: Clock,
      },
      1: {
        className: isDark
          ? "bg-green-900/30 text-green-400 border-green-700"
          : "bg-green-100 text-green-800 border-green-200",
        text: t("leaves.status.approved"),
        icon: Check,
      },
      2: {
        className: isDark
          ? "bg-red-900/30 text-red-400 border-red-700"
          : "bg-red-100 text-red-800 border-red-200",
        text: t("leaves.status.rejected"),
        icon: X,
      },
    }

    return (
      configs[statusCode] || {
        className: isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200",
        text: t("leaves.status.unknown"),
        icon: AlertCircle,
      }
    )
  }

  // Render status badge
  const renderStatusBadge = (statusCode, statusNameAr) => {
    const config = getStatusConfig(statusCode)
    const IconComponent = config.icon

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${config.className}`}
      >
        <IconComponent className="w-3 h-3" />
        {statusNameAr || config.text}
      </span>
    )
  }

  // Format date

  // Format datetime

  // Calculate leave duration
  const calculateDuration = (from, to) => {
    if (!from || !to) return 0
    const fromDate = new Date(from)
    const toDate = new Date(to)
    const diffTime = Math.abs(toDate - fromDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  // Status filter options
  const statusFilterOptions = [
    { value: "", label: t("leaves.filters.all") },
    { value: "0", label: t("leaves.filters.pending") },
    { value: "1", label: t("leaves.filters.approved") },
    { value: "2", label: t("leaves.filters.rejected") },
    { value: "3", label: t("leaves.filters.cancelled") },
    { value: "4", label: t("leaves.filters.underReview") },
  ]

  // Filter leaves based on status
  const filteredLeaves = localFilters.status
    ? leaves.filter(
        (leave) => leave.statusCode === parseInt(localFilters.status)
      )
    : leaves

  // Render action buttons
  const renderActionButtons = (request) => {
    const isProcessing = actionLoading

    console.log("request")
    return (
      <div className="flex gap-2">
        {(request.statusCode === 0 || request.statusCode === 4) && (
          <button
            onClick={() =>
              handleApproveRequest(request.requestId, request.statusCode)
            }
            disabled={isProcessing}
            className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {t("leaves.actions.approve")}
          </button>
        )}

        {(request.statusCode === 0 || request.statusCode === 4) && (
          <button
            onClick={() =>
              handleRejectRequest(request.requestId, request.statusCode)
            }
            disabled={isProcessing}
            className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            {t("leaves.actions.reject")}
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-xl p-6 mb-8`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } flex items-center`}
        >
          <div
            className={`w-8 h-8 ${
              isDark ? "bg-indigo-900/30" : "bg-indigo-100"
            } rounded-lg flex items-center justify-center ${
              isRTL ? "mr-3" : "ml-3"
            }`}
          >
            <CalendarDays
              className={`w-4 h-4 ${
                isDark ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </div>
          {t("leaves.title")}
        </h2>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isDark
                ? "bg-blue-900/30 text-blue-400"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {filteredLeaves?.length || 0} {t("leaves.count")}
          </span>

          <button
            onClick={() => setShowLeaves(!showLeaves)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            {showLeaves ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            } disabled:opacity-50`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {showLeaves && (
        <>
          {/* Action Error Alert */}
          {/* {actionError && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                isDark
                  ? "bg-red-900/20 border border-red-700"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                <AlertCircle
                  className={`w-5 h-5 ${
                    isDark ? "text-red-400" : "text-red-600"
                  } ml-2 flex-shrink-0 mt-0.5`}
                />
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      isDark ? "text-red-300" : "text-red-800"
                    }`}
                  >
                    {t("leaves.errors.actionError")}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-red-400" : "text-red-700"
                    }`}
                  >
                    {actionError.message}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(clearActionError())}
                  className={`${
                    isDark
                      ? "text-red-400 hover:text-red-300"
                      : "text-red-600 hover:text-red-800"
                  } ml-2`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )} */}

          {/* Success Alert */}
          {lastAction && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                isDark
                  ? "bg-green-900/20 border border-green-700"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div className="flex items-start">
                <Check
                  className={`w-5 h-5 ${
                    isDark ? "text-green-400" : "text-green-600"
                  } ml-2 flex-shrink-0 mt-0.5`}
                />
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      isDark ? "text-green-300" : "text-green-800"
                    }`}
                  >
                    {t("leaves.success.processed")}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-green-400" : "text-green-700"
                    }`}
                  >
                    {lastAction.type === "approve"
                      ? t("leaves.success.approved")
                      : t("leaves.success.rejected")}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(clearLastAction())}
                  className={`${
                    isDark
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-800"
                  } ml-2`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div
            className={`p-4 rounded-lg mb-4 ${
              isDark ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex items-center gap-2 mb-2">
                <Calendar
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("department.filters.dateRange") || "تصفية حسب التاريخ"}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 items-end flex-1">
                <div className="flex-1 min-w-[200px]">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("leaves.from") || "من"}
                  </label>
                  <input
                    type="date"
                    value={dateFilters.fromDate}
                    onChange={(e) =>
                      handleDateChange("fromDate", e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("leaves.to") || "إلى"}
                  </label>
                  <input
                    type="date"
                    value={dateFilters.toDate}
                    onChange={(e) => handleDateChange("toDate", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <button
                  onClick={handleApplyDateFilters}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    t("common.apply") || "تطبيق"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div
            className={`p-4 rounded-lg mb-6 ${
              isDark ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("leaves.filters.filterByStatus")}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {statusFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      localFilters.status === option.value
                        ? "bg-blue-600 text-white shadow-md"
                        : isDark
                        ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {t("leaves.loading")}
              </span>
            </div>
          ) : !filteredLeaves || filteredLeaves.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-300"
                }`}
              />
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {t("leaves.noRequests")}
              </h3>
              <p
                className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-4`}
              >
                {localFilters.status
                  ? t("leaves.noRequestsWithFilter")
                  : t("leaves.noRequestsDefault")}
              </p>
              {localFilters.status && (
                <button
                  onClick={() => handleStatusChange("")}
                  className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  {t("leaves.showAllRequests")}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div
                className={`mb-6 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("leaves.resultsCount", {
                  count: filteredLeaves.length,
                  total: leaves.length,
                })}
              </div>

              {/* Requests Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeaves &&
                  filteredLeaves?.map((request) => (
                    <div
                      key={request.requestId}
                      className={`rounded-lg shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
                        isDark
                          ? "bg-gray-700 border-gray-600 hover:border-gray-500"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-semibold mb-1 truncate ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {currentLang == "en"
                              ? request.doctorNameEn
                              : request.doctorNameAr}{" "}
                          </h3>
                        </div>
                        <div className="mr-3 flex-shrink-0">
                          {renderStatusBadge(
                            request.statusCode,
                            request.statusNameAr
                          )}
                        </div>
                      </div>

                      {/* Leave Type */}
                      <div
                        className={`mb-4 p-3 rounded-lg border ${
                          isDark
                            ? "bg-blue-900/20 border-blue-700"
                            : "bg-blue-50 border-blue-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText
                            className={`w-4 h-4 ${
                              isDark ? "text-blue-400" : "text-blue-600"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-blue-300" : "text-blue-900"
                            }`}
                          >
                            {request.leaveTypeNameAr}
                          </span>
                          <span
                            className={`text-xs ${
                              isDark ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
                            ({request.leaveTypeNameEn})
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        {/* Date Range */}
                        <div className="flex items-start text-sm">
                          <Calendar
                            className={`w-4 h-4 ml-2 mt-0.5 flex-shrink-0 ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          />
                          <div className="flex-1">
                            <div
                              className={
                                isDark ? "text-gray-300" : "text-gray-600"
                              }
                            >
                              <span className="font-medium">
                                {t("leaves.from")}:
                              </span>{" "}
                              {formatDate(request.startDate)}
                            </div>
                            <div
                              className={
                                isDark ? "text-gray-300" : "text-gray-600"
                              }
                            >
                              <span className="font-medium">
                                {t("leaves.to")}:
                              </span>{" "}
                              {formatDate(request.endDate)}
                            </div>
                            <div
                              className={`font-medium mt-1 ${
                                isDark ? "text-blue-400" : "text-blue-600"
                              }`}
                            >
                              {calculateDuration(request.from, request.to)}{" "}
                              {t("leaves.days")}
                            </div>
                          </div>
                        </div>

                        {/* Reason */}
                        {request.reason && (
                          <div
                            className={`flex items-start text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            <FileText
                              className={`w-4 h-4 ml-2 mt-0.5 flex-shrink-0 ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            />
                            <span
                              className="line-clamp-2 leading-relaxed"
                              title={request.reason}
                            >
                              {request.reason}
                            </span>
                          </div>
                        )}

                        {/* Requested At */}
                        <div
                          className={`flex items-center text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <Clock
                            className={`w-4 h-4 ml-2 flex-shrink-0 ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          />
                          <span>{formatDate(request.requestedAt)}</span>
                        </div>

                        {/* Approved/Rejected info */}
                        {request.statusCode !== 0 && request.approvedAt && (
                          <div
                            className={`pt-2 border-t ${
                              isDark ? "border-gray-600" : "border-gray-100"
                            }`}
                          >
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("leaves.processedOn", {
                                date: formatDate(request.approvedAt),
                              })}
                            </div>
                            {request.approvedByNameAr && (
                              <div
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {t("leaves.processedBy", {
                                  name: request.approvedByNameAr,
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div
                        className={`mt-6 pt-4 border-t ${
                          isDark ? "border-gray-600" : "border-gray-100"
                        }`}
                      >
                        {renderActionButtons(request)}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Leaves
