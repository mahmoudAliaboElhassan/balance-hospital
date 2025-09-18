import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { assignDepManager } from "../../../state/act/actDepartment";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getUserSummaries } from "../../../state/slices/user";
import { getDepartmentById } from "../../../state/act/actDepartment";
import LoadingGetData from "../../../components/LoadingGetData";
import { Search, User, ArrowLeft, Building } from "lucide-react";
import UseFormValidation from "../../../hooks/use-form-validation";
import UseInitialValues from "../../../hooks/use-initial-values";
import {
  assignCategoryHead,
  getCategoryById,
} from "../../../state/act/actCategory";
import { doctorForAssignment } from "../../../state/act/actUsers";

function AssignDepartmentManager() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { depId: id } = useParams();
  const dropdownRef = useRef(null);
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  // State for user search and selection
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  // Redux selectors
  const {
    loadingAssignManager,
    loadingGetDepartmentById,
    selectedDepartment,
    error,
  } = useSelector((state) => state.department);

  const {
    loadingAssignCategoryHead,
    selectedCategory,
    loadingGetSingleCategory,
  } = useSelector((state) => state.category);

  console.log("selectedCategory", selectedCategory);

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.users);

  // Validation schema
  const { VALIDATION_SCHEMA_ASSIGN_DEPARTMENT_HEAD } = UseFormValidation();
  // Initial form values
  const { INITIAL_VALUES_ASSIGN_DEPARTMENT_HEAD } = UseInitialValues();

  // Load initial data
  useEffect(() => {
    if (id) {
      if (type == "department") {
        dispatch(getDepartmentById(id));
        dispatch(doctorForAssignment({}));
      } else {
        dispatch(getCategoryById({ categoryId: id }));
        dispatch(
          doctorForAssignment({
            categoryId: id,
          })
        );
      }
    }
    // dispatch(
    //   getUserSummaries({
    //     // page: 1,
    //     // pageSize: 50,
    //     isActive: true,
    //     isApproved: true,
    //     isEmailVerified: true,
    //   })
    // );
  }, [dispatch, id]);

  // Handle user search with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (type === "department") {
        dispatch(doctorForAssignment({ search: userSearchTerm }));
      } else {
        dispatch(
          doctorForAssignment({ search: userSearchTerm, categoryId: id })
        );
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearchTerm, dispatch]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle user search input
  const handleUserSearchChange = (e, setFieldValue) => {
    const value = e.target.value;
    setUserSearchTerm(value);
    setShowUserDropdown(true);

    if (!value) {
      setSelectedUser(null);
      setFieldValue("UserId", "");
    }
  };

  // Handle user selection
  const handleUserSelect = (user, setFieldValue) => {
    setSelectedUser(user);
    setUserSearchTerm(`${user.nameEnglish} (${user.mobile})`);
    setFieldValue("UserId", user.userId);
    setShowUserDropdown(false);
  };

  // Filter users based on search
  const filteredUsers =
    users?.filter((user) => {
      if (!userSearchTerm) return true;
      const searchLower = userSearchTerm?.toLowerCase();
      return (
        user.nameEnglish?.toLowerCase().includes(searchLower) ||
        user.nameArabic?.includes(userSearchTerm) ||
        user.mobile.includes(userSearchTerm) ||
        user.role?.toLowerCase().includes(searchLower)
      );
    }) || [];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (type == "department") {
      dispatch(assignDepManager({ data: { ...values, DepartmentId: id } }))
        .unwrap()
        .then(() => {
          resetForm();
          setSelectedUser(null);
          setUserSearchTerm("");
          toast.success(
            t("departmentForm.success.managerAssigned") ||
              "Manager assigned successfully",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          navigate(`/admin-panel/department/${id}`);
        })
        .catch((error) => {
          console.error("Manager assignment error:", error);
          Swal.fire({
            title: t("departmentForm.error.title") || "Error",
            text:
              currentLang === "en"
                ? error?.errors[0] || error?.messageEn
                : error?.errors[0] || error?.messageAr,
            icon: "error",
            confirmButtonText: t("common.ok") || "OK",
            confirmButtonColor: "#ef4444",
            background: isDark ? "#2d2d2d" : "#ffffff",
            color: isDark ? "#f0f0f0" : "#111827",
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      dispatch(assignCategoryHead({ data: { ...values, CategoryId: id } }))
        .unwrap()
        .then(() => {
          resetForm();
          setSelectedUser(null);
          setUserSearchTerm("");
          toast.success(
            t("categoryForm.success.managerAssigned") ||
              "Manager assigned successfully",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          navigate(`/admin-panel/category/${id}`);
        })
        .catch((error) => {
          console.error("Manager assignment error:", error);
          Swal.fire({
            title: t("categoryForm.error.assignManager") || "Error",
            text:
              currentLang === "en"
                ? error?.errors[0] || error?.messageEn
                : error?.errors[0] || error?.messageAr,
            icon: "error",
            confirmButtonText: t("common.ok") || "OK",
            confirmButtonColor: "#ef4444",
            background: isDark ? "#2d2d2d" : "#ffffff",
            color: isDark ? "#f0f0f0" : "#111827",
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  if (loadingGetDepartmentById)
    return <LoadingGetData text={t("gettingData.departmentData")} />;
  if (loadingGetSingleCategory)
    return <LoadingGetData text={t("gettingData.categoryData")} />;

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate("/admin-panel/departments")}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <ArrowLeft size={20} />
              </button>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } ${isRTL ? "font-arabic" : ""}`}
              >
                {t("departmentForm.assignManager") ||
                  "Assign Department Manager"}
              </h1>
            </div>

            {/* Department Info */}

            <div
              className={`p-4 rounded-lg border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-blue-100"
                  }`}
                >
                  <Building
                    size={20}
                    className={isDark ? "text-gray-300" : "text-blue-600"}
                  />
                </div>
                <div>
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {type == "department"
                      ? currentLang === "ar"
                        ? selectedDepartment?.nameArabic
                        : selectedDepartment?.nameEnglish
                      : currentLang === "ar"
                      ? selectedCategory?.nameArabic
                      : selectedCategory?.nameEnglish}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {type == "department"
                      ? `${selectedDepartment?.code} • ${selectedDepartment?.location}`
                      : selectedCategory?.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            className={`rounded-lg shadow border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6">
              <Formik
                initialValues={INITIAL_VALUES_ASSIGN_DEPARTMENT_HEAD}
                validationSchema={VALIDATION_SCHEMA_ASSIGN_DEPARTMENT_HEAD}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    {/* Manager Selection Section */}
                    <div className="space-y-6">
                      <h3
                        className={`text-lg font-semibold border-b pb-2 ${
                          isDark
                            ? "text-white border-gray-600"
                            : "text-gray-900 border-gray-200"
                        }`}
                      >
                        {t("departmentForm.sections.managerSelection") ||
                          "Manager Selection"}
                      </h3>

                      {/* User Selection */}
                      <div className="space-y-2">
                        <label
                          className={`block text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {type == "department"
                            ? t("departmentForm.fields.departmentHead")
                            : t("departmentForm.fields.categoryHead")}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative" ref={dropdownRef}>
                          <div className="relative">
                            <input
                              type="text"
                              value={userSearchTerm}
                              onChange={(e) =>
                                handleUserSearchChange(e, setFieldValue)
                              }
                              onFocus={() => setShowUserDropdown(true)}
                              placeholder={
                                t("departmentForm.placeholders.searchUsers") ||
                                "Search users by name, mobile, or role..."
                              }
                              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                isRTL ? "pr-10" : "pl-10"
                              } ${
                                isDark
                                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                              } ${
                                errors.UserId && touched.UserId
                                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                  : ""
                              }`}
                              autoComplete="off"
                            />
                            <div
                              className={`absolute top-2.5 ${
                                isRTL ? "right-3" : "left-3"
                              }`}
                            >
                              <Search
                                size={16}
                                className={
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }
                              />
                            </div>

                            {/* Loading indicator */}
                            {usersLoading.list?.list && (
                              <div
                                className={`absolute top-2.5 ${
                                  isRTL ? "left-3" : "right-3"
                                }`}
                              >
                                <svg
                                  className="animate-spin h-5 w-5 text-gray-400"
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
                              </div>
                            )}
                          </div>

                          <ErrorMessage
                            name="UserId"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />

                          {/* User Dropdown */}
                          {showUserDropdown && (
                            <div
                              className={`absolute z-20 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto ${
                                isDark
                                  ? "bg-gray-700 border-gray-600"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {usersLoading.list?.list ? (
                                <div
                                  className={`p-4 text-center ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  <svg
                                    className="animate-spin mx-auto h-6 w-6 text-gray-400"
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
                                  <p className="mt-2">
                                    {t("departmentForm.loading.users") ||
                                      "Loading users..."}
                                  </p>
                                </div>
                              ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                  <div
                                    key={user.id}
                                    onClick={() =>
                                      handleUserSelect(user, setFieldValue)
                                    }
                                    className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                                      isDark
                                        ? "hover:bg-gray-600 border-gray-600"
                                        : "hover:bg-gray-50 border-gray-100"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`p-1.5 rounded-full ${
                                          isDark ? "bg-gray-600" : "bg-gray-100"
                                        }`}
                                      >
                                        <User
                                          size={14}
                                          className={
                                            isDark
                                              ? "text-gray-400"
                                              : "text-gray-500"
                                          }
                                        />
                                      </div>
                                      <div>
                                        {/* Main Name */}
                                        <div
                                          className={`text-sm font-medium ${
                                            isDark
                                              ? "text-white"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {user.nameEnglish}
                                          {user.nameArabic && (
                                            <span
                                              className={`text-xs font-normal ${
                                                isDark
                                                  ? "text-gray-400"
                                                  : "text-gray-500"
                                              } ml-2`}
                                            >
                                              ({user.nameArabic})
                                            </span>
                                          )}
                                        </div>

                                        {/* Contact & Status Info */}
                                        <div
                                          className={`text-xs mt-1 space-y-1 ${
                                            isDark
                                              ? "text-gray-400"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span>{user.mobile}</span>
                                            <span>•</span>
                                            <span>{user.email}</span>
                                          </div>

                                          {/* Professional Info */}
                                          <div className="flex items-center gap-2">
                                            {user.scientificDegree && (
                                              <>
                                                <span>
                                                  {user.scientificDegree}
                                                </span>
                                                <span>•</span>
                                              </>
                                            )}
                                            <span>{user.contractingType}</span>
                                          </div>

                                          {/* Experience & Status */}
                                          <div className="flex items-center gap-2">
                                            <span>
                                              {user.experienceYears}{" "}
                                              {t("user.yearsExperience") ||
                                                "years exp"}
                                            </span>

                                            {/* Status Badges */}
                                            {user.isCurrentHead && (
                                              <>
                                                <span>•</span>
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                  {t("user.currentHead") ||
                                                    "Current Head"}
                                                </span>
                                              </>
                                            )}

                                            {user.isManagerInOtherCategory && (
                                              <>
                                                <span>•</span>
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                  {t("user.managerElsewhere") ||
                                                    "Manager in Other Category"}
                                                </span>
                                              </>
                                            )}

                                            {!user.isActive && (
                                              <>
                                                <span>•</span>
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                  {t("user.inactive") ||
                                                    "Inactive"}
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div
                                  className={`p-4 text-center ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {userSearchTerm
                                    ? t("assignUserRole.noResults") ||
                                      "No users found matching your search"
                                    : t("assignUserRole.noUsers") ||
                                      "No users available"}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Start Date */}
                      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="startDate"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("departmentForm.fields.startDate") ||
                              "Start Date"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="date"
                            id="startDate"
                            name="startDate"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.startDate && touched.startDate
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name="startDate"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                      </div> */}
                    </div>

                    {/* Permissions Section */}
                    {/* <div className="space-y-4">
                      <h3
                        className={`text-lg font-semibold border-b pb-2 ${
                          isDark
                            ? "text-white border-gray-600"
                            : "text-gray-900 border-gray-200"
                        }`}
                      >
                        {t("departmentForm.sections.permissions") ||
                          "Manager Permissions"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className={`flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Field
                            type="checkbox"
                            id="canViewDepartment"
                            name="canViewDepartment"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="canViewDepartment"
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } ${isRTL ? "mr-2" : "ml-2"}`}
                          >
                            {t("departmentForm.fields.canViewDepartment") ||
                              "Can View Department"}
                          </label>
                        </div>

                        <div
                          className={`flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Field
                            type="checkbox"
                            id="canEditDepartment"
                            name="canEditDepartment"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="canEditDepartment"
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } ${isRTL ? "mr-2" : "ml-2"}`}
                          >
                            {t("departmentForm.fields.canEditDepartment") ||
                              "Can Edit Department"}
                          </label>
                        </div>

                        <div
                          className={`flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Field
                            type="checkbox"
                            id="canViewDepartmentReports"
                            name="canViewDepartmentReports"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="canViewDepartmentReports"
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } ${isRTL ? "mr-2" : "ml-2"}`}
                          >
                            {t(
                              "departmentForm.fields.canViewDepartmentReports"
                            ) || "Can View Department Reports"}
                          </label>
                        </div>

                        <div
                          className={`flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Field
                            type="checkbox"
                            id="canManageSchedules"
                            name="canManageSchedules"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="canManageSchedules"
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } ${isRTL ? "mr-2" : "ml-2"}`}
                          >
                            {t("departmentForm.fields.canManageSchedules") ||
                              "Can Manage Schedules"}
                          </label>
                        </div>

                        <div
                          className={`flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Field
                            type="checkbox"
                            id="canManageStaff"
                            name="canManageStaff"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="canManageStaff"
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } ${isRTL ? "mr-2" : "ml-2"}`}
                          >
                            {t("departmentForm.fields.canManageStaff") ||
                              "Can Manage Staff"}
                          </label>
                        </div>
                      </div>
                    </div> */}

                    {/* Notes Section */}
                    <div>
                      <label
                        htmlFor="notes"
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("departmentForm.fields.notes") || "Notes"}
                      </label>
                      <Field
                        as="textarea"
                        id="notes"
                        name="notes"
                        rows={3}
                        dir={isRTL ? "rtl" : "ltr"}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900"
                        } ${
                          errors.notes && touched.notes
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : ""
                        }`}
                        placeholder={
                          t("departmentForm.placeholders.notes") ||
                          "Enter any notes about the manager assignment"
                        }
                      />
                      <ErrorMessage
                        name="notes"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                      <p
                        className={`mt-1 text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {values.notes?.length || 0}/500{" "}
                        {t("managementRoleForm.charactersCount")}
                      </p>
                    </div>

                    {/* Submit Buttons */}
                    <div
                      className={`flex justify-end space-x-3 pt-6 border-t ${
                        isDark ? "border-gray-600" : "border-gray-200"
                      } ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <button
                        type="button"
                        className={`px-6 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isDark
                            ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => navigate(-1)}
                      >
                        {t("departmentForm.buttons.cancel") || "Cancel"}
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          loadingAssignManager ||
                          loadingAssignCategoryHead
                        }
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isSubmitting ||
                          loadingAssignManager ||
                          loadingAssignCategoryHead
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting ||
                        loadingAssignManager ||
                        loadingAssignCategoryHead ? (
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
                            {t("department.actions.assigning") ||
                              "Assigning..."}
                          </div>
                        ) : (
                          t("department.actions.assign") || "Assign Manager"
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
    </div>
  );
}

export default AssignDepartmentManager;
