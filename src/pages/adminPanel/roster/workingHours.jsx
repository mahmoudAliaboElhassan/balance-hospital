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
  UserPlus,
} from "lucide-react";
import { getDepartments } from "../../../state/act/actDepartment";
import CollapsibleDateCard from "./collapsWorkingHour";
import i18next from "i18next";

function WorkingHours() {
  const { rosterId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // State for filters
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    departmentId: "",
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
      // Load departments for filter dropdown
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
    if (!dateString) return t("common.notAvailable");
    return new Intl.DateTimeFormat(i18next.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "-";
    const time = new Date(timeString);
    return time.toLocaleTimeString("en-US", {
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

  // Group working hours by date
  const getWorkingHoursByDate = () => {
    if (!workingHours?.data?.departments) return {};

    const groupedByDate = {};

    workingHours.data.departments.forEach((department) => {
      department.shifts.forEach((shift) => {
        shift.contractingTypes.forEach((contractingType) => {
          contractingType.workingHoursDetails.forEach((detail) => {
            const dateKey = detail.shiftDate;
            if (!groupedByDate[dateKey]) {
              groupedByDate[dateKey] = {
                date: dateKey,
                dayOfWeek: detail.dayOfWeek,
                dayOfWeekName:
                  currentLang === "en"
                    ? detail.dayOfWeekNameEn
                    : detail.dayOfWeekNameAr,
                departments: [],
              };
            }

            // Find or create department in this date
            let deptGroup = groupedByDate[dateKey].departments.find(
              (d) => d.departmentId === department.departmentId
            );
            if (!deptGroup) {
              deptGroup = {
                departmentId: department.departmentId,
                departmentName:
                  currentLang === "en"
                    ? department.departmentNameEn
                    : department.departmentNameAr,
                shifts: [],
              };
              groupedByDate[dateKey].departments.push(deptGroup);
            }

            // Find or create shift in this department
            let shiftGroup = deptGroup.shifts.find(
              (s) => s.shiftId === shift.shiftId
            );
            if (!shiftGroup) {
              shiftGroup = {
                shiftId: shift.shiftId,
                shiftName:
                  currentLang === "en" ? shift.shiftNameEn : shift.shiftNameAr,
                shiftPeriod: shift.shiftPeriod,
                startTime: shift.startTime,
                endTime: shift.endTime,
                hours: shift.hours,
                contractingTypes: [],
              };
              deptGroup.shifts.push(shiftGroup);
            }

            // Add contracting type with working hour detail
            shiftGroup.contractingTypes.push({
              contractingTypeId: contractingType.contractingTypeId,
              contractingTypeName:
                currentLang === "en"
                  ? contractingType.contractingTypeNameEn
                  : contractingType.contractingTypeNameAr,
              workingHourDetail: detail,
            });
          });
        });
      });
    });

    // Sort dates
    return Object.keys(groupedByDate)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = groupedByDate[key];
        return sorted;
      }, {});
  };

  const groupedWorkingHours = getWorkingHoursByDate();
  const totalWorkingHoursCount = Object.values(groupedWorkingHours).reduce(
    (count, day) =>
      count +
      day.departments.reduce(
        (deptCount, dept) =>
          deptCount +
          dept.shifts.reduce(
            (shiftCount, shift) => shiftCount + shift.contractingTypes.length,
            0
          ),
        0
      ),
    0
  );

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
                className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors flex items-center gap-2 ${
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
        {workingHours?.data?.summary && (
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
                    {totalWorkingHoursCount}
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
                    {workingHours.data.summary.totalAssignedDoctors}
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
                    {Object.keys(groupedWorkingHours).length}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("roster.totalDays")}
                  </p>
                </div>
                <Calendar
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
                      workingHours.data.summary.overallFillPercentage
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

        {/* Working Hours by Date */}
        <div className="space-y-6">
          {Object.keys(groupedWorkingHours).length === 0 ? (
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-12 text-center`}
            >
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
            Object.values(groupedWorkingHours).map((dayData) => (
              <CollapsibleDateCard
                key={dayData.date}
                dayData={dayData}
                formatDate={formatDate}
                formatTime={formatTime}
                getFillColor={getFillColor}
                getFillBgColor={getFillBgColor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkingHours;
