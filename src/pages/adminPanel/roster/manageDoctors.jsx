import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  getDoctorsRequests,
  rejectRequest,
  DoctorWorkingHoursRequestState,
  getStatusName,
} from "../../../state/act/actRosterManagement";
import {
  selectDoctorRequests,
  selectDoctorRequestsLoading,
  selectApproveRequestLoading,
  selectRejectRequestLoading,
} from "../../../state/slices/roster";
import LoadingGetData from "../../../components/LoadingGetData";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Building,
  AlertCircle,
  CheckCircle,
  User,
  FileText,
  Eye,
  Briefcase,
  Timer,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Badge,
  Activity,
  Ban,
} from "lucide-react";
import ApproveRequestModal from "../../../components/ApprovalRequest";
import RejectRequestModal from "../../../components/RejectRequest";

function ManageDoctors() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [currentStatus, setCurrentStatus] = useState(
    DoctorWorkingHoursRequestState.Pending
  );
  const [loadingStates, setLoadingStates] = useState({});
  const [collapsedDates, setCollapsedDates] = useState({});

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [isOpenApprove, setIsOpnApprove] = useState(false);
  const [isOpenReject, setRejectModalOpen] = useState(false);

  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    setIsOpnApprove(true);
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };

  const { t, i18n } = useTranslation();

  const doctorRequests = useSelector(selectDoctorRequests);
  const isLoading = useSelector(selectDoctorRequestsLoading);
  const isApproving = useSelector(selectApproveRequestLoading);
  const isRejecting = useSelector(selectRejectRequestLoading);

  const { mymode } = useSelector((state) => state.mode);

  // Get current language direction
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (id) {
      dispatch(getDoctorsRequests({ status: currentStatus, rosterId: id }));
    }
  }, [dispatch, id, currentStatus]);

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
  };

  const handleReject = async (requestId) => {
    setLoadingStates((prev) => ({ ...prev, [`reject_${requestId}`]: true }));
    try {
      await dispatch(rejectRequest({ requestId })).unwrap();
      dispatch(getDoctorsRequests({ status: currentStatus, rosterId: id }));
    } catch (error) {
      console.error("Error rejecting request:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`reject_${requestId}`]: false }));
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return isDark
          ? "bg-yellow-900/30 text-yellow-400 border-yellow-500/30"
          : "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Approved":
        return isDark
          ? "bg-green-900/30 text-green-400 border-green-500/30"
          : "bg-green-100 text-green-800 border-green-300";
      case "Rejected":
        return isDark
          ? "bg-red-900/30 text-red-400 border-red-500/30"
          : "bg-red-100 text-red-800 border-red-300";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={12} />;
      case "Approved":
        return <CheckCircle size={12} />;
      case "Rejected":
        return <Ban size={12} />;
      default:
        return <Activity size={12} />;
    }
  };

  const toggleDateCollapse = (date) => {
    setCollapsedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("common.notAvailable");
    return new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
      i18n.language,
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    );
  };

  if (isLoading) {
    return <LoadingGetData text={t("gettingData.doctorRequests")} />;
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <Link
              to={`/admin-panel/rosters/${id}`}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("roster.actions.backToRoster")}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-blue-100"
              } rounded-lg`}
            >
              <UserCheck
                className={`h-8 w-8 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                {t("doctorRequests.title")}
              </h1>
              <h3
                className={`text-xl sm:text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                {doctorRequests?.rosterTitle}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("doctorRequests.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(DoctorWorkingHoursRequestState).map(
            ([key, value]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(value)}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  currentStatus === value
                    ? "bg-blue-600 text-white border-blue-600"
                    : isDark
                    ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {getStatusIcon(key)}
                <span>{t(`doctorRequests.status.${key.toLowerCase()}`)}</span>
              </button>
            )
          )}
        </div>

        {/* Summary Statistics */}
        {doctorRequests && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {doctorRequests.totalRequests}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("doctorRequests.stats.totalRequests")}
                  </p>
                </div>
                <Badge
                  className={`h-8 w-8 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
            </div>

            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-yellow-400" : "text-yellow-600"
                    }`}
                  >
                    {doctorRequests.pendingRequests}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("doctorRequests.status.pending")}
                  </p>
                </div>
                <Clock
                  className={`h-8 w-8 ${
                    isDark ? "text-yellow-400" : "text-yellow-600"
                  }`}
                />
              </div>
            </div>

            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {doctorRequests.approvedRequests}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("doctorRequests.status.approved")}
                  </p>
                </div>
                <CheckCircle
                  className={`h-8 w-8 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
            </div>

            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {doctorRequests.rejectedRequests}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("doctorRequests.status.rejected")}
                  </p>
                </div>
                <Ban
                  className={`h-8 w-8 ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Requests by Date */}
        {doctorRequests?.requestsByDate?.length > 0 ? (
          <div className="space-y-6">
            {doctorRequests.requestsByDate.map((dateGroup) => (
              <div
                key={dateGroup.date}
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
                  onClick={() => toggleDateCollapse(dateGroup.date)}
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
                          {formatDate(dateGroup.date)}
                        </h2>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {dateGroup.dayOfWeekName}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("doctorRequests.stats.total")}:{" "}
                            {dateGroup.totalRequests} |{" "}
                            {t("doctorRequests.status.pending")}:{" "}
                            {dateGroup.pendingRequests} |{" "}
                            {t("doctorRequests.status.approved")}:{" "}
                            {dateGroup.approvedRequests} |{" "}
                            {t("doctorRequests.status.rejected")}:{" "}
                            {dateGroup.rejectedRequests}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chevron Icon */}
                    <div className="flex items-center">
                      {collapsedDates[dateGroup.date] ? (
                        <ChevronDown
                          className={`h-5 w-5 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          } transition-transform duration-200`}
                        />
                      ) : (
                        <ChevronRight
                          className={`h-5 w-5 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          } transition-transform duration-200`}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {collapsedDates[dateGroup.date] && (
                  <div className="p-6 space-y-6">
                    {dateGroup.requests.map((request) => (
                      <div
                        key={request.id}
                        className={`p-4 rounded-lg border ${
                          isDark
                            ? "bg-gray-700/50 border-gray-600"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Request Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <User
                                  className={`h-5 w-5 ${
                                    isDark ? "text-blue-400" : "text-blue-600"
                                  }`}
                                />
                                <h3
                                  className={`text-lg font-medium ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {currentLang === "en"
                                    ? request.doctorName
                                    : request.doctorNameArabic}
                                </h3>
                              </div>
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${getStatusBadgeColor(
                                  request.status
                                )}`}
                              >
                                {getStatusIcon(request.status)}
                                <span className={`${isRTL ? "mr-1" : "ml-1"}`}>
                                  {t(
                                    `doctorRequests.status.${request.status.toLowerCase()}`
                                  )}
                                </span>
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <Building
                                  className={`h-4 w-4 ${
                                    isDark ? "text-green-400" : "text-green-600"
                                  }`}
                                />
                                <div>
                                  <span
                                    className={`text-xs font-medium ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {t("doctorRequests.fields.department")}:
                                  </span>
                                  <p
                                    className={`text-sm ${
                                      isDark ? "text-gray-300" : "text-gray-900"
                                    }`}
                                  >
                                    {request.departmentName}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Briefcase
                                  className={`h-4 w-4 ${
                                    isDark
                                      ? "text-purple-400"
                                      : "text-purple-600"
                                  }`}
                                />
                                <div>
                                  <span
                                    className={`text-xs font-medium ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {t("doctorRequests.fields.shift")}:
                                  </span>
                                  <p
                                    className={`text-sm ${
                                      isDark ? "text-gray-300" : "text-gray-900"
                                    }`}
                                  >
                                    {request.shiftTypeName}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Clock
                                  className={`h-4 w-4 ${
                                    isDark
                                      ? "text-orange-400"
                                      : "text-orange-600"
                                  }`}
                                />
                                <div>
                                  <span
                                    className={`text-xs font-medium ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {t("doctorRequests.fields.time")}:
                                  </span>
                                  <p
                                    className={`text-sm ${
                                      isDark ? "text-gray-300" : "text-gray-900"
                                    }`}
                                  >
                                    {formatTime(request.startTime)} -{" "}
                                    {formatTime(request.endTime)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Timer
                                  className={`h-4 w-4 ${
                                    isDark
                                      ? "text-indigo-400"
                                      : "text-indigo-600"
                                  }`}
                                />
                                <div>
                                  <span
                                    className={`text-xs font-medium ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {t("doctorRequests.fields.hours")}:
                                  </span>
                                  <p
                                    className={`text-sm ${
                                      isDark ? "text-gray-300" : "text-gray-900"
                                    }`}
                                  >
                                    {request.shiftHours}h
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <Badge
                                className={`h-4 w-4 ${
                                  isDark ? "text-cyan-400" : "text-cyan-600"
                                }`}
                              />
                              <span
                                className={`text-xs font-medium ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {t("doctorRequests.fields.type")}:
                              </span>
                              <span
                                className={`text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-900"
                                }`}
                              >
                                {request.contractingTypeName}
                              </span>
                            </div>

                            {request.notes && request.notes !== "string" && (
                              <div className="mb-3">
                                <div className="flex items-start gap-2">
                                  <FileText
                                    className={`h-4 w-4 mt-0.5 ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  />
                                  <div>
                                    <span
                                      className={`text-xs font-medium ${
                                        isDark
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {t("doctorRequests.fields.notes")}:
                                    </span>
                                    <p
                                      className={`text-sm ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      } mt-1`}
                                    >
                                      {request.notes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {request.issues && request.issues.length > 0 && (
                              <div className="mb-3">
                                <div className="flex items-start gap-2">
                                  <AlertCircle
                                    className={`h-4 w-4 mt-0.5 ${
                                      isDark ? "text-red-400" : "text-red-600"
                                    }`}
                                  />
                                  <div>
                                    <span
                                      className={`text-xs font-medium ${
                                        isDark ? "text-red-400" : "text-red-600"
                                      }`}
                                    >
                                      {t("doctorRequests.fields.issues")}:
                                    </span>
                                    <ul className="mt-1 space-y-1">
                                      {request.issues.map((issue, index) => (
                                        <li
                                          key={index}
                                          className={`text-sm ${
                                            isDark
                                              ? "text-red-300"
                                              : "text-red-700"
                                          } flex items-center`}
                                        >
                                          <span
                                            className={`w-2 h-2 ${
                                              isDark
                                                ? "bg-red-400"
                                                : "bg-red-400"
                                            } rounded-full ${
                                              isRTL ? "ml-2" : "mr-2"
                                            } flex-shrink-0`}
                                          ></span>
                                          {issue}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("doctorRequests.fields.requestedAt")}:{" "}
                              {new Date(request.requestedAt).toLocaleString(
                                i18n.language
                              )}
                            </div>
                          </div>

                          {/* Action buttons for pending requests */}
                          {request.status === "Pending" && (
                            <div className="flex gap-2 mt-4 lg:mt-0">
                              <button
                                onClick={() => handleApproveClick(request)}
                                disabled={
                                  loadingStates[`approve_${request.id}`] ||
                                  isApproving
                                }
                                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                              >
                                {loadingStates[`approve_${request.id}`] ? (
                                  <>
                                    <svg
                                      className="animate-spin h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    {t("doctorRequests.actions.approving")}
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={14} />
                                    {t("doctorRequests.actions.approve")}
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleRejectClick(request)}
                                disabled={
                                  loadingStates[`reject_${request.id}`] ||
                                  isRejecting
                                }
                                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                              >
                                {loadingStates[`reject_${request.id}`] ? (
                                  <>
                                    <svg
                                      className="animate-spin h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    {t("doctorRequests.actions.rejecting")}
                                  </>
                                ) : (
                                  <>
                                    <Ban size={14} />
                                    {t("doctorRequests.actions.reject")}
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-12 text-center`}
          >
            <UserCheck
              className={`h-12 w-12 mx-auto mb-4 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <p
              className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {t("doctorRequests.noRequests", {
                status: t(
                  `doctorRequests.status.${getStatusName(
                    currentStatus
                  ).toLowerCase()}`
                ),
              })}
            </p>
          </div>
        )}
      </div>
      <ApproveRequestModal
        isOpen={isOpenApprove}
        onClose={() => setIsOpnApprove(false)}
        request={selectedRequest}
        status={currentStatus}
      />
      <RejectRequestModal
        isOpen={isOpenReject}
        onClose={() => setRejectModalOpen(false)}
        request={selectedRequest}
        status={currentStatus}
      />
    </div>
  );
}

export default ManageDoctors;
