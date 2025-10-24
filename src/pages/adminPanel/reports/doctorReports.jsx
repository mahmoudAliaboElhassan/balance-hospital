import { useDispatch, useSelector } from "react-redux"
import { getDoctorReports } from "../../../state/act/actReports"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import i18next from "i18next"
import {
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Users,
  Activity,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building,
} from "lucide-react"
import LoadingGetData from "../../../components/LoadingGetData"
import {
  clearDoctorReport,
  clearDoctorReportError,
} from "../../../state/slices/reports"
import { CollapsibleRosterCard } from "./collapsingRoster"
import SwapRecordsSection from "./swapRequests"
import LeaveRecordsSection from "./leavesRequests"

function DoctorReports() {
  const { docId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { doctorReport, loadingDoctorReport, doctorReportError } = useSelector(
    (state) => state.reports
  )
  const { mymode } = useSelector((state) => state.mode)

  const isRTL = mymode === "ar"
  const currentLang = i18next.language
  const isDark = mymode === "dark"

  useEffect(() => {
    if (docId) {
      dispatch(getDoctorReports({ doctorId: docId }))
    }

    return () => {
      dispatch(clearDoctorReport())
      dispatch(clearDoctorReportError())
    }
  }, [dispatch, docId])

  // Helper Functions
  const formatDate = (dateString) => {
    if (!dateString) return t("common.notAvailable")
    return new Intl.DateTimeFormat(currentLang, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString))
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return t("common.notAvailable")
    return new Intl.DateTimeFormat(currentLang, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const getComplianceStatusColor = (status) => {
    const statusColors = {
      OVER_ASSIGNED:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      COMPLIANT:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      UNDER_ASSIGNED:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    }
    return (
      statusColors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    )
  }

  const getAttendanceStatusColor = (status) => {
    const statusColors = {
      OnTime: "bg-green-100 text-green-800",
      Late: "bg-yellow-100 text-yellow-800",
      Absent: "bg-red-100 text-red-800",
      EarlyCheckout: "bg-orange-100 text-orange-800",
    }
    return statusColors[status] || "bg-gray-100 text-gray-800"
  }

  // Loading State
  if (loadingDoctorReport) {
    return <LoadingGetData text={t("gettingData.doctorReport")} />
  }

  // Error State
  if (doctorReportError) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-red-50 to-pink-100"
        } p-6`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 text-center`}
          >
            <div
              className={`w-20 h-20 ${
                isDark ? "bg-red-900/30" : "bg-red-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("doctorReport.error.title")}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {doctorReportError.message}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("common.goBack")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Not Found State
  if (!doctorReport) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-gray-50 to-gray-100"
        } p-6`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 text-center`}
          >
            <div
              className={`w-20 h-20 ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <FileText className="w-10 h-10 text-gray-500" />
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("doctorReport.notFound.title")}
            </h3>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("common.goBack")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const report = doctorReport

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isDark
          ? "from-gray-900 via-gray-800 to-gray-900"
          : "from-blue-50 via-indigo-50 to-purple-50"
      } p-6 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            } transition-colors duration-200 mb-4`}
          >
            {currentLang === "en" ? (
              <ArrowLeft className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            {t("common.goBack")}
          </button>

          {/* Doctor Info Card */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div
                  className={`w-20 h-20 ${
                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                  } rounded-full flex items-center justify-center`}
                >
                  <User
                    className={`w-10 h-10 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <div>
                  <h1
                    className={`text-3xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    } mb-2`}
                  >
                    {currentLang === "en" ? report.nameEn : report.nameAr}
                  </h1>
                  <p
                    className={`text-lg ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {currentLang === "en"
                      ? report.categoryNameEn
                      : report.categoryNameAr}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isDark
                      ? "bg-purple-900/30 text-purple-300"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {currentLang === "en"
                    ? report.scientificDegreeNameEn
                    : report.scientificDegreeNameAr}
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isDark
                      ? "bg-green-900/30 text-green-300"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {currentLang === "en"
                    ? report.contractingTypeNameEn
                    : report.contractingTypeNameAr}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Mail
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {report.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {report.mobile}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("doctorReport.nationalId")}: {report.nationalId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Scheduled Shifts */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                } rounded-lg flex items-center justify-center`}
              >
                <Calendar
                  className={`w-6 h-6 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <span
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {report.stats.totalScheduledShifts}
              </span>
            </div>
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("doctorReport.stats.totalScheduledShifts")}
            </h3>
          </div>

          {/* Total Present Days */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${
                  isDark ? "bg-green-900/30" : "bg-green-100"
                } rounded-lg flex items-center justify-center`}
              >
                <CheckCircle
                  className={`w-6 h-6 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
              <span
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {report.stats.totalPresentDays}
              </span>
            </div>
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("doctorReport.stats.totalPresentDays")}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isDark
                    ? "bg-green-900/30 text-green-300"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {report.stats.attendanceRate}%
              </span>
            </div>
          </div>

          {/* Total Late Days */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${
                  isDark ? "bg-yellow-900/30" : "bg-yellow-100"
                } rounded-lg flex items-center justify-center`}
              >
                <Clock
                  className={`w-6 h-6 ${
                    isDark ? "text-yellow-400" : "text-yellow-600"
                  }`}
                />
              </div>
              <span
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {report.stats.totalLateDays}
              </span>
            </div>
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("doctorReport.stats.totalLateDays")}
            </h3>
          </div>

          {/* Total Worked Hours */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${
                  isDark ? "bg-purple-900/30" : "bg-purple-100"
                } rounded-lg flex items-center justify-center`}
              >
                <Activity
                  className={`w-6 h-6 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
              <span
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {report.stats.totalWorkedHours}
              </span>
            </div>
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("doctorReport.stats.totalWorkedHours")}
            </h3>
            <p
              className={`text-xs mt-2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {t("doctorReport.stats.of")} {report.stats.totalAssignedHours}{" "}
              {t("doctorReport.stats.hours")}
            </p>
          </div>
        </div>

        {/* Hours Analysis */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-8 mb-8`}
        >
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            } mb-6 flex items-center gap-3`}
          >
            <BarChart3
              className={`w-6 h-6 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            {t("doctorReport.hoursAnalysis.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div
              className={`p-6 rounded-xl ${
                isDark ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <h3
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.hoursAnalysis.totalAssignedHours")}
              </h3>
              <p
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {report.hoursAnalysis.totalAssignedHours}
              </p>
            </div>

            <div
              className={`p-6 rounded-xl ${
                isDark ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <h3
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.hoursAnalysis.totalWorkedHours")}
              </h3>
              <p
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {report.hoursAnalysis.totalWorkedHours}
              </p>
            </div>

            <div
              className={`p-6 rounded-xl ${
                isDark ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <h3
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.hoursAnalysis.compliancePercentage")}
              </h3>
              <div className="flex items-center gap-3">
                <p
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {report.hoursAnalysis.compliancePercentage.toFixed(1)}%
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getComplianceStatusColor(
                    report.hoursAnalysis.complianceStatus
                  )}`}
                >
                  {currentLang === "en"
                    ? report.hoursAnalysis.complianceStatus
                    : report.hoursAnalysis.complianceStatusAr}
                </span>
              </div>
            </div>
          </div>

          {/* Roster Details */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <th
                    className={`text-${
                      isRTL ? "right" : "left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("doctorReport.hoursAnalysis.rosterTitle")}
                  </th>
                  <th
                    className={`text-${
                      isRTL ? "right" : "left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("doctorReport.hoursAnalysis.assignedHours")}
                  </th>
                  <th
                    className={`text-${
                      isRTL ? "right" : "left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("doctorReport.hoursAnalysis.workedHours")}
                  </th>
                  <th
                    className={`text-${
                      isRTL ? "right" : "left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("doctorReport.hoursAnalysis.compliance")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.hoursAnalysis.rosterDetails.map((roster) => (
                  <tr
                    key={roster.rosterId}
                    className={`border-b ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <td
                      className={`p-4 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {roster.rosterTitle}
                    </td>
                    <td
                      className={`p-4 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {roster.assignedHours}
                    </td>
                    <td
                      className={`p-4 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {roster.workedHours}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          roster.compliancePercentage >= 90
                            ? "bg-green-100 text-green-800"
                            : roster.compliancePercentage >= 70
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {roster.compliancePercentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Chart */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-8 mb-8`}
        >
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            } mb-6 flex items-center gap-3`}
          >
            <CheckCircle
              className={`w-6 h-6 ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            />
            {t("doctorReport.attendanceChart.title")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`p-6 rounded-xl ${
                isDark ? "bg-green-900/20" : "bg-green-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {report.attendanceChart.onTime}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.attendanceChart.onTime")}
              </p>
            </div>

            <div
              className={`p-6 rounded-xl ${
                isDark ? "bg-yellow-900/20" : "bg-yellow-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">
                  {report.attendanceChart.late}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.attendanceChart.late")}
              </p>
            </div>

            <div
              className={`p-6 rounded-xl ${
                isDark ? "bg-red-900/20" : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">
                  {report.attendanceChart.absent}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.attendanceChart.absent")}
              </p>
            </div>

            <div
              className={`p-6 rounded-xl ${
                isDark ? "bg-orange-900/20" : "bg-orange-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">
                  {report.attendanceChart.earlyCheckout}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("doctorReport.attendanceChart.earlyCheckout")}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Roster Distribution */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-8 mb-8`}
        >
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            } mb-6 flex items-center gap-3`}
          >
            <Calendar
              className={`w-6 h-6 ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            />
            {t("doctorReport.monthlyDistribution.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.monthlyRosterDistribution.months.map((month) => (
              <div
                key={`${month.year}-${month.month}`}
                className={`p-6 rounded-xl border ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {month.monthName}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("doctorReport.monthlyDistribution.totalShifts")}
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {month.totalShifts}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("doctorReport.monthlyDistribution.completedShifts")}
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {month.completedShifts}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("doctorReport.monthlyDistribution.workingHours")}
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {month.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance Records */}
        {report.attendanceRecords && report.attendanceRecords.length > 0 && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 mb-8`}
          >
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-6 flex items-center gap-3`}
            >
              <Activity
                className={`w-6 h-6 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
              {t("doctorReport.attendanceRecords.title")}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <th
                      className={`text-${
                        isRTL ? "right" : "left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("doctorReport.attendanceRecords.date")}
                    </th>
                    <th
                      className={`text-${
                        isRTL ? "right" : "left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("doctorReport.attendanceRecords.department")}
                    </th>
                    <th
                      className={`text-${
                        isRTL ? "right" : "left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("doctorReport.attendanceRecords.shiftType")}
                    </th>
                    <th
                      className={`text-${
                        isRTL ? "right" : "left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("doctorReport.attendanceRecords.timeIn")}
                    </th>
                    <th
                      className={`text-${
                        isRTL ? "right" : "left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("doctorReport.attendanceRecords.timeOut")}
                    </th>
                    <th
                      className={`text-${
                        isRTL ? "right" : "left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("doctorReport.attendanceRecords.workedHours")}
                    </th>
                    <th
                      className={`text-${
                        isRTL ? "right" : "left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("doctorReport.attendanceRecords.status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.attendanceRecords.map((record) => (
                    <tr
                      key={record.recordId}
                      className={`border-b ${
                        isDark
                          ? "border-gray-700 hover:bg-gray-750"
                          : "border-gray-200 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td
                        className={`p-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <div className="font-medium">
                          {formatDate(record.workDate)}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {currentLang === "en"
                            ? record.dayNameEn
                            : record.dayNameAr}
                        </div>
                      </td>
                      <td
                        className={`p-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {currentLang === "en"
                          ? record.departmentNameEn
                          : record.departmentNameAr}
                      </td>
                      <td
                        className={`p-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {currentLang === "en"
                          ? record.shiftTypeNameEn
                          : record.shiftTypeNameAr}
                      </td>
                      <td
                        className={`p-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {record.timeIn
                          ? new Date(record.timeIn).toLocaleTimeString(
                              currentLang,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </td>
                      <td
                        className={`p-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {record.timeOut
                          ? new Date(record.timeOut).toLocaleTimeString(
                              currentLang,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </td>
                      <td
                        className={`p-4 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {record.workedHours} {t("doctorReport.stats.hours")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                        {record.lateMinutes > 0 && (
                          <div
                            className={`text-xs mt-1 ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {record.lateMinutes}{" "}
                            {t("doctorReport.attendanceRecords.minutesLate")}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Roster Assignments */}
        <>
          {report.rosterAssignments && report.rosterAssignments.length > 0 && (
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-8 mb-8`}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6 flex items-center gap-3`}
              >
                <FileText
                  className={`w-6 h-6 ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
                {t("doctorReport.rosterAssignments.title")}
              </h2>

              <div className="space-y-6">
                {report.rosterAssignments.map((roster) => (
                  <CollapsibleRosterCard
                    key={roster.rosterId}
                    roster={roster}
                    isDark={isDark}
                    isRTL={isRTL}
                    currentLang={currentLang}
                    t={t}
                    formatDate={formatDate}
                    getAttendanceStatusColor={getAttendanceStatusColor}
                  />
                ))}
              </div>
            </div>
          )}
        </>

        {/* Leave and Swap Records Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Leave Records */}
          <LeaveRecordsSection
            report={report}
            isDark={isDark}
            isRTL={isRTL}
            currentLang={currentLang}
            t={t}
            formatDate={formatDate}
          />

          {/* Swap Records */}
          <SwapRecordsSection
            report={report}
            isDark={isDark}
            isRTL={isRTL}
            currentLang={currentLang}
            t={t}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  )
}

export default DoctorReports
