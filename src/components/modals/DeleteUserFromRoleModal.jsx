// components/DeleteUserFromRoleModal.jsx
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { X, AlertTriangle, User, Phone, Tag, UserCheck } from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { removeRoleFromUser } from "../../state/act/actManagementRole"
import i18next from "i18next"

const DeleteUserFromRoleModal = ({
  isOpen,
  onClose,
  user,
  role,
  onSuccess,
}) => {
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const isDark = mymode === "dark"
  const isRTL = i18n.language === "ar"
  const language = i18n.language
  const dispatch = useDispatch()

  const { loading: loadingStates } = useSelector(
    (state) => state.managementRoles
  )
  const loadingRemoveUser = loadingStates?.assign || false

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!reason.trim()) {
      setError(
        t("managementRoles.users.delete.reasonRequired") || "Reason is required"
      )
      return
    }

    dispatch(
      removeRoleFromUser({
        userId: user.id,
        removeReason: reason,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          t("managementRoles.users.removeSuccess", {
            userName: language === "ar" ? user.nameArabic : user.nameEnglish,
            roleName: language === "ar" ? role.roleNameAr : role.roleNameEn,
          }) ||
            `User "${
              language === "ar" ? user.nameArabic : user.nameEnglish
            }" removed from role "${
              language === "ar" ? role.roleNameAr : role.roleNameEn
            }" successfully`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        )
        handleClose()
        // Call the success callback to refresh data
        if (onSuccess) {
          onSuccess()
        }
      })
      .catch((error) => {
        handleClose()
        console.log("error from catch", error)

        // Choose the right language message
        const message =
          i18next.language === "en"
            ? (error?.messageEn ||
                error?.message ||
                "Failed to remove user from role") +
              (error?.errors?.length > 0 ? " " + error.errors[0] : "")
            : (error?.message ||
                error?.messageAr ||
                "فشل في إزالة المستخدم من الدور") +
              (error?.errors?.length > 0 ? " " + error.errors[0] : "")

        Swal.fire({
          title: message,
          icon: "error",
          confirmButtonText: t("common.ok") || "OK",

          // Style overrides:
          background: isDark ? "#2d2d2d" : "#ffffff",
          color: isDark ? "#f0f0f0" : "#111111",
          confirmButtonColor: isDark ? "#4f83cc" : "#3085d6",

          // Optionally tweak the popup shadow/border:
          customClass: {
            popup: isDark ? "swal2-dark-popup" : "",
          },
        })
      })
  }

  const handleClose = () => {
    setReason("")
    setError("")
    onClose()
  }

  if (!isOpen || !user || !role) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`max-w-md w-full mx-auto rounded-lg shadow-xl ${
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3
              className={`text-lg font-semibold truncate ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("managementRoles.users.delete.title") ||
                "Remove User from Role"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loadingRemoveUser}
            className={`flex-shrink-0 p-1 ml-3 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            } disabled:opacity-50`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <p
              className={`text-sm mb-3 sm:mb-4 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("managementRoles.users.delete.confirmMessage") ||
                "Are you sure you want to remove this user from the role? This action cannot be undone."}
            </p>
          </div>

          {/* Reason Input */}
          <div className="mb-4 sm:mb-6">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("managementRoles.users.delete.reason") || "Reason"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError("")
              }}
              placeholder={
                t("managementRoles.users.delete.reasonPlaceholder") ||
                "Please provide a reason for removing this user from the role..."
              }
              rows={3}
              disabled={loadingRemoveUser}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-sm sm:text-base ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              } ${
                error ? "border-red-500" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {error && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Warning */}
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border-l-4 border-yellow-500 ${
              isDark ? "bg-yellow-900/20" : "bg-yellow-50"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    isDark ? "text-yellow-400" : "text-yellow-400"
                  }`}
                />
              </div>
              <div className="ml-2 sm:ml-3">
                <p
                  className={`text-xs sm:text-sm ${
                    isDark ? "text-yellow-200" : "text-yellow-800"
                  }`}
                >
                  {t("managementRoles.users.delete.warning") ||
                    "Warning: Removing this user from the role will revoke all associated permissions immediately."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loadingRemoveUser}
              className={`w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("common.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loadingRemoveUser || !reason.trim()}
              className="w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loadingRemoveUser && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {t("managementRoles.users.delete.confirm") || "Remove User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteUserFromRoleModal
