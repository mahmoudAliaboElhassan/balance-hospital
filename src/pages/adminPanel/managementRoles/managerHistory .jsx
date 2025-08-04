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
  Menu,
  X,
  History,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";

// Redux actions
import { getManagerHistory } from "../../../state/act/actManagementRole";
import { clearRoleErrors } from "../../../state/slices/managementRole";

// Hooks
import i18next from "i18next";

const ManagerHistory = () => {
  const { t } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const language = i18next.language;
  const isRTL = language === "ar";
  const dispatch = useDispatch();

  // Redux state
  const { managerHistory, loadingManagerHistory, managerHistoryError } =
    useSelector((state) => state.role);

  // Local state
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    userId: "",
    fromDate: "",
    toDate: "",
    managerType: "",
    isActive: "",
    page: 1,
    limit: 10,
  });

  // Filtered and paginated data
  const [filteredHistory, setFilteredHistory] = useState([]);
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

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getManagerHistory({ limit: 50 }));
  }, [dispatch]);

  // Filter and paginate history when data or filters change
  useEffect(() => {
    if (managerHistory) {
      let filtered = [...managerHistory];

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (record) =>
            record.userNameArabic?.toLowerCase().includes(searchTerm) ||
            record.userNameEnglish?.toLowerCase().includes(searchTerm) ||
            record.userId?.toString().includes(searchTerm) ||
            record.categoryName?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply userId filter
      if (filters.userId) {
        filtered = filtered.filter(
          (record) => record.userId?.toString() === filters.userId
        );
      }

      // Apply categoryId filter
      if (filters.categoryId) {
        filtered = filtered.filter(
          (record) => record.categoryId?.toString() === filters.categoryId
        );
      }

      // Apply managerType filter
      if (filters.managerType) {
        filtered = filtered.filter(
          (record) => record.managerType === filters.managerType
        );
      }

      // Apply isActive filter
      if (filters.isActive !== "") {
        const isActiveFilter = filters.isActive === "true";
        filtered = filtered.filter(
          (record) => record.isActive === isActiveFilter
        );
      }

      // Apply date filters
      if (filters.fromDate) {
        filtered = filtered.filter(
          (record) => new Date(record.assignedAt) >= new Date(filters.fromDate)
        );
      }

      if (filters.toDate) {
        filtered = filtered.filter(
          (record) =>
            new Date(record.assignedAt) <=
            new Date(filters.toDate + "T23:59:59")
        );
      }

      // Calculate pagination
      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / filters.limit);
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      const paginatedData = filtered.slice(startIndex, endIndex);

      setFilteredHistory(paginatedData);
      setPagination({
        page: filters.page,
        pageSize: filters.limit,
        totalCount,
        totalPages,
        hasNextPage: filters.page < totalPages,
        hasPreviousPage: filters.page > 1,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, totalCount),
      });
    }
  }, [managerHistory, filters]);

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value) => {
      setSearchInput(value);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }));
      }, 500);

      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newLimit) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1,
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      categoryId: "",
      userId: "",
      fromDate: "",
      toDate: "",
      managerType: "",
      isActive: "",
      page: 1,
      limit: 10,
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return "-";
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("managerHistory.duration.today");
    if (diffDays < 30) {
      return `${diffDays} ${t("managerHistory.duration.days")}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${t("managerHistory.duration.months")}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      if (remainingMonths === 0) {
        return `${years} ${t("managerHistory.duration.years")}`;
      }
      return `${years} ${t(
        "managerHistory.duration.years"
      )} ${remainingMonths} ${t("managerHistory.duration.months")}`;
    }
  };

  // Get manager type display
  const getManagerTypeDisplay = (type) => {
    switch (type) {
      case "MANAGER":
        return t("managerHistory.types.manager");
      case "CHIEF":
        return t("managerHistory.types.departmentHead");
      default:
        return type;
    }
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("managerHistory.status.active")}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="w-3 h-3 mr-1" />
          {t("managerHistory.status.ended")}
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
                  {t("managerHistory.backToRoles")}
                </span>
              </Link>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("managerHistory.title")}
              </h1>
            </div>
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

          {/* Error Display */}
          {managerHistoryError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div className="flex justify-between items-center">
                <span>
                  {language === "ar"
                    ? managerHistoryError?.messageAr || "حدث خطأ"
                    : managerHistoryError?.messageEn || "An error occurred"}
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
                  placeholder={t("managerHistory.search.placeholder")}
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
                    {t("managerHistory.filters.title")}
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
                      {t("managerHistory.filters.clear")}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* User ID Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managerHistory.filters.userId")}
                    </label>
                    <input
                      type="number"
                      value={filters.userId}
                      onChange={(e) =>
                        handleFilterChange("userId", e.target.value)
                      }
                      placeholder={t(
                        "managerHistory.filters.userIdPlaceholder"
                      )}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>

                  {/* Category ID Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managerHistory.filters.categoryId")}
                    </label>
                    <input
                      type="number"
                      value={filters.categoryId}
                      onChange={(e) =>
                        handleFilterChange("categoryId", e.target.value)
                      }
                      placeholder={t(
                        "managerHistory.filters.categoryIdPlaceholder"
                      )}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>

                  {/* Manager Type Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managerHistory.filters.managerType")}
                    </label>
                    <select
                      value={filters.managerType}
                      onChange={(e) =>
                        handleFilterChange("managerType", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">
                        {t("managerHistory.filters.allTypes")}
                      </option>
                      <option value="MANAGER">
                        {t("managerHistory.types.manager")}
                      </option>
                      <option value="CHIEF">
                        {t("managerHistory.types.departmentHead")}
                      </option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managerHistory.filters.status")}
                    </label>
                    <select
                      value={filters.isActive}
                      onChange={(e) =>
                        handleFilterChange("isActive", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">
                        {t("managerHistory.filters.allStatuses")}
                      </option>
                      <option value="true">
                        {t("managerHistory.status.active")}
                      </option>
                      <option value="false">
                        {t("managerHistory.status.ended")}
                      </option>
                    </select>
                  </div>

                  {/* From Date */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managerHistory.filters.fromDate")}
                    </label>
                    <input
                      type="date"
                      value={filters.fromDate}
                      onChange={(e) =>
                        handleFilterChange("fromDate", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* To Date */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managerHistory.filters.toDate")}
                    </label>
                    <input
                      type="date"
                      value={filters.toDate}
                      onChange={(e) =>
                        handleFilterChange("toDate", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Items per page */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managerHistory.filters.itemsPerPage")}
                    </label>
                    <select
                      value={filters.limit}
                      onChange={(e) => handlePageSizeChange(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value={10}>
                        10 {t("managerHistory.filters.perPage")}
                      </option>
                      <option value={25}>
                        25 {t("managerHistory.filters.perPage")}
                      </option>
                      <option value={50}>
                        50 {t("managerHistory.filters.perPage")}
                      </option>
                      <option value={100}>
                        100 {t("managerHistory.filters.perPage")}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
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
                    {t("managerHistory.table.user")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managerHistory.table.role")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managerHistory.table.category")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managerHistory.table.assignedDate")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managerHistory.table.duration")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managerHistory.table.status")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managerHistory.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingManagerHistory ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span
                          className={`${isRTL ? "mr-3" : "ml-3"} ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {t("managerHistory.loading")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8">
                      <div
                        className={`text-center ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <History className="mx-auto h-12 w-12 mb-2 opacity-50" />
                        <p className="text-lg font-medium mb-1">
                          {t("managerHistory.noData")}
                        </p>
                        <p className="text-sm">
                          {t("managerHistory.noDataDescription")}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((record) => (
                    <tr
                      key={record.id}
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
                              ? record.userNameArabic
                              : record.userNameEnglish}
                          </div>
                          <div
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            ID: {record.userId}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            record.managerType === "MANAGER"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}
                        >
                          {record.managerType === "MANAGER" ? (
                            <User className="w-3 h-3 mr-1" />
                          ) : (
                            <Building2 className="w-3 h-3 mr-1" />
                          )}
                          {getManagerTypeDisplay(record.managerType)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {record.categoryName || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {formatDate(record.assignedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {calculateDuration(
                              record.assignedAt,
                              record.revokedAt
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(record.isActive)}</td>
                      <td className="p-4">
                        <Link
                          to={`/admin-panel/management-roles/managers/history/user/${record.userId}`}
                        >
                          <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                        </Link>
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
          {loadingManagerHistory ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <span
                className={`${isRTL ? "mr-3" : "ml-3"} ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("managerHistory.loading")}
              </span>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div
              className={`text-center p-8 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <History className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p className="text-lg font-medium mb-1">
                {t("managerHistory.noData")}
              </p>
              <p className="text-sm">{t("managerHistory.noDataDescription")}</p>
            </div>
          ) : (
            filteredHistory.map((record) => (
              <div
                key={record.id}
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
                        ? record.userNameArabic
                        : record.userNameEnglish}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      ID: {record.userId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(record.isActive)}
                    <Link
                      to={`/admin-panel/management-roles/managers/history/user/${record.userId}`}
                    >
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("managerHistory.table.role")}:
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.managerType === "MANAGER"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}
                    >
                      {getManagerTypeDisplay(record.managerType)}
                    </span>
                  </div>

                  {record.categoryName && (
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {t("managerHistory.table.category")}:
                      </span>
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {record.categoryName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("managerHistory.table.duration")}:
                    </span>
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {calculateDuration(record.assignedAt, record.revokedAt)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {t("managerHistory.assignedOn")}:{" "}
                      {formatDate(record.assignedAt)}
                    </div>
                    {record.assignedByName && (
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {t("managerHistory.assignedBy")}:{" "}
                        {record.assignedByName}
                      </div>
                    )}
                    {record.revocationReason && (
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {t("managerHistory.revocationReason")}:{" "}
                        {record.revocationReason}
                      </div>
                    )}
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
                  {t("managerHistory.pagination.showing")}{" "}
                  {pagination.startIndex} - {pagination.endIndex}{" "}
                  {t("managerHistory.pagination.of")} {pagination.totalCount}{" "}
                  {t("managerHistory.pagination.records")}
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

export default ManagerHistory;
