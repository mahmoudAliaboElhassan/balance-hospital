import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteContractingType } from "../state/act/actContractingType";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";

const DeleteContractingTypeModal = ({
  isOpen,
  onClose,
  info,
  contractingType,
  contractingTypeId,
  contractingTypeName,
  loading = false,
}) => {
  const { t, i18n } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const isDark = mymode === "dark";
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();
  const { loadingDeleteContractingType } = useSelector(
    (state) => state.contractingType
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError(t("contractingTypes.delete.reasonRequired"));
      return;
    }

    const idToDelete = contractingTypeId || info?.id;
    const nameToDelete = contractingTypeName || info?.name;

    dispatch(
      deleteContractingType({
        id: idToDelete,
        reason: reason.trim(),
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          t("contractingTypes.deleteSuccess", { name: nameToDelete }),
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        handleClose();
        navigate("/admin-panel/contracting-types");
      })
      .catch((error) => {
        handleClose();
        console.log("error from catch", error);

        // Choose the right language message
        const message =
          i18next.language === "en"
            ? error?.messageEn + " " + (error.errors?.[0] || "")
            : error?.messageAr + " " + (error.errors?.[0] || "");

        Swal.fire({
          title: message || t("contractingTypes.error.deleteFailed"),
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
        });
      });
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  // Get contracting type info
  const contractingTypeInfo = contractingType || {
    nameArabic: contractingTypeName || info?.name || "",
    nameEnglish: contractingTypeName || info?.name || "",
    code: info?.code || "",
  };

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
              {t("contractingTypes.delete.title")}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loading || loadingDeleteContractingType}
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
              {t("contractingTypes.delete.confirmMessage")}
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
                {contractingTypeInfo.nameArabic}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                dir="ltr"
              >
                {contractingTypeInfo.nameEnglish}
                {contractingTypeInfo.code && ` - ${contractingTypeInfo.code}`}
              </p>
            </div>

            <p
              className={`text-sm mt-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("contractingTypes.delete.warning")}
            </p>
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("contractingTypes.delete.reason")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder={t("contractingTypes.delete.reasonPlaceholder")}
              rows={3}
              disabled={loading || loadingDeleteContractingType}
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
              disabled={loadingDeleteContractingType}
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
              disabled={loadingDeleteContractingType || !reason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(loading || loadingDeleteContractingType) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {t("contractingTypes.delete.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteContractingTypeModal;
