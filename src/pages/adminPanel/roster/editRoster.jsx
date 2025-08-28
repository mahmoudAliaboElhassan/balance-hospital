import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useSearchParams,
  Link,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Info,
  Calendar,
  Users,
  Clock,
  Settings,
  Building,
  AlertCircle,
  CheckCircle,
  Save,
  X,
} from "lucide-react";

import { updateRosterBasicInfo } from "../../../state/act/actRosterManagement";
import { getRosterById } from "../../../state/act/actRosterManagement";
import { selectSelectedRoster } from "../../../state/slices/roster";

import LoadingGetData from "../../../components/LoadingGetData";
import Swal from "sweetalert2";
import UseFormValidation from "../../../hooks/use-form-validation";

const UpdateRoster = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rosterId } = useParams();
  const [searchParams] = useSearchParams();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";
  const rosterType = searchParams.get("type") || "basic";
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = rosterType === "complete" ? 4 : 2;

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { loading, success, error, updateError } = useSelector(
    (state) => state.rosterManagement
  );
  const selectedRoster = useSelector(selectSelectedRoster);

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  const { categoryTypes, loadingGetCategoryTypes } = useSelector(
    (state) => state.category
  );
  const { VALIDATION_SCHEMA_UPDATE_BASIC_ROASTER } = UseFormValidation();

  useEffect(() => {
    if (rosterId) {
      dispatch(getRosterById(rosterId));
    }
  }, [dispatch, rosterId]);

  // Set up cascading dropdowns when roster data is loaded
  useEffect(() => {
    if (selectedRoster && categoryTypes.length > 0 && !isDataLoaded) {
      setIsDataLoaded(true);
    }
  }, [selectedRoster, categoryTypes, dispatch, isDataLoaded]);

  if (loadingGetCategoryTypes || loading.fetch) {
    return <LoadingGetData text={t("gettingData.roster")} />;
  }

  // Show error if roster not found
  if (!selectedRoster && !loading.fetch) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("roster.error.notFound")}
            </h1>
            <Link
              to="/admin-panel/rosters"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} className={isRTL ? "ml-2" : "mr-2"} />
              {t("common.backToList")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get current year and next 5 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear + i);

  const getInitialValues = () => {
    if (!selectedRoster) return {};

    const submissionDeadline = selectedRoster.submissionDeadline
      ? new Date(selectedRoster.submissionDeadline).toISOString().slice(0, 16)
      : "";
    console.log("selectedRoster", selectedRoster.endDate.split("-")[2]);

    return {
      categoryId: selectedRoster.categoryId?.toString() || "",
      title: selectedRoster.title || "",
      description: selectedRoster.description || "",
      month: selectedRoster.month || new Date().getMonth() + 1,
      year: selectedRoster.year || new Date().getFullYear(),
      submissionDeadline: submissionDeadline,
      startDay: selectedRoster.startDate.split("-")[2] || 1,
      endDay: selectedRoster.endDate.split("-")[2] || 1,
      allowSwapRequests: selectedRoster.allowSwapRequests ?? true,
      allowLeaveRequests: selectedRoster.allowLeaveRequests ?? true,
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("values", values);
    let formattedDeadline = values.submissionDeadline;
    if (formattedDeadline) {
      // Parse the date and format it as YYYY-MM-DD
      const date = new Date(formattedDeadline);
      formattedDeadline = date.toISOString().split("T")[0];
    }

    const startDate = `${values.year}-${values.month
      .toString()
      .padStart(2, "0")}-${values.startDay.toString().padStart(2, "0")}`;
    const endDate = `${values.year}-${values.month
      .toString()
      .padStart(2, "0")}-${values.endDay.toString().padStart(2, "0")}`;

    const cleanedValues = {
      title: values.title,
      description: values.description || null,
      startDate: startDate,
      endDate: endDate,
      submissionDeadline: formattedDeadline,
      allowSwapRequests: values.allowSwapRequests,
      allowLeaveRequests: values.allowLeaveRequests,
    };

    console.log("Cleaned values for update", cleanedValues);
    setSubmitting(true);

    dispatch(
      updateRosterBasicInfo({
        rosterId: parseInt(rosterId),
        updateData: cleanedValues,
      })
    )
      .unwrap()
      .then(() => {
        setSubmitting(false);
        toast.success(t("roster.success.updated"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/admin-panel/rosters");
      })
      .catch((error) => {
        setSubmitting(false);
        Swal.fire({
          title: t("roster.error.updateFailed"),
          text:
            currentLang === "en"
              ? error?.response?.data?.messageEn || error?.message
              : error?.response?.data?.messageAr,
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: "#ffffff",
          color: "#111827",
        });
      });
  };

  const monthNames = isRTL
    ? [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ]
    : [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

  const getStepTitle = (step) => {
    switch (step) {
      case 1:
        return t("roster.form.basicInfo");
      case 2:
        return t("roster.form.settings");
      default:
        return "";
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return <Info size={20} />;
      case 2:
        return <Settings size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
              to="/admin-panel/rosters"
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
                {t("roster.form.updateRoster")}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                {selectedRoster?.title || t("roster.form.updateRosterInfo")}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                (step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        step <= currentStep
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isDark
                          ? "border-gray-600 text-gray-400"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {step < currentStep ? (
                        <CheckCircle size={20} />
                      ) : (
                        getStepIcon(step)
                      )}
                    </div>
                    <div
                      className={`${isRTL ? "mr-3" : "ml-3"} ${
                        step < totalSteps
                          ? isRTL
                            ? "border-r-2"
                            : "border-l-2"
                          : ""
                      } ${
                        step < currentStep
                          ? "border-blue-600"
                          : isDark
                          ? "border-gray-600"
                          : "border-gray-300"
                      } ${isRTL ? "pr-3" : "pl-3"}`}
                    >
                      <div
                        className={`text-sm font-medium ${
                          step <= currentStep
                            ? isDark
                              ? "text-white"
                              : "text-gray-900"
                            : isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {getStepTitle(step)}
                      </div>
                    </div>
                    {step < totalSteps && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          step < currentStep
                            ? "bg-blue-600"
                            : isDark
                            ? "bg-gray-600"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                )
              )}
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
            <Formik
              initialValues={getInitialValues()}
              validationSchema={VALIDATION_SCHEMA_UPDATE_BASIC_ROASTER}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <Info
                          className={`${isRTL ? "ml-3" : "mr-3"} text-blue-600`}
                          size={24}
                        />
                        <h2
                          className={`text-xl font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("roster.form.basicInfo")}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category (Read Only) */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.category")} *
                          </label>
                          <div
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-600 border-gray-600 text-gray-300"
                                : "bg-gray-100 border-gray-300 text-gray-600"
                            } cursor-not-allowed`}
                          >
                            {selectedRoster?.categoryName ||
                              t("common.loading")}
                          </div>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mt-1`}
                          >
                            {t("roster.form.categoryReadOnly")}
                          </p>
                        </div>

                        {/* Title */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.title")} *
                          </label>
                          <Field
                            type="text"
                            name="title"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.title && touched.title
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder={t("roster.form.titlePlaceholder")}
                          />
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        {/* Month (Read Only) */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.month")} *
                          </label>
                          <div
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-600 border-gray-600 text-gray-300"
                                : "bg-gray-100 border-gray-300 text-gray-600"
                            } cursor-not-allowed`}
                          >
                            {selectedRoster?.month
                              ? monthNames[selectedRoster.month - 1]
                              : t("common.loading")}
                          </div>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mt-1`}
                          >
                            {t("roster.form.monthReadOnly")}
                          </p>
                        </div>

                        {/* Year (Read Only) */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.year")} *
                          </label>
                          <div
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-600 border-gray-600 text-gray-300"
                                : "bg-gray-100 border-gray-300 text-gray-600"
                            } cursor-not-allowed`}
                          >
                            {selectedRoster?.year || t("common.loading")}
                          </div>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mt-1`}
                          >
                            {t("roster.form.yearReadOnly")}
                          </p>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.startDate")} *
                          </label>
                          <Field
                            as="select"
                            name="startDay"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.startDay && touched.startDay
                                ? "border-red-500"
                                : ""
                            }`}
                          >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(
                              (day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              )
                            )}
                          </Field>
                          <ErrorMessage
                            name="startDay"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        {/* End Day */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.endDate")} *
                          </label>
                          <Field
                            as="select"
                            name="endDay"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.endDay && touched.endDay
                                ? "border-red-500"
                                : ""
                            }`}
                          >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(
                              (day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              )
                            )}
                          </Field>
                          <ErrorMessage
                            name="endDay"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                        {/* Submission Deadline */}
                        <div className="md:col-span-2">
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.submissionDeadline")} *
                          </label>
                          <Field
                            type="datetime-local"
                            name="submissionDeadline"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.submissionDeadline &&
                              touched.submissionDeadline
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mt-1`}
                          >
                            {t("roster.form.submissionDeadlineHelp")}
                          </p>
                          <ErrorMessage
                            name="submissionDeadline"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.description")}
                          </label>
                          <Field
                            as="textarea"
                            name="description"
                            rows="3"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder={t(
                              "roster.form.descriptionPlaceholder"
                            )}
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Settings */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <Settings
                          className={`${isRTL ? "ml-3" : "mr-3"} text-blue-600`}
                          size={24}
                        />
                        <h2
                          className={`text-xl font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("roster.form.settings")}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Allow Swap Requests */}
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
                                className={`text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {t("roster.form.allowSwapRequests")}
                              </label>
                              <p
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                } mt-1`}
                              >
                                {t("roster.form.allowSwapRequestsHelp")}
                              </p>
                            </div>
                            <Field
                              type="checkbox"
                              name="allowSwapRequests"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                          </div>
                        </div>

                        {/* Allow Leave Requests */}
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
                                className={`text-sm font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {t("roster.form.allowLeaveRequests")}
                              </label>
                              <p
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                } mt-1`}
                              >
                                {t("roster.form.allowLeaveRequestsHelp")}
                              </p>
                            </div>
                            <Field
                              type="checkbox"
                              name="allowLeaveRequests"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            isDark
                              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <ArrowLeft
                            size={16}
                            className={isRTL ? "ml-2" : "mr-2"}
                          />
                          {t("common.previous")}
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        to="/admin-panel/rosters"
                        className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          isDark
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <X size={16} className={isRTL ? "ml-2" : "mr-2"} />
                        {t("common.cancel")}
                      </Link>

                      {currentStep < totalSteps ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          {t("common.next")}
                          <ArrowLeft
                            size={16}
                            className={`${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                          />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting || loading.update}
                          className={`inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isSubmitting || loading.update ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {t("roster.actions.updating")}
                            </>
                          ) : (
                            <>
                              <Save
                                size={16}
                                className={isRTL ? "ml-2" : "mr-2"}
                              />
                              {t("roster.actions.update")}
                            </>
                          )}
                        </button>
                      )}
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
};

export default UpdateRoster;
