import i18next from "i18next"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { X, AlertTriangle } from "lucide-react"
import { deleteRoster } from "../../state/act/actRosterManagement"

function ModalDeleteRoster({ toDelete, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.rosterManagement)
  const { mymode } = useSelector((state) => state.mode)
  const { t } = useTranslation()

  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const isDark = mymode === "dark"
  const currentLang = i18next.language
  const isRTL = currentLang === "ar"

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!reason.trim()) {
      setError(t("roster.delete.reasonRequired"))
      return
    }

    try {
      await dispatch(
        deleteRoster({
          rosterId: toDelete.id,
          reason: reason.trim(),
        })
      ).unwrap()

      toast.success(t("roster.delete.success", { name: toDelete.name }), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      handleClose()
    } catch (error) {
      console.error("Roster deletion error:", error)
      handleClose()

      const message = error.errors[0]

      Swal.fire({
        title: t("roster.delete.error.title"),
        text: message,
        icon: "error",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#ef4444",
        background: isDark ? "#2d2d2d" : "#ffffff",
        color: isDark ? "#f0f0f0" : "#111827",
        customClass: {
          popup: isDark ? "swal2-dark-popup" : "",
        },
      })
    }
  }

  const handleClose = () => {
    setReason("")
    setError("")
    onClose()
  }

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
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.delete.title")}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading?.delete}
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
              {t("roster.delete.confirmMessage")}
            </p>

            {toDelete && (
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
                  {toDelete.name}
                </p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("roster.delete.reason")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError("")
              }}
              placeholder={t("roster.delete.reasonPlaceholder")}
              rows={3}
              disabled={loading?.delete}
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              } ${
                error ? "border-red-500" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p
              className={`mt-1 text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {reason.length}/500 {t("roster.delete.charactersCount")}
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading?.delete}
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
              disabled={loading?.delete || !reason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading?.delete && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {t("roster.delete.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalDeleteRoster
