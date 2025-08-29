import i18next from "i18next";
import { useEffect } from "react";
import UseFormValidation from "../hooks/use-form-validation";
import UseInitialValues from "../hooks/use-initial-values";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Plus, Trash2, Save, X } from "lucide-react";
import {
  addDepartmentShifts,
  getDepartmentShifts,
} from "../state/act/actRosterManagement";
import { getShiftHoursTypes } from "../state/act/actShiftHours";
import LoadingGetData from "./LoadingGetData";

function ModalShiftsDepartment({ selectedDepartment, onClose }) {
  const dispatch = useDispatch();
  console.log("Selected Department in Modal:", selectedDepartment);
  const { loading } = useSelector((state) => state.rosterManagement);
  const { allShiftHoursTypes, loadingGetShiftHoursTypes } = useSelector(
    (state) => state.shiftHour || {}
  );
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  const { t } = useTranslation();
  const currentLang = i18next.language;
  const isRTL = currentLang === "ar";
  // Validation schema
  const { VALIDATION_SCHEMA_ADD_SHIFTS_DEPARTMENT } = UseFormValidation();

  // Initial form values
  const { INITIAL_VALUES_ADD_SHIFTS_DEPARTMENT } = UseInitialValues();
  useEffect(() => {
    dispatch(getShiftHoursTypes({ isActive: true }));
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const shiftsData = {
        rosterDepartmentId: selectedDepartment.id,
        shifts: values.shifts.map((shift) => ({
          shiftHoursTypeId: parseInt(shift.shiftHoursTypeId),
          notes: shift.notes || "",
        })),
        overwriteExisting: values.overwriteExisting,
      };
      console.log("Submitting shifts data:", shiftsData);

      await dispatch(
        addDepartmentShifts({
          rosterDepartmentId: selectedDepartment.id,
          shiftsData,
        })
      ).unwrap();

      await dispatch(
        getDepartmentShifts({ rosterDepartmentId: selectedDepartment.id })
      ).unwrap();

      resetForm();
      toast.success(t("roster.phaseOne.success.shiftsAdded"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      onClose();
    } catch (error) {
      console.error("Department shifts creation error:", error);

      Swal.fire({
        title: t("roster.phaseOne.error.title"),
        text:
          currentLang === "en"
            ? error?.response?.data?.messageEn ||
              error?.message ||
              t("roster.phaseOne.error.message")
            : error?.response?.data?.messageAr ||
              error?.message ||
              t("roster.phaseOne.error.message"),
        icon: "error",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#ef4444",
        background: "#ffffff",
        color: "#111827",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {loadingGetShiftHoursTypes && (
        <LoadingGetData text={t("gettingData.shiftHours")} />
      )}
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
                  {t("roster.phaseOne.subtitle")}
                </h2>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } mt-1`}
                >
                  {currentLang === "ar"
                    ? selectedDepartment.nameArabic ||
                      selectedDepartment.nameEnglish
                    : selectedDepartment.nameEnglish ||
                      selectedDepartment.nameArabic}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                } transition-colors`}
              >
                <X size={18} />
              </button>
            </div>

            <Formik
              initialValues={INITIAL_VALUES_ADD_SHIFTS_DEPARTMENT}
              validationSchema={VALIDATION_SCHEMA_ADD_SHIFTS_DEPARTMENT}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, errors, touched, values }) => (
                <Form className="space-y-4">
                  {/* Shifts Array */}
                  <FieldArray name="shifts">
                    {({ remove, push }) => (
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3
                            className={`text-base font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t("roster.phaseOne.fields.shifts")}
                          </h3>
                          <button
                            type="button"
                            onClick={() =>
                              push({ shiftHoursTypeId: "", notes: "" })
                            }
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                          >
                            <Plus
                              size={14}
                              className={isRTL ? "ml-1" : "mr-1"}
                            />
                            {t("roster.phaseOne.buttons.addShift")}
                          </button>
                        </div>

                        {values.shifts.map((shift, index) => (
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
                                {t("roster.phaseOne.shiftNumber", {
                                  number: index + 1,
                                })}
                              </h4>
                              {values.shifts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                >
                                  <Trash2
                                    size={12}
                                    className={isRTL ? "ml-1" : "mr-1"}
                                  />
                                  {t("roster.phaseOne.buttons.removeShift")}
                                </button>
                              )}
                            </div>

                            <div className="space-y-3">
                              {/* Shift Hours Type */}
                              <div>
                                <label
                                  htmlFor={`shifts.${index}.shiftHoursTypeId`}
                                  className={`block text-xs font-medium ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  } mb-1`}
                                >
                                  {t("roster.phaseOne.fields.shiftType")}{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <Field
                                  as="select"
                                  id={`shifts.${index}.shiftHoursTypeId`}
                                  name={`shifts.${index}.shiftHoursTypeId`}
                                  disabled={loadingGetShiftHoursTypes}
                                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                                    isDark
                                      ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                                      : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.shifts?.[index]?.shiftHoursTypeId &&
                                    touched.shifts?.[index]?.shiftHoursTypeId
                                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                      : ""
                                  }`}
                                >
                                  <option value="">
                                    {loadingGetShiftHoursTypes
                                      ? t("common.loading")
                                      : t(
                                          "roster.phaseOne.placeholders.selectShiftType"
                                        )}
                                  </option>
                                  {allShiftHoursTypes?.map((shiftType) => (
                                    <option
                                      key={shiftType.id}
                                      value={shiftType.id}
                                    >
                                      {currentLang === "ar"
                                        ? shiftType.nameArabic ||
                                          shiftType.nameEnglish
                                        : shiftType.nameEnglish ||
                                          shiftType.nameArabic}
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name={`shifts.${index}.shiftHoursTypeId`}
                                  component="div"
                                  className="mt-1 text-xs text-red-600"
                                />
                              </div>

                              {/* Notes */}
                              <div>
                                <label
                                  htmlFor={`shifts.${index}.notes`}
                                  className={`block text-xs font-medium ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  } mb-1`}
                                >
                                  {t("roster.phaseOne.fields.notes")}
                                </label>
                                <Field
                                  as="textarea"
                                  id={`shifts.${index}.notes`}
                                  name={`shifts.${index}.notes`}
                                  rows={2}
                                  dir={isRTL ? "rtl" : "ltr"}
                                  className={`w-full px-3 py-2 text-sm border rounded-lg resize-vertical ${
                                    isDark
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.shifts?.[index]?.notes &&
                                    touched.shifts?.[index]?.notes
                                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                      : ""
                                  }`}
                                  placeholder={t(
                                    "roster.phaseOne.placeholders.notes"
                                  )}
                                />
                                <ErrorMessage
                                  name={`shifts.${index}.notes`}
                                  component="div"
                                  className="mt-1 text-xs text-red-600"
                                />
                                <p
                                  className={`mt-1 text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {shift.notes?.length || 0}/500{" "}
                                  {t("roster.phaseOne.charactersCount")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
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
                    <div className="flex items-center justify-between">
                      <div>
                        <label
                          htmlFor="overwriteExisting"
                          className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("roster.phaseOne.fields.overwriteExisting")}
                        </label>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          } mt-1`}
                        >
                          {t("roster.phaseOne.fields.overwriteExistingHelp")}
                        </p>
                      </div>
                      <Field
                        type="checkbox"
                        id="overwriteExisting"
                        name="overwriteExisting"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
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
                        {t("roster.phaseOne.buttons.cancel")}
                      </button>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          loading?.addShifts ||
                          loadingGetShiftHoursTypes
                        }
                        className={`inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isSubmitting || loading?.addShifts ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t("roster.phaseOne.buttons.adding")}
                          </>
                        ) : (
                          <>
                            <Save
                              size={14}
                              className={isRTL ? "ml-1" : "mr-1"}
                            />
                            {t("roster.phaseOne.buttons.addShifts")}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalShiftsDepartment;
