import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { createSubDepartment } from "../../../state/act/actSubDepartment";
import { getDepartments } from "../../../state/act/actDepartment";
import { useNavigate } from "react-router-dom";
import UseInitialValues from "../../../hooks/use-initial-values";
import UseFormValidation from "../../../hooks/use-form-validation";
import LoadingGetData from "../../../components/LoadingGetData";

function CreateSubDepartment() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const {
    loadingCreateSubDepartment,
    createError,
    createSuccess,
    createMessage,
  } = useSelector((state) => state.subDepartment);

  const { loadingGetDepartments } = useSelector((state) => state.department);

  useEffect(() => {
    dispatch(getDepartments({ isActive: true }));
  }, [dispatch]);

  // Get departments for dropdown
  const { departments } = useSelector((state) => state.department);

  // Validation schema with translations
  const { VALIDATION_SCHEMA_ADD_SUBDEPARTMENT } = UseFormValidation();
  const navigate = useNavigate();

  // Initial form values
  const { INITIAL_VALUES_ADD_SUBDEPARTMENT } = UseInitialValues();

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    dispatch(createSubDepartment(values))
      .unwrap()
      .then(() => {
        // Success handling
        resetForm();
        toast.success(t("subDepartmentForm.success.created"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/admin-panel/sub-departments");
      })
      .catch((error) => {
        console.error("SubDepartment creation error:", error);

        Swal.fire({
          title: t("subDepartmentForm.error.title"),
          text:
            currentLang === "en"
              ? error?.response?.data?.messageEn || error?.message
              : error?.response?.data?.messageAr ||
                error?.message ||
                t("subDepartment.error.message"),
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: "#ffffff",
          color: "#111827",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (loadingGetDepartments) return <LoadingGetData />;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2
        className={`text-2xl font-bold text-gray-800 mb-6 text-center ${
          isRTL ? "font-arabic" : ""
        }`}
      >
        {t("subDepartmentForm.title")}
      </h2>

      <Formik
        initialValues={INITIAL_VALUES_ADD_SUBDEPARTMENT}
        validationSchema={VALIDATION_SCHEMA_ADD_SUBDEPARTMENT}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Arabic Name */}
            <div>
              <label
                htmlFor="nameArabic"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("subDepartmentForm.fields.nameArabic")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nameArabic"
                name="nameArabic"
                dir="rtl"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nameArabic && touched.nameArabic
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("subDepartmentForm.placeholders.nameArabic")}
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("subDepartmentForm.fields.nameEnglish")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nameEnglish"
                name="nameEnglish"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nameEnglish && touched.nameEnglish
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("subDepartmentForm.placeholders.nameEnglish")}
              />
              <ErrorMessage
                name="nameEnglish"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Department Selection */}
            <div>
              <label
                htmlFor="departmentId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("subDepartmentForm.fields.department")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="departmentId"
                name="departmentId"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.departmentId && touched.departmentId
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">
                  {t("subDepartmentForm.placeholders.department")}
                </option>
                {departments?.map((department) => (
                  <option key={department.id} value={department.id}>
                    {currentLang === "ar"
                      ? department.nameArabic
                      : department.nameEnglish}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="departmentId"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("subDepartmentForm.fields.location")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="location"
                name="location"
                dir={isRTL ? "rtl" : "ltr"}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.location && touched.location
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("subDepartmentForm.placeholders.location")}
              />
              <ErrorMessage
                name="location"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("subDepartmentForm.hints.location")}
              </p>
            </div>

            {/* Description (Optional) */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("subDepartmentForm.fields.description")}
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={3}
                dir={isRTL ? "rtl" : "ltr"}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.description && touched.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("subDepartmentForm.placeholders.description")}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("subDepartmentForm.hints.description")}
              </p>
            </div>

            {/* Is Active */}
            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Field
                type="checkbox"
                id="isActive"
                name="isActive"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className={`block text-sm text-gray-700 ${
                  isRTL ? "mr-2" : "ml-2"
                }`}
              >
                {t("subDepartmentForm.fields.isActive")}
              </label>
            </div>

            {/* Submit Button */}
            <div
              className={`flex justify-end space-x-3 pt-4 ${
                isRTL ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  window.history.back();
                }}
              >
                {t("subDepartmentForm.buttons.cancel")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || loadingCreateSubDepartment}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting || loadingCreateSubDepartment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting || loadingCreateSubDepartment ? (
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
                    {t("subDepartmentForm.buttons.creating")}
                  </div>
                ) : (
                  t("subDepartmentForm.buttons.create")
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateSubDepartment;
