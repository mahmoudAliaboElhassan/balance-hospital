import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MapPin, Wifi, Radio, ArrowRight } from "lucide-react"
import UseInitialValues from "../../../../../hooks/use-initial-values"
import UseFormValidation from "../../../../../hooks/use-form-validation"
import { createGoFence } from "../../../../../state/act/actDepartment"

function CreateGeoFence() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { departmentId } = useParams()
  const currentLang = i18n.language
  const isRTL = currentLang === "ar"

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  const { loadingCreateGofence, error } = useSelector(
    (state) => state.department
  )

  const { VALIDATION_SCHEMA_CREATE_GOEFENCE } = UseFormValidation()

  // Initial Values

  const { INITIAL_VALUES_ADD_GOEFENCE } = UseInitialValues()

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const submissionData = {
      ...values,
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
      radiusMeters: parseInt(values.radiusMeters),
      priority: 100,
    }

    try {
      await dispatch(
        createGoFence({
          departmentId: departmentId,
          data: submissionData,
        })
      ).unwrap()

      toast.success(
        t("geoFenceForm.success.created") || "GeoFence created successfully",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )

      resetForm()
      navigate(`/admin-panel/department/${departmentId}`)
    } catch (error) {
      console.error("GeoFence creation error:", error)

      Swal.fire({
        title: t("geoFenceForm.error.title") || "Error",
        text:
          currentLang === "en"
            ? error?.messageEn || error?.message || "Failed to create geofence"
            : error?.message ||
              error?.messageEn ||
              "فشل في إنشاء السياج الجغرافي",
        icon: "error",
        confirmButtonText: t("common.ok") || "OK",
        confirmButtonColor: "#ef4444",
        background: isDark ? "#2d2d2d" : "#ffffff",
        color: isDark ? "#f0f0f0" : "#111827",
      })
    } finally {
      setSubmitting(false)
    }
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
                {t("geoFenceForm.title") || "Create GeoFence"}
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
                initialValues={INITIAL_VALUES_ADD_GOEFENCE}
                validationSchema={VALIDATION_SCHEMA_CREATE_GOEFENCE}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                      <h3
                        className={`text-lg font-semibold border-b pb-2 flex items-center gap-2 ${
                          isDark
                            ? "text-white border-gray-600"
                            : "text-gray-900 border-gray-200"
                        }`}
                      >
                        <MapPin size={20} />
                        {t("geoFenceForm.sections.basicInfo") ||
                          "Basic Information"}
                      </h3>

                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("geoFenceForm.fields.name") || "GeoFence Name"}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          dir={isRTL ? "rtl" : "ltr"}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900"
                          } ${
                            errors.name && touched.name
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                          }`}
                          placeholder={
                            t("geoFenceForm.placeholders.name") ||
                            "e.g., Emergency Department - Main Entrance"
                          }
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      {/* Location Coordinates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Latitude */}
                        <div>
                          <label
                            htmlFor="latitude"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("geoFenceForm.fields.latitude") || "Latitude"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="number"
                            id="latitude"
                            name="latitude"
                            step="0.000001"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.latitude && touched.latitude
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                            placeholder="27.1809"
                          />
                          <ErrorMessage
                            name="latitude"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        {/* Longitude */}
                        <div>
                          <label
                            htmlFor="longitude"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("geoFenceForm.fields.longitude") || "Longitude"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="number"
                            id="longitude"
                            name="longitude"
                            step="0.000001"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.longitude && touched.longitude
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                            placeholder="31.1837"
                          />
                          <ErrorMessage
                            name="longitude"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                      </div>

                      <div>
                        {/* Radius */}
                        <div>
                          <label
                            htmlFor="radiusMeters"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("geoFenceForm.fields.radius") ||
                              "Radius (meters)"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="number"
                            id="radiusMeters"
                            name="radiusMeters"
                            min="10"
                            max="10000"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.radiusMeters && touched.radiusMeters
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name="radiusMeters"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                          <p
                            className={`mt-1 text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("geoFenceForm.hints.radius") ||
                              "Range: 10 - 10,000 meters"}
                          </p>
                        </div>
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
                          navigate(
                            `/admin-panel/departments/${departmentId}/geofences`
                          )
                        }
                      >
                        {t("geoFenceForm.buttons.cancel") || "Cancel"}
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || loadingCreateGofence}
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isSubmitting || loadingCreateGofence
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting || loadingCreateGofence ? (
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
                            {t("geoFenceForm.buttons.creating") ||
                              "Creating..."}
                          </div>
                        ) : (
                          t("geoFenceForm.buttons.create") || "Create GeoFence"
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

export default CreateGeoFence
