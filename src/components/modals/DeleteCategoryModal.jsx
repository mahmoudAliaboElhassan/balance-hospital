import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { X, AlertTriangle } from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { deleteCategory } from "../../state/act/actCategory"
import { useNavigate } from "react-router-dom"
import i18next from "i18next"

const DeleteCategoryModal = ({
  isOpen,
  onClose,
  info,
  category,
  loading = false,
}) => {
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const isDark = mymode === "dark"
  const navigate = useNavigate()
  const isRTL = i18n.language === "ar"
  const dispatch = useDispatch()
  const { loadingDeleteCategory } = useSelector((state) => state.category)
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!reason.trim()) {
      setError(t("categories.delete.reasonRequired"))
      return
    }
    dispatch(
      deleteCategory({
        categoryId: info.id,
        reason,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(t("categories.deleteSuccess", { name: info.name }), {
          position: "top-right",
          autoClose: 3000,
        })
        handleClose()
        navigate("/admin-panel/categories")
      })
      .catch((error) => {
        handleClose()
        console.log("erorr from catch", error)

        // choose the right language message
        const message =
          i18next.language === "en"
            ? error?.messageEn + " " + error.errors[0]
            : error?.message + " " + error.errors[0]

        Swal.fire({
          title: message,
          icon: "error",
          confirmButtonText: t("common.ok"),

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
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("categories.delete.title")}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
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
              {t("categories.delete.confirmMessage")}
            </p>

            {category && (
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
                  {category.nameArabic}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {category.nameEnglish} - {category.code}
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
              {t("categories.delete.reason")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError("")
              }}
              placeholder={t("categories.delete.reasonPlaceholder")}
              rows={3}
              disabled={loading}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              } ${
                error ? "border-red-500" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loadingDeleteCategory}
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
              disabled={loadingDeleteCategory || !reason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {t("categories.delete.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteCategoryModal
