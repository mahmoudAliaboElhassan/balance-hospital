import { useEffect } from "react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { Save, ArrowLeft } from "lucide-react"
import {
  getWorkingHour,
  updateWorkingHour,
} from "../../../state/act/actRosterManagement"
import UseFormValidation from "../../../hooks/use-form-validation"
import LoadingGetData from "../../../components/LoadingGetData"

function EditWorkingHour() {
  const { workingHourId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { workingHour, loading } = useSelector(
    (state) => state.rosterManagement
  )
  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  const { t } = useTranslation()
  const currentLang = i18next.language
  const isRTL = currentLang === "ar"

  useEffect(() => {
    if (workingHourId) {
      dispatch(getWorkingHour({ workingHourId }))
    }
  }, [dispatch, workingHourId])

  // Validation schema
  const { VALIDATION_SCHEMA_EDIT_WORKING_HOUR } = UseFormValidation()

  // Initial values from store
  const initialValues = {
    rosterWorkingHoursId: workingHour?.id || "",
    requiredDoctors: workingHour?.requiredDoctors || 1,
    maxDoctors: workingHour?.maxDoctors || 1,
    notes: workingHour?.notes || "",
    modificationReason: "",
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updateData = {
        rosterWorkingHoursId: parseInt(values.rosterWorkingHoursId),
        requiredDoctors: parseInt(values.requiredDoctors),
        maxDoctors: parseInt(values.maxDoctors),
        notes: values.notes || "",
        modificationReason: values.modificationReason,
      }

      console.log("Updating working hour:", updateData)

      await dispatch(
        updateWorkingHour({
          workingHourId: workingHourId,
          data: updateData,
        })
      ).unwrap()

      toast.success(t("roster.workingHours.success.updated"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      // Navigate back or to a specific route
      navigate(-1) // Go back to previous page
    } catch (error) {
      console.error("Working hour update error:", error)

      Swal.fire({
        title: t("roster.workingHours.error.updateTitle"),
        text:
          currentLang === "en"
            ? error?.response?.data?.messageEn ||
              error?.message ||
              t("roster.workingHours.error.updateMessage")
            : error?.response?.data?.messageAr ||
              error?.message ||
              t("roster.workingHours.error.updateMessage"),
        icon: "error",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#ef4444",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading?.fetch) {
    return <LoadingGetData text={t("gettingData.workingHour")} />
  }

  if (!workingHour) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className={`text-center ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <p>{t("roster.workingHours.error.notFound")}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} py-6`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              } transition-colors mr-3`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.workingHours.editTitle")}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                {t("roster.workingHours.editSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div
          className={`${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-lg shadow border p-6`}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={VALIDATION_SCHEMA_EDIT_WORKING_HOUR}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-6">
                {/* Working Hours ID (Hidden) */}
                <Field type="hidden" name="rosterWorkingHoursId" />

                {/* Required Doctors */}
                <div>
                  <label
                    htmlFor="requiredDoctors"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t("roster.workingHours.fields.requiredDoctors")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="number"
                    id="requiredDoctors"
                    name="requiredDoctors"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.requiredDoctors && touched.requiredDoctors
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="requiredDoctors"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Max Doctors */}
                <div>
                  <label
                    htmlFor="maxDoctors"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t("roster.workingHours.fields.maxDoctors")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="number"
                    id="maxDoctors"
                    name="maxDoctors"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.maxDoctors && touched.maxDoctors
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="maxDoctors"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t("roster.workingHours.fields.notes")}
                  </label>
                  <Field
                    as="textarea"
                    id="notes"
                    name="notes"
                    rows={4}
                    dir={isRTL ? "rtl" : "ltr"}
                    className={`w-full px-3 py-2 border rounded-lg text-sm resize-vertical ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.notes && touched.notes
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : ""
                    }`}
                    placeholder={t("roster.workingHours.placeholders.notes")}
                  />
                  <ErrorMessage
                    name="notes"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p
                    className={`mt-1 text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {values.notes?.length || 0}/500{" "}
                    {t("roster.workingHours.charactersCount")}
                  </p>
                </div>

                {/* Modification Reason */}
                <div>
                  <label
                    htmlFor="modificationReason"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t("roster.workingHours.fields.modificationReason")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="modificationReason"
                    name="modificationReason"
                    rows={3}
                    dir={isRTL ? "rtl" : "ltr"}
                    className={`w-full px-3 py-2 border rounded-lg text-sm resize-vertical ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.modificationReason && touched.modificationReason
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : ""
                    }`}
                    placeholder={t(
                      "roster.workingHours.placeholders.modificationReason"
                    )}
                  />
                  <ErrorMessage
                    name="modificationReason"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p
                    className={`mt-1 text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {values.modificationReason?.length || 0}/500{" "}
                    {t("roster.workingHours.charactersCount")}
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      isDark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ArrowLeft size={16} className={isRTL ? "ml-2" : "mr-2"} />
                    {t("common.cancel")}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || loading?.update}
                    className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting || loading?.update ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t("roster.actions.updating")}
                      </>
                    ) : (
                      <>
                        <Save size={16} className={isRTL ? "ml-2" : "mr-2"} />
                        {t("roster.actions.update")}
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default EditWorkingHour
