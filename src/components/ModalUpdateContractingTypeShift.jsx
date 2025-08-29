import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Save, X } from "lucide-react";
import * as Yup from "yup";
import {
  getShiftContractingTypes,
  updateShiftContractingType,
} from "../state/act/actRosterManagement";
import { useEffect } from "react";
import { getContractingTypes } from "../state/act/actContractingType";
import LoadingGetData from "./LoadingGetData";

function ModalEditContractingTypeModal({
  selectedContractingType,
  selectedShift,
  onClose,
}) {
  const dispatch = useDispatch();

  console.log("Selected Contracting Type:", selectedContractingType);

  const { loading } = useSelector((state) => state.rosterManagement);
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const { contractingTypes, loadingGetContractingTypes } = useSelector(
    (state) => state.contractingType
  );

  const { t } = useTranslation();
  const currentLang = i18next.language;
  const isRTL = currentLang === "ar";

  useEffect(() => {
    // Fetch available contracting types when modal opens
    dispatch(getContractingTypes());
  }, [dispatch]);

  // Validation schema - removed contractingTypeId validation since it's disabled
  const validationSchema = Yup.object({
    defaultRequiredDoctors: Yup.number()
      .required(t("roster.contractingTypes.validation.defaultRequiredRequired"))
      .min(1, t("roster.contractingTypes.validation.minValue")),
    defaultMaxDoctors: Yup.number()
      .required(t("roster.contractingTypes.validation.defaultMaxRequired"))
      .min(1, t("roster.contractingTypes.validation.minValue"))
      .when("defaultRequiredDoctors", (defaultRequired, schema) => {
        return schema.min(
          defaultRequired,
          t("roster.contractingTypes.validation.maxGreaterThanRequired")
        );
      }),
    notes: Yup.string().max(
      500,
      t("roster.contractingTypes.validation.notesMaxLength")
    ),
  });

  // Initial values
  const initialValues = {
    contractingTypeId: selectedContractingType?.contractingTypeId || "",
    defaultRequiredDoctors:
      selectedContractingType?.defaultRequiredDoctors || 1,
    defaultMaxDoctors: selectedContractingType?.defaultMaxDoctors || 1,
    notes: selectedContractingType?.notes || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updateData = {
        contractingTypeId: parseInt(values.contractingTypeId),
        defaultRequiredDoctors: parseInt(values.defaultRequiredDoctors),
        defaultMaxDoctors: parseInt(values.defaultMaxDoctors),
        notes: values.notes || "",
      };

      console.log("Updating contracting type:", updateData);

      await dispatch(
        updateShiftContractingType({
          shiftContractingTypeId: selectedContractingType.id,
          updateData,
        })
      ).unwrap();

      dispatch(
        getShiftContractingTypes({
          departmentShiftId: localStorage.getItem("currentShiftId"),
        })
      ).unwrap();
      toast.success(t("roster.contractingTypes.success.updated"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Call the parent update function to refresh data

      onClose();
    } catch (error) {
      console.error("Contracting type update error:", error);

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
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {loadingGetContractingTypes ? (
        <LoadingGetData text={t("gettingData.contractingTypes")} />
      ) : (
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

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
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
          </div>
        </div>
      )}
    </>
  );
}

export default ModalEditContractingTypeModal;
