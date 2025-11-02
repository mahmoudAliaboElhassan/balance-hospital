import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { Save, X } from "lucide-react"
import * as Yup from "yup"
import {
  getAvailbleScientficDegrees,
  getShiftContractingTypes,
  updateShiftContractingType,
} from "../../state/act/actRosterManagement"
import { useEffect } from "react"
import LoadingGetData from "../LoadingGetData"
import UseFormValidation from "../../hooks/use-form-validation"

function ModalEditContractingTypeModal({
  selectedContractingType,
  selectedShift,
  onClose,
}) {
  const dispatch = useDispatch()

  console.log("Selected Contracting Type:", selectedContractingType)

  const { loading } = useSelector((state) => state.rosterManagement)
  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"
  const { contractingTypes, loadingGetContractingTypes } = useSelector(
    (state) => state.contractingType
  )

  const { t } = useTranslation()
  const currentLang = i18next.language
  const isRTL = currentLang === "ar"

  useEffect(() => {
    // Fetch available contracting types when modal opens
    dispatch(getAvailbleScientficDegrees())
  }, [dispatch])

  // Validation schema - removed contractingTypeId validation since it's disabled
  const { VALIDATION_SCHEMA_EDIT_ROSTER_CONTRAFCTING_TYPES } =
    UseFormValidation()
  // Initial values
  const initialValues = {
    contractingTypeId: selectedContractingType?.contractingTypeId || "",
    defaultRequiredDoctors:
      selectedContractingType?.defaultRequiredDoctors || 1,
    defaultMaxDoctors: selectedContractingType?.defaultMaxDoctors || 1,
    notes: selectedContractingType?.notes || "",
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Form values on submit:", values)
      const updateData = {
        contractingTypeId: parseInt(values.contractingTypeId),
        defaultRequiredDoctors: parseInt(values.defaultRequiredDoctors),
        defaultMaxDoctors: parseInt(values.defaultMaxDoctors),
        notes: values.notes || "",
      }

      console.log("Updating contracting type:", updateData)

      await dispatch(
        updateShiftContractingType({
          shiftContractingTypeId: selectedContractingType.id,
          updateData,
        })
      ).unwrap()

      dispatch(
        getShiftContractingTypes({
          departmentShiftId: localStorage.getItem("currentShiftId"),
        })
      ).unwrap()
      toast.success(t("roster.contractingTypes.success.updated"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      // Call the parent update function to refresh data

      onClose()
    } catch (error) {
      console.error("Contracting type update error:", error)

      Swal.fire({
        title: t("roster.contractingTypes.error.updateTitle"),
        text:
          currentLang === "en"
            ? error?.response?.data?.messageEn ||
              error?.message ||
              t("roster.contractingTypes.error.updateMessage")
            : error?.response?.data?.messageAr ||
              error?.message ||
              t("roster.contractingTypes.error.updateMessage"),
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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 mt-8 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } rounded-lg shadow border`}
      >
        <div
          className={` p-6 rounded-lg border ${
            isDark
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }  
            } rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto`}
        >
          {loadingGetContractingTypes ? (
            <LoadingGetData text={t("gettingData.scientificDegrees")} />
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("roster.contractingTypes.editTitle")}
                  </h2>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mt-1`}
                  >
                    {selectedContractingType?.contractingTypeName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  } transition-colors`}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                className={`mb-4 p-4 rounded-lg border ${
                  isDark
                    ? "bg-blue-900/20 border-blue-700/50 text-blue-200"
                    : "bg-blue-50 border-blue-200 text-blue-800"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className={`${isRTL ? "mr-3" : "ml-3"} flex-1 text-sm`}>
                    <p className="font-semibold mb-2">
                      {currentLang === "ar"
                        ? "تنبيه هام عند تعديل الأعداد:"
                        : "Important Notice When Modifying Numbers:"}
                    </p>
                    <ul
                      className={`list-disc ${
                        isRTL ? "mr-5" : "ml-5"
                      } space-y-1`}
                    >
                      <li>
                        {currentLang === "ar"
                          ? "سيتم تطبيق هذه التعديلات على جميع ساعات العمل المستقبلية في هذه الوردية."
                          : "These changes will be applied to all future work hours in this shift."}
                      </li>
                      <li>
                        {currentLang === "ar"
                          ? "إذا كان هناك أطباء معينون بالفعل وتريد تقليل العدد المطلوب أو الحد الأقصى، سيتم تخطي الساعات التي تحتوي على عدد أطباء أكبر من العدد الجديد."
                          : "If there are already assigned doctors and you want to reduce the required or maximum number, hours with more assigned doctors than the new number will be skipped."}
                      </li>
                      <li className="font-medium">
                        {currentLang === "ar"
                          ? "مثال: إذا كان هناك 5 أطباء معينون والعدد المحدد 5، ولا يمكن تقليله إلى 2 لهذه الساعة المحددة. سيتم تحديث الساعات الأخرى التي لا تتأثر فقط."
                          : "Example: If there are 5 assigned doctors with a limit of 5, it cannot be reduced to 2 for that specific hour. Only unaffected hours will be updated."}
                      </li>
                      <li className="text-xs mt-2 opacity-90">
                        {currentLang === "ar"
                          ? "النظام سيقوم تلقائياً بتحديث الساعات التي يمكن تعديلها وتخطي الساعات التي تحتوي على تعيينات تمنع التعديل."
                          : "The system will automatically update modifiable hours and skip hours with assignments that prevent modification."}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={
                  VALIDATION_SCHEMA_EDIT_ROSTER_CONTRAFCTING_TYPES
                }
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched, values }) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor={`contractingTypes`}
                        className={`block text-xs font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } mb-1`}
                      >
                        {t("roster.contractingTypes.fields.contractingType")}
                      </label>
                      <Field
                        as="select"
                        id={`contractingTypes`}
                        name={"contractingTypeId"}
                        disabled={true}
                        className={`w-full px-2 py-1.5 border rounded text-sm ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-400"
                            : "bg-gray-100 border-gray-300 text-gray-500"
                        } cursor-not-allowed opacity-60`}
                      >
                        <option value="">
                          {t(
                            "roster.contractingTypes.placeholders.selectContractingType"
                          )}
                        </option>
                        {contractingTypes?.map((type) => (
                          <option key={type.id} value={type.id}>
                            {currentLang === "ar"
                              ? type.nameArabic || type.nameEnglish
                              : type.nameEnglish || type.nameArabic}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div>
                      <label
                        htmlFor="defaultRequiredDoctors"
                        className={`block text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } mb-1`}
                      >
                        {t("roster.contractingTypes.fields.defaultRequired")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        id="defaultRequiredDoctors"
                        name="defaultRequiredDoctors"
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          isDark
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.defaultRequiredDoctors &&
                          touched.defaultRequiredDoctors
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="defaultRequiredDoctors"
                        component="div"
                        className="mt-1 text-xs text-red-600"
                      />
                    </div>

                    {/* Default Max Doctors */}
                    <div>
                      <label
                        htmlFor="defaultMaxDoctors"
                        className={`block text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } mb-1`}
                      >
                        {t("roster.contractingTypes.fields.defaultMax")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        id="defaultMaxDoctors"
                        name="defaultMaxDoctors"
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          isDark
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.defaultMaxDoctors && touched.defaultMaxDoctors
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        name="defaultMaxDoctors"
                        component="div"
                        className="mt-1 text-xs text-red-600"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label
                        htmlFor="notes"
                        className={`block text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } mb-1`}
                      >
                        {t("roster.contractingTypes.fields.notes")}
                      </label>
                      <Field
                        as="textarea"
                        id="notes"
                        name="notes"
                        rows={3}
                        dir={isRTL ? "rtl" : "ltr"}
                        className={`w-full px-3 py-2 border rounded-lg text-sm resize-vertical ${
                          isDark
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.notes && touched.notes
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : ""
                        }`}
                        placeholder={t(
                          "roster.contractingTypes.placeholders.notes"
                        )}
                      />
                      <ErrorMessage
                        name="notes"
                        component="div"
                        className="mt-1 text-xs text-red-600"
                      />
                      <p
                        className={`mt-1 text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {values.notes?.length || 0}/500{" "}
                        {t("roster.contractingTypes.charactersCount")}
                      </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={onClose}
                        className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          isDark
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <X size={14} className={isRTL ? "ml-1" : "mr-1"} />
                        {t("common.cancel")}
                      </button>

                      <button
                        type="submit"
                        disabled={
                          isSubmitting || loading?.updateShiftContractingType
                        }
                        className={`inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isSubmitting || loading?.updateShiftContractingType ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            {t("roster.actions.updating")}
                          </>
                        ) : (
                          <>
                            <Save
                              size={14}
                              className={isRTL ? "ml-1" : "mr-1"}
                            />
                            {t("roster.actions.update")}
                          </>
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ModalEditContractingTypeModal
