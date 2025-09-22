import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDoctorsPerRoster } from "../../../state/act/actRosterManagement";
import {
  selectDoctorsPerRoster,
  selectIsFetching,
  selectErrors,
} from "../../../state/slices/roster";
import CollapsibleDoctorCard from "./CollapsibleDoctorCard";
import {
  Users,
  Clock,
  Building,
  FileText,
  AlertCircle,
  Loader2,
  Filter,
  UserCheck,
  Stethoscope,
  GraduationCap,
  Award,
} from "lucide-react";
import LoadingGetData from "../../../components/LoadingGetData";

function DoctorsPerRoster() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);

  const doctorsData = useSelector(selectDoctorsPerRoster);
  const isLoading = useSelector(selectIsFetching);
  const errors = useSelector(selectErrors);

  const [selectedFilter, setSelectedFilter] = useState("all");

  const isRTL = i18n.language === "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (id) {
      dispatch(getDoctorsPerRoster({ rosterId: id }));
    }
  }, [dispatch, id]);

  // Filter doctors based on specialty
  const filteredDoctors = React.useMemo(() => {
    if (!doctorsData || selectedFilter === "all") {
      return doctorsData || [];
    }

    return doctorsData.filter((doctor) => {
      const specialty = doctor.specialtyEn?.toLowerCase() || "";
      return specialty.includes(selectedFilter.toLowerCase());
    });
  }, [doctorsData, selectedFilter]);

  // Calculate filter counts
  const filterCounts = React.useMemo(() => {
    if (!doctorsData) return {};

    return {
      all: doctorsData.length,
      physician: doctorsData.filter((doctor) =>
        doctor.specialtyEn?.toLowerCase().includes("physician")
      ).length,
      consultant: doctorsData.filter((doctor) =>
        doctor.specialtyEn?.toLowerCase().includes("consultant")
      ).length,
      specialist: doctorsData.filter((doctor) =>
        doctor.specialtyEn?.toLowerCase().includes("specialist")
      ).length,
    };
  }, [doctorsData]);

  // Calculate summary statistics based on filtered data
  const summaryStats = React.useMemo(() => {
    if (!filteredDoctors || filteredDoctors.length === 0) return null;

    return filteredDoctors.reduce(
      (acc, doctor) => ({
        totalDoctors: acc.totalDoctors + 1,
        totalAssignments: acc.totalAssignments + doctor.totalAssignments,
        totalHours: acc.totalHours + doctor.totalHours,
        totalRequests:
          acc.totalRequests +
          (doctor.requestsApproved +
            doctor.requestsRejected +
            doctor.requestsPending),
        totalApproved: acc.totalApproved + doctor.requestsApproved,
        totalRejected: acc.totalRejected + doctor.requestsRejected,
        totalPending: acc.totalPending + doctor.requestsPending,
        totalPresent: acc.totalPresent + doctor.presentCount,
        totalNoShow: acc.totalNoShow + doctor.noShowCount,
        totalLate: acc.totalLate + doctor.lateCount,
      }),
      {
        totalDoctors: 0,
        totalAssignments: 0,
        totalHours: 0,
        totalRequests: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalPending: 0,
        totalPresent: 0,
        totalNoShow: 0,
        totalLate: 0,
      }
    );
  }, [filteredDoctors]);

  const filterOptions = [
    {
      key: "all",
      label: t("roster.filters.all", "All"),
      icon: Users,
      color: "blue",
      count: filterCounts.all || 0,
    },
    {
      key: "physician",
      label: t("roster.filters.physician", "Physician"),
      icon: Stethoscope,
      color: "green",
      count: filterCounts.physician || 0,
    },
    {
      key: "consultant",
      label: t("roster.filters.consultant", "Consultant"),
      icon: GraduationCap,
      color: "purple",
      count: filterCounts.consultant || 0,
    },
    {
      key: "specialist",
      label: t("roster.filters.specialist", "Specialist"),
      icon: Award,
      color: "orange",
      count: filterCounts.specialist || 0,
    },
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: {
        active: isDark
          ? "bg-blue-600 border-blue-500 text-white"
          : "bg-blue-500 border-blue-500 text-white",
        inactive: isDark
          ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
        icon: isDark ? "text-blue-300" : "text-blue-400",
      },
      green: {
        active: isDark
          ? "bg-green-600 border-green-500 text-white"
          : "bg-green-500 border-green-500 text-white",
        inactive: isDark
          ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
        icon: isDark ? "text-green-300" : "text-green-400",
      },
      purple: {
        active: isDark
          ? "bg-purple-600 border-purple-500 text-white"
          : "bg-purple-500 border-purple-500 text-white",
        inactive: isDark
          ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
        icon: isDark ? "text-purple-300" : "text-purple-400",
      },
      orange: {
        active: isDark
          ? "bg-orange-600 border-orange-500 text-white"
          : "bg-orange-500 border-orange-500 text-white",
        inactive: isDark
          ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
        icon: isDark ? "text-orange-300" : "text-orange-400",
      },
    };

    return {
      card: isActive ? colors[color].active : colors[color].inactive,
      icon: isActive ? "text-white" : colors[color].icon,
    };
  };

  if (isLoading) {
    return <LoadingGetData text={t("gettingData.loadingDoctors")} />;
  }

  if (errors.general) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle
            className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? "text-red-400" : "text-red-500"
            }`}
          />
          <p className={`text-lg ${isDark ? "text-red-400" : "text-red-600"}`}>
            {errors.general}
          </p>
        </div>
      </div>
    );
  }

  if (!doctorsData || doctorsData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users
            className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            {t("roster.noDoctorsFound")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("roster.doctorsPerRoster")}
          </h1>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("roster.doctorsPerRosterDescription")}
          </p>
        </div>
      </div>

      {/* Summary Statistics */}
      {summaryStats && (
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm border ${
            isDark ? "border-gray-700" : "border-gray-200"
          } p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.summaryStatistics")}
            </h2>
            {selectedFilter !== "all" && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDark
                    ? "bg-blue-900/50 text-blue-300"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {t("roster.filtered", "Filtered")}: {filteredDoctors.length}{" "}
                {t("roster.doctors", "doctors")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users
                  className={`h-4 w-4 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.totalDoctors")}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {summaryStats.totalDoctors}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock
                  className={`h-4 w-4 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.totalHours")}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {summaryStats.totalHours}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Building
                  className={`h-4 w-4 ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.totalRequests")}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {summaryStats.totalRequests}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.totalPresent")}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {summaryStats.totalPresent}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("roster.totalPending")}
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {summaryStats.totalPending}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filterOptions.map((option) => {
          const isActive = selectedFilter === option.key;
          const colorClasses = getColorClasses(option.color, isActive);
          const IconComponent = option.icon;

          return (
            <button
              key={option.key}
              onClick={() => setSelectedFilter(option.key)}
              className={`p-4 rounded-lg border transition-all duration-200 ${colorClasses.card} shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${colorClasses.icon}`} />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <span
                  className={`text-lg font-bold ${
                    isActive
                      ? "text-white"
                      : isDark
                      ? "text-gray-200"
                      : "text-gray-900"
                  }`}
                >
                  {option.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {/* Doctors List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className={`text-2xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("roster.doctorsList")} ({filteredDoctors.length})
          </h2>
          {selectedFilter !== "all" && (
            <button
              onClick={() => setSelectedFilter("all")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="h-4 w-4" />
              {t("roster.clearFilter", "Clear Filter")}
            </button>
          )}
        </div>

        {/* Doctor Cards */}
        {filteredDoctors.length === 0 ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Users
                className={`h-8 w-8 mx-auto mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t(
                  "roster.noDoctorsInFilter",
                  "No doctors found for this filter"
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <CollapsibleDoctorCard
                key={doctor.doctorId}
                doctorData={doctor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorsPerRoster;
