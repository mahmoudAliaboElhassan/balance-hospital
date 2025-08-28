import i18next from "i18next";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  getRostersPaged,
  updateRosterStatus,
} from "../state/act/actRosterManagement";

function ModalUpdateRosterStatus({
  statusToUpdate,
  setStatusModalOpen,
  setStatusToUpdate,
}) {
  const dispatch = useDispatch();
  const { mymode } = useSelector((state) => state.mode);
  const { loading } = useSelector((state) => state.rosterManagement || {});
  const isDark = mymode === "dark";

  // Check if current language is RTL
  const language = i18next.language;
  const isRTL = language === "ar";
  const { t } = useTranslation();

  const [selectedStatus, setSelectedStatus] = useState(
    statusToUpdate.currentStatus
  );
  const [reason, setReason] = useState("");

  const handleStatusUpdate = async () => {
    try {
      const updateData = {
        newStatus: selectedStatus,
        reason: reason || t("roster.defaultUpdateReason"),
      };

      await dispatch(
        updateRosterStatus({
          rosterId: statusToUpdate.id,
          updateData,
        })
      ).unwrap();

      // Success handling
      toast.success(t("roster.success.statusUpdated"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      dispatch(getRostersPaged());
      // Close modal and reset state
      setStatusModalOpen(false);
      setStatusToUpdate({
        id: null,
        title: "",
        currentStatus: "",
      });
    } catch (error) {
      console.error("Status update error:", error);

      Swal.fire({
        title: t("roster.error.updateStatusFailed"),
        text: error.errors[0],
        icon: "error",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#ef4444",
        background: "#ffffff",
        color: "#111827",
      });
    }
  };

  const handleCancel = () => {
    setStatusModalOpen(false);
    setStatusToUpdate({
      id: null,
      title: "",
      currentStatus: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-md w-full rounded-lg p-6 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("roster.actions.updateStatus")}
        </h3>

        <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {t("roster.updateStatusFor")}: <strong>{statusToUpdate.title}</strong>
        </p>

        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("roster.filters.status")} <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          >
            <option value="DRAFT_BASIC">{t("roster.status.draftBasic")}</option>
            <option value="DRAFT_PARTIAL">
              {t("roster.status.draftPartial")}
            </option>
            <option value="DRAFT">{t("roster.status.draft")}</option>
            <option value="DRAFT_READY">{t("roster.status.draftReady")}</option>
            <option value="PUBLISHED">{t("roster.status.published")}</option>
            <option value="CLOSED">{t("roster.status.closed")}</option>
            <option value="ARCHIVED">{t("roster.status.archived")}</option>
          </select>
        </div>

        <div className="mb-6">
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
            rows={3}
            className={`w-full p-3 border rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
            }`}
            placeholder={t("roster.phaseOne.placeholders.updateReason")}
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
            onClick={handleCancel}
            disabled={loading.update}
            className={`px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("roster.actions.cancel")}
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={loading?.update || !selectedStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            {loading?.update ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("roster.actions.updating")}
              </>
            ) : (
              t("roster.actions.update")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalUpdateRosterStatus;
