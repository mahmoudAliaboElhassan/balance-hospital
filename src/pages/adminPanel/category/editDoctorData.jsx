import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { getDoctorData, updateDoctorData } from "../../../state/act/actUsers"
import { useNavigate, useParams } from "react-router-dom"
import {
  getScientificDegrees,
  getScientificDegreesForSignup,
} from "../../../state/act/actScientificDegree"
import {
  getContractingTypes,
  getContractingTypesForSignup,
} from "../../../state/act/actContractingType"
import LoadingGetData from "../../../components/LoadingGetData"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getAvailbleScientficDegrees } from "../../../state/act/actRosterManagement"

function EditDoctorData() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const currentLang = i18n.language
  const isRTL = currentLang === "ar"

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  // Redux selectors
  const { userData, loading } = useSelector((state) => state.users)
  const { scientificDegreesForSignup, loadingGetScientificDegreesForSignup } =
    useSelector((state) => state.scientificDegree)
  const { contractingTypesForSignup, loadingGetContractingTypesForSignup } =
    useSelector((state) => state.contractingType)

  // Load initial data
  useEffect(() => {
    if (id) {
      dispatch(getDoctorData({ userId: id }))
    }
    dispatch(getScientificDegreesForSignup())
    dispatch(getContractingTypesForSignup())
  }, [dispatch, id])

  // Validation Schema
  const validationSchema = Yup.object().shape({
    scientificDegreeId: Yup.number()
      .required(
        t("doctorForm.validation.scientificDegreeRequired") ||
          "Scientific degree is required"
      )
      .positive(
        t("doctorForm.validation.scientificDegreeRequired") ||
          "Scientific degree is required"
      ),
    contractingTypeId: Yup.number()
      .required(
        t("doctorForm.validation.contractingTypeRequired") ||
          "Contracting type is required"
      )
      .positive(
        t("doctorForm.validation.contractingTypeRequired") ||
          "Contracting type is required"
      ),
    // updateReason: Yup.string()
    //   .required(
    //     t("doctorForm.validation.updateReasonRequired") ||
    //       "Update reason is required"
    //   )
    //   .min(
    //     10,
    //     t("doctorForm.validation.updateReasonMin") ||
    //       "Update reason must be at least 10 characters"
    //   )
    //   .max(
    //     500,
    //     t("doctorForm.validation.updateReasonMax") ||
    //       "Update reason must not exceed 500 characters"
    //   ),
  })

  // Loading state
  if (
    loading.list ||
    loadingGetScientificDegreesForSignup ||
    loadingGetContractingTypesForSignup
  ) {
    return (
      <LoadingGetData
        text={t("gettingData.doctorData") || "Loading doctor data..."}
      />
    )
  }

  // Error state
  if (!userData) {
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
                  {t("doctorForm.error.notFound") || "Doctor data not found"}
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t("common.goBack") || "Go Back"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Initialize form values
  const getInitialValues = () => {
    return {
      fullNameAr: userData.nameArabic || "",
      fullNameEn: userData.nameEnglish || "",
      email: userData.email || "",
      mobile: userData.mobile || "",
      primaryCategoryId: userData.primaryCategory?.id || "",
      scientificDegreeId: userData.scientificDegree?.id || "",
      contractingTypeId: userData.contractingType?.id || "",
      updateReason: "",
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const updateData = {
      fullNameAr: values.fullNameAr,
      fullNameEn: values.fullNameEn,
      email: values.email,
      mobile: values.mobile,
      primaryCategoryId: values.primaryCategoryId,
      scientificDegreeId: values.scientificDegreeId,
      contractingTypeId: values.contractingTypeId,
      updateReason: values.updateReason,
    }
    console.log("updateData", updateData)
    dispatch(updateDoctorData({ userId: id, userData: updateData }))
      .unwrap()
      .then(() => {
        toast.success(
          t("doctorForm.success.updated") || "Doctor data updated successfully",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        )
        navigate(-1)
      })
      .catch((error) => {
        console.error("Doctor update error:", error)
        Swal.fire({
          title: t("doctorForm.error.title") || "Update Failed",
          text:
            currentLang === "en"
              ? error?.messageEn ||
                error?.message ||
                "Failed to update doctor data"
              : error?.messageAr || error?.message || "فشل تحديث بيانات الطبيب",
          icon: "error",
          confirmButtonText: t("common.ok") || "OK",
          confirmButtonColor: "#ef4444",
          background: isDark ? "#2d2d2d" : "#ffffff",
          color: isDark ? "#f0f0f0" : "#111827",
        })
      })
      .finally(() => setSubmitting(false))
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
              <button
                onClick={() => navigate(-1)}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {currentLang == "en" ? (
                  <ArrowLeft size={20} />
                ) : (
                  <ArrowRight size={20} />
                )}{" "}
              </button>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } ${isRTL ? "font-arabic" : ""}`}
              >
                {t("doctorForm.editTitle") || "Edit Doctor Data"}
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
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched, values }) => (
                  <Form className="space-y-6">
                    {/* Basic Information Section (Disabled Fields) */}
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
                        {/* Arabic Name - Disabled */}
                        <div>
                          <label
                            htmlFor="fullNameAr"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("department.table.nameArabic") || "Arabic Name"}
                          </label>
                          <Field
                            type="text"
                            id="fullNameAr"
                            name="fullNameAr"
                            dir="rtl"
                            disabled
                            className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-not-allowed ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-gray-400"
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                        </div>

                        {/* English Name - Disabled */}
                        <div>
                          <label
                            htmlFor="fullNameEn"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("department.table.nameEnglish") ||
                              "English Name"}
                          </label>
                          <Field
                            type="text"
                            id="fullNameEn"
                            name="fullNameEn"
                            disabled
                            className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-not-allowed ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-gray-400"
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email - Disabled */}
                        <div>
                          <label
                            htmlFor="email"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("email") || "Email"}
                          </label>
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            disabled
                            className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-not-allowed ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-gray-400"
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                        </div>

                        {/* Mobile - Disabled */}
                        <div>
                          <label
                            htmlFor="mobile"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("mobile") || "Mobile"}
                          </label>
                          <Field
                            type="text"
                            id="mobile"
                            name="mobile"
                            disabled
                            className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-not-allowed ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-gray-400"
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Primary Category - Disabled */}
                      <div>
                        <label
                          htmlFor="primaryCategoryId"
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("department.table.category") || "Primary Category"}
                        </label>
                        <Field
                          type="text"
                          id="primaryCategoryDisplay"
                          value={
                            currentLang === "ar"
                              ? userData.primaryCategory?.nameArabic
                              : userData.primaryCategory?.nameEnglish
                          }
                          disabled
                          className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-not-allowed ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-gray-400"
                              : "bg-gray-100 border-gray-300 text-gray-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Editable Fields Section */}
                    <div className="space-y-6">
                      <h3
                        className={`text-lg font-semibold border-b pb-2 ${
                          isDark
                            ? "text-white border-gray-600"
                            : "text-gray-900 border-gray-200"
                        }`}
                      >
                        {t("users.professionalInformation") ||
                          "Professional Information"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Scientific Degree */}
                        <div>
                          <label
                            htmlFor="scientificDegreeId"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("users.scientificDegree") || "Scientific Degree"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="select"
                            id="scientificDegreeId"
                            name="scientificDegreeId"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.scientificDegreeId &&
                              touched.scientificDegreeId
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                          >
                            <option value="">
                              {t("doctorForm.placeholders.scientificDegree") ||
                                "Select scientific degree"}
                            </option>
                            {scientificDegreesForSignup?.map((degree) => (
                              <option key={degree.id} value={degree.id}>
                                {currentLang === "ar"
                                  ? degree.nameArabic
                                  : degree.nameEnglish}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="scientificDegreeId"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        {/* Contracting Type */}
                        <div>
                          <label
                            htmlFor="contractingTypeId"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("users.contractingType") || "Contracting Type"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="select"
                            id="contractingTypeId"
                            name="contractingTypeId"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.contractingTypeId &&
                              touched.contractingTypeId
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                          >
                            <option value="">
                              {t("doctorForm.placeholders.contractingType") ||
                                "Select contracting type"}
                            </option>
                            {contractingTypesForSignup?.map((type) => (
                              <option key={type.id} value={type.id}>
                                {currentLang === "ar"
                                  ? type.nameArabic
                                  : type.nameEnglish}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="contractingTypeId"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                      </div>

                      {/* Update Reason */}
                      <div>
                        <label
                          htmlFor="updateReason"
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("managementRoles.delete.reason") ||
                            "Update Reason"}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="textarea"
                          id="updateReason"
                          name="updateReason"
                          rows={4}
                          dir={isRTL ? "rtl" : "ltr"}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900"
                          } ${
                            errors.updateReason && touched.updateReason
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                          }`}
                          placeholder={
                            t("roster.phaseOne.placeholders.updateReason") ||
                            "Explain the reason for this update..."
                          }
                        />
                        <ErrorMessage
                          name="updateReason"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                        <p
                          className={`mt-1 text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("doctorForm.hints.updateReason") ||
                            "Minimum 10 characters, maximum 500 characters"}
                        </p>
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
                        onClick={() => navigate(-1)}
                      >
                        {t("doctorForm.buttons.cancel") || "Cancel"}
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || loading.update}
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isSubmitting || loading.update
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting || loading.update ? (
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
                            {t("doctorForm.buttons.updating") || "Updating..."}
                          </div>
                        ) : (
                          t("doctorForm.buttons.update") || "Update Doctor Data"
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
  )
}

export default EditDoctorData
