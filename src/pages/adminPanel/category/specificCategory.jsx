import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategoryById } from "../../../state/act/actCategory";
import {
  clearSingleCategory,
  clearSingleCategoryError,
} from "../../../state/slices/category";
import { getDepartments } from "../../../state/act/actDepartment";
import LoadingGetData from "../../../components/LoadingGetData";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import {
  Building,
  Users,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const SpecificCategory = () => {
  const { catId: id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedCategory, loadingGetSingleCategory, singleCategoryError } =
    useSelector((state) => state.category);

  // Get departments from the department slice
  const { departments, loadingGetDepartments } = useSelector(
    (state) => state.department
  );

  // Get mode and translation function
  const { mymode } = useSelector((state) => state.mode);
  const { t } = useTranslation();

  // Get current language direction and theme
  const isRTL = mymode === "ar";
  const currentLang = i18next.language;
  const isDark = mymode === "dark";

  useEffect(() => {
    if (id) {
      // Clear previous data before fetching
      dispatch(clearSingleCategory());
      dispatch(getCategoryById({ categoryId: id }));
      // Fetch departments for this specific category
      dispatch(getDepartments({ categoryId: id }));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSingleCategory());
      dispatch(clearSingleCategoryError());
    };
  }, [dispatch, id]);

  // Handle error cases
  useEffect(() => {
    if (singleCategoryError) {
      if (singleCategoryError.status === 404) {
        console.error("Category not found");
      } else if (singleCategoryError.status === 403) {
        console.error("Access denied");
      }
    }
  }, [singleCategoryError, navigate]);

  // Get category name based on current language
  const getCategoryName = () => {
    if (!selectedCategory) return "";
    return currentLang === "en"
      ? selectedCategory.nameEnglish
      : selectedCategory.nameArabic;
  };

  // Get category secondary name (opposite language)
  const getCategorySecondaryName = () => {
    if (!selectedCategory) return "";
    return currentLang === "en"
      ? selectedCategory.nameArabic
      : selectedCategory.nameEnglish;
  };

  // Format date based on language
  const formatDate = (dateString) => {
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

  // Handle create department for this category
  const handleCreateDepartment = () => {
    if (selectedCategory) {
      // Save category information to localStorage
      localStorage.setItem("categoryId", selectedCategory.id);
      localStorage.setItem("categoryEnglishName", selectedCategory.nameEnglish);
      localStorage.setItem("categoryArabicName", selectedCategory.nameArabic);

      // Navigate to create department page
      navigate("/admin-panel/department/create-specific");
    }
  };

  // Department Card Component
  const DepartmentCard = ({ department }) => (
    <div
      className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3
            className={`font-bold text-lg mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {currentLang === "en"
              ? department.nameEnglish
              : department.nameArabic}
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {currentLang === "en"
              ? department.nameArabic
              : department.nameEnglish}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            department.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {department.isActive
            ? t("department.status.active")
            : t("department.status.inactive")}
        </span>
      </div>

      {department.location && (
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-gray-500" />
          <span
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {department.location}
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Building size={16} className="text-blue-500" />
          </div>
          <div
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {department.subDepartmentsCount || 0}
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("department.table.subDepartments")}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="text-green-500" />
          </div>
          <div
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {department.doctorsCount || 0}
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("department.table.doctors")}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar size={16} className="text-purple-500" />
          </div>
          <div
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {department.pendingRequestsCount || 0}
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("department.table.pendingRequests")}
          </div>
        </div>
      </div>

      <div
        className={`flex items-center justify-between pt-4 border-t ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          {formatDate(department.createdAt)}
        </div>
        <div className="flex gap-2">
          <Link to={`/admin-panel/department/${department.id}`}>
            <button
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title={t("department.actions.view")}
            >
              <Eye size={16} />
            </button>
          </Link>
          <Link to={`/admin-panel/department/edit/${department.id}`}>
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
  );

  // Loading Component
  if (loadingGetSingleCategory) {
    return <LoadingGetData text={t("gettingData.categoryData")} />;
  }

  // Error Component
  if (singleCategoryError) {
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
              {t("specificCategory.error.title")}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {singleCategoryError.message}
            </p>
            <button
              onClick={() => navigate("/admin-panel/categories")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("specificCategory.error.backToCategories")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found Component
  if (!selectedCategory) {
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.664-2.226M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("specificCategory.notFound.title")}
            </h3>
            <button
              onClick={() => navigate("/admin-panel/categories")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("specificCategory.notFound.backToCategories")}
            </button>
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
          <button
            onClick={() => navigate("/admin-panel/categories")}
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
            {t("specificCategory.navigation.backToCategories")}
          </button>

          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 mb-8`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {getCategoryName()}
                </h1>
              </div>

              <div
                className={`flex items-center space-x-4 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory.isActive
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
                  {selectedCategory.isActive
                    ? t("specificCategory.status.active")
                    : t("specificCategory.status.inactive")}
                </div>

                <div
                  className={`${
                    isDark
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-blue-100 text-blue-800"
                  } px-4 py-2 rounded-full text-sm font-medium font-mono`}
                >
                  {selectedCategory.code}
                </div>
              </div>
            </div>

            {/* Create Department Button */}
            <div
              className={`mt-6 flex ${isRTL ? "justify-start" : "justify-end"}`}
            >
              <button
                onClick={handleCreateDepartment}
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
                {t("create-specific-department")}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
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
                      d="M9 12h6m-6 4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.664-2.226M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                {t("specificCategory.sections.description.title")}
              </h2>
              <p
                className={`${
                  isDark ? "text-gray-300" : "text-gray-600"
                } leading-relaxed text-lg`}
              >
                {selectedCategory.description ||
                  t("specificCategory.sections.description.noDescription")}
              </p>
            </div>

            {/* Departments Section */}
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
                      isDark ? "bg-green-900/30" : "bg-green-100"
                    } rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <Building
                      className={`w-4 h-4 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                  </div>
                  {t("specificCategory.sections.departments.title")}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDark
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {departments?.length || 0}{" "}
                  {t("specificCategory.sections.departments.count")}
                </span>
              </div>

              {loadingGetDepartments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {t("department.loading")}
                  </p>
                </div>
              ) : departments && departments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((department) => (
                    <DepartmentCard
                      key={department.id}
                      department={department}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div
                    className={`w-16 h-16 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Building
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
                    {t("specificCategory.sections.departments.noDepartments")}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {t("specificCategory.sections.departments.createFirst")}
                  </p>
                </div>
              )}
            </div>

            {/* Chief Card - if exists */}
            {selectedCategory.chief && (
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  {t("specificCategory.sections.chief.title")}
                </h2>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } text-lg`}
                >
                  {selectedCategory.chief.name}
                </p>
              </div>
            )}
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Statistics Cards */}
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
                {t("specificCategory.sections.statistics.title")}
              </h2>

              <div className="space-y-4">
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <span
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } font-medium`}
                    >
                      {t(
                        "specificCategory.sections.statistics.departmentsCount"
                      )}
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-bold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {selectedCategory.departmentsCount}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-4 ${
                    isDark ? "bg-green-900/20" : "bg-green-50"
                  } rounded-xl`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 ${
                        isDark ? "bg-green-900/30" : "bg-green-100"
                      } rounded-lg flex items-center justify-center ${
                        isRTL ? "mr-3" : "ml-3"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          isDark ? "text-green-400" : "text-green-600"
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
                    </div>
                    <span
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } font-medium`}
                    >
                      {t("specificCategory.sections.statistics.usersCount")}
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-bold ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {selectedCategory.usersCount}
                  </span>
                </div>
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
                {t("specificCategory.sections.metadata.title")}
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
                    {t("specificCategory.sections.metadata.createdAt")}
                  </div>
                  <div
                    className={`${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {formatDate(selectedCategory.createdAt)}
                  </div>
                </div>

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
                    {t("specificCategory.sections.metadata.createdBy")}
                  </div>
                  <div
                    className={`${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                  >
                    {selectedCategory.createdByName}
                  </div>
                </div>

                {selectedCategory.updatedAt && (
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
                        {t("specificCategory.sections.metadata.updatedAt")}
                      </div>
                      <div
                        className={`${
                          isDark ? "text-white" : "text-gray-900"
                        } font-medium`}
                      >
                        {formatDate(selectedCategory.updatedAt)}
                      </div>
                    </div>

                    {selectedCategory.updatedByName && (
                      <div>
                        <div
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          } mb-1`}
                        >
                          {t("specificCategory.sections.metadata.updatedBy")}
                        </div>
                        <div
                          className={`${
                            isDark ? "text-white" : "text-gray-900"
                          } font-medium`}
                        >
                          {selectedCategory.updatedByName}
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
    </div>
  );
};

export default SpecificCategory;
