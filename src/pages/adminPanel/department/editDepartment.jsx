import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  updateDepartment,
  getDepartmentById,
} from "../../../state/act/actDepartment";
import { useNavigate, useParams } from "react-router-dom";
import UseFormValidation from "../../../hooks/use-form-validation";
import { getCategoryTypes } from "../../../state/act/actCategory";
import { getUserSummaries } from "../../../state/slices/user";
import LoadingGetData from "../../../components/LoadingGetData";
import { Search, User, ArrowLeft } from "lucide-react";

function EditDepartment() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { depId: id } = useParams();
  const dropdownRef = useRef(null);
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  // State for user search and selection
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  const { VALIDATION_SCHEMA_ADD_DEPARTMENT } = UseFormValidation();

  // Redux selectors
  const {
    loadingUpdateDepartment,
    selectedDepartment,
    loadingGetSingleDepartment,
    singleDepartmentError,
  } = useSelector((state) => state.department);

  // Load initial data
  useEffect(() => {
    if (id) dispatch(getDepartmentById(id));
    dispatch(getCategoryTypes());
    dispatch(getUserSummaries({ page: 1, pageSize: 50 }));
  }, [dispatch, id]);

  const { departmentManagerId } = useSelector((state) => state.auth);

  // Handle user search with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (userSearchTerm.length >= 2) {
        dispatch(
          getUserSummaries({
            page: 1,
            pageSize: 50,
            searchTerm: userSearchTerm,
          })
        );
      } else if (userSearchTerm.length === 0) {
        dispatch(getUserSummaries({ page: 1, pageSize: 50 }));
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearchTerm, dispatch]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loadingGetSingleDepartment)
    return <LoadingGetData text={t("gettingData.departmentData")} />;

  if (singleDepartmentError)
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">
            <div
              className={`rounded-lg shadow border p-6 text-center ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="py-12">
                <div className="text-red-500 text-lg mb-4">
                  {currentLang === "ar"
                    ? singleDepartmentError.message
                    : "Department not found"}
                </div>
                <button
                  onClick={() => navigate(`/admin-panel/department/${id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t("common.goBack")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (!selectedDepartment)
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">
            <div
              className={`rounded-lg shadow border p-6 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-center items-center py-12">
                <div className={isDark ? "text-gray-300" : "text-gray-600"}>
                  {t("common.noData")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  console.log("selectedDepartment", selectedDepartment);

  // Initialize form values based on selected department
  const getInitialValues = () => {
    const manager = selectedDepartment.manager || {};

    return {
      id: selectedDepartment.id,
      nameArabic: selectedDepartment.nameArabic || "",
      nameEnglish: selectedDepartment.nameEnglish || "",
      code: selectedDepartment.code || "",
      location: selectedDepartment.location || "",
      description: selectedDepartment.description || "",
      isActive:
        selectedDepartment.isActive !== undefined
          ? selectedDepartment.isActive
          : true,
      manager: {
        userId: manager.userId || "",
        startDate: manager.startDate
          ? new Date(manager.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        canViewDepartment:
          manager.canViewDepartment !== undefined
            ? manager.canViewDepartment
            : true,
        canEditDepartment:
          manager.canEditDepartment !== undefined
            ? manager.canEditDepartment
            : false,
        canViewDepartmentReports:
          manager.canViewDepartmentReports !== undefined
            ? manager.canViewDepartmentReports
            : false,
        canManageSchedules:
          manager.canManageSchedules !== undefined
            ? manager.canManageSchedules
            : false,
        canManageStaff:
          manager.canManageStaff !== undefined ? manager.canManageStaff : false,
        notes: manager.notes || "",
      },
    };
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    // Transform the data to match the expected API format

    console.log(values);

    dispatch(updateDepartment({ id, departmentData: values }))
      .unwrap()
      .then(() => {
        // Success handling
        toast.success(t("departmentForm.success.updated"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate(`/admin-panel/department/${id}`);
      })
      .catch((error) => {
        console.error("Department update error:", error);

        Swal.fire({
          title: t("departmentForm.error.title"),
          text:
            currentLang === "en"
              ? error?.messageEn || error?.message
              : error?.messageAr ||
                error?.message ||
                t("department.error.message"),
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: isDark ? "#2d2d2d" : "#ffffff",
          color: isDark ? "#f0f0f0" : "#111827",
        });
      })
      .finally(() => setSubmitting(false));
  };

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
              <button
                onClick={() => navigate(`/admin-panel/department/${id}`)}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <ArrowLeft size={20} />
              </button>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } ${isRTL ? "font-arabic" : ""}`}
              >
                {t("departmentForm.editTitle") || "Edit Department"}
              </h1>
            </div>
          </div>

          {/* Form */}
          <div
            className={`rounded-lg shadow border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6">
              <Formik
                initialValues={getInitialValues()}
                validationSchema={VALIDATION_SCHEMA_ADD_DEPARTMENT}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                      <h3
                        className={`text-lg font-semibold border-b pb-2 ${
                          isDark
                            ? "text-white border-gray-600"
                            : "text-gray-900 border-gray-200"
                        }`}
                      >
                        {t("departmentForm.sections.basicInfo") ||
                          "Basic Information"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Arabic Name */}
                        <div>
                          <label
                            htmlFor="nameArabic"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("departmentForm.fields.nameArabic") ||
                              "Arabic Name"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="nameArabic"
                            name="nameArabic"
                            dir="rtl"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.nameArabic && touched.nameArabic
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                            placeholder={
                              t("departmentForm.placeholders.nameArabic") ||
                              "Enter Arabic name"
                            }
                          />
                          <ErrorMessage
                            name="nameArabic"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        {/* English Name */}
                        <div>
                          <label
                            htmlFor="nameEnglish"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("departmentForm.fields.nameEnglish") ||
                              "English Name"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="nameEnglish"
                            name="nameEnglish"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.nameEnglish && touched.nameEnglish
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                            placeholder={
                              t("departmentForm.placeholders.nameEnglish") ||
                              "Enter English name"
                            }
                          />
                          <ErrorMessage
                            name="nameEnglish"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Code */}
                        <div>
                          <label
                            htmlFor="code"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("categoryForm.fields.code") || "Code"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="code"
                            name="code"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.code && touched.code
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                            placeholder={
                              t("categoryForm.placeholders.code") ||
                              "Enter code"
                            }
                            onChange={(e) => {
                              const upperValue = e.target.value.toUpperCase();
                              setFieldValue("code", upperValue);
                            }}
                          />
                          <ErrorMessage
                            name="code"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                          <p
                            className={`mt-1 text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("categoryForm.hints.code") ||
                              "Code will be automatically converted to uppercase"}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label
                          htmlFor="location"
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("departmentForm.fields.location") || "Location"}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          id="location"
                          name="location"
                          dir={isRTL ? "rtl" : "ltr"}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900"
                          } ${
                            errors.location && touched.location
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                          }`}
                          placeholder={
                            t("departmentForm.placeholders.location") ||
                            "Enter location"
                          }
                        />
                        <ErrorMessage
                          name="location"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor="description"
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("departmentForm.fields.description") ||
                            "Description"}
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={3}
                          dir={isRTL ? "rtl" : "ltr"}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900"
                          } ${
                            errors.description && touched.description
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                          }`}
                          placeholder={
                            t("departmentForm.placeholders.description") ||
                            "Enter description"
                          }
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      {/* Is Active */}
                      <div
                        className={`flex items-center ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Field
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="isActive"
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } ${isRTL ? "mr-2" : "ml-2"}`}
                        >
                          {t("departmentForm.fields.isActive") || "Active"}
                        </label>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div
                      className={`flex justify-end space-x-3 pt-6 border-t ${
                        isDark ? "border-gray-600" : "border-gray-200"
                      } ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <button
                        type="button"
                        className={`px-6 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isDark
                            ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          navigate(`/admin-panel/department/${id}`)
                        }
                      >
                        {t("departmentForm.buttons.cancel") || "Cancel"}
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || loadingUpdateDepartment}
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isSubmitting || loadingUpdateDepartment
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting || loadingUpdateDepartment ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {t("departmentForm.buttons.editing") ||
                              "Updating..."}
                          </div>
                        ) : (
                          t("departmentForm.buttons.edit") ||
                          "Update Department"
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDepartment;
