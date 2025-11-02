import i18next from "i18next"
import React, { use, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { X, Edit3 } from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import {
  getRostersPaged,
  updateRosterStatus,
} from "../../state/act/actRosterManagement"
import UseRosterStatus from "../../hooks/use-roster-status"

const ModalUpdateRosterStatus = ({
  statusToUpdate,
  setStatusModalOpen,
  setStatusToUpdate,
}) => {
  const dispatch = useDispatch()
  const { mymode } = useSelector((state) => state.mode)
  const { loading } = useSelector((state) => state.rosterManagement || {})
  const { t } = useTranslation()
  const { rosterStatus } = UseRosterStatus()

  const isDark = mymode === "dark"
  const isRTL = i18next.language === "ar"

  const [selectedStatus, setSelectedStatus] = useState(
    statusToUpdate.currentStatus
  )
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedStatus) {
      setError(t("roster.error.statusRequired"))
      return
    }

    try {
      const updateData = {
        newStatus: selectedStatus,
        reason: reason || t("roster.defaultUpdateReason"),
      }

      await dispatch(
        updateRosterStatus({
          rosterId: statusToUpdate.id,
          updateData,
        })
      ).unwrap()

      // Success handling
      toast.success(t("roster.success.statusUpdated"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      dispatch(getRostersPaged())
      handleClose()
    } catch (error) {
      console.error("Status update error:", error)
      handleClose()

      // Choose the right language message
      const message =
        i18next.language === "en"
          ? error?.messageEn + " " + (error.errors?.[0] || "")
          : error?.message + " " + (error.errors?.[0] || "")

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
    }
  }

  const handleClose = () => {
    setSelectedStatus(statusToUpdate.currentStatus)
    setReason("")
    setError("")
    setStatusModalOpen(false)
    setStatusToUpdate({
      id: null,
      title: "",
      currentStatus: "",
    })
  }

  const isOpen = statusToUpdate.id !== null

  if (!isOpen) return null

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
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.actions.updateStatus")}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading?.update}
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
              className={`text-sm mb-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("roster.updateStatusFor")}:
            </p>

            <div
              className={`p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {statusToUpdate.title}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("roster.filters.status")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                if (error) setError("")
              }}
              disabled={loading?.update}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } ${
                error ? "border-red-500" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {rosterStatus.map(({ value, label }) => (
                <option
                  key={value}
                  value={value}
                  disabled={value === statusToUpdate.currentStatus}
                >
                  {label}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("roster.phaseOne.fields.reason")}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("roster.phaseOne.placeholders.updateReason")}
              rows={3}
              disabled={loading?.update}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              maxLength={500}
            />
            <p
              className={`mt-1 text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {reason.length}/500 {t("roster.phaseOne.charactersCount")}
            </p>
          </div>

          <div
            className={`flex gap-3 ${isRTL ? "justify-start" : "justify-end"}`}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={loading?.update}
              className={`px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("roster.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading?.update || !selectedStatus}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading?.update && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading?.update
                ? t("roster.actions.updating")
                : t("roster.actions.update")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalUpdateRosterStatus
