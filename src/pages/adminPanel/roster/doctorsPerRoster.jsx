import React, { useEffect } from "react";
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

  const isRTL = i18n.language === "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (id) {
      dispatch(getDoctorsPerRoster({ rosterId: id }));
    }
  }, [dispatch, id]);

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    if (!doctorsData || doctorsData.length === 0) return null;

    return doctorsData.reduce(
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
  }, [doctorsData]);

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
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("roster.summaryStatistics")}
          </h2>

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
                {summaryStats.totalAssignments}
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

      {/* Doctors List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className={`text-2xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("roster.doctorsList")} ({doctorsData.length})
          </h2>
        </div>

        {/* Doctor Cards */}
        <div className="space-y-4">
          {doctorsData.map((doctor) => (
            <CollapsibleDoctorCard key={doctor.doctorId} doctorData={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorsPerRoster;
