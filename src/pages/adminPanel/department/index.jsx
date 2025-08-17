import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../../styles/general.css";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Plus,
  Menu,
  X,
  MapPin,
  Building,
  Users,
  UserCheck,
  Calendar,
} from "lucide-react";
import { getDepartments } from "../../../state/act/actDepartment";
import { getCategories } from "../../../state/act/actCategory";
import {
  clearError,
  setCurrentPage,
  setFilters,
  setPageSize,
  setCategoryFilter,
  clearFilters,
} from "../../../state/slices/department";
import { Link } from "react-router-dom";
import DeleteDepartmentModal from "../../../components/DeleteDepartmentModal";

function Department() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });
  const { departments, pagination, filters, loadingGetDepartments, error } =
    useSelector((state) => state.department);
  const { categories } = useSelector((state) => state.category);
  const { mymode } = useSelector((state) => state.mode);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Check if we're in dark mode
  const isDark = mymode === "dark";

  // Check if current language is RTL
  const language = i18n.language;
  const isRTL = language === "ar";

  // Fetch departments when filters change
  useEffect(() => {
    dispatch(getDepartments(filters));
  }, [dispatch, filters]);

  // Fetch categories for filter dropdown
  useEffect(() => {
    dispatch(getCategories({ pageSize: 100, isActive: true }));
  }, [dispatch]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchInput(value);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        dispatch(setFilters({ search: value, page: 1 }));
      }, 500);

      setSearchTimeout(timeout);
    },
    [dispatch, searchTimeout]
  );

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(parseInt(newPageSize)));
  };
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchInput("");
    handleFilterChange("isActive", true);
  };
  // Format date
  const formatDate = (dateString) => {
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination?.totalPages || 1;
    const currentPage = pagination?.page || 1;

    // Show up to 3 page numbers on mobile, 5 on desktop
    const maxPages = window.innerWidth < 768 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Mobile card component for each department
  const DepartmentCard = ({ department }) => (
    <div
      className={`p-4 rounded-lg border mb-3 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3
            className={`font-semibold text-lg ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {department.nameArabic}
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {department.nameEnglish}
          </p>
          {department.categoryNameArabic && (
            <p
              className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                isDark
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {department.categoryNameArabic}
            </p>
          )}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            department.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {department.isActive
            ? t("department.status.active")
            : t("department.status.inactive")}
        </span>
      </div>

      {department.location && (
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={14} className="text-gray-500" />
          <span
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {department.location}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center gap-2">
          <Building size={14} className="text-gray-500" />
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("department.table.subDepartments")}:
          </span>
          <span className={`${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {department.subDepartmentsCount || 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-500" />
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("department.table.doctors")}:
          </span>
          <span className={`${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {department.doctorsCount || 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck size={14} className="text-gray-500" />
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("department.table.pendingRequests")}:
          </span>
          <span className={`${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {department.pendingRequestsCount || 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-500" />
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("department.table.createdAt")}:
          </span>
          <span
            className={`text-xs ${isDark ? "text-gray-200" : "text-gray-800"}`}
          >
            {formatDate(department.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to={`/admin-panel/department/${department.id}`}>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer cursor-pointer"
            title={t("department.actions.view")}
          >
            <Eye size={16} />
          </button>
        </Link>
        <Link to={`/admin-panel/department/edit/${department.id}`}>
          <button
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors cursor-pointer cursor-pointer"
            title={t("department.actions.edit")}
          >
            <Edit size={16} />
          </button>
        </Link>
        <button
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
          title={t("department.actions.delete")}
          onClick={() => {
            setToDelete({
              id: department.id,
              name:
                language === "en"
                  ? department.nameEnglish
                  : department.nameArabic,
            });
            setModalOpen(true);
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DeleteDepartmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        departmentId={toDelete.id}
        info={toDelete}
        departmentName={toDelete.name}
      />
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("department.title")}
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/admin-panel/department/create">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer flex-1 sm:flex-none justify-center">
                    <Plus size={20} />
                    <span className="hidden sm:inline">
                      {t("department.addNew")}
                    </span>
                    <span className="sm:hidden">{t("department.add")}</span>
                  </button>
                </Link>
                {/* Mobile table toggle */}
                <button
                  onClick={() => setShowMobileTable(!showMobileTable)}
                  className={`md:hidden px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    showMobileTable
                      ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300"
                      : `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`
                  }`}
                >
                  {showMobileTable ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex justify-between items-center">
                  <span>{error.message}</span>
                  <button
                    onClick={() => dispatch(clearError())}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div
            className={`rounded-lg shadow-sm border mb-6 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search
                    className={`absolute ${
                      isRTL ? "right-3" : "left-3"
                    } top-1/2 transform -translate-y-1/2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder={t("department.search.placeholder")}
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className={`w-full ${
                      isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                    } py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-2 justify-center sm:justify-start ${
                    showFilters
                      ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300"
                      : `hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isDark
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-200 hover:border-gray-400"
                        }`
                  }`}
                >
                  <Filter size={20} />
                  {t("department.filters.title")}
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t ${
                    isDark ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("department.filters.category")}
                    </label>
                    <select
                      value={filters.categoryId || 1}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? "" : parseInt(e.target.value);
                        handleFilterChange("categoryId", value);
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="">
                        {t("department.filters.allCategories")}
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {language === "ar"
                            ? category.nameArabic
                            : category.nameEnglish}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("department.filters.status")}
                    </label>
                    <select
                      value={
                        filters.isActive === null
                          ? "all"
                          : filters.isActive.toString()
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value === "all"
                            ? null
                            : e.target.value === "true";
                        handleFilterChange("isActive", value);
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="true">
                        {t("department.status.active")}
                      </option>
                      <option value="false">
                        {t("department.status.inactive")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("department.filters.orderBy")}
                    </label>
                    <select
                      value={filters.orderBy}
                      onChange={(e) =>
                        handleFilterChange("orderBy", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="nameArabic">
                        {t("department.filters.sortBy.nameArabic")}
                      </option>
                      <option value="nameEnglish">
                        {t("department.filters.sortBy.nameEnglish")}
                      </option>
                      <option value="createdAt">
                        {t("department.filters.sortBy.createdAt")}
                      </option>
                      <option value="location">
                        {t("department.filters.sortBy.location")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("department.filters.orderDirection")}
                    </label>
                    <select
                      value={filters.orderDesc.toString()}
                      onChange={(e) =>
                        handleFilterChange(
                          "orderDesc",
                          e.target.value === "true"
                        )
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="true">
                        {t("department.filters.descending")}
                      </option>
                      <option value="false">
                        {t("department.filters.ascending")}
                      </option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <button
                      onClick={handleClearFilters}
                      className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer cursor-pointer ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t("contractingTypes.filters.clear")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className={`md:hidden ${showMobileTable ? "hidden" : "block"}`}>
            {loadingGetDepartments ? (
              <div className="text-center p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span
                    className={`${isRTL ? "mr-3" : "ml-3"} ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("department.loading")}
                  </span>
                </div>
              </div>
            ) : departments.length === 0 ? (
              <div
                className={`text-center p-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("department.noData")}
              </div>
            ) : (
              departments.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div
            className={`hidden md:block ${showMobileTable ? "md:hidden" : ""} ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-lg shadow-sm border`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark
                        ? "border-gray-700 bg-gray-750"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.nameArabic")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.nameEnglish")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.category")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.location")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.status")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.subDepartments")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.doctors")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.pendingRequests")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.createdAt")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingGetDepartments ? (
                    <tr>
                      <td colSpan="10" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-3" : "ml-3"} ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("department.loading")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : departments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className={`text-center p-8 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("department.noData")}
                      </td>
                    </tr>
                  ) : (
                    departments.map((department) => (
                      <tr
                        key={department.id}
                        className={`border-b transition-colors cursor-pointer ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {department.nameArabic}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {department.nameEnglish}
                        </td>
                        <td className="p-4">
                          {department.categoryNameArabic && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isDark
                                  ? "bg-blue-900 text-blue-300"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {language === "ar"
                                ? department.categoryNameArabic
                                : department.categoryNameEnglish}
                            </span>
                          )}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <div
                            className="max-w-xs truncate flex items-center gap-1"
                            title={department.location}
                          >
                            <MapPin
                              size={14}
                              className="text-gray-500 flex-shrink-0"
                            />
                            {department.location || "-"}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              department.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {department.isActive
                              ? t("department.status.active")
                              : t("department.status.inactive")}
                          </span>
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Building size={14} className="text-gray-500" />
                            {department.subDepartmentsCount || 0}
                          </div>
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-500" />
                            {department.doctorsCount || 0}
                          </div>
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <UserCheck size={14} className="text-gray-500" />
                            {department.pendingRequestsCount || 0}
                          </div>
                        </td>
                        <td
                          className={`p-4 text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {formatDate(department.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/admin-panel/department/${department.id}`}
                            >
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                                title={t("departments.actions.view")}
                              >
                                <Eye size={16} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/department/edit/${department.id}`}
                            >
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors cursor-pointer"
                                title={t("department.actions.edit")}
                              >
                                <Edit size={16} />
                              </button>
                            </Link>
                            <button
                              onClick={() => {
                                setToDelete({
                                  id: department.id,
                                  name:
                                    language === "en"
                                      ? department.nameEnglish
                                      : department.nameArabic,
                                });
                                setModalOpen(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                              title={t("department.actions.delete")}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Table View (when toggled) */}
          <div
            className={`md:hidden ${showMobileTable ? "block" : "hidden"} ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-lg shadow-sm border overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark
                        ? "border-gray-700 bg-gray-750"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.name")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.status")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("department.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingGetDepartments ? (
                    <tr>
                      <td colSpan="3" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-2" : "ml-2"} text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("department.loading")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : departments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className={`text-center p-8 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("department.noData")}
                      </td>
                    </tr>
                  ) : (
                    departments.map((department) => (
                      <tr
                        key={department.id}
                        className={`border-b transition-colors cursor-pointer ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-2">
                          <div>
                            <div
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {department.nameArabic}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {department.categoryNameArabic || "بدون فئة"}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              department.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {department.isActive
                              ? t("department.status.active")
                              : t("department.status.inactive")}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Link
                              to={`/admin-panel/department/${department.id}`}
                            >
                              <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors cursor-pointer">
                                <Eye size={14} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/department/edit/${department.id}`}
                            >
                              <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors cursor-pointer">
                                <Edit size={14} />
                              </button>
                            </Link>
                            <button
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors cursor-pointer"
                              onClick={() => {
                                setToDelete({
                                  id: department.id,
                                  name:
                                    language === "en"
                                      ? department.nameEnglish
                                      : department.nameArabic,
                                });
                                setModalOpen(true);
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              className={`border-t p-4 mt-6 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } rounded-lg`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
                  <span
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {t("departmentHeads.pagination.displayRange", {
                      start: (pagination.page - 1) * pagination.pageSize + 1,
                      end: Math.min(
                        pagination.page * pagination.pageSize,
                        pagination.totalCount
                      ),
                      total: pagination.totalCount,
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <select
                      value={pagination.pageSize}
                      onChange={(e) => handlePageSizeChange(e.target.value)}
                      className={`p-1 border rounded text-sm ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                    <span
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("department.pagination.itemsPerPage")}{" "}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>

                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-2 sm:px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${
                        pageNum === pagination.page
                          ? "bg-blue-600 text-white"
                          : isDark
                          ? "border border-gray-600 hover:bg-gray-700 text-gray-300"
                          : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Department;
