import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { X, AlertTriangle, User, Tag } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import i18next from "i18next";
import { removeCategoryHead } from "../state/act/actCategory";

const RemoveCategoryHeadModal = ({
  isOpen,
  onClose,
  categoryInfo,
  categoryHeadName,
  categoryHeadId,
  loading = false,
}) => {
  const { t, i18n } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  console.log("categoryInfo", categoryInfo);

  const isDark = mymode === "dark";
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();
  const { loadingRemoveCategoryHead } = useSelector((state) => state.category);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError(
        t("categoryHead.removeCategoryHead.reasonRequired") ||
          "Reason is required"
      );
      return;
    }

    dispatch(
      removeCategoryHead({
        data: {
          CategoryId: categoryInfo.id,
          Reason: reason.trim(),
          UserId: categoryHeadId,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          t("categoryHead.removeCategoryHead.success", {
            categoryHeadName,
            categoryName: isRTL
              ? categoryInfo.nameArabic
              : categoryInfo.nameEnglish,
          }) ||
            `Category Head ${categoryHeadName} removed from ${
              isRTL ? categoryInfo.nameArabic : categoryInfo.nameEnglish
            } successfully`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        handleClose();
        // Optionally refresh the category data or navigate
        // Simple refresh, you might want to dispatch getCategoryHeads instead
      })
      .catch((error) => {
        handleClose();
        console.log("Error removing category head:", error);

        // Choose the right language message
        const message =
          i18next.language === "en"
            ? error?.messageEn ||
              error?.message ||
              "Failed to remove category head"
            : error?.messageAr || error?.message || "فشل في إزالة رئيس الفئة";

        Swal.fire({
          title: t("categoryHead.removeCategoryHead.error.title") || "Error",
          text: message,
          icon: "error",
          confirmButtonText: t("common.ok") || "OK",
          confirmButtonColor: "#ef4444",
          background: isDark ? "#2d2d2d" : "#ffffff",
          color: isDark ? "#f0f0f0" : "#111827",
          customClass: {
            popup: isDark ? "swal2-dark-popup" : "",
          },
        });
      });
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="sticky inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("categoryHead.removeCategoryHead.title") ||
                "Remove Category Head"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loadingRemoveCategoryHead}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <p
              className={`text-sm mb-4 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("categoryHead.removeCategoryHead.confirmMessage") ||
                "Are you sure you want to remove this category head? This action cannot be undone."}
            </p>

            {/* Category Info */}
            <div
              className={`p-4 rounded-lg border mb-4 ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Category Name */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-1.5 rounded-full ${
                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                  }`}
                >
                  <Tag className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("categoryHead.removeCategoryHead.category") ||
                      "Category"}
                  </p>
                  <p
                    className={`font-semibold text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isRTL
                      ? categoryInfo?.nameArabic
                      : categoryInfo?.nameEnglish || "N/A"}
                  </p>
                </div>
              </div>

              {/* Category Head Name */}
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-full ${
                    isDark ? "bg-red-900/30" : "bg-red-100"
                  }`}
                >
                  <User className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("categoryHead.removeCategoryHead.categoryHead") ||
                      "Current Category Head"}
                  </p>
                  <p
                    className={`font-semibold text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {categoryHeadName || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div
              className={`p-3 rounded-lg border-l-4 border-yellow-500 ${
                isDark ? "bg-yellow-900/20" : "bg-yellow-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isDark ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                <strong>
                  {t("categoryHead.removeCategoryHead.warning.title") ||
                    "Warning:"}
                </strong>{" "}
                {t("categoryHead.removeCategoryHead.warning.message") ||
                  "Removing the category head will revoke all their category-specific permissions and access."}
              </p>
            </div>
          </div>

          {/* Reason Input */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("categoryHead.removeCategoryHead.reason") ||
                "Reason for removal"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder={
                t("categoryHead.removeCategoryHead.reasonPlaceholder") ||
                "Please provide a reason for removing this category head..."
              }
              rows={3}
              disabled={loadingRemoveCategoryHead}
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              } ${
                error ? "border-red-500 ring-1 ring-red-500" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertTriangle size={14} />
                {error}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`flex gap-3 ${
              isRTL ? "flex-row-reverse" : "justify-end"
            }`}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={loadingRemoveCategoryHead}
              className={`px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("common.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loadingRemoveCategoryHead || !reason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingRemoveCategoryHead && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {t("categoryHead.removeCategoryHead.confirm") ||
                "Remove Category Head"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemoveCategoryHeadModal;
