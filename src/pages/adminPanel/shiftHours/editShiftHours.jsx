import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import UseInitialValues from "../../../hooks/use-initial-values";
import UseFormValidation from "../../../hooks/use-form-validation";
import {
  getShiftHoursTypeById,
  updateShiftHoursType,
} from "../../../state/act/actShiftHours";
import {
  clearSingleShiftHoursType,
  clearSingleShiftHoursTypeError,
  resetUpdateForm,
} from "../../../state/slices/shiftHours";
import LoadingGetData from "../../../components/LoadingGetData";
function EditShiftHourType() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const {
    selectedShiftHoursType,
    loadingGetSingleShiftHoursType,
    singleShiftHoursTypeError,
    loadingUpdateShiftHoursType,
    updateError,
    updateSuccess,
    updateMessage,
  } = useSelector((state) => state.shiftHour);

  // Validation schema with translations
  const { VALIDATION_SCHEMA_ADD_SHIFT_HOUR_TYPE } = UseFormValidation();

  // Default initial values

  // Period options
  const periodOptions = [
    { value: "Morning", labelKey: "shiftHourTypeForm.periods.morning" },
    { value: "Evening", labelKey: "shiftHourTypeForm.periods.evening" },
    { value: "Night", labelKey: "shiftHourTypeForm.periods.night" },
  ];

  // Load shift hour type data on component mount
  useEffect(() => {
    if (id) {
      dispatch(getShiftHoursTypeById(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSingleShiftHoursType());
      dispatch(clearSingleShiftHoursTypeError());
      dispatch(resetUpdateForm());
    };
  }, [dispatch, id]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      toast.success(updateMessage || t("shiftHourTypeForm.success.updated"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/admin-panel/shift-hours-types");
    }
  }, [updateSuccess, updateMessage, navigate, t]);

  // Prepare initial values for form
  const getInitialValues = () => {
    if (selectedShiftHoursType) {
      return {
        nameArabic: selectedShiftHoursType.nameArabic || "",
        nameEnglish: selectedShiftHoursType.nameEnglish || "",
        code: selectedShiftHoursType.code || "",
        period: selectedShiftHoursType.period || "",
        hours: selectedShiftHoursType.hours || "",
        startTime: selectedShiftHoursType.startTime || "",
        endTime: selectedShiftHoursType.endTime || "",
        description: selectedShiftHoursType.description || "",
        isActive:
          selectedShiftHoursType.isActive !== undefined
            ? selectedShiftHoursType.isActive
            : true,
      };
    }
    return INITIAL_VALUES_ADD_SHIFT_HOUR_TYPE;
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const data = { ...values, id };
    dispatch(updateShiftHoursType({ id, shiftHoursTypeData: data }))
      .unwrap()
      .then(() => {
        // Success is handled in useEffect
      })
      .catch((error) => {
        console.error("Shift hour type update error:", error);

        Swal.fire({
          title: t("shiftHourTypeForm.error.edit-title"),
          text: t("shiftHourTypeForm.error.message"),
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: "#ffffff",
          color: "#111827",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Handle loading state
  if (loadingGetSingleShiftHoursType) {
    return <LoadingGetData text={t("gettingData.shiftHourData")} />;
  }

  // Handle error state
  if (singleShiftHoursTypeError) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("shiftHourTypeForm.error.loadFailed")}
          </h3>
          <p className="text-gray-600 mb-4">
            {currentLang === "en"
              ? singleShiftHoursTypeError.message
              : singleShiftHoursTypeError.message}
          </p>
          <button
            onClick={() => navigate("/admin-panel/shift-hours-types")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t("common.goBack")}
          </button>
        </div>
      </div>
    );
  }

  // Handle case where shift hour type not found
  if (!loadingGetSingleShiftHoursType && !selectedShiftHoursType) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("shiftHourTypeForm.error.notFound")}
          </h3>
          <p className="text-gray-600 mb-4">
            {t("shiftHourTypeForm.error.notFoundMessage")}
          </p>
          <button
            onClick={() => navigate("/admin-panel/shift-hours-types")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t("common.goBack")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2
        className={`text-2xl font-bold text-gray-800 mb-6 text-center ${
          isRTL ? "font-arabic" : ""
        }`}
      >
        {t("shiftHourTypeForm.editTitle")}
      </h2>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={VALIDATION_SCHEMA_ADD_SHIFT_HOUR_TYPE}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Arabic Name */}
            <div>
              <label
                htmlFor="nameArabic"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("shiftHourTypeForm.fields.nameArabic")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nameArabic"
                name="nameArabic"
                dir="rtl"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nameArabic && touched.nameArabic
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("shiftHourTypeForm.placeholders.nameArabic")}
              />
              <ErrorMessage
                name="nameArabic"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* English Name */}
            <div>
              <label
                htmlFor="nameEnglish"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("shiftHourTypeForm.fields.nameEnglish")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nameEnglish"
                name="nameEnglish"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nameEnglish && touched.nameEnglish
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("shiftHourTypeForm.placeholders.nameEnglish")}
              />
              <ErrorMessage
                name="nameEnglish"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Code */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("shiftHourTypeForm.fields.code")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="code"
                name="code"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
                  errors.code && touched.code
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("shiftHourTypeForm.placeholders.code")}
                onChange={(e) => {
                  const upperValue = e.target.value.toUpperCase();
                  setFieldValue("code", upperValue);
                }}
              />
              <ErrorMessage
                name="code"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("shiftHourTypeForm.hints.code")}
              </p>
            </div>

            {/* Period */}
            <div>
              <label
                htmlFor="period"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("shiftHourTypeForm.fields.period")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="period"
                name="period"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.period && touched.period
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">
                  {t("shiftHourTypeForm.placeholders.period")}
                </option>
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="period"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Hours Count */}
            <div>
              <label
                htmlFor="hoursCount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("shiftHourTypeForm.fields.hoursCount")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="number"
                id="hoursCount"
                name="hours"
                min="1"
                max="24"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.hours && touched.hours
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("shiftHourTypeForm.placeholders.hoursCount")}
              />
              <ErrorMessage
                name="hours"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("shiftHourTypeForm.hints.hoursCount")}
              </p>
            </div>

            {/* Start Time */}
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("shiftHourTypeForm.fields.startTime")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="time"
                id="startTime"
                name="startTime"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.startTime && touched.startTime
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="startTime"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* End Time */}
            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("shiftHourTypeForm.fields.endTime")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="time"
                id="endTime"
                name="endTime"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.endTime && touched.endTime
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="endTime"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Is Active */}
            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Field
                type="checkbox"
                id="isActive"
                name="isActive"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className={`block text-sm text-gray-700 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              >
                {t("shiftHourTypeForm.fields.isActive")}
              </label>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("shiftHourTypeForm.fields.description")}
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="3"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.description && touched.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("shiftHourTypeForm.placeholders.description")}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
            {/* Submit Button */}
            <div
              className={`flex justify-end space-x-3 pt-4 ${
                isRTL ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  navigate("/admin-panel/shift-hours-types");
                }}
              >
                {t("shiftHourTypeForm.buttons.cancel")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || loadingUpdateShiftHoursType}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting || loadingUpdateShiftHoursType
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting || loadingUpdateShiftHoursType ? (
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
                    {t("shiftHourTypeForm.buttons.updating")}
                  </div>
                ) : (
                  t("shiftHourTypeForm.buttons.update")
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditShiftHourType;
