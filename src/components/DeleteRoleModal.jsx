// components/DeleteRoleModal.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteManagementRole } from "../state/act/actManagementRole";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";

const DeleteRoleModal = ({ isOpen, onClose, info, role, loading = false }) => {
  const { t, i18n } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const isDark = mymode === "dark";
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();
  const { loading: loadingStates } = useSelector(
    (state) => state.managementRoles
  );
  const loadingDeleteRole = loadingStates?.delete || false;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError(
        t("managementRoles.delete.reasonRequired") || "Reason is required"
      );
      return;
    }

    dispatch(
      deleteManagementRole({
        id: info.id,
        deleteReason: reason,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          t("managementRoles.deleteSuccess", { name: info.name }) ||
            `Role "${info.name}" deleted successfully`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        handleClose();
        // Navigate to roles list if needed
        navigate("/admin-panel/management-roles");
      })
      .catch((error) => {
        handleClose();
        console.log("error from catch", error);

        // Choose the right language message
        const message =
          i18next.language === "en"
            ? (error?.messageEn || error?.message || "Failed to delete role") +
              (error?.errors?.length > 0 ? " " + error.errors[0] : "")
            : (error?.message || error?.messageAr || "فشل في حذف الدور") +
              (error?.errors?.length > 0 ? " " + error.errors[0] : "");

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
              {t("managementRoles.delete.title") || "Delete Role"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={loadingDeleteRole}
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
              {t("managementRoles.delete.confirmMessage") ||
                "Are you sure you want to delete this role? This action cannot be undone."}
            </p>

            {role && (
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
                  {role.roleNameAr}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {role.roleNameEn}
                  {role.description && ` - ${role.description}`}
                </p>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.isSystemRole
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {role.isSystemRole
                      ? t("managementRoles.type.system") || "System"
                      : t("managementRoles.type.custom") || "Custom"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {role.isActive
                      ? t("managementRoles.status.active") || "Active"
                      : t("managementRoles.status.inactive") || "Inactive"}
                  </span>
                </div>
                {role.usersCount > 0 && (
                  <div className="mt-2">
                    <span
                      className={`text-xs ${
                        isDark ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    >
                      ⚠️{" "}
                      {t("managementRoles.delete.usersWarning", {
                        count: role.usersCount,
                      }) ||
                        `This role is assigned to ${role.usersCount} user(s)`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("managementRoles.delete.reason") || "Reason"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder={
                t("managementRoles.delete.reasonPlaceholder") ||
                "Please provide a reason for deleting this role..."
              }
              rows={3}
              disabled={loadingDeleteRole}
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

          {/* Warning for system roles or roles with users */}
          {(role?.isSystemRole || role?.usersCount > 0) && (
            <div
              className={`mb-4 p-3 rounded-lg border-l-4 border-yellow-500 ${
                isDark ? "bg-yellow-900/20" : "bg-yellow-50"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      isDark ? "text-yellow-400" : "text-yellow-400"
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm ${
                      isDark ? "text-yellow-200" : "text-yellow-800"
                    }`}
                  >
                    {role?.isSystemRole && (
                      <span>
                        {t("managementRoles.delete.systemRoleWarning") ||
                          "Warning: This is a system role. Deleting it may affect system functionality."}
                      </span>
                    )}
                    {role?.usersCount > 0 && (
                      <span>
                        {role?.isSystemRole && <br />}
                        {t("managementRoles.delete.assignedUsersWarning") ||
                          "Warning: This role is currently assigned to users. They will lose these permissions."}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loadingDeleteRole}
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
              disabled={loadingDeleteRole || !reason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingDeleteRole && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {t("managementRoles.delete.confirm") || "Delete Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
