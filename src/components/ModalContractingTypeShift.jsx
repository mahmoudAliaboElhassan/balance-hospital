import i18next from "i18next";
import { useEffect } from "react";
import UseFormValidation from "../hooks/use-form-validation";
import UseInitialValues from "../hooks/use-initial-values";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Plus, Trash2, Save, X, Users } from "lucide-react";
import {
  addShiftContractingTypes,
  getShiftContractingTypes,
} from "../state/act/actRosterManagement";
import { getContractingTypes } from "../state/act/actContractingType";
import LoadingGetData from "./LoadingGetData";

function ModalContractingTypesDepartment({ selectedShift, onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.rosterManagement);
  const { contractingTypes, loadingGetContractingTypes } = useSelector(
    (state) => state.contractingType
  );
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  const { t } = useTranslation();
  const currentLang = i18next.language;
  const isRTL = currentLang === "ar";

  // Validation schema for contracting types
  const { VALIDATION_SCHEMA_ADD_ROSTER_CONTRACTING_TYPES } =
    UseFormValidation();
  const { INITIAL_VALUES_ADD_CONTRACTING_TYPES } = UseInitialValues();

  useEffect(() => {
    // Fetch available contracting types when modal opens
    dispatch(getContractingTypes());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const contractingData = {
        contractingTypes: values.contractingTypes.map((contractingType) => ({
          contractingTypeId: parseInt(contractingType.contractingTypeId),
          defaultRequiredDoctors: parseInt(
            contractingType.defaultRequiredDoctors
          ),
          defaultMaxDoctors: parseInt(contractingType.defaultMaxDoctors),
          notes: contractingType.notes || "",
        })),
        overwriteExisting: values.overwriteExisting,
      };

      console.log("Submitting contracting types data:", contractingData);

      await dispatch(
        addShiftContractingTypes({
          departmentShiftId: selectedShift.id,
          contractingTypesData: contractingData,
        })
      ).unwrap();
      await dispatch(
        getShiftContractingTypes({
          departmentShiftId: selectedShift.id,
        })
      ).unwrap();
      resetForm();
      toast.success(t("roster.contractingTypes.success.added"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      onClose();
    } catch (error) {
      console.error("Contracting types creation error:", error);

      Swal.fire({
        title: t("roster.contractingTypes.error.title"),
        text:
          currentLang === "en"
            ? error?.response?.data?.messageEn ||
              error?.message ||
              t("roster.contractingTypes.error.message")
            : error?.response?.data?.messageAr ||
              error?.message ||
              t("roster.contractingTypes.error.message"),
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
            <LoadingGetData text={t("gettingData.contractingTypes")} />
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("roster.contractingTypes.title")}
                  </h2>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mt-1`}
                  >
                    {selectedShift.shiftTypeName} -{" "}
                    {selectedShift.departmentName}
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
                initialValues={INITIAL_VALUES_ADD_CONTRACTING_TYPES}
                validationSchema={
                  VALIDATION_SCHEMA_ADD_ROSTER_CONTRACTING_TYPES
                }
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched, values }) => (
                  <Form className="space-y-4">
                    {/* Contracting Types Array */}
                    <FieldArray name="contractingTypes">
                      {({ remove, push }) => (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h3
                              className={`text-base font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {t(
                                "roster.contractingTypes.fields.contractingTypes"
                              )}
                            </h3>
                            <button
                              type="button"
                              onClick={() =>
                                push({
                                  contractingTypeId: "",
                                  defaultRequiredDoctors: 1,
                                  defaultMaxDoctors: 1,
                                  notes: "",
                                })
                              }
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                            >
                              <Plus
                                size={14}
                                className={isRTL ? "ml-1" : "mr-1"}
                              />
                              {t(
                                "roster.contractingTypes.buttons.addContractingType"
                              )}
                            </button>
                          </div>

                          {values.contractingTypes.length === 0 && (
                            <div
                              className={`text-center py-6 border-2 border-dashed rounded-lg ${
                                isDark
                                  ? "border-gray-600 bg-gray-700/50"
                                  : "border-gray-300 bg-gray-50"
                              }`}
                            >
                              <Users
                                size={36}
                                className={`mx-auto mb-3 ${
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }`}
                              />
                              <p
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {t(
                                  "roster.contractingTypes.noContractingTypes"
                                )}
                              </p>
                            </div>
                          )}

                          {values.contractingTypes.map(
                            (contractingType, index) => (
                              <div
                                key={index}
                                className={`border rounded-lg p-3 mb-3 ${
                                  isDark
                                    ? "border-gray-600 bg-gray-700"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h4
                                    className={`text-sm font-medium ${
                                      isDark ? "text-white" : "text-gray-700"
                                    }`}
                                  >
                                    {t(
                                      "roster.contractingTypes.contractingTypeNumber",
                                      {
                                        number: index + 1,
                                      }
                                    )}
                                  </h4>
                                  {values.contractingTypes.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    >
                                      <Trash2
                                        size={12}
                                        className={isRTL ? "ml-1" : "mr-1"}
                                      />
                                      {t(
                                        "roster.contractingTypes.buttons.remove"
                                      )}
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  {/* Contracting Type Selection */}
                                  <div>
                                    <label
                                      htmlFor={`contractingTypes.${index}.contractingTypeId`}
                                      className={`block text-xs font-medium ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      } mb-1`}
                                    >
                                      {t(
                                        "roster.contractingTypes.fields.contractingType"
                                      )}{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                      as="select"
                                      id={`contractingTypes.${index}.contractingTypeId`}
                                      name={`contractingTypes.${index}.contractingTypeId`}
                                      className={`w-full px-2 py-1.5 border rounded text-sm ${
                                        isDark
                                          ? "bg-gray-600 border-gray-500 text-white"
                                          : "bg-white border-gray-300 text-gray-900"
                                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.contractingTypes?.[index]
                                          ?.contractingTypeId &&
                                        touched.contractingTypes?.[index]
                                          ?.contractingTypeId
                                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                          : ""
                                      }`}
                                    >
                                      <option value="">
                                        {t(
                                          "roster.contractingTypes.placeholders.selectContractingType"
                                        )}
                                      </option>
                                      {contractingTypes?.map((type) => (
                                        <option key={type.id} value={type.id}>
                                          {currentLang === "ar"
                                            ? type.nameArabic ||
                                              type.nameEnglish
                                            : type.nameEnglish ||
                                              type.nameArabic}
                                        </option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`contractingTypes.${index}.contractingTypeId`}
                                      component="div"
                                      className="mt-1 text-xs text-red-600"
                                    />
                                  </div>

                                  {/* Default Required and Max Doctors in one row */}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label
                                        htmlFor={`contractingTypes.${index}.defaultRequiredDoctors`}
                                        className={`block text-xs font-medium ${
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        } mb-1`}
                                      >
                                        {t(
                                          "roster.contractingTypes.fields.defaultRequired"
                                        )}{" "}
                                        <span className="text-red-500">*</span>
                                      </label>
                                      <Field
                                        type="number"
                                        id={`contractingTypes.${index}.defaultRequiredDoctors`}
                                        name={`contractingTypes.${index}.defaultRequiredDoctors`}
                                        min="1"
                                        className={`w-full px-2 py-1.5 border rounded text-sm ${
                                          isDark
                                            ? "bg-gray-600 border-gray-500 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                          errors.contractingTypes?.[index]
                                            ?.defaultRequiredDoctors &&
                                          touched.contractingTypes?.[index]
                                            ?.defaultRequiredDoctors
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                            : ""
                                        }`}
                                      />
                                      <ErrorMessage
                                        name={`contractingTypes.${index}.defaultRequiredDoctors`}
                                        component="div"
                                        className="mt-1 text-xs text-red-600"
                                      />
                                    </div>

                                    <div>
                                      <label
                                        htmlFor={`contractingTypes.${index}.defaultMaxDoctors`}
                                        className={`block text-xs font-medium ${
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        } mb-1`}
                                      >
                                        {t(
                                          "roster.contractingTypes.fields.defaultMax"
                                        )}{" "}
                                        <span className="text-red-500">*</span>
                                      </label>
                                      <Field
                                        type="number"
                                        id={`contractingTypes.${index}.defaultMaxDoctors`}
                                        name={`contractingTypes.${index}.defaultMaxDoctors`}
                                        min="1"
                                        className={`w-full px-2 py-1.5 border rounded text-sm ${
                                          isDark
                                            ? "bg-gray-600 border-gray-500 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                          errors.contractingTypes?.[index]
                                            ?.defaultMaxDoctors &&
                                          touched.contractingTypes?.[index]
                                            ?.defaultMaxDoctors
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                            : ""
                                        }`}
                                      />
                                      <ErrorMessage
                                        name={`contractingTypes.${index}.defaultMaxDoctors`}
                                        component="div"
                                        className="mt-1 text-xs text-red-600"
                                      />
                                    </div>
                                  </div>

                                  {/* Notes */}
                                  <div>
                                    <label
                                      htmlFor={`contractingTypes.${index}.notes`}
                                      className={`block text-xs font-medium ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      } mb-1`}
                                    >
                                      {t(
                                        "roster.contractingTypes.fields.notes"
                                      )}
                                    </label>
                                    <Field
                                      as="textarea"
                                      id={`contractingTypes.${index}.notes`}
                                      name={`contractingTypes.${index}.notes`}
                                      rows={2}
                                      dir={isRTL ? "rtl" : "ltr"}
                                      className={`w-full px-2 py-1.5 border rounded text-sm resize-vertical ${
                                        isDark
                                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.contractingTypes?.[index]
                                          ?.notes &&
                                        touched.contractingTypes?.[index]?.notes
                                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                          : ""
                                      }`}
                                      placeholder={t(
                                        "roster.contractingTypes.placeholders.notes"
                                      )}
                                    />
                                    <ErrorMessage
                                      name={`contractingTypes.${index}.notes`}
                                      component="div"
                                      className="mt-1 text-xs text-red-600"
                                    />
                                    <p
                                      className={`mt-1 text-xs ${
                                        isDark
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {contractingType.notes?.length || 0}/500{" "}
                                      {t(
                                        "roster.contractingTypes.charactersCount"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </FieldArray>

                    {/* Overwrite Existing */}
                    <div
                      className={`p-3 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <label
                            htmlFor="overwriteExisting"
                            className={`text-xs font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t(
                              "roster.contractingTypes.fields.overwriteExisting"
                            )}
                          </label>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mt-1`}
                          >
                            {t(
                              "roster.contractingTypes.fields.overwriteExistingHelp"
                            )}
                          </p>
                        </div>
                        <Field
                          type="checkbox"
                          id="overwriteExisting"
                          name="overwriteExisting"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                        />
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={onClose}
                        className={`inline-flex items-center px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                          isDark
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <X size={14} className={isRTL ? "ml-1" : "mr-1"} />
                        {t("roster.contractingTypes.buttons.cancel")}
                      </button>

                      <button
                        type="submit"
                        disabled={
                          isSubmitting || loading?.addShiftContractingTypes
                        }
                        className={`inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isSubmitting || loading?.addShiftContractingTypes ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            {t("roster.contractingTypes.buttons.adding")}
                          </>
                        ) : (
                          <>
                            <Save
                              size={14}
                              className={isRTL ? "ml-1" : "mr-1"}
                            />
                            {t(
                              "roster.contractingTypes.buttons.addContractingTypes"
                            )}
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
  );
}

export default ModalContractingTypesDepartment;
