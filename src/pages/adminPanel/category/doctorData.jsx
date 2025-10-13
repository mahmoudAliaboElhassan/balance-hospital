import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { getDoctorData } from "../../../state/act/actUsers"
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Stethoscope,
  Award,
  UserCheck,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Building,
  FileText,
  Hash,
  Edit,
} from "lucide-react"
import LoadingGetData from "../../../components/LoadingGetData"

function DoctorData() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)

  const navigate = useNavigate()

  // Get data from Redux store - adjust these selectors based on your actual store structure

  const { loginRoleResponseDto } = useSelector((state) => state.auth)

  const userData = useSelector((state) => state.users.userData)
  const isLoading = useSelector((state) => state.users.loading.list)
  const error = useSelector((state) => state.users.error)

  const isRTL = i18n.language === "ar"
  const currentLang = i18n.language || "ar"
  const isDark = mymode === "dark"

  useEffect(() => {
    if (id) {
      dispatch(getDoctorData({ userId: id }))
    }
  }, [dispatch, id])

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return t("common.notAvailable")
    return new Intl.DateTimeFormat(currentLang, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  // Helper function to get status badge
  const getStatusBadge = (isActive, label) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full"
    if (isActive) {
      return (
        <span
          className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}
        >
          <CheckCircle size={12} className={`${isRTL ? "ml-1" : "mr-1"}`} />
          {label}
        </span>
      )
    }
    return (
      <span
        className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}
      >
        <XCircle size={12} className={`${isRTL ? "ml-1" : "mr-1"}`} />
        {t("common.notVerified")}
      </span>
    )
  }

  if (isLoading) {
    return <LoadingGetData text={t("gettingData.doctorData")} />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle
            className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? "text-red-400" : "text-red-500"
            }`}
          />
          <p className={`text-lg ${isDark ? "text-red-400" : "text-red-600"}`}>
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User
            className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            {t("users.doctorNotFound")}
          </p>
        </div>
      </div>
    )
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
            {t("users.doctorProfile")}
          </h1>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("users.doctorProfileDescription")}
          </p>
        </div>

        {/* Edit Button */}

        {(loginRoleResponseDto.roleNameEn == "System Administrator" ||
          loginRoleResponseDto.roleNameEn == "Category Head") && (
          <button
            onClick={() => navigate("edit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } shadow-lg hover:shadow-xl`}
          >
            <Edit className="w-4 h-4" />
            {t("common.edit")}
          </button>
        )}
      </div>

      {/* Doctor Profile Card */}
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-sm border ${
          isDark ? "border-gray-700" : "border-gray-200"
        } overflow-hidden`}
      >
        {/* Header with Doctor Basic Info */}
        <div
          className={`p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div
              className={`p-4 ${
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              } rounded-full`}
            >
              <User
                className={`h-12 w-12 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentLang === "en"
                      ? userData.nameEnglish
                      : userData.nameArabic}
                  </h2>

                  <div className="flex items-center gap-2 mt-2">
                    <Stethoscope
                      className={`h-4 w-4 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {currentLang === "en"
                        ? userData.roleNameEn
                        : userData.roleNameAr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Award
                      className={`h-4 w-4 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {currentLang === "en"
                        ? userData.scientificDegree?.nameEnglish
                        : userData.scientificDegree?.nameArabic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Building
                      className={`h-4 w-4 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {currentLang === "en"
                        ? userData.primaryCategory?.nameEnglish
                        : userData.primaryCategory?.nameArabic}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col gap-2">
                  {getStatusBadge(userData.isApproved, t("users.approved"))}
                  {getStatusBadge(
                    userData.isEmailVerified,
                    t("users.emailVerified")
                  )}
                  {userData.isProtected && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      <Shield
                        size={12}
                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                      />
                      {t("users.protected")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("users.personalInformation")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("email")}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {userData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("mobile")}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {userData.mobile}
                      {userData.isMobileVerified && (
                        <CheckCircle className="inline h-3 w-3 ml-1 text-green-500" />
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("nationalId")}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {userData.nationalId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("users.printNumber")}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {userData.printNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("users.professionalInformation")}
              </h3>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <h4
                    className={`text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("users.contractingType")}
                  </h4>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentLang === "en"
                      ? userData.contractingType?.nameEnglish
                      : userData.contractingType?.nameArabic}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs">
                    <span
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("users.maxHoursPerWeek")}:{" "}
                      {userData.contractingType?.maxHoursPerWeek}h
                    </span>
                    <span
                      className={`${
                        userData.contractingType?.allowOvertimeHours
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {userData.contractingType?.allowOvertimeHours
                        ? t("users.overtimeAllowed")
                        : t("users.noOvertime")}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <h4
                    className={`text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("users.primaryCategory")}
                  </h4>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentLang === "en"
                      ? userData.primaryCategory?.nameEnglish
                      : userData.primaryCategory?.nameArabic}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("users.code")}: {userData.primaryCategory?.code}
                  </p>
                  {userData.primaryCategory?.description && (
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {userData.primaryCategory.description}
                    </p>
                  )}
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <h4
                    className={`text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("users.scientificDegree")}
                  </h4>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentLang === "en"
                      ? userData.scientificDegree?.nameEnglish
                      : userData.scientificDegree?.nameArabic}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("users.code")}: {userData.scientificDegree?.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity & System Information */}
          <div className="mt-8">
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("users.activityInformation")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock
                    className={`h-4 w-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("users.totalLoginCount")}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {userData.totalLoginCount || 0}
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar
                    className={`h-4 w-4 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("roster.details.createdAt")}
                  </span>
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatDate(userData.createdAt)}
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck
                    className={`h-4 w-4 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("roster.details.approvedAt")}
                  </span>
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatDate(userData.approvedAt)}
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User
                    className={`h-4 w-4 ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("users.approvedBy")}
                  </span>
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {userData.approvedByName || t("common.notAvailable")}
                </div>
              </div>
            </div>
          </div>

          {/* Last Activity */}
          {(userData.lastLoginAt || userData.lastPasswordChangeAt) && (
            <div className="mt-8">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("users.lastActivity")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.lastLoginAt && (
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? "bg-gray-700/30 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock
                        className={`h-4 w-4 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("users.lastLogin")}
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {formatDate(userData.lastLoginAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {userData.lastPasswordChangeAt && (
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? "bg-gray-700/30 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield
                        className={`h-4 w-4 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("users.lastPasswordChange")}
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {formatDate(userData.lastPasswordChangeAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorData
