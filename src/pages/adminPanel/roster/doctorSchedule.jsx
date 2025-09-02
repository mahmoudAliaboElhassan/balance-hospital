import React, { useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Building,
  AlertCircle,
  CheckCircle,
  User,
  Target,
  FileText,
  Briefcase,
  Timer,
  UserCheck,
  Activity,
  Award,
  MapPin,
  Hash,
  UserX,
} from "lucide-react";
import { getDoctorSchedule } from "../../../state/act/actRosterManagement";
import LoadingGetData from "../../../components/LoadingGetData";
import UnAssignDoctorModal from "../../../components/UnAsssignDoctorModal";

function DoctorSchedule() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({});

  const { doctorSchedule, loading, errors } = useSelector(
    (state) => state.rosterManagement
  );
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  const { t } = useTranslation();
  const currentLang = i18next.language;
  const isRTL = currentLang === "ar";

  useEffect(() => {
    if (doctorId) {
      dispatch(
        getDoctorSchedule({
          doctorId,
          rosterId: localStorage.getItem("rosterId"),
        })
      );
    }
  }, [dispatch, doctorId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "-";
    const time = new Date(timeString);
    return time.toLocaleTimeString(currentLang === "ar" ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status background color
  const getStatusBgColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading?.doctorSchedule) {
    return <LoadingGetData text={t("gettingData.doctorSchedule")} />;
  }

  if (errors.doctorSchedule) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-red-500 text-lg mb-4">
                {errors.doctorSchedule}
              </div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("common.goBack")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctorSchedule) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className={`text-center ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <p>{t("roster.doctorSchedule.error.notFound")}</p>
        </div>
      </div>
    );
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
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("common.goBack")}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              {doctorSchedule.profileImageUrl ? (
                <img
                  src={doctorSchedule.profileImageUrl}
                  alt={doctorSchedule.doctorName}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-full ${
                    isDark ? "bg-gray-700" : "bg-blue-100"
                  } flex items-center justify-center border-4 border-white shadow-lg`}
                >
                  <User
                    className={`h-8 w-8 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
              )}
            </div>
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-1`}
              >
                {currentLang === "ar" && doctorSchedule.doctorNameArabic
                  ? doctorSchedule.doctorNameArabic
                  : doctorSchedule.doctorName}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {doctorSchedule.rosterTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {doctorSchedule.totalAssignments}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.doctorSchedule.totalAssignments")}
                </p>
              </div>
              <Hash
                className={`h-6 w-6 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
          </div>
          <UnAssignDoctorModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            doctorData={doctorData}
          />
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {doctorSchedule.totalHours}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.doctorSchedule.totalHours")}
                </p>
              </div>
              <Timer
                className={`h-6 w-6 ${
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
            } p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {doctorSchedule.completedShifts}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.doctorSchedule.completedShifts")}
                </p>
              </div>
              <CheckCircle
                className={`h-6 w-6 ${
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
            } p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {doctorSchedule.pendingShifts}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.doctorSchedule.pendingShifts")}
                </p>
              </div>
              <Clock
                className={`h-6 w-6 ${
                  isDark ? "text-yellow-400" : "text-yellow-600"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule Assignments */}
          <div className="lg:col-span-2">
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6 mb-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("roster.doctorSchedule.assignments")}
                </h2>
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {doctorSchedule.assignments?.length || 0} {t("roster.shifts")}
                </span>
              </div>

              {doctorSchedule.assignments &&
              doctorSchedule.assignments.length > 0 ? (
                <div className="space-y-4">
                  {doctorSchedule.assignments.map((assignment, index) => (
                    <div
                      key={assignment.scheduleId || index}
                      className={`p-4 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              isDark ? "bg-gray-600" : "bg-blue-100"
                            }`}
                          >
                            <Calendar
                              size={16}
                              className={`${
                                isDark ? "text-blue-400" : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {formatDate(assignment.shiftDate)}
                            </p>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {assignment.dayOfWeekName || assignment.dayOfWeek}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(
                              assignment.status
                            )}`}
                          >
                            {assignment.status}
                          </span>
                          {(assignment.status === "CONFIRMED" ||
                            assignment.status === "PENDING") && (
                            <button
                              onClick={() => {
                                setDoctorData({
                                  name: doctorSchedule.doctorName,
                                  doctorScheule: assignment.scheduleId,
                                });
                                setModalOpen(true);
                              }}
                              className={`p-1.5 rounded-md transition-colors ${
                                isDark
                                  ? "bg-red-600 hover:bg-red-700 text-white"
                                  : "bg-red-600 hover:bg-red-700 text-white"
                              }`}
                              title={t("roster.actions.unAssignDoctor")}
                            >
                              <UserX size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={14}
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {assignment.startTime} - {assignment.endTime}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              isDark
                                ? "bg-gray-600 text-gray-300"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {assignment.shiftHours}h
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Building
                            size={14}
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {assignment.departmentName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <span
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {assignment.shiftTypeName}
                          </span>
                          <span
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {assignment.contractingTypeName}
                          </span>
                        </div>
                        <span
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {t("roster.assignedBy")}: {assignment.assignedByName}
                        </span>
                      </div>

                      {assignment.notes && (
                        <div
                          className={`mt-3 pt-3 border-t ${
                            isDark ? "border-gray-600" : "border-gray-200"
                          }`}
                        >
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {assignment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar
                    className={`h-12 w-12 mx-auto mb-3 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("roster.doctorSchedule.noAssignments")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics & Charts */}
          <div>
            {/* Shift Types Breakdown */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6 mb-6`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                {t("roster.form.shiftType")}
              </h3>
              <div className="space-y-3">
                {Object.entries(doctorSchedule.shiftTypesCount || {}).map(
                  ([shiftType, count]) => (
                    <div
                      key={shiftType}
                      className="flex items-center justify-between"
                    >
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {shiftType}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-16 h-2 ${
                            isDark ? "bg-gray-700" : "bg-gray-200"
                          } rounded-full`}
                        >
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (count / doctorSchedule.totalAssignments) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Departments */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6 mb-6`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                {t("adminPanel.departments")}
              </h3>
              <div className="space-y-3">
                {Object.entries(doctorSchedule.departmentsCount || {}).map(
                  ([department, count]) => (
                    <div
                      key={department}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Building
                          size={16}
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {department}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Weekly Distribution */}
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
                } mb-4`}
              >
                {t("roster.doctorSchedule.weeklyDistribution")}
              </h3>
              <div className="space-y-2">
                {Object.entries(doctorSchedule.weekdaysCount || {}).map(
                  ([weekday, count]) => (
                    <div
                      key={weekday}
                      className="flex items-center justify-between"
                    >
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {weekday}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-12 h-1.5 ${
                            isDark ? "bg-gray-700" : "bg-gray-200"
                          } rounded-full`}
                        >
                          <div
                            className="h-1.5 bg-green-500 rounded-full"
                            style={{
                              width: `${
                                (count /
                                  Math.max(
                                    ...Object.values(
                                      doctorSchedule.weekdaysCount
                                    )
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSchedule;
