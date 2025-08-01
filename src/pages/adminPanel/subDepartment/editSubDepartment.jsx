import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import {
  updateSubDepartment,
  getSubDepartmentById,
} from "../../../state/act/actSubDepartment";
import { getDepartments } from "../../../state/act/actDepartment";
import {
  clearUpdateSuccess,
  resetUpdateForm,
} from "../../../state/slices/subDepartment";

function EditSubDepartment() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    loadingUpdateSubDepartment,
    updateError,
    updateSuccess,
    updateMessage,
    selectedSubDepartment,
    loadingGetSingleSubDepartment,
    singleSubDepartmentError,
  } = useSelector((state) => state.subDepartment);
  const { departments } = useSelector((state) => state.department);
  const { mymode } = useSelector((state) => state.mode);

  const isDark = mymode === "dark";
  const isRTL = i18n.language === "ar";

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    nameArabic: "",
    nameEnglish: "",
    departmentId: "",
    location: "",
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      dispatch(getSubDepartmentById(id));
    }
    dispatch(getDepartments({ pageSize: 100, isActive: true }));
    dispatch(resetUpdateForm());
  }, [dispatch, id]);

  // Update form data when subDepartment is loaded
  useEffect(() => {
    if (selectedSubDepartment) {
      setFormData({
        id: selectedSubDepartment.id,
        nameArabic: selectedSubDepartment.nameArabic || "",
        nameEnglish: selectedSubDepartment.nameEnglish || "",
        departmentId: selectedSubDepartment.departmentId || "",
        location: selectedSubDepartment.location || "",
        isActive: selectedSubDepartment.isActive,
      });
    }
  }, [selectedSubDepartment]);

  // Handle success
  useEffect(() => {
    if (updateSuccess) {
      navigate("/admin-panel/sub-departments");
      dispatch(clearUpdateSuccess());
    }
  }, [updateSuccess, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nameArabic.trim()) {
      errors.nameArabic = t("subDepartment.form.validation.nameArabicRequired");
    }

    if (!formData.nameEnglish.trim()) {
      errors.nameEnglish = t(
        "subDepartment.form.validation.nameEnglishRequired"
      );
    }

    if (!formData.departmentId) {
      errors.departmentId = t(
        "subDepartment.form.validation.departmentRequired"
      );
    }

    if (!formData.location.trim()) {
      errors.location = t("subDepartment.form.validation.locationRequired");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        ...formData,
        departmentId: parseInt(formData.departmentId),
      };
      dispatch(updateSubDepartment({ id, subDepartmentData: submitData }));
    }
  };

  // Loading state
  if (loadingGetSingleSubDepartment) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span
                  className={`${isRTL ? "mr-3" : "ml-3"} ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("subDepartment.loading")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (singleSubDepartmentError) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center p-8">
              <div
                className={`text-red-500 text-lg mb-4 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                {singleSubDepartmentError.message}
              </div>
              <Link
                to="/admin-panel/sub-departments"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t("common.cancel")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!selectedSubDepartment) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center p-8">
              <div
                className={`text-gray-600 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("subDepartment.noData")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link
                to="/admin-panel/sub-departments"
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
              </Link>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("subDepartment.form.edit.title")}
              </h1>
            </div>
          </div>

          {/* Form */}
          <div
            className={`rounded-lg shadow-sm border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Arabic Name */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("subDepartment.form.fields.nameArabic.label")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameArabic"
                    value={formData.nameArabic}
                    onChange={handleInputChange}
                    placeholder={t(
                      "subDepartment.form.fields.nameArabic.placeholder"
                    )}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.nameArabic
                        ? "border-red-500 focus:ring-red-500"
                        : isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    }`}
                    disabled={loadingUpdateSubDepartment}
                    dir="rtl"
                  />
                  {formErrors.nameArabic && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.nameArabic}
                    </p>
                  )}
                </div>

                {/* English Name */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("subDepartment.form.fields.nameEnglish.label")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameEnglish"
                    value={formData.nameEnglish}
                    onChange={handleInputChange}
                    placeholder={t(
                      "subDepartment.form.fields.nameEnglish.placeholder"
                    )}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.nameEnglish
                        ? "border-red-500 focus:ring-red-500"
                        : isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    }`}
                    disabled={loadingUpdateSubDepartment}
                  />
                  {formErrors.nameEnglish && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.nameEnglish}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("subDepartment.form.fields.department.label")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.departmentId
                        ? "border-red-500 focus:ring-red-500"
                        : isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                    disabled={loadingUpdateSubDepartment}
                  >
                    <option value="">
                      {t("subDepartment.form.fields.department.placeholder")}
                    </option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {i18n.language === "ar"
                          ? department.nameArabic
                          : department.nameEnglish}
                      </option>
                    ))}
                  </select>
                  {formErrors.departmentId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.departmentId}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("subDepartment.form.fields.location.label")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder={t(
                      "subDepartment.form.fields.location.placeholder"
                    )}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.location
                        ? "border-red-500 focus:ring-red-500"
                        : isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    }`}
                    disabled={loadingUpdateSubDepartment}
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("subDepartment.form.fields.isActive.label")}
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        value="true"
                        checked={formData.isActive === true}
                        onChange={(e) =>
                          handleInputChange({
                            ...e,
                            target: {
                              ...e.target,
                              name: "isActive",
                              value: true,
                            },
                          })
                        }
                        className="text-blue-600 focus:ring-blue-500"
                        disabled={loadingUpdateSubDepartment}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("subDepartment.form.fields.isActive.active")}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        value="false"
                        checked={formData.isActive === false}
                        onChange={(e) =>
                          handleInputChange({
                            ...e,
                            target: {
                              ...e.target,
                              name: "isActive",
                              value: false,
                            },
                          })
                        }
                        className="text-blue-600 focus:ring-blue-500"
                        disabled={loadingUpdateSubDepartment}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("subDepartment.form.fields.isActive.inactive")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {updateError && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p
                    className={`text-sm ${
                      isDark ? "text-red-400" : "text-red-800"
                    }`}
                  >
                    {updateError.message}
                  </p>
                  {updateError.errors && updateError.errors.length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {updateError.errors.map((error, index) => (
                        <li
                          key={index}
                          className={`text-xs ${
                            isDark ? "text-red-300" : "text-red-600"
                          }`}
                        >
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Success Message */}
              {updateSuccess && updateMessage && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p
                    className={`text-sm ${
                      isDark ? "text-green-400" : "text-green-800"
                    }`}
                  >
                    {updateMessage}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/admin-panel/sub-departments"
                  className={`px-6 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <X size={16} />
                    {t("common.cancel")}
                  </div>
                </Link>
                <button
                  type="submit"
                  disabled={loadingUpdateSubDepartment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingUpdateSubDepartment ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {t("subDepartment.form.edit.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSubDepartment;
