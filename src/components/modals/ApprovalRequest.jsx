import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { X, CheckCircle, User, Building, Clock, Timer } from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import i18next from "i18next"
import {
  approveRequest,
  getDoctorsRequests,
} from "../../state/act/actRosterManagement"
import { useParams } from "react-router-dom"

const ApproveRequestModal = ({ isOpen, onClose, request, status }) => {
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)
  const { id } = useParams()
  const [processedNotes, setProcessedNotes] = useState("")
  const [error, setError] = useState("")

  const isDark = mymode === "dark"
  const isRTL = i18n.language === "ar"
  const currentLang = i18n.language || "ar"
  const dispatch = useDispatch()

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
      approveRequest({
        requestId: request.id,
        processedNotes: processedNotes.trim(),
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          t("doctorRequests.approve.success", {
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
                "Failed to approve request") +
              (error?.errors?.[0] ? " " + error.errors[0] : "")
            : (error?.messageAr ||
                error?.message ||
                "فشل في الموافقة على الطلب") +
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("doctorRequests.approve.title")}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading.approveRequest}
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
              {t("doctorRequests.approve.confirmMessage")}
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
          </div>

          {/* Processed Notes Field */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("doctorRequests.approve.processedNotes")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={processedNotes}
              onChange={(e) => {
                setProcessedNotes(e.target.value)
                if (error) setError("")
              }}
              placeholder={t("doctorRequests.approve.notesPlaceholder")}
              rows={3}
              disabled={loading.approveRequest}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
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
              disabled={loading.approveRequest}
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
              disabled={loading.approveRequest || !processedNotes.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading.approveRequest && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {t("doctorRequests.approve.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApproveRequestModal
