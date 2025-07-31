import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  updateCategory,
  getCategoryById,
} from "../../../state/act/actCategory";
import { useNavigate, useParams } from "react-router-dom";
import UseFormValidation from "../../../hooks/use-form-validation";
import LoadingGetData from "../../../components/LoadingGetData";

function EditCategory() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { catId: id } = useParams();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const {
    loadingUpdateCategory,
    updateError,
    updateSuccess,
    updateMessage,
    selectedCategory,
    loadingGetSingleCategory,
    singleCategoryError,
  } = useSelector((state) => state.category);

  // Validation schema with translations
  const { VALIDATION_SCHEMA_EDIT_CATEGORY } = UseFormValidation();

  // Fetch category data on component mount
  useEffect(() => {
    if (id) {
      dispatch(getCategoryById({ categoryId: id }));
    }
  }, [dispatch, id]);

  // Initial form values based on selected category
  const getInitialValues = () => {
    if (selectedCategory) {
      return {
        id: selectedCategory.id,
        nameArabic: selectedCategory.nameArabic || "",
        nameEnglish: selectedCategory.nameEnglish || "",
        code: selectedCategory.code || "",
        description: selectedCategory.description || "",
        isActive: selectedCategory.isActive || false,
      };
    }
    return {
      id: parseInt(id),
      nameArabic: "",
      nameEnglish: "",
      code: "",
      description: "",
      isActive: true,
    };
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    dispatch(updateCategory({ categoryId: id, categoryData: values }))
      .unwrap()
      .then(() => {
        // Success handling
        toast.success(t("categoryForm.success.updated"), {
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
        console.error("Category update error:", error);

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
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Show loading state while fetching category
  if (loadingGetSingleCategory) {
    return <LoadingGetData />;
  }

  // Show error state if category not found
  if (singleCategoryError) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            {currentLang === "ar"
              ? singleCategoryError.message
              : "Category not found"}
          </div>
          <button
            onClick={() => navigate("/admin-panel/categories")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("common.goBack")}
          </button>
        </div>
      </div>
    );
  }

  // Don't render form until category data is loaded
  if (!selectedCategory) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">{t("common.noData")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2
        className={`text-2xl font-bold text-gray-800 mb-6 text-center ${
          isRTL ? "font-arabic" : ""
        }`}
      >
        {t("categoryForm.editTitle")}
      </h2>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={VALIDATION_SCHEMA_EDIT_CATEGORY}
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
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  navigate("/admin-panel/categories");
                }}
              >
                {t("categoryForm.buttons.cancel")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || loadingUpdateCategory}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting || loadingUpdateCategory
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting || loadingUpdateCategory ? (
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
                    {t("categoryForm.buttons.editing")}
                  </div>
                ) : (
                  t("categoryForm.buttons.edit")
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditCategory;
