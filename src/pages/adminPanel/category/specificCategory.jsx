import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategoryById } from "../../../state/act/actCategory";
import {
  clearSingleCategory,
  clearSingleCategoryError,
} from "../../../state/slices/category";
import LoadingGetData from "../../../components/LoadingGetData";
import { useTranslation } from "react-i18next";

const SpecificCategory = () => {
  const { catId: id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedCategory, loadingGetSingleCategory, singleCategoryError } =
    useSelector((state) => state.category);

  // Get mode and translation function
  const { mymode } = useSelector((state) => state.mode);
  const { t } = useTranslation();

  // Get current language direction
  const isRTL = mymode === "ar";
  const currentLang = mymode || "ar";

  useEffect(() => {
    if (id) {
      // Clear previous data before fetching
      dispatch(clearSingleCategory());
      dispatch(getCategoryById({ categoryId: id }));
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

  // Loading Component
  if (loadingGetSingleCategory) {
    return <LoadingGetData />;
  }

  // Error Component
  if (singleCategoryError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("specificCategory.error.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
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
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin-panel/categories")}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 mb-4 group"
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

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {getCategoryName()}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {getCategorySecondaryName()}
                </p>
              </div>

              <div
                className={`flex items-center space-x-4 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {selectedCategory.isActive
                    ? t("specificCategory.status.active")
                    : t("specificCategory.status.inactive")}
                </div>

                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium font-mono">
                  {selectedCategory.code}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div
                  className={`w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ${
                    isRTL ? "mr-3" : "ml-3"
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {selectedCategory.description ||
                  t("specificCategory.sections.description.noDescription")}
              </p>
            </div>

            {/* Chief Card - if exists */}
            {selectedCategory.chief && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div
                    className={`w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <svg
                      className="w-4 h-4 text-purple-600 dark:text-purple-400"
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
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {selectedCategory.chief.name}
                </p>
              </div>
            )}
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t("specificCategory.sections.statistics.title")}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ${
                        isRTL ? "mr-3" : "ml-3"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {t(
                        "specificCategory.sections.statistics.departmentsCount"
                      )}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedCategory.departmentsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center ${
                        isRTL ? "mr-3" : "ml-3"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400"
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
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {t("specificCategory.sections.statistics.usersCount")}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedCategory.usersCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t("specificCategory.sections.metadata.title")}
              </h2>

              <div className="space-y-4 text-sm">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div className="text-gray-500 dark:text-gray-400 mb-1">
                    {t("specificCategory.sections.metadata.createdAt")}
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {formatDate(selectedCategory.createdAt)}
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div className="text-gray-500 dark:text-gray-400 mb-1">
                    {t("specificCategory.sections.metadata.createdBy")}
                  </div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {selectedCategory.createdByName}
                  </div>
                </div>

                {selectedCategory.updatedAt && (
                  <>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">
                        {t("specificCategory.sections.metadata.updatedAt")}
                      </div>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {formatDate(selectedCategory.updatedAt)}
                      </div>
                    </div>

                    {selectedCategory.updatedByName && (
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 mb-1">
                          {t("specificCategory.sections.metadata.updatedBy")}
                        </div>
                        <div className="text-gray-900 dark:text-white font-medium">
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
