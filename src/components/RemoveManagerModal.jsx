import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { removeManager } from "../state/act/actManagementRole";
import i18next from "i18next";

const RemoveManagerModal = ({
  isOpen,
  onClose,
  managerId,
  managerName,
  onRemove,
}) => {
  const { t } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const language = i18next.language;
  const isRTL = language === "ar";
  const dispatch = useDispatch();

  const { loadingRemoveManager, removeManagerError } = useSelector(
    (state) => state.role
  );

  const [revocationReason, setRevocationReason] = useState("");
  const [errors, setErrors] = useState({});

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!revocationReason.trim()) {
      newErrors.revocationReason = t("managers.removeModal.reasonRequired");
    } else if (revocationReason.trim().length < 3) {
      newErrors.revocationReason = t("managers.removeModal.reasonTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle remove manager
  const handleRemove = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(
        removeManager({
          userId: managerId,
          revocationReason: revocationReason.trim(),
        })
      ).unwrap();

      if (result.success) {
        setRevocationReason("");
        setErrors({});
        onRemove?.();
        onClose();
      }
    } catch (error) {
      console.error("Error removing manager:", error);
    }
  };

  // Close modal and reset state
  const handleClose = () => {
    setRevocationReason("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-xl max-w-md w-full mx-4`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 mr-3">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("managers.removeModal.title")}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                  {t("managers.removeModal.warning")}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400">
                  {t("managers.removeModal.confirmMessage", {
                    name: managerName,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Manager Details */}
          <div
            className={`p-4 rounded-lg border mb-4 ${
              isDark
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <h4
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-900"
              } mb-2`}
            >
              {t("managers.removeModal.managerDetails")}
            </h4>
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <span className="font-medium">
                {t("managers.removeModal.name")}:
              </span>{" "}
              {managerName}
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <span className="font-medium">
                {t("managers.removeModal.id")}:
              </span>{" "}
              {managerId}
            </p>
          </div>

          {/* Revocation Reason */}
          <div className="mb-4">
            <label
              htmlFor="revocationReason"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("managers.removeModal.reason")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="revocationReason"
              value={revocationReason}
              onChange={(e) => {
                setRevocationReason(e.target.value);
                if (errors.revocationReason) {
                  setErrors({ ...errors, revocationReason: null });
                }
              }}
              placeholder={t("managers.removeModal.reasonPlaceholder")}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.revocationReason
                  ? "border-red-500 dark:border-red-500"
                  : isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            {errors.revocationReason && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.revocationReason}
              </p>
            )}
          </div>

          {/* API Error */}
          {removeManagerError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="text-sm">
                {removeManagerError.messageEn ||
                  removeManagerError.message ||
                  t("managers.removeModal.error")}
              </p>
            </div>
          )}

          {/* Consequences */}
          <div
            className={`p-4 rounded-lg border mb-6 ${
              isDark
                ? "bg-yellow-900/20 border-yellow-800"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <h4
              className={`font-medium ${
                isDark ? "text-yellow-300" : "text-yellow-800"
              } mb-2`}
            >
              {t("managers.removeModal.consequences")}
            </h4>
            <ul
              className={`text-sm ${
                isDark ? "text-yellow-200" : "text-yellow-700"
              } space-y-1`}
            >
              <li>• {t("managers.removeModal.consequence1")}</li>
              <li>• {t("managers.removeModal.consequence2")}</li>
              <li>• {t("managers.removeModal.consequence3")}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            disabled={loadingRemoveManager}
            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
              isDark
                ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                : "text-gray-700 border-gray-300 hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {t("managers.removeModal.cancel")}
          </button>
          <button
            onClick={handleRemove}
            disabled={loadingRemoveManager || !revocationReason.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loadingRemoveManager ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("managers.removeModal.removing")}
              </>
            ) : (
              <>
                <Trash2 size={16} className="mr-2" />
                {t("managers.removeModal.confirm")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveManagerModal;
