import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Plus, Trash2, Info, Clock, Save, X } from "lucide-react";
import { getActiveShiftHoursTypes } from "../../../../../state/act/actShiftHours";
import { addDepartmentShifts } from "../../../../../state/act/actRosterManagement";

function PhaseOne() {
  const { rosterId } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  // Redux state
  const { loading, errors, success } = useSelector(
    (state) => state.rosterManagement || {}
  );
  const { allShiftHoursTypes, loadingGetShiftHoursTypes } = useSelector(
    (state) => state.shiftHour || {}
  );

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  // Validation schema
  const validationSchema = Yup.object().shape({
    shifts: Yup.array()
      .of(
        Yup.object().shape({
          shiftHoursTypeId: Yup.number().required(
            t("roster.phaseOne.validation.shiftTypeRequired")
          ),
          notes: Yup.string().max(
            500,
            t("roster.phaseOne.validation.notesMaxLength")
          ),
        })
      )
      .min(1, t("roster.phaseOne.validation.atLeastOneShift")),
    overwriteExisting: Yup.boolean(),
  });

  // Initial form values
  const initialValues = {
    rosterDepartmentId: "",
    shifts: [
      {
        shiftHoursTypeId: "",
        notes: "",
      },
    ],
    overwriteExisting: false,
  };

  // Fetch shift hours types on component mount
  useEffect(() => {
    dispatch(getActiveShiftHoursTypes());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Format the data according to the API structure
      const shiftsData = {
        rosterDepartmentId: rosterId,
        shifts: values.shifts.map((shift) => ({
          shiftHoursTypeId: parseInt(shift.shiftHoursTypeId),
          notes: shift.notes || "",
        })),
        overwriteExisting: values.overwriteExisting,
      };

      await dispatch(
        addDepartmentShifts({
          rosterId,
          shiftsData,
        })
      ).unwrap();

      // Success handling
      resetForm();
      toast.success(t("roster.phaseOne.success.shiftsAdded"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate to phase2
      navigate(`/admin-panel/rosters/${rosterId}/phase2`);
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
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link
              to={`/admin-panel/rosters/${rosterId}`}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                  : "border-gray-300 hover:bg-gray-50 text-gray-700"
              } ${isRTL ? "ml-4" : "mr-4"}`}
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.phaseOne.title")}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                {t("roster.phaseOne.rosterId")}: {rosterId}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Clock
                className={`${isRTL ? "ml-3" : "mr-3"} text-blue-600`}
                size={24}
              />
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.phaseOne.subtitle")}
              </h2>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, errors, touched, values }) => (
                <Form className="space-y-6">
                  {/* Shifts Array */}
                  <FieldArray name="shifts">
                    {({ remove, push }) => (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3
                            className={`text-lg font-medium ${
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
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                          >
                            <Plus
                              size={16}
                              className={isRTL ? "ml-2" : "mr-2"}
                            />
                            {t("roster.phaseOne.buttons.addShift")}
                          </button>
                        </div>

                        {values.shifts.map((shift, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 mb-4 ${
                              isDark
                                ? "border-gray-600 bg-gray-700"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4
                                className={`text-md font-medium ${
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
                                  className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-colors"
                                >
                                  <Trash2
                                    size={14}
                                    className={isRTL ? "ml-1" : "mr-1"}
                                  />
                                  {t("roster.phaseOne.buttons.removeShift")}
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Shift Hours Type */}
                              <div>
                                <label
                                  htmlFor={`shifts.${index}.shiftHoursTypeId`}
                                  className={`block text-sm font-medium ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  } mb-2`}
                                >
                                  {t("roster.phaseOne.fields.shiftType")}{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <Field
                                  as="select"
                                  id={`shifts.${index}.shiftHoursTypeId`}
                                  name={`shifts.${index}.shiftHoursTypeId`}
                                  disabled={loadingGetShiftHoursTypes}
                                  className={`w-full px-3 py-2 border rounded-lg ${
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
                                  className="mt-1 text-sm text-red-600"
                                />
                              </div>

                              {/* Notes */}
                              <div>
                                <label
                                  htmlFor={`shifts.${index}.notes`}
                                  className={`block text-sm font-medium ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  } mb-2`}
                                >
                                  {t("roster.phaseOne.fields.notes")}
                                </label>
                                <Field
                                  as="textarea"
                                  id={`shifts.${index}.notes`}
                                  name={`shifts.${index}.notes`}
                                  rows={3}
                                  dir={isRTL ? "rtl" : "ltr"}
                                  className={`w-full px-3 py-2 border rounded-lg resize-vertical ${
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
                                  className="mt-1 text-sm text-red-600"
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
                    className={`p-4 border rounded-lg ${
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
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <Link
                        to={`/admin-panel/rosters/${rosterId}`}
                        className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          isDark
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <X size={16} className={isRTL ? "ml-2" : "mr-2"} />
                        {t("roster.phaseOne.buttons.cancel")}
                      </Link>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          loading?.addShifts ||
                          loadingGetShiftHoursTypes
                        }
                        className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isSubmitting || loading?.addShifts ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t("roster.phaseOne.buttons.adding")}
                          </>
                        ) : (
                          <>
                            <Save
                              size={16}
                              className={isRTL ? "ml-2" : "mr-2"}
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

        {/* Loading state for shift types */}
        {loadingGetShiftHoursTypes && (
          <div
            className={`mt-4 p-4 rounded-lg border ${
              isDark
                ? "border-blue-600 bg-blue-900/20"
                : "border-blue-200 bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span
                className={`ml-2 text-sm ${
                  isDark ? "text-blue-300" : "text-blue-600"
                }`}
              >
                {t("roster.phaseOne.loading.shiftTypes")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhaseOne;
