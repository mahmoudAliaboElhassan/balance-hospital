import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  X,
  Ban,
  User,
  Building,
  Clock,
  Timer,
  AlertTriangle,
} from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import i18next from "i18next"
import {
  getDoctorsRequests,
  rejectRequest,
} from "../../state/act/actRosterManagement"
import { useParams } from "react-router-dom"

const RejectRequestModal = ({ isOpen, onClose, request, status }) => {
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)
  const [processedNotes, setProcessedNotes] = useState("")
  const [error, setError] = useState("")

  const isDark = mymode === "dark"
  const isRTL = i18n.language === "ar"
  const currentLang = i18n.language || "ar"
  const dispatch = useDispatch()
  const { id } = useParams()

  const { loading } = useSelector((state) => state.rosterManagement)

  const formatTime = (timeString) => {
    if (!timeString) return "-"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
      i18n.language,
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!processedNotes.trim()) {
      setError(t("doctorRequests.notesRequired"))
      return
    }

    if (processedNotes.trim().length < 3) {
      setError(t("doctorRequests.notesTooShort"))
      return
    }

    dispatch(
      rejectRequest({
        requestId: request.id,
        processedNotes: processedNotes.trim(),
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          t("doctorRequests.reject.success", {
            doctorName:
              currentLang === "en"
                ? request.doctorName
                : request.doctorNameArabic,
          }),
          {
            position: "top-right",
            autoClose: 3000,
          }
        )
        dispatch(getDoctorsRequests({ status, rosterId: id }))

        handleClose()
      })
      .catch((error) => {
        handleClose()
        console.log("error from catch", error)

        const message =
          i18next.language === "en"
            ? (error?.messageEn ||
                error?.message ||
                "Failed to reject request") +
              (error?.errors?.[0] ? " " + error.errors[0] : "")
            : (error?.messageAr || error?.message || "فشل في رفض الطلب") +
              (error?.errors?.[0] ? " " + error.errors[0] : "")

        Swal.fire({
          title: message,
          icon: "error",
          confirmButtonText: t("common.ok"),
          background: isDark ? "#2d2d2d" : "#ffffff",
          color: isDark ? "#f0f0f0" : "#111111",
          confirmButtonColor: isDark ? "#4f83cc" : "#3085d6",
          customClass: {
            popup: isDark ? "swal2-dark-popup" : "",
          },
        })
      })
  }

  const handleClose = () => {
    setProcessedNotes("")
    setError("")
    onClose()
  }

  if (!isOpen || !request) return null

  return (
    <div>
      <div style={{ height: "30px" }}></div>
      <div
        className="fixed inset-0 bg-black h-full bg-opacity-50 flex items-center justify-center p-4 z-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className={`max-w-md w-full rounded-lg shadow-xl ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("doctorRequests.reject.title")}
              </h3>
            </div>
            <button
              onClick={handleClose}
              disabled={loading.rejectRequest}
              className={`p-1 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              } disabled:opacity-50`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <p
                className={`text-sm mb-3 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("doctorRequests.reject.confirmMessage")}
              </p>

              {/* Request Details */}
              <div
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {/* Doctor Name */}
                <div className="flex items-center gap-2 mb-3">
                  <User
                    className={`h-4 w-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <p
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentLang === "en"
                      ? request.doctorName
                      : request.doctorNameArabic}
                  </p>
                </div>

                {/* Department and Shift */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Building
                      className={`h-4 w-4 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("doctorRequests.fields.department")}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {request.departmentName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Timer
                      className={`h-4 w-4 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("doctorRequests.fields.shift")}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {request.shiftTypeName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time and Hours */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock
                      className={`h-4 w-4 ${
                        isDark ? "text-orange-400" : "text-orange-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("doctorRequests.fields.time")}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formatTime(request.startTime)} -{" "}
                        {formatTime(request.endTime)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("doctorRequests.fields.hours")}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {request.shiftHours}h
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <AlertTriangle
                  className={`h-4 w-4 mt-0.5 ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                />
                <p
                  className={`text-sm ${
                    isDark ? "text-red-300" : "text-red-700"
                  }`}
                >
                  {t("doctorRequests.reject.warning")}
                </p>
              </div>
            </div>

            {/* Processed Notes Field */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("doctorRequests.reject.processedNotes")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={processedNotes}
                onChange={(e) => {
                  setProcessedNotes(e.target.value)
                  if (error) setError("")
                }}
                placeholder={t("doctorRequests.reject.notesPlaceholder")}
                rows={3}
                disabled={loading.rejectRequest}
                className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                  isDark
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                } ${
                  error ? "border-red-500" : ""
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                dir={isRTL ? "rtl" : "ltr"}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading.rejectRequest}
                className={`px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading.rejectRequest || !processedNotes.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading.rejectRequest && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {t("doctorRequests.reject.confirm")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RejectRequestModal
