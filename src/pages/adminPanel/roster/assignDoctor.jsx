import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import {
  ArrowLeft,
  UserPlus,
  X,
  Search,
  AlertCircle,
  CheckCircle,
  Users,
  Briefcase,
  Award,
  Calendar,
  Save,
  Building,
  Clock,
} from "lucide-react"
import * as Yup from "yup"
import {
  assignDoctorToShift,
  getAvailableDoctorsForShift,
  getWorkingHour,
} from "../../../state/act/actRosterManagement"
import LoadingGetData from "../../../components/LoadingGetData"
import { formatDate } from "../../../utils/formtDate"

// Constants
const MAX_NOTES_LENGTH = 500
const WORKLOAD_THRESHOLDS = {
  HIGH: 90,
  MEDIUM: 70,
}

// Helper functions
const getDoctorStatusColor = (doctor, isDark) => {
  if (!doctor.isAvailable) {
    return isDark ? "bg-red-900/20 text-red-400" : "bg-red-100 text-red-800"
  }
  if (doctor.hasConflict) {
    return isDark
      ? "bg-yellow-900/20 text-yellow-400"
      : "bg-yellow-100 text-yellow-800"
  }
  return isDark
    ? "bg-green-900/20 text-green-400"
    : "bg-green-100 text-green-800"
}

const getDoctorStatusIcon = (doctor) => {
  if (!doctor.isAvailable) return <X size={14} />
  if (doctor.hasConflict) return <AlertCircle size={14} />
  return <CheckCircle size={14} />
}

const getWorkloadColor = (percentage) => {
  if (percentage > WORKLOAD_THRESHOLDS.HIGH) return "text-red-500 bg-red-500"
  if (percentage > WORKLOAD_THRESHOLDS.MEDIUM)
    return "text-yellow-500 bg-yellow-500"
  return "text-green-500 bg-green-500"
}

