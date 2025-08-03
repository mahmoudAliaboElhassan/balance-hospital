import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  User,
  AlertCircle,
  CheckCircle,
  Loader as LoaderIcon,
  Info,
} from "lucide-react";

// Redux actions
import { addManager } from "../../../state/act/actManagementRole";
import { clearRoleErrors } from "../../../state/slices/managementRole";

// Hooks
import i18next from "i18next";

const AssignManager = () => {
  const { t } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const language = i18next.language;
  const isRTL = language === "ar";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { loadingAddManager, addManagerError, addManagerSuccess } = useSelector(
    (state) => state.role
  );

  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    notes: "",
  });

  // Local state
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate user ID
    if (!formData.userId.trim()) {
      newErrors.userId = t("assignManager.errors.userIdRequired");
    } else if (!/^\d+$/.test(formData.userId.trim())) {
      newErrors.userId = t("assignManager.errors.userIdInvalid");
    } else if (parseInt(formData.userId) <= 0) {
      newErrors.userId = t("assignManager.errors.userIdMustBePositive");
    }

    // Validate notes
    if (!formData.notes.trim()) {
      newErrors.notes = t("assignManager.errors.notesRequired");
    } else if (formData.notes.trim().length < 10) {
      newErrors.notes = t("assignManager.errors.notesTooShort");
    } else if (formData.notes.trim().length > 500) {
      newErrors.notes = t("assignManager.errors.notesTooLong");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch(
        addManager({
          userId: parseInt(formData.userId.trim()),
          notes: formData.notes.trim(),
        })
      ).unwrap();

      if (result.success) {
        // Reset form
        setFormData({ userId: "", notes: "" });
        setErrors({});

        // Navigate back to managers list after a short delay
        setTimeout(() => {
          navigate("/admin-panel/management-roles/managers");
        }, 2000);
      }
    } catch (error) {
      console.error("Error assigning manager:", error);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({ userId: "", notes: "" });
    setErrors({});
    dispatch(clearRoleErrors());
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/admin-panel/management-roles/managers"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors ${isRTL ? "ml-4" : "mr-4"}`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("assignManager.backToManagers")}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-blue-100"
              } rounded-lg`}
            >
              <UserPlus
                className={`h-8 w-8 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("assignManager.title")}
              </h1>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("assignManager.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {addManagerSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{t("assignManager.success")}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {addManagerError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>
                  {language === "ar"
                    ? addManagerError?.messageAr || "حدث خطأ أثناء تعيين المدير"
                    : addManagerError?.messageEn || "Error assigning manager"}
                </span>
              </div>
              <button
                onClick={() => dispatch(clearRoleErrors())}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Info Message */}
        <div
          className={`mb-6 p-4 rounded-lg border ${
            isDark
              ? "bg-blue-900/20 border-blue-800"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-center">
            <Info
              className={`h-5 w-5 mr-2 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                isDark ? "text-blue-300" : "text-blue-700"
              }`}
            >
              {t("assignManager.form.infoMessage")}
            </span>
          </div>
        </div>

        {/* Form */}
        <div
          className={`${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } border rounded-xl shadow-sm p-6`}
        >
          <form onSubmit={handleSubmit}>
            {/* User ID Input */}
            <div className="mb-6">
              <label
                htmlFor="userId"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("assignManager.form.userId")}{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="relative">
                  <User
                    className={`absolute ${
                      isRTL ? "right-3" : "left-3"
                    } top-1/2 transform -translate-y-1/2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } h-4 w-4`}
                  />
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    placeholder={t("assignManager.form.userIdPlaceholder")}
                    className={`w-full ${
                      isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                    } py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.userId
                        ? "border-red-500"
                        : isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
              </div>

              {errors.userId && (
                <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
              )}

              <p
                className={`mt-1 text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("assignManager.form.userIdHelp")}
              </p>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label
                htmlFor="notes"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("assignManager.form.notes")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t("assignManager.form.notesPlaceholder")}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                  errors.notes
                    ? "border-red-500"
                    : isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
              <p
                className={`mt-1 text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formData.notes.length}/500 {t("assignManager.form.characters")}
              </p>
            </div>

            {/* Preview Section */}
            {formData.userId && formData.notes && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  } mb-3`}
                >
                  {t("assignManager.form.assignmentPreview")}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <strong>{t("assignManager.form.userId")}:</strong>{" "}
                      {formData.userId}
                    </span>
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <strong>{t("assignManager.form.notes")}:</strong>
                    <p className="mt-1 italic">{formData.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Assignment Details */}
            <div
              className={`mb-6 p-4 rounded-lg border ${
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
                {t("assignManager.form.whatHappens")}
              </h4>
              <ul
                className={`text-sm ${
                  isDark ? "text-yellow-200" : "text-yellow-700"
                } space-y-1`}
              >
                <li>• {t("assignManager.form.consequence1")}</li>
                <li>• {t("assignManager.form.consequence2")}</li>
                <li>• {t("assignManager.form.consequence3")}</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleReset}
                className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                  isDark
                    ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {t("assignManager.form.reset")}
              </button>

              <Link
                to="/admin-panel/management-roles/managers"
                className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                  isDark
                    ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {t("assignManager.form.cancel")}
              </Link>

              <button
                type="submit"
                disabled={
                  loadingAddManager ||
                  !formData.userId.trim() ||
                  !formData.notes.trim()
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loadingAddManager ? (
                  <>
                    <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                    {t("assignManager.form.assigning")}
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    {t("assignManager.form.assignManager")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* How to Find User ID Help */}
        <div
          className={`mt-6 p-4 rounded-lg border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h4
            className={`font-medium ${
              isDark ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            {t("assignManager.help.title")}
          </h4>
          <ul
            className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            } space-y-1`}
          >
            <li>• {t("assignManager.help.step1")}</li>
            <li>• {t("assignManager.help.step2")}</li>
            <li>• {t("assignManager.help.step3")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssignManager;
