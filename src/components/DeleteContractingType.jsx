import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { deleteContractingType } from "../state/act/actContractingType";
import {
  clearDeleteSuccess,
  resetDeleteForm,
} from "../state/slices/contractingType";
import { toast } from "react-toastify";

const DeleteContractingTypeModal = ({
  isOpen,
  onClose,
  contractingTypeId,
  contractingTypeName,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const { loadingDeleteContractingType, deleteError, deleteSuccess } =
    useSelector((state) => state.contractingType);

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const isRTL = i18n.language === "ar";

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setReason("");
      setReasonError("");
      dispatch(resetDeleteForm());
    }
  }, [isOpen, dispatch]);

  // Handle successful deletion
  React.useEffect(() => {
    if (deleteSuccess) {
      toast.success(t("contractingTypes.success.deleted"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      handleClose();
      dispatch(clearDeleteSuccess());
    }
  }, [deleteSuccess, dispatch, t]);

  const handleClose = () => {
    setReason("");
    setReasonError("");
    dispatch(resetDeleteForm());
    onClose();
  };

  const validateReason = () => {
    if (!reason.trim()) {
      setReasonError(t("contractingTypes.delete.reasonRequired"));
      return false;
    }
    if (reason.trim().length < 3) {
      setReasonError(t("contractingTypes.delete.reasonTooShort"));
      return false;
    }
    setReasonError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateReason()) {
      return;
    }

    try {
      await dispatch(
        deleteContractingType({
          id: contractingTypeId,
          reason: reason.trim(),
        })
      ).unwrap();
    } catch (error) {
      console.error("Delete error:", error);
      // Error handling is done in the slice
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div
          className={`inline-block align-bottom ${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
        >
          {/* Header */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}
          >
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10`}
              >
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>

              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-lg leading-6 font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("contractingTypes.delete.title")}
                  </h3>

                  <button
                    onClick={handleClose}
                    className={`rounded-md p-2 ${
                      isDark
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-2">
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {t("contractingTypes.delete.confirmMessage")}
                  </p>

                  <div
                    className={`mt-3 p-3 ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    } rounded-lg`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {contractingTypeName}
                    </p>
                  </div>

                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mt-3`}
                  >
                    {t("contractingTypes.delete.warning")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } px-4 pb-4 sm:px-6`}
            >
              {/* Reason Input */}
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {t("contractingTypes.delete.reason")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (reasonError) setReasonError("");
                  }}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    reasonError ? "border-red-500" : "border-gray-300"
                  } ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white placeholder-gray-500"
                  }`}
                  placeholder={t("contractingTypes.delete.reasonPlaceholder")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {reasonError && (
                  <p className="text-red-500 text-sm mt-1">{reasonError}</p>
                )}
              </div>

              {/* Error Message */}
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">
                    {i18n.language === "ar"
                      ? deleteError.messageAr || deleteError.message
                      : deleteError.messageEn || deleteError.message}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className={`${
                isDark ? "bg-gray-700" : "bg-gray-50"
              } px-4 py-3 sm:px-6 sm:flex ${
                isRTL ? "sm:flex-row-reverse" : "sm:flex-row"
              } sm:justify-between`}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={loadingDeleteContractingType}
                className={`w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:text-sm ${
                  isDark
                    ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } ${
                  loadingDeleteContractingType
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {t("contractingTypes.delete.cancel")}
              </button>

              <button
                type="submit"
                disabled={loadingDeleteContractingType || !reason.trim()}
                className={`mt-3 sm:mt-0 ${
                  isRTL ? "sm:mr-3" : "sm:ml-3"
                } w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm ${
                  loadingDeleteContractingType || !reason.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loadingDeleteContractingType ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Trash2 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                )}
                {loadingDeleteContractingType
                  ? t("common.deleting")
                  : t("contractingTypes.delete.confirm")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteContractingTypeModal;
