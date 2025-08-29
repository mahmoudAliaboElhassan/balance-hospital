import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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

import { createBasicRoster } from "../../../state/act/actRosterManagement";
// import { clearError, clearSuccess } from "../../../state/slices/roster";

import { getCategoryTypes } from "../../../state/act/actCategory";
import { getDepartments } from "../../../state/act/actDepartment";
import { getSubDepartments } from "../../../state/act/actSubDepartment";
import { getShiftHoursTypes } from "../../../state/act/actShiftHours";
import { getContractingTypes } from "../../../state/act/actContractingType";
import LoadingGetData from "../../../components/LoadingGetData";
import Swal from "sweetalert2";
import UseInitialValues from "../../../hooks/use-initial-values";
import UseFormValidation from "../../../hooks/use-form-validation";

const CreateRoster = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";
  const rosterType = searchParams.get("type") || "basic"; // basic or complete
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = rosterType === "complete" ? 4 : 2;
  // State for cascading dropdowns
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [departmentsByCategory, setDepartmentsByCategory] = useState([]);
  const [subDepartmentsByDepartment, setSubDepartmentsByDepartment] = useState(
    {}
  );

  const { VALIDATION_SCHEMA_CREATE_BASIC_ROASTER } = UseFormValidation();
  const { INITIAL_VALUES_CREATE_BASIC_ROASTER } = UseInitialValues();

  const { loading, success, error, createError } = useSelector(
    (state) => state.rosterManagement
  );

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  const [loadingSubDepartment, setLoadingSubDepartment] = useState(0);

  // Configuration data
  const { categoryTypes, loadingGetCategoryTypes } = useSelector(
    (state) => state.category
  );
  const { departments, loadingGetDepartments } = useSelector(
    (state) => state.department
  );
  const { subDepartments, loadingGetSubDepartments } = useSelector(
    (state) => state.subDepartment
  );

  // Load initial data
  useEffect(() => {
    dispatch(getCategoryTypes());
    if (rosterType === "complete") {
      dispatch(getShiftHoursTypes());
      dispatch(getContractingTypes());
    }
  }, [dispatch, rosterType]);

  // Filter departments when category changes
  useEffect(() => {
    if (selectedCategoryId && departments.length > 0) {
      const filteredDepartments = departments.filter(
        (dept) => dept.categoryId === parseInt(selectedCategoryId)
      );
      setDepartmentsByCategory(filteredDepartments);
    } else {
      setDepartmentsByCategory([]);
    }
  }, [selectedCategoryId, departments]);

  // Filter subdepartments when departments change
  useEffect(() => {
    if (subDepartments.length > 0) {
      const subDeptsByDept = {};
      subDepartments.forEach((subDept) => {
        if (!subDeptsByDept[subDept.departmentId]) {
          subDeptsByDept[subDept.departmentId] = [];
        }
        subDeptsByDept[subDept.departmentId].push(subDept);
      });
      setSubDepartmentsByDepartment(subDeptsByDept);
    }
  }, [subDepartments]);

  // Handle success/error notifications
  useEffect(() => {
    if (success.create) {
      toast.success(t("roster.success.created"));
      //   dispatch(clearSuccess());
    }
  }, [success.create, dispatch, navigate, t]);

  useEffect(() => {
    if (createError) {
      toast.error(
        createError.messageAr ||
          createError.message ||
          t("roster.error.createFailed")
      );
      //   dispatch(clearError());
    }
  }, [createError, dispatch, t]);

  // Show loading screen for initial categoryTypes loading
  if (loadingGetCategoryTypes) {
    return <LoadingGetData text={t("gettingData.categories")} />;
  }

  // Get current year and next 5 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear + i);

  // Validation schemas

  const cleanDepartmentData = (department, rosterType) => {
    const cleanedDepartment = {
      departmentId: parseInt(department.departmentId),
    };

    // Only add subDepartmentId if it's not empty
    if (
      department.subDepartmentId &&
      department.subDepartmentId.toString().trim() !== ""
    ) {
      cleanedDepartment.subDepartmentId = parseInt(department.subDepartmentId);
    }

    // Only add notes if it's not empty
    if (department.notes && department.notes.trim() !== "") {
      cleanedDepartment.notes = department.notes.trim();
    }

    return cleanedDepartment;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("values", values);

    // Combine startDay and endDay with month/year to create full dates
    const year = parseInt(values.year);
    const month = parseInt(values.month);
    const startDay = parseInt(values.startDay);
    const endDay = parseInt(values.endDay);

    // Create full date strings (YYYY-MM-DD format)
    const startDate = `${year}-${month.toString().padStart(2, "0")}-${startDay
      .toString()
      .padStart(2, "0")}`;
    const endDate = `${year}-${month.toString().padStart(2, "0")}-${endDay
      .toString()
      .padStart(2, "0")}`;

    const cleanedValues = {
      categoryId: parseInt(values.categoryId),
      month: month,
      year: year,
      startDate: startDate,
      endDate: endDate,
      title: values.title,
      description: values.description || "",
      submissionDeadline: values.submissionDeadline,
      departments: values.departments.map((department) =>
        cleanDepartmentData(department, rosterType)
      ),
      allowSwapRequests: values.allowSwapRequests || false,
      allowLeaveRequests: values.allowLeaveRequests || false,
    };

    console.log("Cleaned values", cleanedValues);
    setSubmitting(true);

    dispatch(createBasicRoster(cleanedValues))
      .unwrap()
      .then(() => {
        setSubmitting(false);
        toast.success(t("roster.success.created"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate(`/admin-panel/rosters/departments`);
      })
      .catch((error) => {
        // Error handling is done in useEffect
        setSubmitting(false);

        Swal.fire({
          title: t("roster.error.createFailed"),
          text: error.errors[0],

          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: "#ffffff",
          color: "#111827",
        });
      });
  };

  // Handle category change
  const handleCategoryChange = (categoryId, setFieldValue) => {
    setSelectedCategoryId(categoryId);
    setFieldValue("categoryId", categoryId);

    // Clear all department selections when category changes
    setFieldValue("departments", [
      {
        departmentId: "",
        subDepartmentId: "",
        notes: "",
        ...(rosterType === "complete" && {
          workingHours: [],
        }),
      },
    ]);

    // Fetch departments for the selected category
    if (categoryId) {
      dispatch(getDepartments({ categoryId }));
      // Also fetch subdepartments for future use
      dispatch(getSubDepartments());
    }
  };

  // Handle department change
  const handleDepartmentChange = (departmentId, index, setFieldValue) => {
    setFieldValue(`departments.${index}.departmentId`, departmentId);
    // const departmentFiltered = departmentsByCategory.filter(
    //   (dep) => dep.id != departmentId
    // );
    // setDepartmentsByCategory(departmentFiltered);
    setFieldValue(`departments.${index}.subDepartmentId`, "");
    setLoadingSubDepartment(index);
    dispatch(getSubDepartments({ departmentId }));
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

  const dayNames = isRTL
    ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

  const getStepTitle = (step) => {
    switch (step) {
      case 1:
        return t("roster.form.basicInfo");
      case 2:
        return t("roster.form.departments");
      case 3:
        return t("roster.form.workingHours");
      case 4:
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
        return <Building size={20} />;
      case 3:
        return <Clock size={20} />;
      case 4:
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

  // Loading component for dropdown fields
  const DropdownLoader = ({ text }) => (
    <div
      className={`w-full px-3 py-2 border rounded-lg ${
        isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
      } flex items-center justify-center`}
    >
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      <span
        className={`${isRTL ? "mr-2" : "ml-2"} text-sm ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {text}
      </span>
    </div>
  );

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
                {rosterType === "basic"
                  ? t("roster.form.createBasicRoster")
                  : t("roster.form.createCompleteRoster")}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                {rosterType === "basic"
                  ? t("roster.form.basicRosterInfo")
                  : t("roster.form.completeRosterInfo")}
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
              initialValues={INITIAL_VALUES_CREATE_BASIC_ROASTER}
              validationSchema={VALIDATION_SCHEMA_CREATE_BASIC_ROASTER}
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
                        {/* Category */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.category")} *
                          </label>
                          <Field
                            as="select"
                            name="categoryId"
                            value={values.categoryId}
                            onChange={(e) =>
                              handleCategoryChange(
                                e.target.value,
                                setFieldValue
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.categoryId && touched.categoryId
                                ? "border-red-500"
                                : ""
                            }`}
                          >
                            <option value="">
                              {t("roster.form.selectCategory")}
                            </option>
                            {categoryTypes.map((category) => (
                              <option key={category.id} value={category.id}>
                                {isRTL
                                  ? category.nameArabic
                                  : category.nameEnglish}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="categoryId"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
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

                        {/* Month */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.month")} *
                          </label>
                          <Field
                            as="select"
                            name="month"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          >
                            {monthNames.map((month, index) => (
                              <option key={index + 1} value={index + 1}>
                                {month}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="month"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        {/* Year */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.year")} *
                          </label>
                          <Field
                            as="select"
                            name="year"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          >
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="year"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
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

                  {/* Step 2: Departments */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <Building
                          className={`${isRTL ? "ml-3" : "mr-3"} text-blue-600`}
                          size={24}
                        />
                        <h2
                          className={`text-xl font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("roster.form.departments")}
                        </h2>
                      </div>

                      {!selectedCategoryId && (
                        <div
                          className={`p-4 rounded-lg border ${
                            isDark
                              ? "border-yellow-600 bg-yellow-900/20"
                              : "border-yellow-200 bg-yellow-50"
                          }`}
                        >
                          <div className="flex items-start">
                            <AlertCircle
                              className={`${
                                isRTL ? "ml-3" : "mr-3"
                              } text-yellow-600 mt-0.5`}
                              size={20}
                            />
                            <div>
                              <h4
                                className={`font-medium ${
                                  isDark ? "text-yellow-300" : "text-yellow-800"
                                } mb-1`}
                              >
                                {t("roster.form.selectCategoryFirst")}
                              </h4>
                              <p
                                className={`text-sm ${
                                  isDark ? "text-yellow-200" : "text-yellow-700"
                                }`}
                              >
                                {t(
                                  "roster.form.selectCategoryFirstDescription"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Loading indicator for departments/subdepartments */}
                      {(loadingGetDepartments || loadingGetSubDepartments) &&
                        selectedCategoryId && (
                          <div
                            className={`p-4 rounded-lg border ${
                              isDark
                                ? "border-blue-600 bg-blue-900/20"
                                : "border-blue-200 bg-blue-50"
                            } mb-4`}
                          >
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                              <span
                                className={`${
                                  isRTL ? "mr-3" : "ml-3"
                                } text-sm ${
                                  isDark ? "text-blue-300" : "text-blue-800"
                                }`}
                              >
                                {loadingGetDepartments
                                  ? t("department.loading")
                                  : t("gettingData.subDepartments")}
                              </span>
                            </div>
                          </div>
                        )}

                      <FieldArray name="departments">
                        {({ remove, push }) => (
                          <div className="space-y-4">
                            {values.departments.map((department, index) => (
                              <div
                                key={index}
                                className={`p-4 border rounded-lg ${
                                  isDark
                                    ? "border-gray-600 bg-gray-700"
                                    : "border-gray-300 bg-gray-50"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-4">
                                  <h4
                                    className={`font-medium ${
                                      isDark ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {t("roster.form.departmentConfig")}{" "}
                                    {index + 1}
                                  </h4>
                                  {values.departments.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="text-red-600 hover:text-red-800 p-1 rounded"
                                      title={t("roster.form.removeDepartment")}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Department */}
                                  <div>
                                    <label
                                      className={`block text-sm font-medium ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      } mb-1`}
                                    >
                                      {t("roster.form.selectDepartment")} *
                                    </label>

                                    {loadingGetDepartments ? (
                                      <DropdownLoader
                                        text={t("common.loading")}
                                      />
                                    ) : (
                                      <Field
                                        as="select"
                                        name={`departments.${index}.departmentId`}
                                        value={department.departmentId}
                                        onChange={(e) =>
                                          handleDepartmentChange(
                                            e.target.value,
                                            index,
                                            setFieldValue
                                          )
                                        }
                                        disabled={
                                          !selectedCategoryId ||
                                          loadingGetDepartments
                                        }
                                        className={`w-full px-3 py-2 border rounded-lg ${
                                          isDark
                                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                                            : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                          errors.departments?.[index]
                                            ?.departmentId &&
                                          touched.departments?.[index]
                                            ?.departmentId
                                            ? "border-red-500"
                                            : ""
                                        }`}
                                      >
                                        <option value="">
                                          {t("roster.form.selectDepartment")}
                                        </option>
                                        {departmentsByCategory.map((dept) => (
                                          <option key={dept.id} value={dept.id}>
                                            {isRTL
                                              ? dept.nameArabic
                                              : dept.nameEnglish}
                                          </option>
                                        ))}
                                      </Field>
                                    )}

                                    <ErrorMessage
                                      name={`departments.${index}.departmentId`}
                                      component="div"
                                      className="text-red-500 text-xs mt-1"
                                    />
                                  </div>

                                  {/* Sub Department */}
                                  <div>
                                    <label
                                      className={`block text-sm font-medium ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      } mb-1`}
                                    >
                                      {t("roster.form.subDepartment")}
                                    </label>

                                    {loadingGetSubDepartments &&
                                    loadingSubDepartment == index ? (
                                      <DropdownLoader
                                        text={t("common.loading")}
                                      />
                                    ) : (
                                      <Field
                                        as="select"
                                        name={`departments.${index}.subDepartmentId`}
                                        disabled={
                                          !department.departmentId ||
                                          loadingGetSubDepartments
                                        }
                                        className={`w-full px-3 py-2 border rounded-lg ${
                                          isDark
                                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                                            : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                      >
                                        <option value="">
                                          {t("roster.form.selectSubDepartment")}
                                        </option>
                                        {department.departmentId &&
                                          subDepartmentsByDepartment[
                                            department.departmentId
                                          ]?.map((subDept) => (
                                            <option
                                              key={subDept.id}
                                              value={subDept.id}
                                            >
                                              {isRTL
                                                ? subDept.nameArabic
                                                : subDept.nameEnglish}
                                            </option>
                                          ))}
                                      </Field>
                                    )}
                                  </div>

                                  {/* Notes */}
                                  <div className="md:col-span-2">
                                    <label
                                      className={`block text-sm font-medium ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      } mb-1`}
                                    >
                                      {t("roster.form.notes")}
                                    </label>
                                    <Field
                                      type="text"
                                      name={`departments.${index}.notes`}
                                      className={`w-full px-3 py-2 border rounded-lg ${
                                        isDark
                                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                      placeholder={t(
                                        "roster.form.notesPlaceholder"
                                      )}
                                    />
                                    <ErrorMessage
                                      name={`departments.${index}.notes`}
                                      component="div"
                                      className="text-red-500 text-xs mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() =>
                                push({
                                  departmentId: "",
                                  subDepartmentId: "",
                                  notes: "",
                                  ...(rosterType === "complete" && {
                                    workingHours: [],
                                  }),
                                })
                              }
                              disabled={!selectedCategoryId}
                              className={`inline-flex items-center px-4 py-2 border border-dashed rounded-lg text-sm font-medium transition-colors ${
                                !selectedCategoryId
                                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                  : isDark
                                  ? "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                                  : "border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-600"
                              }`}
                            >
                              <Plus
                                size={16}
                                className={isRTL ? "ml-2" : "mr-2"}
                              />
                              {t("roster.form.addDepartment")}
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  )}

                  {/* Step 3: Working Hours (Complete Mode Only) */}
                  {currentStep === 3 && rosterType === "complete" && (
                    <div className="space-y-6">
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
                          {t("roster.form.workingHours")}
                        </h2>
                      </div>

                      <div
                        className={`p-4 rounded-lg border ${
                          isDark
                            ? "border-blue-600 bg-blue-900/20"
                            : "border-blue-200 bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start">
                          <AlertCircle
                            className={`${
                              isRTL ? "ml-3" : "mr-3"
                            } text-blue-600 mt-0.5`}
                            size={20}
                          />
                          <div>
                            <h4
                              className={`font-medium ${
                                isDark ? "text-blue-300" : "text-blue-800"
                              } mb-1`}
                            >
                              {t("roster.form.workingHoursNote")}
                            </h4>
                            <p
                              className={`text-sm ${
                                isDark ? "text-blue-200" : "text-blue-700"
                              }`}
                            >
                              {t("roster.form.workingHoursDescription")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Working hours configuration would be implemented here */}
                      {/* This is a complex nested form that would require additional components */}
                      <div
                        className={`p-8 text-center ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        } rounded-lg`}
                      >
                        <Clock
                          className={`mx-auto mb-4 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                          size={48}
                        />
                        <h3
                          className={`text-lg font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          } mb-2`}
                        >
                          {t("roster.form.workingHoursConfiguration")}
                        </h3>
                        <p
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t(
                            "roster.form.workingHoursConfigurationDescription"
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Settings (Complete Mode) / Step 2: Settings (Basic Mode) */}
                  {currentStep === totalSteps && (
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

                        {/* Max Consecutive Days */}
                        {/* <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.maxConsecutiveDays")}
                          </label>
                          <Field
                            type="number"
                            name="maxConsecutiveDays"
                            min="1"
                            max="14"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.maxConsecutiveDays &&
                              touched.maxConsecutiveDays
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mt-1`}
                          >
                            {t("roster.form.maxConsecutiveDaysHelp")}
                          </p>
                          <ErrorMessage
                            name="maxConsecutiveDays"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div> */}

                        {/* Min Rest Days Between */}
                        {/* <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } mb-2`}
                          >
                            {t("roster.form.minRestDaysBetween")}
                          </label>
                          <Field
                            type="number"
                            name="minRestDaysBetween"
                            min="0"
                            max="7"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.minRestDaysBetween &&
                              touched.minRestDaysBetween
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mt-1`}
                          >
                            {t("roster.form.minRestDaysBetweenHelp")}
                          </p>
                          <ErrorMessage
                            name="minRestDaysBetween"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div> */}
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
                          disabled={isSubmitting || loading.createBasic}
                          className={`inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isSubmitting || loading.createBasic ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {t("roster.actions.creating")}
                            </>
                          ) : (
                            <>
                              <Save
                                size={16}
                                className={isRTL ? "ml-2" : "mr-2"}
                              />
                              {t("roster.actions.createBasic")}
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

export default CreateRoster;
