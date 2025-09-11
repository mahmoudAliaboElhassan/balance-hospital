import React, { useState, useEffect } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Plus, Save, X } from "lucide-react";
import * as Yup from "yup";
import {
  addRosterDepartment,
  getDepartmentShifts,
  getRosterDepartments,
} from "../state/act/actRosterManagement";
import { getDepartmentByCategory } from "../state/act/actDepartment";
import LoadingGetData from "./LoadingGetData";
import UseFormValidation from "../hooks/use-form-validation";
import UseInitialValues from "../hooks/use-initial-values";

// Modal Component
function ModalAddRosterDepartment({ onClose }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentLang = i18next.language;
  const isRTL = currentLang === "ar";

  // Get categoryId from localStorage
  const rosterId = localStorage.getItem("rosterId");
  const categoryId = localStorage.getItem("categoryId");

  const { loading } = useSelector((state) => state.rosterManagement);
  const { departmentsByCategory, loadingGetDepartmentsByCategory } =
    useSelector((state) => state.department);
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  useEffect(() => {
    // Fetch departments with categoryId from localStorage
    dispatch(
      getDepartmentByCategory({
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        isActive: true,
      })
    );
  }, [dispatch, categoryId]);

  // Validation schema
  const { VALIDATION_SCHEMA_ADD_DEPARTMENT_TO_ROSTER } = UseFormValidation();
  // Initial values
  const { INITIAL_VALUES_ADD_DEPARTMENT_TO_ROSTER } = UseInitialValues();
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const departmentData = {
        departmentId: parseInt(values.departmentId),
        notes: values.notes || "",
        defaultShifts: [],
      };

      console.log("Submitting department data:", departmentData);

      await dispatch(
        addRosterDepartment({
          rosterId: rosterId,
          department: departmentData,
        })
      )
        .unwrap()
        .then(() => {
          if (rosterId) {
            dispatch(getRosterDepartments({ rosterId: rosterId }))
              .unwrap()
              .then((response) => {
                console.log("Fetched roster departments:", response);
              })
              .catch((err) => {
                console.error("Failed to fetch roster departments:", err);
              });
          }
        });

      resetForm();
      toast.success(t("departmentForm.success.created"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      onClose();
    } catch (error) {
      console.error("Add department error:", error);

      Swal.fire({
        title: t("departmentForm.error.createFailed"),
        text: error.errors[0],
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
      {loadingGetDepartmentsByCategory && (
        <LoadingGetData text={t("gettingData.departments")} />
      )}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 mt-8`}
      >
        <div
          className={`p-6 rounded-lg border ${
            isDark
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          } rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("roster.actions.addDepartment")}
                </h2>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } mt-1`}
                >
                  {t("departmentForm.addToRoster")}
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
              initialValues={INITIAL_VALUES_ADD_DEPARTMENT_TO_ROSTER}
              validationSchema={VALIDATION_SCHEMA_ADD_DEPARTMENT_TO_ROSTER}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, errors, touched, values }) => (
                <Form className="space-y-4">
                  {/* Department Selection */}
                  <div>
                    <label
                      htmlFor="departmentId"
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      {t("roster.departmentss.department")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="departmentId"
                      name="departmentId"
                      disabled={loadingGetDepartmentsByCategory}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                          : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.departmentId && touched.departmentId
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : ""
                      }`}
                    >
                      <option value="">
                        {loadingGetDepartmentsByCategory
                          ? t("department.loading")
                          : t("roster.assign.departmentPlacholder")}
                      </option>
                      {departmentsByCategory?.map((department) => (
                        <option key={department.id} value={department.id}>
                          {currentLang === "ar"
                            ? department.nameArabic || department.nameEnglish
                            : department.nameEnglish || department.nameArabic}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="departmentId"
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
                      } mb-2`}
                    >
                      {t("common.notes")}
                    </label>
                    <Field
                      as="textarea"
                      id="notes"
                      name="notes"
                      rows={3}
                      dir={isRTL ? "rtl" : "ltr"}
                      className={`w-full px-3 py-2 text-sm border rounded-lg resize-vertical ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.notes && touched.notes
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : ""
                      }`}
                      placeholder={t("roster.form.notesPlaceholder")}
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
                      {t("roster.assign.charactersCount")}
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <X size={16} className={isRTL ? "ml-2" : "mr-2"} />
                      {t("common.cancel")}
                    </button>

                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        loading?.addRosterDepartment ||
                        loadingGetDepartmentsByCategory
                      }
                      className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSubmitting || loading?.addRosterDepartment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t("roster.contractingTypes.buttons.adding")}
                        </>
                      ) : (
                        <>
                          <Save size={16} className={isRTL ? "ml-2" : "mr-2"} />
                          {t("roster.actions.addDepartment")}
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
    </div>
  );
}
export default ModalAddRosterDepartment;
