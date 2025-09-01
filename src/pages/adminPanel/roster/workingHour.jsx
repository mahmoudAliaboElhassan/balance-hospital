import React, { useEffect } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Edit,
  UserPlus,
} from "lucide-react";
import {
  assignDoctor,
  getWorkingHour,
} from "../../../state/act/actRosterManagement";
import LoadingGetData from "../../../components/LoadingGetData";

function WorkingHour() {
  const { workingHourId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { workingHour, loading, errors } = useSelector(
    (state) => state.rosterManagement
  );
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  const { t } = useTranslation();
  const currentLang = i18next.language;
  const isRTL = currentLang === "ar";

  useEffect(() => {
    if (workingHourId) {
      dispatch(getWorkingHour({ workingHourId }));
    }
  }, [dispatch, workingHourId]);

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

  // Get fill percentage color
  const getFillColor = (percentage) => {
    if (percentage >= 80) return isDark ? "text-green-400" : "text-green-600";
    if (percentage >= 50) return isDark ? "text-yellow-400" : "text-yellow-600";
    if (percentage >= 25) return isDark ? "text-orange-400" : "text-orange-600";
    return isDark ? "text-red-400" : "text-red-600";
  };

  // Get fill background color
  const getFillBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading?.fetch) {
    return <LoadingGetData text={t("gettingData.workingHour")} />;
  }

  if (errors.workingHours) {
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
                {errors.workingHours}
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

  if (!workingHour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className={`text-center ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <p>{t("roster.workingHours.error.notFound")}</p>
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

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  navigate(
                    `/admin-panel/rosters/working-hours/${workingHourId}/edit`
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit size={16} />
                {t("common.edit")}
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/admin-panel/rosters/working-hours/${workingHourId}/assign-doctor`
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <UserPlus size={16} />
                {t("roster.actions.assignDoctor")}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-blue-100"
              } rounded-lg`}
            >
              <Clock
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
                {t("roster.workingHours.title")}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {formatDate(workingHour.shiftDate)} -{" "}
                {workingHour.dayOfWeekName}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
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
                  {workingHour.requiredDoctors}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.workingHours.fields.requiredDoctors")}
                </p>
              </div>
              <Target
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
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {workingHour.currentAssignedDoctors}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.assignedDoctors")}
                </p>
              </div>
              <UserCheck
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
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {workingHour.remainingSlots}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.remainingSlots")}
                </p>
              </div>
              <Users
                className={`h-8 w-8 ${
                  isDark ? "text-orange-400" : "text-orange-600"
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
                  className={`text-2xl font-bold ${getFillColor(
                    workingHour.fillPercentage
                  )}`}
                >
                  {Math.round(workingHour.fillPercentage)}%
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("roster.fillPercentage")}
                </p>
              </div>
              <Timer
                className={`h-8 w-8 ${getFillColor(
                  workingHour.fillPercentage
                )}`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6 mb-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                {t("roster.workingHours.title")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date & Time Information */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar
                      className={`h-5 w-5 mt-0.5 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {t("common.date")}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {formatDate(workingHour.shiftDate)}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {workingHour.dayOfWeekName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building
                      className={`h-5 w-5 mt-0.5 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {t("common.department")}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {workingHour.department.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shift Information */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Briefcase
                      className={`h-5 w-5 mt-0.5 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {t("adminPanel.shiftHours")}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {workingHour.shift.name}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {workingHour.shift.period} ({workingHour.shift.hours}h)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User
                      className={`h-5 w-5 mt-0.5 ${
                        isDark ? "text-orange-400" : "text-orange-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {t("roster.contractingTypes.fields.contractingTypes")}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {workingHour.contractingType.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-4">
                  {workingHour.isFullyBooked && (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle
                        size={16}
                        className={`${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {t("roster.fullyBooked")}
                    </span>
                  )}

                  {workingHour.isOverBooked && (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      <AlertCircle
                        size={16}
                        className={`${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {t("roster.overBooked")}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${getFillColor(
                        workingHour.fillPercentage
                      )}`}
                    >
                      {Math.round(workingHour.fillPercentage)}%{" "}
                      {t("roster.filled")}
                    </span>
                    <div
                      className={`w-20 ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      } rounded-full h-2`}
                    >
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getFillBgColor(
                          workingHour.fillPercentage
                        )}`}
                        style={{
                          width: `${Math.min(
                            workingHour.fillPercentage,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {workingHour.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <FileText
                      className={`h-5 w-5 mt-0.5 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        } mb-2`}
                      >
                        {t("common.notes")}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {workingHour.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Doctors */}
          <div>
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("roster.assignedDoctors")}
                </h3>
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {workingHour.assignedDoctors?.length || 0}/
                  {workingHour.maxDoctors}
                </span>
              </div>

              {workingHour.assignedDoctors &&
              workingHour.assignedDoctors.length > 0 ? (
                <div className="space-y-3">
                  {workingHour.assignedDoctors.map((doctor, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              isDark ? "bg-gray-600" : "bg-blue-100"
                            }`}
                          >
                            <User
                              size={16}
                              className={`${
                                isDark ? "text-gray-300" : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {doctor.doctorName}
                            </p>
                            <p
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {doctor.contractingTypeName}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            doctor.assignmentMethod === "MANUAL"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          }`}
                        >
                          {doctor.assignmentMethod}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("roster.workingHours.assignedBy")}:{" "}
                            {doctor.assignedByName}
                          </span>
                          <span
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {formatTime(doctor.assignedAt)}
                          </span>
                        </div>
                        {doctor.notes && (
                          <p
                            className={`text-xs mt-1 ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            {doctor.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users
                    className={`h-12 w-12 mx-auto mb-3 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("roster.noAssignedDoctors")}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div
              className={`mt-6 ${
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
                {t("specificCategory.sections.metadata.title")}
              </h3>
              <div className="space-y-3">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("roster.details.createdAt")}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formatTime(workingHour.createdAt)}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("roster.details.createdBy")}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {workingHour.createdByName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkingHour;
