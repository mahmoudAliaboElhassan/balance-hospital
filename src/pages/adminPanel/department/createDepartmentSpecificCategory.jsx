import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { createDepartment } from "../../../state/act/actDepartment"
import { useNavigate } from "react-router-dom"
import UseInitialValues from "../../../hooks/use-initial-values"
import UseFormValidation from "../../../hooks/use-form-validation"
import i18next from "i18next"

function CreateDepartmentSpecificCategory() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const currentLang = i18n.language
  const isRTL = currentLang === "ar"

  const { loadingCreateDepartment, createError, createSuccess, createMessage } =
    useSelector((state) => state.department)

  // Validation schema with translations
  const { VALIDATION_SCHEMA_ADD_DEPARTMENT } = UseFormValidation()
  const navigate = useNavigate()

  // Initial form values
  const { INITIAL_VALUES_ADD_DEPARTMENT } = UseInitialValues()

  // Get categoryId from localStorage
  const categoryId = localStorage.getItem("categoryId")
  const currentLanguage = i18next.language
  const name =
    currentLanguage === "en"
      ? localStorage.getItem("categoryEnglishName")
      : localStorage.getItem("categoryArabicName")
  // Enhanced initial values with categoryId from localStorage
  const enhancedInitialValues = {
    ...INITIAL_VALUES_ADD_DEPARTMENT,
    categoryId: categoryId || "",
  }

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    // Ensure categoryId is included in the submission
    const submissionValues = {
      ...values,
      categoryId: categoryId || values.categoryId,
    }

    dispatch(createDepartment(submissionValues))
      .unwrap()
      .then(() => {
        // Success handling
        resetForm()
        toast.success(t("departmentForm.success.created"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        navigate("/admin-panel/departments")
      })
      .catch((error) => {
        console.error("Department creation error:", error)

        Swal.fire({
          title: t("departmentForm.error.title"),
          text:
            currentLang === "en"
              ? error?.response?.data?.messageEn || error?.message
              : error?.response?.data?.messageAr ||
                error?.message ||
                t("department.error.message"),
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: "#ffffff",
          color: "#111827",
        })
      })
  }

  // Check if categoryId exists in localStorage
  useEffect(() => {
    if (!categoryId) {
      console.warn("No categoryId found in localStorage")
      // Optionally show a warning or redirect
      toast.warning(t("departmentForm.warning.noCategorySelected"), {
        position: "top-right",
        autoClose: 5000,
      })
    }
  }, [categoryId, t])

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2
        className={`text-2xl font-bold text-gray-800 mb-6 text-center ${
          isRTL ? "font-arabic" : ""
        }`}
      >
        {t("departmentForm.title")}
      </h2>
      <Formik
        initialValues={enhancedInitialValues}
        validationSchema={VALIDATION_SCHEMA_ADD_DEPARTMENT}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Hidden field for categoryId */}
            <Field type="hidden" name="categoryId" value={categoryId || ""} />
            {/* Category Name Display */}
            {name && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  {t("departmentForm.fields.category")}
                </label>
                <div
                  className={`text-lg font-semibold text-blue-800 ${
                    isRTL ? "text-right font-arabic" : "text-left"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {name}
                </div>
              </div>
            )}
            {/* Arabic Name */}
            <div>
              <label
                htmlFor="nameArabic"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("departmentForm.fields.nameArabic")}{" "}
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
                placeholder={t("departmentForm.placeholders.nameArabic")}
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
                {t("departmentForm.fields.nameEnglish")}{" "}
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
                placeholder={t("departmentForm.placeholders.nameEnglish")}
              />
              <ErrorMessage
                name="nameEnglish"
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
                {t("departmentForm.fields.location")}
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
                placeholder={t("departmentForm.placeholders.location")}
              />
              <ErrorMessage
                name="location"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
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
                {t("departmentForm.fields.isActive")}
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
                  window.history.back()
                }}
              >
                {t("departmentForm.buttons.cancel")}
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting || loadingCreateDepartment || !categoryId
                }
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting || loadingCreateDepartment || !categoryId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting || loadingCreateDepartment ? (
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
                    {t("departmentForm.buttons.creating")}
                  </div>
                ) : (
                  t("departmentForm.buttons.create")
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateDepartmentSpecificCategory
