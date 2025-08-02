import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { deleteScientificDegree } from "../state/act/actScientificDegree";
import {
  clearDeleteSuccess,
  resetDeleteForm,
} from "../state/slices/scientificDegree";

const DeleteScientificDegreeModal = ({
  isOpen,
  onClose,
  scientificDegreeId,
  scientificDegreeName,
  info,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    loadingDeleteScientificDegree,
    deleteSuccess,
    deleteError,
    deleteMessage,
  } = useSelector((state) => state.scientificDegree);

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const isRTL = i18n.language === "ar";

  // Get scientific degree info from props or selector
  const scientificDegreeInfo = info || {
    nameArabic: scientificDegreeName,
    nameEnglish: scientificDegreeName,
    code: "",
  };

  useEffect(() => {
    if (deleteSuccess) {
      toast.success(
        deleteMessage ||
          t("scientificDegrees.success.deleted", {
            name: scientificDegreeName,
          }),
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
      dispatch(clearDeleteSuccess());
    }
  }, [deleteSuccess, deleteMessage, scientificDegreeName, t, dispatch]);

  useEffect(() => {
    if (deleteError) {
      setError(
        i18n.language === "en"
          ? deleteError.messageEn ||
              deleteError.message ||
              "Failed to delete scientific degree"
          : deleteError.messageAr ||
              deleteError.message ||
              "فشل في حذف الدرجة العلمية"
      );
    }
  }, [deleteError, i18n.language]);

  const handleClose = () => {
    setReason("");
    setError("");
    setLoading(false);
    dispatch(resetDeleteForm());
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError(t("scientificDegrees.delete.reasonRequired"));
      return;
    }

    if (reason.trim().length < 3) {
      setError(t("scientificDegrees.delete.reasonTooShort"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await dispatch(
        deleteScientificDegree({
          id: scientificDegreeId,
          reason: reason.trim(),
        })
      ).unwrap();
    } catch (error) {
      console.error("Delete scientific degree error:", error);
      setError(
        i18n.language === "en"
          ? error?.messageEn ||
              error?.message ||
              "Failed to delete scientific degree"
          : error?.messageAr || error?.message || "فشل في حذف الدرجة العلمية"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2
              className={`text-xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("scientificDegrees.delete.title")}
            </h2>

            <p
              className={`text-sm mb-4 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("scientificDegrees.delete.confirmMessage")}
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
                dir="rtl"
              >
                {scientificDegreeInfo.nameArabic}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                dir="ltr"
              >
                {scientificDegreeInfo.nameEnglish}
                {scientificDegreeInfo.code && ` - ${scientificDegreeInfo.code}`}
              </p>
            </div>

            <p
              className={`text-sm mt-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("scientificDegrees.delete.warning")}
            </p>
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("scientificDegrees.delete.reason")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder={t("scientificDegrees.delete.reasonPlaceholder")}
              rows={3}
              disabled={loading || loadingDeleteScientificDegree}
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

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loadingDeleteScientificDegree}
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
              disabled={loadingDeleteScientificDegree || !reason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(loading || loadingDeleteScientificDegree) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {t("scientificDegrees.delete.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteScientificDegreeModal;
