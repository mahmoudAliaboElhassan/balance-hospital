import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { createCategory } from "../../../state/act/actCategory";
import { useNavigate } from "react-router-dom";
import UseInitialValues from "../../../hooks/use-initial-values";
import UseFormValidation from "../../../hooks/use-form-validation";

function CreateCategory() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const { loadingCreateCategory, createError, createSuccess, createMessage } =
    useSelector((state) => state.category);

  // Validation schema with translations
  const { VALIDATION_SCHEMA_ADD_CATEGORY } = UseFormValidation();
  const navigate = useNavigate();
  // Initial form values
  const { INITIAL_VALUES_ADD_CATEGORY } = UseInitialValues();
  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    dispatch(createCategory(values))
      .unwrap()
      .then(() => {
        // Success handling
        resetForm();
        toast.success(t("categoryForm.success.created"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/admin-panel/categories");
      })
      .catch((error) => {
        console.error("Category creation error:", error);

        Swal.fire({
          title: t("categoryForm.error.title"),
          text:
            currentLang === "en"
              ? error?.response?.data?.messageEn || error?.message
              : error?.response?.data?.messageAr ||
                error?.message ||
                t("category.error.message"),
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: "#ffffff",
          color: "#111827",
        });
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2
        className={`text-2xl font-bold text-gray-800 mb-6 text-center ${
          isRTL ? "font-arabic" : ""
        }`}
      >
        {t("categoryForm.title")}
      </h2>

      <Formik
        initialValues={INITIAL_VALUES_ADD_CATEGORY}
        validationSchema={VALIDATION_SCHEMA_ADD_CATEGORY}
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
                {t("categoryForm.fields.nameArabic")}{" "}
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
                placeholder={t("categoryForm.placeholders.nameArabic")}
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
                {t("categoryForm.fields.nameEnglish")}{" "}
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
                placeholder={t("categoryForm.placeholders.nameEnglish")}
              />
              <ErrorMessage
                name="nameEnglish"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Code */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("categoryForm.fields.code")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="code"
                name="code"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
                  errors.code && touched.code
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("categoryForm.placeholders.code")}
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
              <p className="mt-1 text-xs text-gray-500">
                {t("categoryForm.hints.code")}
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("categoryForm.fields.description")}
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={4}
                dir={isRTL ? "rtl" : "ltr"}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                  errors.description && touched.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("categoryForm.placeholders.description")}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                {values.description.length}/500{" "}
                {t("categoryForm.charactersCount")}
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
                  isRTL ? "ml-2" : "mr-2"
                }`}
              >
                {t("categoryForm.fields.isActive")}
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
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                onClick={() => {
                  window.history.back();
                }}
              >
                {t("categoryForm.buttons.cancel")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || loadingCreateCategory}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                  isSubmitting || loadingCreateCategory
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting || loadingCreateCategory ? (
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
                    {t("categoryForm.buttons.creating")}
                  </div>
                ) : (
                  t("categoryForm.buttons.create")
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateCategory;
