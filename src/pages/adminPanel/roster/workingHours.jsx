import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getWorkingHours } from "../../../state/act/actRosterManagement";
import { useTranslation } from "react-i18next";
import LoadingGetData from "../../../components/LoadingGetData";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Building,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  User,
  Target,
  TrendingUp,
  RefreshCw,
  FileText,
  Eye,
  Briefcase,
  Timer,
  UserCheck,
  Edit,
} from "lucide-react";
import { getDepartments } from "../../../state/act/actDepartment";

function WorkingHours() {
  const { rosterId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // State for filters
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    departmentId: null,
  });

  const [showFilters, setShowFilters] = useState(false);

  const { workingHours, loading, errors, rosterDepartments } = useSelector(
    (state) => state.rosterManagement
  );

  const { departments } = useSelector((state) => state.department);
  const { mymode } = useSelector((state) => state.mode);

  // Get current language direction
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (rosterId) {
      dispatch(getWorkingHours({ rosterId, params: filters }));
      // Load rosterDepartments for filter dropdown
      dispatch(getDepartments());
    }
  }, [dispatch, rosterId]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    dispatch(getWorkingHours({ rosterId, params: filters }));
  };

  // Clear filters
  const clearFilters = () => {
    const clearedFilters = {
      startDate: "",
      endDate: "",
      departmentId: "",
    };
    setFilters(clearedFilters);
    dispatch(getWorkingHours({ rosterId, params: clearedFilters }));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
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

  if (loading.fetch) {
    return <LoadingGetData text={t("gettingData.workingHours")} />;
  }

  if (errors.general) {
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
              <div className="text-red-500 text-lg mb-4">{errors.general}</div>
              <Link
                to={`/admin-panel/rosters/${rosterId}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("roster.actions.backToRoster")}
                </span>
              </Link>
            </div>
          </div>
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
            <Link
              to={`/admin-panel/rosters/${rosterId}`}
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  showFilters
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Filter size={16} />
                {t("common.filters")}
              </button>

              <button
                onClick={applyFilters}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={16} />
                {t("common.refresh")}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-purple-100"
              } rounded-lg`}
            >
              <Clock
                className={`h-8 w-8 ${
                  isDark ? "text-purple-400" : "text-purple-600"
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
                {t("roster.workingHours.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6 mb-6`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {t("common.startDate")}
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {t("common.endDate")}
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {t("common.department")}
                </label>
                <select
                  value={filters.departmentId}
                  onChange={(e) =>
                    handleFilterChange("departmentId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">{t("common.allDepartments")}</option>
                  {departments?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {currentLang === "en"
                        ? dept?.nameEnglish
                        : dept?.nameArabic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Search size={16} />
                  {t("common.apply")}
                </button>
                <button
                  onClick={clearFilters}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t("common.clear")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {workingHours && workingHours.length > 0 && (
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
                    {workingHours.length}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.totalShifts")}
                  </p>
                </div>
                <Timer
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
                    {workingHours.reduce(
                      (acc, wh) => acc + wh.currentAssignedDoctors,
                      0
                    )}
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
                    {workingHours.filter((wh) => wh.isFullyBooked).length}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.fullyBooked")}
                  </p>
                </div>
                <Target
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
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {Math.round(
                      workingHours.reduce(
                        (acc, wh) => acc + wh.fillPercentage,
                        0
                      ) / workingHours.length
                    )}
                    %
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.averageFill")}
                  </p>
                </div>
                <TrendingUp
                  className={`h-8 w-8 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Working Hours List */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.workingHoursList")}
            </h2>
          </div>

          {!workingHours || workingHours.length === 0 ? (
            <div className="p-12 text-center">
              <Clock
                className={`h-12 w-12 mx-auto mb-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <p
                className={`text-lg ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("roster.noWorkingHours")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {workingHours.map((workingHour) => (
                <div key={workingHour.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Side - Main Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Calendar
                            className={`h-5 w-5 ${
                              isDark ? "text-blue-400" : "text-blue-600"
                            }`}
                          />
                          <div>
                            <h3
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {formatDate(workingHour.shiftDate)}
                            </h3>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {workingHour.dayOfWeekName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Building
                            className={`h-5 w-5 ${
                              isDark ? "text-green-400" : "text-green-600"
                            }`}
                          />
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {workingHour.department.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Shift Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Briefcase
                            className={`h-4 w-4 ${
                              isDark ? "text-purple-400" : "text-purple-600"
                            }`}
                          />
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {workingHour.shift.name}
                            </p>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {workingHour.shift.period} (
                              {workingHour.shift.hours}h)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <User
                            className={`h-4 w-4 ${
                              isDark ? "text-orange-400" : "text-orange-600"
                            }`}
                          />
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {workingHour.contractingType.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Assignment Stats */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users
                            className={`h-4 w-4 ${
                              isDark ? "text-blue-400" : "text-blue-600"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {workingHour.currentAssignedDoctors}/
                            {workingHour.requiredDoctors} {t("roster.required")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Target
                            className={`h-4 w-4 ${getFillColor(
                              workingHour.fillPercentage
                            )}`}
                          />
                          <span
                            className={`text-sm font-medium ${getFillColor(
                              workingHour.fillPercentage
                            )}`}
                          >
                            {Math.round(workingHour.fillPercentage)}%{" "}
                            {t("roster.filled")}
                          </span>
                        </div>

                        {workingHour.isFullyBooked && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle
                              size={12}
                              className={`${isRTL ? "ml-1" : "mr-1"}`}
                            />
                            {t("roster.fullyBooked")}
                          </span>
                        )}

                        {workingHour.isOverBooked && (
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

                    {/* Right Side - Progress & Actions */}
                    <div className="flex flex-col gap-4">
                      {/* Progress Bar */}
                      <div className="w-full lg:w-32">
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("roster.progress")}
                          </span>
                          <span
                            className={`text-xs font-semibold ${getFillColor(
                              workingHour.fillPercentage
                            )}`}
                          >
                            {Math.round(workingHour.fillPercentage)}%
                          </span>
                        </div>
                        <div
                          className={`w-full ${
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

                      {/* Action Button */}
                      <button
                        onClick={() =>
                          navigate(
                            `/admin-panel/rosters/working-hours/${workingHour.id}`
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Eye size={16} />
                        {t("common.view")}
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/admin-panel/rosters/working-hours/${workingHour.id}/edit`
                          )
                        }
                        className="bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Edit size={16} />
                        {t("common.edit")}
                      </button>
                    </div>
                  </div>

                  {/* Assigned Doctors Preview */}
                  {workingHour.assignedDoctors &&
                    workingHour.assignedDoctors.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4
                            className={`text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("roster.assignedDoctors")} (
                            {workingHour.assignedDoctors.length})
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {workingHour.assignedDoctors
                            .slice(0, 3)
                            .map((doctor, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                  isDark
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                <User
                                  size={12}
                                  className={`${isRTL ? "ml-1" : "mr-1"}`}
                                />
                                {doctor.doctorName}
                              </span>
                            ))}
                          {workingHour.assignedDoctors.length > 3 && (
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                isDark
                                  ? "bg-blue-700 text-blue-300"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              +{workingHour.assignedDoctors.length - 3}{" "}
                              {t("common.more")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Notes */}
                  {workingHour.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-2">
                        <FileText
                          className={`h-4 w-4 mt-0.5 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-1`}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkingHours;
