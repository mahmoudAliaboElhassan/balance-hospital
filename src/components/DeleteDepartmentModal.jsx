import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";
import { deleteDepartment } from "../state/act/actDepartment";

const DeleteDepartmentModal = ({
  isOpen,
  onClose,
  info, // { id, name }
  loading = false, // you can pass loadingDeleteDepartment here
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mymode } = useSelector((state) => state.mode);
  const { loadingDeleteDepartment } = useSelector((state) => state.department);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const isDark = mymode === "dark";
  const isRTL = i18n.language === "ar";

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError(t("department.delete.reasonRequired"));
      return;
    }

    dispatch(deleteDepartment({ id: info.id, reason }))
      .unwrap()
      .then(() => {
        toast.success(t("department.deleteSuccess", { name: info.name }), {
          position: "top-right",
          autoClose: 3000,
        });
        handleClose();
        navigate("/admin-panel/departments");
      })
      .catch((err) => {
        handleClose();
        const msg =
          i18next.language === "en"
            ? err?.messageEn || err?.message
            : err?.messageAr || err?.message;
        Swal.fire({
          title: msg,
          icon: "error",
          confirmButtonText: t("common.ok"),
          background: isDark ? "#2d2d2d" : "#ffffff",
          color: isDark ? "#f0f0f0" : "#111827",
          confirmButtonColor: isDark ? "#4f83cc" : "#3085d6",
          customClass: { popup: isDark ? "swal2-dark-popup" : "" },
        });
      });
  };

  if (!isOpen) return null;

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
              {t("department.delete.title")}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loadingDeleteDepartment}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            } disabled:opacity-50`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4">
          <p
            className={`text-sm mb-4 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("department.delete.confirmMessage")}
          </p>

          <div
            className={`p-3 rounded-lg border mb-4 ${
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
              {info.name}
            </p>
          </div>

          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("department.delete.reason")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            rows={3}
            disabled={loadingDeleteDepartment}
            placeholder={t("department.delete.reasonPlaceholder")}
            className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 transition-colors ${
              isDark
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
            } ${error ? "border-red-500" : ""} disabled:opacity-50`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loadingDeleteDepartment}
              className={`px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={loadingDeleteDepartment || !reason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingDeleteDepartment && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              )}
              {t("department.delete.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteDepartmentModal;
