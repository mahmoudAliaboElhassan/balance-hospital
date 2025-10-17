import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MapPin } from "lucide-react"
import { useEffect } from "react"
import UseFormValidation from "../../../../../hooks/use-form-validation"
import {
  editGeofence,
  getGeofFence,
} from "../../../../../state/act/actDepartment"
import LoadingGetData from "../../../../../components/LoadingGetData"

function EditGeofence() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { departmentId: id } = useParams()
  const currentLang = i18n.language
  const isRTL = currentLang === "ar"

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  const { singleGeoFence, loadingGetGeofence, loadingEditGeoFence, error } =
    useSelector((state) => state.department)

  const { VALIDATION_SCHEMA_CREATE_GOEFENCE } = UseFormValidation()

  useEffect(() => {
    if (id) {
      dispatch(getGeofFence({ fenceId: id }))
    }
  }, [dispatch, id])

  const initialValues = {
    name: "arwe",
    latitude: singleGeoFence?.latitude || "",
    longitude: singleGeoFence?.longitude || "",
    radiusMeters: singleGeoFence?.radiusMeters || "",
    priority: 100,
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const submissionData = {
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
      radiusMeters: parseInt(values.radiusMeters),
      priority: 100,
    }

    try {
      await dispatch(
        editGeofence({
          fenceId: id,
          data: submissionData,
        })
      ).unwrap()

      toast.success(
        t("geoFenceForm.success.updated") || "GeoFence updated successfully",
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
    } catch (error) {
      console.error("GeoFence update error:", error)

      Swal.fire({
        title: t("geoFenceForm.error.title") || "Error",
        text:
          currentLang === "en"
            ? error?.messageEn || error?.message || "Failed to update geofence"
            : error?.message ||
              error?.messageEn ||
              "فشل في تحديث السياج الجغرافي",
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

  if (loadingGetGeofence) {
    return <LoadingGetData text={t("gettingData.geofence")} />
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
                <ArrowLeft size={20} />
              </button>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } ${isRTL ? "font-arabic" : ""}`}
              >
                {t("geoFenceForm.editTitle") || "Edit GeoFence"}
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
                initialValues={initialValues}
                validationSchema={VALIDATION_SCHEMA_CREATE_GOEFENCE}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched }) => (
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
                        onClick={() => navigate(-1)}
                      >
                        {t("geoFenceForm.buttons.cancel") || "Cancel"}
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || loadingEditGeoFence}
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isSubmitting || loadingEditGeoFence
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting || loadingEditGeoFence ? (
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
                            {t("geoFenceForm.buttons.updating") ||
                              "Updating..."}
                          </div>
                        ) : (
                          t("geoFenceForm.buttons.update") || "Update GeoFence"
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

export default EditGeofence
