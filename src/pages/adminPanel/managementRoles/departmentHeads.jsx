import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
  Crown,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  Users,
  Download,
  RotateCcw,
} from "lucide-react";

// Redux actions
import {
  getDepartmentHeads,
  removeDepartmentHead,
} from "../../../state/act/actManagementRole";
import { clearRoleErrors } from "../../../state/slices/managementRole";

// Components
// import RemoveDepartmentHeadModal from "../../../components/RemoveDepartmentHeadModal";

// Hooks
import i18next from "i18next";

const DepartmentHeads = () => {
  const { t } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const language = i18next.language;
  const isRTL = language === "ar";
  const dispatch = useDispatch();

  // Redux state
  const {
    departmentHeads,
    loadingDepartmentHeads,
    departmentHeadsError,
    loadingRemoveDepartmentHead,
    removeDepartmentHeadError,
  } = useSelector((state) => state.role);

  // Local state
  const [modalOpen, setModalOpen] = useState(false);
  const [toRemove, setToRemove] = useState({
    id: null,
    name: "",
    categoryId: null,
    userId: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    SearchTerm: "",
    CategoryId: "",
    IsActive: "",
    Page: 1,
    pageSize: 10,
  });

  // Filtered data
  const [filteredDepartmentHeads, setFilteredDepartmentHeads] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    startIndex: 1,
    endIndex: 0,
  });

  // Fetch data on component mount and when filters change
  useEffect(() => {
    const params = {};
    if (filters.SearchTerm) params.SearchTerm = filters.SearchTerm;
    if (filters.CategoryId) params.CategoryId = parseInt(filters.CategoryId);
    if (filters.IsActive !== "") params.IsActive = filters.IsActive === "true";
    params.Page = filters.Page;
    params.pageSize = filters.pageSize;

    dispatch(getDepartmentHeads(params));
  }, [dispatch, filters]);

  // Update filtered data when Redux data changes
  useEffect(() => {
    if (departmentHeads?.items) {
      setFilteredDepartmentHeads(departmentHeads.items);
      setPagination({
        page: departmentHeads.page || 1,
        pageSize: departmentHeads.pageSize || 10,
        totalCount: departmentHeads.totalCount || 0,
        totalPages: departmentHeads.totalPages || 1,
        hasNextPage: departmentHeads.hasNext || false,
        hasPreviousPage: departmentHeads.hasPrevious || false,
        startIndex: departmentHeads.startIndex || 1,
        endIndex: departmentHeads.endIndex || 0,
      });
    } else if (departmentHeads) {
      // Handle case where departmentHeads is direct array
      setFilteredDepartmentHeads(departmentHeads);
      setPagination({
        page: 1,
        pageSize: filters.pageSize,
        totalCount: departmentHeads.length,
        totalPages: Math.ceil(departmentHeads.length / filters.pageSize),
        hasNextPage: false,
        hasPreviousPage: false,
        startIndex: 1,
        endIndex: departmentHeads.length,
      });
    }
  }, [departmentHeads, filters.pageSize]);

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value) => {
      setSearchInput(value);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        setFilters((prev) => ({ ...prev, SearchTerm: value, Page: 1 }));
      }, 500);

      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, Page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, Page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setFilters((prev) => ({
      ...prev,
      pageSize: parseInt(newPageSize),
      Page: 1,
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      SearchTerm: "",
      CategoryId: "",
      IsActive: "",
      Page: 1,
      pageSize: 10,
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const locale = language === "ar" ? "ar-SA" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get permissions display
  const getPermissions = (departmentHead) => {
    const permissions = [];
    if (departmentHead.canCreateRosters)
      permissions.push(t("departmentHeads.permissions.createRosters"));
    if (departmentHead.canApproveSchedules)
      permissions.push(t("departmentHeads.permissions.approveSchedules"));
    if (departmentHead.canManageUsers)
      permissions.push(t("departmentHeads.permissions.manageUsers"));
    if (departmentHead.canViewReports)
      permissions.push(t("departmentHeads.permissions.viewReports"));
    if (departmentHead.canExportData)
      permissions.push(t("departmentHeads.permissions.exportData"));
    return permissions;
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("departmentHeads.status.active")}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="w-3 h-3 mr-1" />
          {t("departmentHeads.status.inactive")}
        </span>
      );
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const maxPages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* <RemoveDepartmentHeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        departmentHeadId={toRemove.id}
        departmentHeadName={toRemove.name}
        userId={toRemove.userId}
        categoryId={toRemove.categoryId}
        onRemove={() => {
          // Refresh data after removal
          const params = {};
          if (filters.SearchTerm) params.SearchTerm = filters.SearchTerm;
          if (filters.CategoryId)
            params.CategoryId = parseInt(filters.CategoryId);
          if (filters.IsActive !== "")
            params.IsActive = filters.IsActive === "true";
          params.Page = filters.Page;
          params.pageSize = filters.pageSize;
          dispatch(getDepartmentHeads(params));
          setModalOpen(false);
        }}
      /> */}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center">
              <Link
                to="/admin-panel/management-roles"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors ${isRTL ? "ml-4" : "mr-4"}`}
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("departmentHeads.backToRoles")}
                </span>
              </Link>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("departmentHeads.title")}
              </h1>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link to="/admin-panel/management-roles/department-heads/assign">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center">
                  <Plus size={20} />
                  <span className="hidden sm:inline">
                    {t("departmentHeads.assignNew")}
                  </span>
                  <span className="sm:hidden">
                    {t("departmentHeads.assign")}
                  </span>
                </button>
              </Link>
              {/* Mobile table toggle */}
              <button
                onClick={() => setShowMobileTable(!showMobileTable)}
                className={`md:hidden px-3 py-2 rounded-lg border transition-colors ${
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

          {/* Error Display */}
          {(departmentHeadsError || removeDepartmentHeadError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div className="flex justify-between items-center">
                <span>
                  {language === "ar"
                    ? departmentHeadsError?.messageAr ||
                      removeDepartmentHeadError?.messageAr ||
                      "حدث خطأ"
                    : departmentHeadsError?.messageEn ||
                      removeDepartmentHeadError?.messageEn ||
                      "An error occurred"}
                </span>
                <button
                  onClick={() => dispatch(clearRoleErrors())}
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
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex-1 relative">
                <Search
                  className={`absolute ${
                    isRTL ? "right-3" : "left-3"
                  } top-1/2 transform -translate-y-1/2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } h-4 w-4`}
                />
                <input
                  type="text"
                  placeholder={t("departmentHeads.search.placeholder")}
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`w-full ${
                    isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                    showFilters
                      ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300"
                      : `${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`
                  }`}
                >
                  <Filter size={16} />
                  <span className="hidden sm:inline">
                    {t("departmentHeads.filters.title")}
                  </span>
                </button>

                {Object.values(filters).some(
                  (val) => val !== "" && val !== 1 && val !== 10
                ) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    <span className="hidden sm:inline">
                      {t("departmentHeads.filters.clear")}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category ID Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("departmentHeads.filters.categoryId")}
                    </label>
                    <input
                      type="number"
                      value={filters.CategoryId}
                      onChange={(e) =>
                        handleFilterChange("CategoryId", e.target.value)
                      }
                      placeholder={t(
                        "departmentHeads.filters.categoryIdPlaceholder"
                      )}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("departmentHeads.filters.status")}
                    </label>
                    <select
                      value={filters.IsActive}
                      onChange={(e) =>
                        handleFilterChange("IsActive", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">
                        {t("departmentHeads.filters.allStatuses")}
                      </option>
                      <option value="true">
                        {t("departmentHeads.status.active")}
                      </option>
                      <option value="false">
                        {t("departmentHeads.status.inactive")}
                      </option>
                    </select>
                  </div>

                  {/* Items per page */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("departmentHeads.filters.itemsPerPage")}
                    </label>
                    <select
                      value={filters.pageSize}
                      onChange={(e) => handlePageSizeChange(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value={5}>
                        5 {t("departmentHeads.filters.perPage")}
                      </option>
                      <option value={10}>
                        10 {t("departmentHeads.filters.perPage")}
                      </option>
                      <option value={25}>
                        25 {t("departmentHeads.filters.perPage")}
                      </option>
                      <option value={50}>
                        50 {t("departmentHeads.filters.perPage")}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-lg shadow-sm p-6`}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                <h3
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {filteredDepartmentHeads?.length || 0}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("departmentHeads.statistics.totalDepartmentHeads")}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-lg shadow-sm p-6`}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                <h3
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {filteredDepartmentHeads?.filter((head) => head.isActive)
                    ?.length || 0}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("departmentHeads.statistics.activeDepartmentHeads")}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-lg shadow-sm p-6`}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                <h3
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {new Set(
                    filteredDepartmentHeads?.map((head) => head.categoryId)
                  )?.size || 0}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("departmentHeads.statistics.categoriesWithHeads")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div
          className={`hidden md:block ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-lg shadow-sm border overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
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
                    {t("departmentHeads.table.user")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("departmentHeads.table.category")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("departmentHeads.table.permissions")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("departmentHeads.table.assignedDate")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("departmentHeads.table.status")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("departmentHeads.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingDepartmentHeads ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span
                          className={`${isRTL ? "mr-3" : "ml-3"} ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {t("departmentHeads.loading")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredDepartmentHeads.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8">
                      <div
                        className={`text-center ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Crown className="mx-auto h-12 w-12 mb-2 opacity-50" />
                        <p className="text-lg font-medium mb-1">
                          {t("departmentHeads.noData")}
                        </p>
                        <p className="text-sm">
                          {t("departmentHeads.noDataDescription")}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDepartmentHeads.map((departmentHead) => (
                    <tr
                      key={departmentHead.id}
                      className={`border-b ${
                        isDark
                          ? "border-gray-700 hover:bg-gray-750"
                          : "border-gray-200 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="p-4">
                        <div>
                          <div
                            className={`font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {language === "ar"
                              ? departmentHead.userNameArabic
                              : departmentHead.userNameEnglish}
                          </div>
                          <div
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {departmentHead.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {departmentHead.categoryName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {getPermissions(departmentHead)
                            .slice(0, 2)
                            .map((permission, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {permission}
                              </span>
                            ))}
                          {getPermissions(departmentHead).length > 2 && (
                            <span
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              +{getPermissions(departmentHead).length - 2}{" "}
                              {t("departmentHeads.more")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {formatDate(departmentHead.assignedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(departmentHead.isActive)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Link
                            to={`/admin-panel/management-roles/department-heads/${departmentHead.id}`}
                          >
                            <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                              <Eye size={16} />
                            </button>
                          </Link>
                          <Link
                            to={`/admin-panel/management-roles/department-heads/edit/${departmentHead.id}`}
                          >
                            <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors">
                              <Edit size={16} />
                            </button>
                          </Link>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                            onClick={() => {
                              setToRemove({
                                id: departmentHead.id,
                                name:
                                  language === "ar"
                                    ? departmentHead.userNameArabic
                                    : departmentHead.userNameEnglish,
                                userId: departmentHead.userId,
                                categoryId: departmentHead.categoryId,
                              });
                              setModalOpen(true);
                            }}
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

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4">
          {loadingDepartmentHeads ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <span
                className={`${isRTL ? "mr-3" : "ml-3"} ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("departmentHeads.loading")}
              </span>
            </div>
          ) : filteredDepartmentHeads.length === 0 ? (
            <div
              className={`text-center p-8 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Crown className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p className="text-lg font-medium mb-1">
                {t("departmentHeads.noData")}
              </p>
              <p className="text-sm">
                {t("departmentHeads.noDataDescription")}
              </p>
            </div>
          ) : (
            filteredDepartmentHeads.map((departmentHead) => (
              <div
                key={departmentHead.id}
                className={`${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border rounded-lg shadow-sm p-4`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {language === "ar"
                        ? departmentHead.userNameArabic
                        : departmentHead.userNameEnglish}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {departmentHead.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(departmentHead.isActive)}
                    <div className="flex gap-1">
                      <Link
                        to={`/admin-panel/management-roles/department-heads/${departmentHead.id}`}
                      >
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                      </Link>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                        onClick={() => {
                          setToRemove({
                            id: departmentHead.id,
                            name:
                              language === "ar"
                                ? departmentHead.userNameArabic
                                : departmentHead.userNameEnglish,
                            userId: departmentHead.userId,
                            categoryId: departmentHead.categoryId,
                          });
                          setModalOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("departmentHeads.table.category")}:
                    </span>
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {departmentHead.categoryName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("departmentHeads.table.assignedDate")}:
                    </span>
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {formatDate(departmentHead.assignedAt)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("departmentHeads.table.permissions")}:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getPermissions(departmentHead).map(
                        (permission, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {permission}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
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
                  className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t("departmentHeads.pagination.showing")}{" "}
                  {pagination.startIndex} - {pagination.endIndex}{" "}
                  {t("departmentHeads.pagination.of")} {pagination.totalCount}{" "}
                  {t("departmentHeads.pagination.departmentHeads")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className={`p-2 rounded-lg border transition-colors ${
                    pagination.hasPreviousPage
                      ? `${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`
                      : `${
                          isDark ? "text-gray-600" : "text-gray-400"
                        } border-gray-200 dark:border-gray-700 cursor-not-allowed`
                  }`}
                >
                  {isRTL ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronLeft size={16} />
                  )}
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                      page === pagination.page
                        ? "bg-blue-600 text-white border-blue-600"
                        : `${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`p-2 rounded-lg border transition-colors ${
                    pagination.hasNextPage
                      ? `${
                          isDark ? "text-gray-300" : "text-gray-700"
                        } border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`
                      : `${
                          isDark ? "text-gray-600" : "text-gray-400"
                        } border-gray-200 dark:border-gray-700 cursor-not-allowed`
                  }`}
                >
                  {isRTL ? (
                    <ChevronLeft size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentHeads;