// Sub-components
const DoctorAvatar = ({ doctor, isDark }) => {
  if (doctor.profileImageUrl) {
    return (
      <img
        src={doctor.profileImageUrl}
        alt=""
        className="w-10 h-10 rounded-full object-cover"
      />
    )
  }

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isDark ? "bg-gray-600" : "bg-gray-200"
      }`}
    >
      <Users size={20} className={isDark ? "text-gray-400" : "text-gray-500"} />
    </div>
  )
}

const WorkloadIndicator = ({ doctor, isDark, t }) => {
  const workloadPercentage = doctor.workloadPercentage || 0
  const colorClasses = getWorkloadColor(workloadPercentage)

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className={isDark ? "text-gray-400" : "text-gray-500"}>
          {t("roster.assign.workload")}
        </span>
        <span className={`font-medium ${colorClasses.split(" ")[0]}`}>
          {workloadPercentage.toFixed(1)}%
        </span>
      </div>
      <div
        className={`w-full rounded-full h-1.5 mt-1 ${
          isDark ? "bg-gray-600" : "bg-gray-200"
        }`}
      >
        <div
          className={`h-1.5 rounded-full ${colorClasses.split(" ")[1]}`}
          style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
        />
      </div>
      <div
        className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        {doctor.currentMonthAssignments} {t("roster.assign.assignments")} •{" "}
        {doctor.currentMonthHours} {t("roster.assign.hours")}
      </div>
    </div>
  )
}

const ConflictDetails = ({
  doctor,
  showConflictDetails,
  onToggle,
  isDark,
  t,
}) => {
  if (!doctor.hasConflict || !doctor.conflictDetails?.length) return null

  const confilcts =
    i18next.language === "en"
      ? doctor.conflictDetails
      : doctor.conflictDetailsAr
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onToggle}
        className={`text-xs underline ${
          isDark
            ? "text-yellow-400 hover:text-yellow-300"
            : "text-yellow-600 hover:text-yellow-700"
        }`}
      >
        {showConflictDetails
          ? t("roster.assign.hideConflicts")
          : t("roster.assign.showConflicts")}
      </button>
      {showConflictDetails && (
        <div
          className={`mt-1 p-2 rounded text-xs ${
            isDark
              ? "bg-yellow-900/20 text-yellow-400"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {confilcts.map((conflict, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 rtl:space-x-reverse"
            >
              <AlertCircle size={12} />
              <span>{conflict}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const DoctorCard = ({
  doctor,
  isSelected,
  onSelect,
  showConflictDetails,
  onToggleConflicts,
  isDark,
  currentLang,
  isRTL,
  t,
}) => {
  const handleClick = useCallback(() => {
    onSelect(doctor)
  }, [doctor, onSelect])

  const handleToggleConflicts = useCallback(
    (e) => {
      e.stopPropagation()
      onToggleConflicts(doctor.doctorId)
    },
    [doctor.doctorId, onToggleConflicts]
  )

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected
          ? isDark
            ? "border-blue-500 bg-blue-900/20"
            : "border-blue-500 bg-blue-50"
          : isDark
          ? "border-gray-600 hover:border-gray-500 bg-gray-700"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 rtl:space-x-reverse flex-1">
          <div className="flex-shrink-0">
            <DoctorAvatar doctor={doctor} isDark={isDark} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
              <h3
                className={`font-medium truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {currentLang === "ar"
                  ? doctor.doctorNameArabic
                  : doctor.doctorName}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDoctorStatusColor(
                  doctor,
                  isDark
                )}`}
              >
                {getDoctorStatusIcon(doctor)}
                <span className={isRTL ? "mr-1" : "ml-1"}>
                  {doctor.isAvailable
                    ? doctor.hasConflict
                      ? t("roster.assign.status.conflict")
                      : t("roster.assign.status.available")
                    : t("roster.assign.status.unavailable")}
                </span>
              </span>
            </div>

            <div
              className={`text-sm space-y-1 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Briefcase size={14} />
                <span>{doctor.specialty}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Award size={14} />
                <span>{doctor.scientificDegreeName}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar size={14} />
                <span>{doctor.contractingTypeName}</span>
              </div>
            </div>

            <WorkloadIndicator doctor={doctor} isDark={isDark} t={t} />

            <ConflictDetails
              doctor={doctor}
              showConflictDetails={showConflictDetails[doctor.doctorId]}
              onToggle={handleToggleConflicts}
              isDark={isDark}
              t={t}
            />

            {doctor.priorityScore && (
              <div className="mt-2">
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t("roster.assign.priorityScore")}: {doctor.priorityScore}/100
                </div>
                {doctor.priorityReason && (
                  <div
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {doctor.priorityReason}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
          <Field
            type="radio"
            name="doctorId"
            value={doctor.doctorId}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
          />
        </div>
      </div>
    </div>
  )
}

const EmptyState = ({ searchTerm, isDark, t }) => (
  <div
    className={`text-center py-8 border-2 border-dashed rounded-lg ${
      isDark ? "border-gray-600 bg-gray-700/50" : "border-gray-300 bg-gray-50"
    }`}
  >
    <Users
      size={48}
      className={`mx-auto mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
    />
    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
      {searchTerm
        ? t("roster.assign.noDoctorsFound")
        : t("roster.assign.noAvailableDoctors")}
    </p>
  </div>
)

const ShiftInfo = ({ workingHour, isDark, isRTL, t }) => {
  if (!workingHour) return null

  // Format date

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "-"
    const time = new Date(timeString)
    return time.toLocaleTimeString(isRTL ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Extract shift and department info from the nested structure
  const shift = workingHour.shift || {}
  const department = workingHour.department || {}
  const contractingType = workingHour.contractingType || {}
  const currentLang = i18next.language
  return (
    <div
      className={`rounded-lg border p-4 mb-6 ${
        isDark ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-start space-x-4 rtl:space-x-reverse">
        <div
          className={`p-3 rounded-lg ${
            isDark ? "bg-blue-900/20" : "bg-blue-50"
          }`}
        >
          <Clock className="w-6 h-6 text-blue-600" />
        </div>

        <div className="flex-1">
          <h3
            className={`text-lg font-medium ${
              isDark ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            {t("roster.assign.shiftDetails")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Shift Date */}
            <div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("common.date")}
              </div>
              <div
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {formatDate(workingHour.shiftDate)}
              </div>
              {workingHour.dayOfWeekName && (
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {workingHour.dayOfWeekName}
                </div>
              )}
            </div>

            {/* Shift Time */}
            <div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("adminPanel.shiftHours")}
              </div>
              <div
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </div>
              {shift.name && (
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {shift.name}
                </div>
              )}
            </div>

            {/* Department */}
            <div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("common.department")}
              </div>
              <div
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {currentLang === "en"
                  ? department.nameArabic
                  : department.nameEnglish}
              </div>
            </div>

            {/* Doctor Capacity */}
            <div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("roster.capacity")}
              </div>
              <div
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {workingHour.currentAssignedDoctors || 0}/
                {workingHour.requiredDoctors || 0} {t("roster.assign.doctors")}
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {workingHour.fillPercentage || 0}% {t("roster.filled")}
              </div>
            </div>

            {/* Shift Duration */}
            <div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("roster.table.period")}
              </div>
              <div
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {shift.hours || 0} h
              </div>
              {shift.period && (
                <div
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {shift.period}
                </div>
              )}
            </div>

            {/* Contract Type */}
            <div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("roster.contractingTypes.fields.contractingTypes")}
              </div>
              <div
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {currentLang == "ar"
                  ? contractingType.nameArabic
                  : contractingType.nameEnglish}
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2 mt-4">
            {workingHour.isFullyBooked && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isDark
                    ? "bg-red-900/20 text-red-400 border border-red-800"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {t("roster.fullyBooked")}
              </span>
            )}

            {workingHour.isOverBooked && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isDark
                    ? "bg-orange-900/20 text-orange-400 border border-orange-800"
                    : "bg-orange-100 text-orange-800 border border-orange-200"
                }`}
              >
                {t("roster.overBooked")}
              </span>
            )}

            {workingHour.remainingSlots > 0 && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isDark
                    ? "bg-green-900/20 text-green-400 border border-green-800"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
              >
                {workingHour.remainingSlots} {t("roster.remainingSlots")}
              </span>
            )}
          </div>

          {/* Notes */}
          {workingHour.notes && (
            <div className="mt-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20">
              <div
                className={`text-sm font-medium ${
                  isDark ? "text-blue-400" : "text-blue-800"
                } mb-1`}
              >
                {t("roster.assign.notes")}
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-blue-300" : "text-blue-700"
                }`}
              >
                {workingHour.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
// Main component
function AssignDoctor() {
  const { workingHourId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, availableDoctorsForShift, errors, workingHour } =
    useSelector((state) => state.rosterManagement)
  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  const { t } = useTranslation()
  const currentLang = i18next.language
  const isRTL = currentLang === "ar"

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showConflictDetails, setShowConflictDetails] = useState({})

  // Validation schema
  const validationSchema = useMemo(
    () =>
      Yup.object({
        doctorId: Yup.number()
          .required(t("roster.assign.validation.doctorRequired"))
          .positive(t("roster.assign.validation.doctorInvalid")),
        notes: Yup.string()
          .max(MAX_NOTES_LENGTH, t("roster.assign.validation.notesMaxLength"))
          .nullable(),
        overrideConflicts: Yup.boolean(),
      }),
    [t]
  )

  const initialValues = useMemo(
    () => ({
      doctorId: "",
      notes: "",
      overrideConflicts: false,
    }),
    []
  )

  // Fetch working hour details and available doctors when component mounts
  useEffect(() => {
    if (workingHourId) {
      dispatch(getWorkingHour({ workingHourId }))
      dispatch(
        getAvailableDoctorsForShift({
          workingHourId: workingHourId,
        })
      )
    }
  }, [dispatch, workingHourId])

  // Filter doctors based on search term
  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return availableDoctorsForShift

    const searchLower = searchTerm.toLowerCase()
    return availableDoctorsForShift.filter((doctor) => {
      const doctorName = (doctor.doctorName || "").toLowerCase()
      const doctorNameArabic = (doctor.doctorNameArabic || "").toLowerCase()
      const specialty = (doctor.specialty || "").toLowerCase()

      return (
        doctorName.includes(searchLower) ||
        doctorNameArabic.includes(searchLower) ||
        specialty.includes(searchLower)
      )
    })
  }, [availableDoctorsForShift, searchTerm])

  const showSweetAlert = useCallback(
    (options) => {
      return Swal.fire({
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
        ...options,
      })
    },
    [isDark]
  )

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        const assignmentData = {
          doctorId: parseInt(values.doctorId),
          workingHoursId: parseInt(workingHourId),
          notes: values.notes || "",
          overrideConflicts: values.overrideConflicts,
        }

        await dispatch(assignDoctorToShift(assignmentData)).unwrap()

        toast.success(t("roster.assign.success.assigned"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        navigate(-1) // Go back to previous page
      } catch (error) {
        console.error("Doctor assignment error:", error)

        if (error?.status === 409) {
          const result = await showSweetAlert({
            title: t("roster.assign.conflict.title"),
            text:
              currentLang === "en"
                ? error?.errors[0] || t("roster.assign.conflict.message")
                : error?.errors[0] || t("roster.assign.conflict.message"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("roster.assign.conflict.override"),
            cancelButtonText: t("common.cancel"),
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
          })

          if (result.isConfirmed) {
            values.overrideConflicts = true
            return handleSubmit(values, { setSubmitting })
          }
        } else {
          await showSweetAlert({
            title: t("roster.assign.error.title"),
            text:
              currentLang === "en"
                ? error?.errors[0] ||
                  error?.message ||
                  t("roster.assign.error.message")
                : error?.errors[0] ||
                  error?.message ||
                  t("roster.assign.error.message"),
            icon: "error",
            confirmButtonText: t("common.ok"),
            confirmButtonColor: "#ef4444",
          })
        }
      } finally {
        setSubmitting(false)
      }
    },
    [dispatch, workingHourId, navigate, t, currentLang, showSweetAlert]
  )

  const handleDoctorSelect = useCallback((doctor, setFieldValue) => {
    setSelectedDoctor(doctor)
    setFieldValue("doctorId", doctor.doctorId)
  }, [])

  const toggleConflictDetails = useCallback((doctorId) => {
    setShowConflictDetails((prev) => ({
      ...prev,
      [doctorId]: !prev[doctorId],
    }))
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  if (loading?.fetch || loading?.availableDoctors) {
    return (
      <LoadingGetData
        text={
          loading?.fetch
            ? t("gettingData.workingHour")
            : t("gettingData.availableDoctors")
        }
      />
    )
  }

  if (errors.workingHours || errors.availableDoctors) {
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
                {/* {errors.workingHours || errors.availableDoctors} */}
              </div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={16} className={isRTL ? "ml-2" : "mr-2"} />
                {t("common.goBack")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                  : "border-gray-300 hover:bg-gray-50 text-gray-700"
              } ${isRTL ? "ml-4" : "mr-4"}`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.assign.title")}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                {t("roster.assign.subtitle")}
              </p>
            </div>
          </div>

          {/* Shift Information */}
          <ShiftInfo
            workingHour={workingHour}
            isDark={isDark}
            isRTL={isRTL}
            t={t}
          />
        </div>

        {/* Form */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Search Bar */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      {t("roster.assign.searchDoctors")}
                    </label>

                    <div className="flex items-center gap-2">
                      {/* Search Icon Container - Completely separate from input */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
                          isDark
                            ? "border-gray-600 bg-gray-700 text-gray-400"
                            : "border-gray-300 bg-white text-gray-500"
                        }`}
                      >
                        <Search size={18} />
                      </div>

                      {/* Input Container */}
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder={t("roster.assign.searchPlaceholder")}
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className={`w-full px-4 py-2 border rounded-lg text-sm ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Available Doctors List */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } mb-3`}
                    >
                      {t("roster.assign.selectDoctor")} *
                    </label>

                    <div className="max-h-96 overflow-y-auto">
                      {filteredDoctors.length === 0 ? (
                        <EmptyState
                          searchTerm={searchTerm}
                          isDark={isDark}
                          t={t}
                        />
                      ) : (
                        <div className="space-y-3">
                          {filteredDoctors.map((doctor) => (
                            <DoctorCard
                              key={doctor.doctorId}
                              doctor={doctor}
                              isSelected={
                                selectedDoctor?.doctorId === doctor.doctorId
                              }
                              onSelect={(doctor) =>
                                handleDoctorSelect(doctor, setFieldValue)
                              }
                              showConflictDetails={showConflictDetails}
                              onToggleConflicts={toggleConflictDetails}
                              isDark={isDark}
                              currentLang={currentLang}
                              isRTL={isRTL}
                              t={t}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Doctor Selection Error */}
                    <ErrorMessage
                      name="doctorId"
                      component="div"
                      className="text-sm text-red-600 mt-2"
                    />
                  </div>

                  {/* Notes Section */}
                  <div>
                    <label
                      htmlFor="notes"
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.assign.fields.notes")}
                    </label>
                    <Field
                      as="textarea"
                      id="notes"
                      name="notes"
                      rows={3}
                      dir={isRTL ? "rtl" : "ltr"}
                      className={`w-full px-3 py-2 border rounded-lg text-sm resize-vertical ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder={t("roster.assign.placeholders.notes")}
                    />
                    <ErrorMessage
                      name="notes"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                    <p
                      className={`mt-1 text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {values.notes?.length || 0}/{MAX_NOTES_LENGTH}{" "}
                      {t("roster.assign.charactersCount")}
                    </p>
                  </div>

                  {/* Override Conflicts Checkbox */}
                  <div
                    className={`p-3 border rounded-lg ${
                      isDark
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <label
                          htmlFor="overrideConflicts"
                          className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("roster.assign.fields.overrideConflicts")}
                        </label>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("roster.assign.fields.overrideConflictsHelp")}
                        </p>
                      </div>
                      <Field
                        type="checkbox"
                        id="overrideConflicts"
                        name="overrideConflicts"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <X size={16} className={isRTL ? "ml-2" : "mr-2"} />
                      {t("common.cancel")}
                    </button>

                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        loading?.assignDoctor ||
                        !values.doctorId
                      }
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || loading?.assignDoctor ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 rtl:mr-0 rtl:ml-2" />
                          {t("roster.assign.buttons.assigning")}
                        </>
                      ) : (
                        <>
                          <UserPlus
                            size={16}
                            className={isRTL ? "ml-2" : "mr-2"}
                          />
                          {t("roster.assign.buttons.assignDoctor")}
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignDoctor
