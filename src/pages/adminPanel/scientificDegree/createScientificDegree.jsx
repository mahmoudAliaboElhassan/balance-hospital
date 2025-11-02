import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { createScientificDegree } from "../../../state/act/actScientificDegree"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react"
import UseFormValidation from "../../../hooks/use-form-validation"
import UseInitialValues from "../../../hooks/use-initial-values"

function CreateScientificDegree() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentLang = i18n.language
  const isRTL = currentLang === "ar"

  const {
    loadingCreateScientificDegree,
    createError,
    createSuccess,
    createMessage,
  } = useSelector((state) => state.scientificDegree)

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  // Validation schema
  const { VALIDATION_SCHEMA_ADD_SCIENTIFIC_DEGREE } = UseFormValidation()
  // Initial form values
  const { INITIAL_VALUES_ADD_SCIENTIFIC_DEGREE } = UseInitialValues()
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(createScientificDegree(values)).unwrap()

      // Success handling
      resetForm()
      toast.success(t("scientificDegrees.success.created"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      navigate("/admin-panel/scientific-degrees")
    } catch (error) {
      console.error("Scientific Degree creation error:", error)

      Swal.fire({
        title: t("scientificDegrees.error.title"),
        text:
          currentLang === "en"
            ? error?.messageEn ||
              error?.message ||
              "Failed to create scientific degree"
            : error?.messageAr ||
              error?.message ||
              "فشل في إنشاء الدرجة العلمية",
        icon: "error",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#3085d6",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/admin-panel/scientific-degrees"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("scientificDegrees.backToList")}
              </span>
            </Link>
          </div>

          <h1
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("scientificDegrees.form.create.title")}
          </h1>
          <p
            className={`mt-2 text-lg ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("scientificDegrees.form.create.description")}
          </p>
        </div>

        {/* Form */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm border ${
            isDark ? "border-gray-700" : "border-gray-200"
          } p-6`}
        >
          <Formik
            initialValues={INITIAL_VALUES_ADD_SCIENTIFIC_DEGREE}
            validationSchema={VALIDATION_SCHEMA_ADD_SCIENTIFIC_DEGREE}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Arabic Name */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("scientificDegrees.form.nameArabic")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="nameArabic"
                    type="text"
                    placeholder={t(
                      "scientificDegrees.form.nameArabicPlaceholder"
                    )}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    } ${
                      errors.nameArabic && touched.nameArabic
                        ? "border-red-500"
                        : ""
                    }`}
                    dir="rtl"
                  />
                  <ErrorMessage
                    name="nameArabic"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* English Name */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("scientificDegrees.form.nameEnglish")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="nameEnglish"
                    type="text"
                    placeholder={t(
                      "scientificDegrees.form.nameEnglishPlaceholder"
                    )}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    } ${
                      errors.nameEnglish && touched.nameEnglish
                        ? "border-red-500"
                        : ""
                    }`}
                    dir="ltr"
                  />
                  <ErrorMessage
                    name="nameEnglish"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Code */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("scientificDegrees.form.code")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="code"
                    type="text"
                    placeholder={t("scientificDegrees.form.codePlaceholder")}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    } ${errors.code && touched.code ? "border-red-500" : ""}`}
                    dir="ltr"
                  />
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("scientificDegrees.form.codeHint")}
                  </p>
                  <ErrorMessage
                    name="code"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <div className="flex items-start">
                    <Field
                      name="isActive"
                      type="checkbox"
                      className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                        isDark ? "bg-gray-700 border-gray-600" : ""
                      }`}
                    />
                    <div className={`${isRTL ? "mr-3" : "ml-3"}`}>
                      <label
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("scientificDegrees.form.isActive")}
                      </label>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("scientificDegrees.form.isActiveHint")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {createError && (
                  <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                    <p className="font-medium">
                      {currentLang === "en"
                        ? createError.messageEn ||
                          createError.message ||
                          "An error occurred"
                        : createError.messageAr ||
                          createError.message ||
                          "حدث خطأ"}
                    </p>
                    {createError.errors && createError.errors.length > 0 && (
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {createError.errors.map((error, index) => (
                          <li key={index} className="text-sm">
                            {error}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || loadingCreateScientificDegree}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {(isSubmitting || loadingCreateScientificDegree) && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <Save size={16} />
                    {isSubmitting || loadingCreateScientificDegree
                      ? t("scientificDegrees.form.create.creating")
                      : t("scientificDegrees.form.create.submit")}
                  </button>

                  <Link
                    to="/admin-panel/scientific-degrees"
                    className={`flex-1 border border-gray-300 dark:border-gray-600 ${
                      isDark
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    } px-6 py-3 rounded-lg font-medium transition-colors text-center flex items-center justify-center gap-2`}
                  >
                    <X size={16} />
                    {t("common.cancel")}
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default CreateScientificDegree
