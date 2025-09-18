import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDepartmentById } from "../../../state/act/actDepartment";
import { getSubDepartments } from "../../../state/act/actSubDepartment";
import {
  clearSingleDepartment,
  clearSingleDepartmentError,
} from "../../../state/slices/department";
import LoadingGetData from "../../../components/LoadingGetData";
import { useTranslation } from "react-i18next";
import { Edit, Eye, UserPlus, UserCog, UserX, Shield } from "lucide-react";
import RemoveManagerModal from "../../../components/RemoveMangerModal";
import Forbidden from "../../../components/forbidden";

function SpecificDepartment() {
  const { depId: id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showRemoveManagerModal, setShowRemoveManagerModal] = useState(false);
  const { loginRoleResponseDto } = useSelector((state) => state.auth);
  const {
    selectedDepartment,
    loadingGetSingleDepartment,
    singleDepartmentError,
    departmentLinkedIds,
  } = useSelector((state) => state.department);

  const depIdsLinked = JSON?.parse(departmentLinkedIds);
  console.log(depIdsLinked, typeof depIdsLinked);
  const canManage = depIdsLinked?.some((depId) => depId == id);

  console.log("canManage", canManage);
  if (!canManage && loginRoleResponseDto?.roleNameEn == "Category Head") {
    return <Forbidden />;
  }
  // Get sub-departments
  const { subDepartments, loadingGetSubDepartments } = useSelector(
    (state) => state.subDepartment
  );

  // Get categories for displaying category name
  const { categories } = useSelector((state) => state.category);

  // Get mode and translation function
  const { mymode } = useSelector((state) => state.mode);
  const { t, i18n } = useTranslation();

  // Get current language direction and theme
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (id) {
      // Clear previous data before fetching
      dispatch(clearSingleDepartment());
      dispatch(getDepartmentById(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSingleDepartment());
      dispatch(clearSingleDepartmentError());
    };
  }, [dispatch, id]);

  // Fetch sub-departments for this specific department
  // useEffect(() => {
  //   if (selectedDepartment?.id) {
  //     dispatch(
  //       getSubDepartments({
  //         departmentId: selectedDepartment.id,
  //       })
  //     );
  //   }
  // }, [dispatch, selectedDepartment?.id]);

  // Handle error cases
  useEffect(() => {
    if (singleDepartmentError) {
      if (singleDepartmentError.status === 404) {
        console.error("Department not found");
      } else if (singleDepartmentError.status === 403) {
        console.error("Access denied");
      }
    }
  }, [singleDepartmentError, navigate]);

  // Get department name based on current language
  const getDepartmentName = () => {
    if (!selectedDepartment) return "";
    return currentLang === "en"
      ? selectedDepartment.nameEnglish
      : selectedDepartment.nameArabic;
  };

  // Get department secondary name (opposite language)
  const getDepartmentSecondaryName = () => {
    if (!selectedDepartment) return "";
    return currentLang === "en"
      ? selectedDepartment.nameArabic
      : selectedDepartment.nameEnglish;
  };

  const handleCreateSubDepartment = () => {
    if (selectedDepartment) {
      // Save category information to localStorage
      localStorage.setItem("departmentId", selectedDepartment.id);
      localStorage.setItem(
        "departmentEnglishName",
        selectedDepartment.nameEnglish
      );
      localStorage.setItem(
        "departmentArabicName",
        selectedDepartment.nameArabic
      );

      // Navigate to create department page
      navigate("/admin-panel/sub-department/create-specific");
    }
  };

  // Manager action handlers
  const handleAssignManager = () => {
    navigate(`/admin-panel/department/assign-manager/${id}?type=department`);
  };

  const handleEditManagerPermissions = () => {
    navigate(`/admin-panel/department/edit-manager-permissions/${id}`);
  };

  const handleRemoveManager = () => {
    setShowRemoveManagerModal(true);
  };

  // Get manager name based on current language
  const getManagerName = () => {
    if (!selectedDepartment?.manager) return "";
    // Assuming manager object has name properties
    return currentLang === "ar"
      ? selectedDepartment.manager.userNameArabic
      : selectedDepartment.manager.userNameEnglish;
  };

  // Get category name based on current language
  const getCategoryNames = () => {
    if (!selectedDepartment?.linkedCategories && !categories) return [];

    // If department has linked categories, return all of them
    if (selectedDepartment?.linkedCategories?.length > 0) {
      return selectedDepartment.linkedCategories.map((category) => ({
        id: category.id,
        name:
          currentLang === "en"
            ? category.categoryNameEnglish
            : category.categoryNameArabic,
      }));
    }
  };

  // Format date based on language
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const locale = currentLang === "en" ? "en-US" : "ar-EG";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString(locale, options);
  };

  // Loading Component
  if (loadingGetSingleDepartment) {
    return <LoadingGetData text={t("gettingData.departmentData")} />;
  }

  // Error Component
  if (singleDepartmentError) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-red-50 to-pink-100"
        } p-6`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 text-center`}
          >
            <div
              className={`w-20 h-20 ${
                isDark ? "bg-red-900/30" : "bg-red-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("department.error.title") || "Error"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {singleDepartmentError.message}
            </p>

            {loginRoleResponseDto?.roleNameEn == "System Administrator" && (
              <button
                onClick={() => navigate("/admin-panel/departments")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("department.details.backToDepartments") ||
                  "Back to Departments"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Not Found Component
  if (!selectedDepartment) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-gray-50 to-gray-100"
        } p-6`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 text-center`}
          >
            <div
              className={`w-20 h-20 ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <svg
                className="w-10 h-10 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("department.empty.title") || "Department Not Found"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {t("department.error.notFound") ||
                "The requested department was not found."}
            </p>
            {loginRoleResponseDto?.roleNameEn == "System Administrator" && (
              <button
                onClick={() => navigate("/admin-panel/departments")}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("department.details.backToDepartments") ||
                  "Back to Departments"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Component
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isDark
          ? "from-gray-900 via-gray-800 to-gray-900"
          : "from-blue-50 via-indigo-50 to-purple-50"
      } p-6 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {loginRoleResponseDto?.roleNameEn == "System Administrator" && (
            <button
              onClick={() => navigate("/admin-panel/departments")}
              className={`inline-flex items-center ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              } transition-colors duration-200 mb-4 group`}
            >
              <svg
                className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"} transform ${
                  isRTL
                    ? "group-hover:translate-x-1 rotate-180"
                    : "group-hover:-translate-x-1"
                } transition-transform duration-200`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t("department.details.backToDepartments") ||
                "Back to Departments"}
            </button>
          )}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 mb-8`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {getDepartmentName()}
                </h1>
                <div
                  className={`mt-2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("departmentForm.fields.category")}
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {getCategoryNames()?.length > 0 ? (
                      getCategoryNames()?.map((category, index) => (
                        <span
                          key={category.id || index}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isDark
                              ? "bg-blue-900 text-blue-200"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {category.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic">
                        {t("department.details.noCategoryInfo")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center space-x-4 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedDepartment.isActive
                      ? `bg-green-100 text-green-800 ${
                          isDark
                            ? "dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }`
                      : `bg-red-100 text-red-800 ${
                          isDark ? "dark:bg-red-900/30 dark:text-red-400" : ""
                        }`
                  }`}
                >
                  {selectedDepartment.isActive
                    ? t("department.status.active")
                    : t("department.status.inactive")}
                </div>

                <Link
                  to={`/admin-panel/department/edit/${selectedDepartment.id}`}
                  className="w-full md:w-auto"
                >
                  <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors justify-center">
                    <Edit size={20} />
                    <span className="hidden sm:inline">
                      {t("department.actions.edit")}
                    </span>
                    <span className="sm:hidden">
                      {t("department.actions.edit")}
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {/* <div
              className={`mt-6 flex ${isRTL ? "justify-start" : "justify-end"}`}
            >
              <button
                onClick={handleCreateSubDepartment}
                className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg
                  className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {t("create-specific-sub-department")}
              </button>
            </div> */}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6`}
            >
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6 flex items-center`}
              >
                <div
                  className={`w-8 h-8 ${
                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                  } rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                {t("department.details.information")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("departmentForm.fields.nameArabic")}
                  </label>
                  <p
                    className={`text-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                    dir="rtl"
                  >
                    {selectedDepartment.nameArabic}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("departmentForm.fields.nameEnglish")}
                  </label>
                  <p
                    className={`text-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {selectedDepartment.nameEnglish}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("departmentForm.fields.category")}
                  </label>
                  <div
                    className={`mt-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="flex flex-wrap gap-2 mt-1">
                      {getCategoryNames()?.length > 0 ? (
                        getCategoryNames()?.map((category, index) => (
                          <span
                            key={category.id || index}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              isDark
                                ? "bg-blue-900 text-blue-200"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {category.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm italic">
                          {t("department.details.noCategoryInfo")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {selectedDepartment.location && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mb-2`}
                    >
                      {t("departmentForm.fields.location")}
                    </label>
                    <p
                      className={`text-lg ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {selectedDepartment.location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Manager Management Card */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  } flex items-center`}
                >
                  <div
                    className={`w-8 h-8 ${
                      isDark ? "bg-purple-900/30" : "bg-purple-100"
                    } rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <UserCog
                      className={`w-4 h-4 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                  </div>
                  {t("department.manager.title") || "Department Manager"}
                </h2>
              </div>

              {selectedDepartment.hasManager && selectedDepartment.manager ? (
                <div>
                  {/* Manager Info */}
                  <div
                    className={`p-4 rounded-lg border mb-4 ${
                      isDark
                        ? "border-gray-700 bg-gray-750"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-lg ${
                            isDark ? "text-white" : "text-gray-900"
                          } mb-2`}
                        >
                          {getManagerName()}
                        </h3>

                        {/* Manager Permissions */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          {/* View Department Permission */}
                          <div className="flex items-center gap-2">
                            {selectedDepartment.manager.canViewDepartment ? (
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            <Eye size={16} className="text-blue-500" />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {t(
                                "department.manager.permissions.viewDepartment"
                              ) || "View Department"}
                            </span>
                          </div>

                          {/* Edit Department Permission */}
                          <div className="flex items-center gap-2">
                            {selectedDepartment.manager.canEditDepartment ? (
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            <Edit size={16} className="text-green-500" />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {t(
                                "department.manager.permissions.editDepartment"
                              ) || "Edit Department"}
                            </span>
                          </div>

                          {/* View Department Reports Permission */}
                          <div className="flex items-center gap-2">
                            {selectedDepartment.manager
                              .canViewDepartmentReports ? (
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            <Shield size={16} className="text-purple-500" />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {t(
                                "department.manager.permissions.viewReports"
                              ) || "View Reports"}
                            </span>
                          </div>

                          {/* Manage Schedules Permission */}
                          <div className="flex items-center gap-2">
                            {selectedDepartment.manager.canManageSchedules ? (
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            <svg
                              className="w-4 h-4 text-indigo-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {t(
                                "department.manager.permissions.manageSchedules"
                              ) || "Manage Schedules"}
                            </span>
                          </div>

                          {/* Manage Staff Permission */}
                          <div className="flex items-center gap-2">
                            {selectedDepartment.manager.canManageStaff ? (
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            <UserCog size={16} className="text-orange-500" />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {t(
                                "department.manager.permissions.manageStaff"
                              ) || "Manage Staff"}
                            </span>
                          </div>
                        </div>

                        {/* Start Date and Notes */}
                        {selectedDepartment.manager.startDate && (
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mb-1`}
                          >
                            <strong>
                              {t("department.manager.startDate") ||
                                "Start Date"}
                              :
                            </strong>{" "}
                            {formatDate(selectedDepartment.manager.startDate)}
                          </p>
                        )}
                        {selectedDepartment.manager.notes && (
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <strong>
                              {t("department.manager.notes") || "Notes"}:
                            </strong>{" "}
                            {selectedDepartment.manager.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Manager Action Buttons */}
                  <div
                    className={`flex gap-3 ${
                      isRTL ? "justify-start" : "justify-end"
                    }`}
                  >
                    {/* <button
                      onClick={handleEditManagerPermissions}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      title={
                        t("department.manager.actions.editPermissions") ||
                        "Edit Permissions"
                      }
                    >
                      <Shield
                        size={16}
                        className={`${isRTL ? "mr-2" : "ml-2"}`}
                      />
                      {t("department.manager.actions.editPermissions") ||
                        "Edit Permissions"}
                    </button> */}

                    {(loginRoleResponseDto?.roleNameEn ===
                      "System Administrator" ||
                      loginRoleResponseDto?.roleNameEn == "Category Head") && (
                      <button
                        onClick={handleRemoveManager}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title={
                          t("department.manager.actions.removeManager") ||
                          "Remove Manager"
                        }
                      >
                        <UserX
                          size={16}
                          className={`${isRTL ? "mr-2" : "ml-2"}`}
                        />
                        {t("department.manager.actions.removeManager") ||
                          "Remove Manager"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div
                    className={`w-16 h-16 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <UserPlus
                      className={`w-8 h-8 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-lg font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    } mb-2`}
                  >
                    {t("department.manager.noManager") || "No Manager Assigned"}
                  </p>
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } text-sm mb-4`}
                  >
                    {t("department.manager.noManagerDescription") ||
                      "This department doesn't have a manager assigned yet."}
                  </p>
                  {(loginRoleResponseDto?.roleNameEn ===
                    "System Administrator" ||
                    loginRoleResponseDto?.roleNameEn == "Category Head") && (
                    <button
                      onClick={handleAssignManager}
                      className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <UserPlus
                        size={16}
                        className={`${isRTL ? "mr-2" : "ml-2"}`}
                      />
                      {t("department.manager.actions.assignManager") ||
                        "Assign Manager"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sub-Departments Section */}
            {/* <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  } flex items-center`}
                >
                  <div
                    className={`w-8 h-8 ${
                      isDark ? "bg-indigo-900/30" : "bg-indigo-100"
                    } rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isDark ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  {t("department.details.subDepartments") || "Sub Departments"}
                  <span
                    className={`${
                      isRTL ? "mr-2" : "ml-2"
                    } px-2 py-1 rounded-full text-sm font-medium ${
                      isDark
                        ? "bg-indigo-900/30 text-indigo-400"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {subDepartments?.length || 0}
                  </span>
                </h2>
              </div>

              {loadingGetSubDepartments ? (
                <div className="text-center p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span
                      className={`${isRTL ? "mr-3" : "ml-3"} ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("gettingData.subDepartments") ||
                        "Loading sub departments..."}
                    </span>
                  </div>
                </div>
              ) : !subDepartments || subDepartments.length === 0 ? (
                <div className="text-center p-8">
                  <div
                    className={`w-16 h-16 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <svg
                      className={`w-8 h-8 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <p
                    className={`text-lg font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    } mb-2`}
                  >
                    {t("subDepartment.empty.title") || "No Sub Departments"}
                  </p>
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } text-sm`}
                  >
                    {t("subDepartment.empty.description") ||
                      "This department doesn't have any sub-departments yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subDepartments.map((subDepartment) => (
                    <div
                      key={subDepartment.id}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                        isDark
                          ? "border-gray-700 bg-gray-750 hover:bg-gray-700"
                          : "border-gray-200 bg-gray-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-lg ${
                              isDark ? "text-white" : "text-gray-900"
                            } mb-1 leading-tight`}
                            dir={currentLang === "ar" ? "rtl" : "ltr"}
                          >
                            {currentLang === "en"
                              ? subDepartment.nameEnglish
                              : subDepartment.nameArabic}
                          </h3>
                          {currentLang === "en" && subDepartment.nameArabic && (
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                              dir="rtl"
                            >
                              {subDepartment.nameArabic}
                            </p>
                          )}
                          {currentLang === "ar" &&
                            subDepartment.nameEnglish && (
                              <p
                                className={`text-sm ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                                dir="ltr"
                              >
                                {subDepartment.nameEnglish}
                              </p>
                            )}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            isRTL ? "mr-2" : "ml-2"
                          } ${
                            subDepartment.isActive
                              ? `bg-green-100 text-green-800 ${
                                  isDark
                                    ? "dark:bg-green-900/30 dark:text-green-400"
                                    : ""
                                }`
                              : `bg-red-100 text-red-800 ${
                                  isDark
                                    ? "dark:bg-red-900/30 dark:text-red-400"
                                    : ""
                                }`
                          }`}
                        >
                          {subDepartment.isActive
                            ? t("subDepartment.status.active")
                            : t("subDepartment.status.inactive")}
                        </span>
                      </div>

                      {subDepartment.location && (
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className={`w-4 h-4 ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            } truncate`}
                            title={subDepartment.location}
                          >
                            {subDepartment.location}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        {subDepartment.doctorsCount !== undefined && (
                          <div className="flex items-center gap-2">
                            <svg
                              className={`w-4 h-4 ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                              />
                            </svg>
                            <span
                              className={`${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {subDepartment.doctorsCount || 0}{" "}
                              {t("subDepartment.table.doctors")}
                            </span>
                          </div>
                        )}
                        {subDepartment.pendingRequestsCount !== undefined && (
                          <div className="flex items-center gap-2">
                            <svg
                              className={`w-4 h-4 ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span
                              className={`${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {subDepartment.pendingRequestsCount || 0}{" "}
                              {t("subDepartment.table.pendingRequests")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <svg
                            className={`w-4 h-4 ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {formatDate(subDepartment.createdAt)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/admin-panel/sub-departments/${subDepartment.id}`}
                          >
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title={t("department.actions.view")}
                            >
                              <Eye size={16} />
                            </button>
                          </Link>
                          <Link
                            to={`/admin-panel/sub-departments/edit/${subDepartment.id}`}
                          >
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                              title={t("department.actions.edit")}
                            >
                              <Edit size={16} />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            {/* Description Card */}
            {selectedDepartment.description && (
              <div
                className={`${
                  isDark ? "bg-gray-800" : "bg-white"
                } rounded-2xl shadow-xl p-6`}
              >
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  } mb-4 flex items-center`}
                >
                  <div
                    className={`w-8 h-8 ${
                      isDark ? "bg-purple-900/30" : "bg-purple-100"
                    } rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.664-2.226M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  {t("departmentForm.fields.description")}
                </h2>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed text-lg`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {selectedDepartment.description}
                </p>
              </div>
            )}
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                {t("department.details.statistics")}
              </h2>

              <div className="space-y-4">
                {/* Active Schedules Count */}
                {selectedDepartment.activeSchedulesCount !== undefined && (
                  <div
                    className={`flex items-center justify-between p-4 ${
                      isDark ? "bg-blue-900/20" : "bg-blue-50"
                    } rounded-xl`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 ${
                          isDark ? "bg-blue-900/30" : "bg-blue-100"
                        } rounded-lg flex items-center justify-center ${
                          isRTL ? "mr-3" : "ml-3"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-medium`}
                      >
                        {t("department.statistics.activeSchedules") ||
                          "Active Schedules"}
                      </span>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {selectedDepartment.activeSchedulesCount}
                    </span>
                  </div>
                )}

                {/* Linked Categories Count */}
                {selectedDepartment.linkedCategoriesCount !== undefined && (
                  <div
                    className={`flex items-center justify-between p-4 ${
                      isDark ? "bg-purple-900/20" : "bg-purple-50"
                    } rounded-xl`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 ${
                          isDark ? "bg-purple-900/30" : "bg-purple-100"
                        } rounded-lg flex items-center justify-center ${
                          isRTL ? "mr-3" : "ml-3"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            isDark ? "text-purple-400" : "text-purple-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <span
                        className={`${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } font-medium`}
                      >
                        {t("department.statistics.linkedCategories") ||
                          "Linked Categories"}
                      </span>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {selectedDepartment.linkedCategoriesCount}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Card */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-6`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                {t("department.details.information")}
              </h2>

              <div className="space-y-4 text-sm">
                <div
                  className={`border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } pb-3`}
                >
                  <div
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("department.details.createdAt")}
                  </div>
                  <div
                    className={`${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {formatDate(selectedDepartment.createdAt)}
                  </div>
                </div>

                {selectedDepartment.createdByName && (
                  <div
                    className={`border-b ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    } pb-3`}
                  >
                    <div
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("department.details.createdBy")}
                    </div>
                    <div
                      className={`${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {selectedDepartment.createdByName}
                    </div>
                  </div>
                )}

                {selectedDepartment.updatedAt && (
                  <>
                    <div
                      className={`border-b ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      } pb-3`}
                    >
                      <div
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                      >
                        {t("department.details.updatedAt")}
                      </div>
                      <div
                        className={`${
                          isDark ? "text-white" : "text-gray-900"
                        } font-medium`}
                      >
                        {formatDate(selectedDepartment.updatedAt)}
                      </div>
                    </div>

                    {selectedDepartment.updatedByName && (
                      <div>
                        <div
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          } mb-1`}
                        >
                          {t("department.details.updatedBy")}
                        </div>
                        <div
                          className={`${
                            isDark ? "text-white" : "text-gray-900"
                          } font-medium`}
                        >
                          {selectedDepartment.updatedByName}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Manager Modal */}
      <RemoveManagerModal
        isOpen={showRemoveManagerModal}
        onClose={() => setShowRemoveManagerModal(false)}
        departmentInfo={{
          id: selectedDepartment?.id,
          name: getDepartmentName(),
          userId: selectedDepartment?.manager?.userId,
        }}
        managerName={getManagerName()}
      />
    </div>
  );
}

export default SpecificDepartment;
