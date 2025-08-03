import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
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
  Clock,
  Hash,
  Calendar,
} from "lucide-react";

import {
  clearError,
  setStatusFilter as setShiftHoursStatusFilter,
  setCurrentPage,
  setFilters,
  setPageSize,
} from "../../../state/slices/shiftHours";
import { Link } from "react-router-dom";
// import DeleteShiftHoursTypeModal from "../../../components/DeleteShiftHoursTypeModal";
import LoadingGetData from "../../../components/LoadingGetData";
import {
  getActiveShiftHoursTypes,
  getShiftHoursTypes,
} from "../../../state/act/actShiftHours";
import DeleteShiftHoursTypeModal from "../../../components/DeleteShiftHoursTypeModal";

function ShiftHours() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });

  const {
    shiftHoursTypes,
    activeShiftHoursTypes,
    loadingGetShiftHoursTypes,
    loadingGetActiveShiftHoursTypes,
    pagination,
    filters,
    error,
  } = useSelector((state) => state.shiftHour);

  const { mymode } = useSelector((state) => state.mode);

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Check if we're in dark mode
  const isDark = mymode === "dark";

  // Check if current language is RTL
  const language = i18n.language;
  const isRTL = language === "ar";

  // Get current data based on status filter
  const currentData =
    filters.statusFilter === "active" ? activeShiftHoursTypes : shiftHoursTypes;
  const isLoading =
    filters.statusFilter === "active"
      ? loadingGetActiveShiftHoursTypes
      : loadingGetShiftHoursTypes;

  // Fetch shift hours types based on status filter and other filters
  useEffect(() => {
    if (filters.statusFilter === "active") {
      dispatch(getActiveShiftHoursTypes(filters));
    } else {
      dispatch(getShiftHoursTypes(filters));
    }
  }, [dispatch, filters]);

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
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

  // Handle status filter change
  const handleStatusChange = (newStatus) => {
    dispatch(setShiftHoursStatusFilter(newStatus));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(parseInt(newPageSize)));
  };

  // Handle delete action
  const handleDeleteClick = (shiftHoursType) => {
    const name =
      language === "ar"
        ? shiftHoursType.nameArabic
        : shiftHoursType.nameEnglish;
    setToDelete({ id: shiftHoursType.id, name });
    setModalOpen(true);
  };

  // Get shift hours type name based on current language
  const getShiftHoursTypeName = (shiftHoursType) => {
    return language === "ar"
      ? shiftHoursType.nameArabic
      : shiftHoursType.nameEnglish;
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

  // Format hours for display
  const formatHours = (hours) => {
    if (!hours) return "0";
    return parseFloat(hours).toString();
  };

  // Get period display text
  const getPeriodDisplay = (period) => {
    const periodMap = {
      daily: t("shiftHoursTypes.periods.daily"),
      weekly: t("shiftHoursTypes.periods.weekly"),
      monthly: t("shiftHoursTypes.periods.monthly"),
    };
    return periodMap[period] || period;
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

  // Mobile card component for each shift hours type
  const ShiftHoursTypeCard = ({ shiftHoursType }) => (
    <div
      className={`p-4 rounded-lg border mb-3 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3
            className={`font-semibold text-lg ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {shiftHoursType.nameArabic}
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {shiftHoursType.nameEnglish}
          </p>
          {shiftHoursType.code && (
            <div className="flex items-center mt-1">
              <Hash
                className={`h-3 w-3 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } ${isRTL ? "ml-1" : "mr-1"}`}
              />
              <span
                className={`text-xs font-mono px-2 py-1 rounded ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {shiftHoursType.code}
              </span>
            </div>
          )}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            shiftHoursType.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {shiftHoursType.isActive
            ? t("shiftHoursTypes.status.active")
            : t("shiftHoursTypes.status.inactive")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-500" />
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("shiftHoursTypes.table.hours")}:
          </span>
          <span className={`${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {formatHours(shiftHoursType.hours)}h
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("shiftHoursTypes.table.period")}:
          </span>
          <span className={`${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {getPeriodDisplay(shiftHoursType.period)}
          </span>
        </div>
        {shiftHoursType.createdAt && (
          <div className="flex items-center gap-2 col-span-2">
            <Calendar size={14} className="text-gray-500" />
            <span
              className={`font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("shiftHoursTypes.table.createdAt")}:
            </span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {formatDate(shiftHoursType.createdAt)}
            </span>
          </div>
        )}
      </div>

      {shiftHoursType.description && (
        <div className="mb-3">
          <p
            className={`text-xs ${
              isDark ? "text-gray-400" : "text-gray-600"
            } line-clamp-2`}
          >
            {language === "ar"
              ? shiftHoursType.descriptionArabic
              : shiftHoursType.descriptionEnglish}
          </p>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Link to={`/admin-panel/shift-hours-types/${shiftHoursType.id}`}>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title={t("shiftHoursTypes.actions.view")}
          >
            <Eye size={16} />
          </button>
        </Link>
        <Link to={`/admin-panel/shift-hours-types/edit/${shiftHoursType.id}`}>
          <button
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
            title={t("shiftHoursTypes.actions.edit")}
          >
            <Edit size={16} />
          </button>
        </Link>
        <button
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
          title={t("shiftHoursTypes.actions.delete")}
          onClick={() => handleDeleteClick(shiftHoursType)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingGetData />;
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DeleteShiftHoursTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        shiftHoursTypeId={toDelete.id}
        info={toDelete}
        shiftHoursTypeName={toDelete.name}
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
                {t("shiftHoursTypes.title")}
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/admin-panel/shift-hours-types/create">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center">
                    <Plus size={20} />
                    <span className="hidden sm:inline">
                      {t("shiftHoursTypes.addNew")}
                    </span>
                    <span className="sm:hidden">
                      {t("shiftHoursTypes.add")}
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
                    placeholder={t("shiftHoursTypes.search.placeholder")}
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
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 justify-center sm:justify-start ${
                    showFilters
                      ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300"
                      : `hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isDark
                            ? "border-gray-600 text-gray-300"
                            : "border-gray-300 text-gray-700"
                        }`
                  }`}
                >
                  <Filter size={20} />
                  {t("shiftHoursTypes.filters.title")}
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
                      {t("shiftHoursTypes.filters.status")}
                    </label>
                    <select
                      value={filters.statusFilter || "all"}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="all">
                        {t("shiftHoursTypes.filters.allStatuses")}
                      </option>
                      <option value="active">
                        {t("shiftHoursTypes.status.active")}
                      </option>
                      <option value="inactive">
                        {t("shiftHoursTypes.status.inactive")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("shiftHoursTypes.filters.period")}
                    </label>
                    <select
                      value={filters.period || ""}
                      onChange={(e) =>
                        handleFilterChange("period", e.target.value || null)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="">
                        {t("shiftHoursTypes.filters.allPeriods")}
                      </option>
                      <option value="daily">
                        {t("shiftHoursTypes.periods.daily")}
                      </option>
                      <option value="weekly">
                        {t("shiftHoursTypes.periods.weekly")}
                      </option>
                      <option value="monthly">
                        {t("shiftHoursTypes.periods.monthly")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("shiftHoursTypes.filters.orderBy")}
                    </label>
                    <select
                      value={filters.orderBy || "nameArabic"}
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
                        {t("shiftHoursTypes.filters.sortBy.nameArabic")}
                      </option>
                      <option value="nameEnglish">
                        {t("shiftHoursTypes.filters.sortBy.nameEnglish")}
                      </option>
                      <option value="hours">
                        {t("shiftHoursTypes.filters.sortBy.hours")}
                      </option>
                      <option value="createdAt">
                        {t("shiftHoursTypes.filters.sortBy.createdAt")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("shiftHoursTypes.filters.orderDirection")}
                    </label>
                    <select
                      value={filters.orderDesc?.toString() || "true"}
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
                        {t("shiftHoursTypes.filters.descending")}
                      </option>
                      <option value="false">
                        {t("shiftHoursTypes.filters.ascending")}
                      </option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className={`md:hidden ${showMobileTable ? "hidden" : "block"}`}>
            {isLoading ? (
              <div className="text-center p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span
                    className={`${isRTL ? "mr-3" : "ml-3"} ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("shiftHoursTypes.loading")}
                  </span>
                </div>
              </div>
            ) : !currentData || currentData.length === 0 ? (
              <div
                className={`text-center p-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("shiftHoursTypes.noData")}
              </div>
            ) : (
              currentData.map((shiftHoursType) => (
                <ShiftHoursTypeCard
                  key={shiftHoursType.id}
                  shiftHoursType={shiftHoursType}
                />
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
                      {t("shiftHoursTypes.table.nameArabic")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.nameEnglish")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.code")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.hours")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.period")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.status")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.createdAt")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-3" : "ml-3"} ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("shiftHoursTypes.loading")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : !currentData || currentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className={`text-center p-8 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("shiftHoursTypes.noData")}
                      </td>
                    </tr>
                  ) : (
                    currentData.map((shiftHoursType) => (
                      <tr
                        key={shiftHoursType.id}
                        className={`border-b transition-colors ${
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
                          {shiftHoursType.nameArabic}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {shiftHoursType.nameEnglish}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs font-mono px-2 py-1 rounded ${
                              isDark
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {shiftHoursType.code || "N/A"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-500" />
                            <span
                              className={`font-medium ${
                                isDark ? "text-gray-300" : "text-gray-900"
                              }`}
                            >
                              {formatHours(shiftHoursType.hours)}h
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              shiftHoursType.period === "daily"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : shiftHoursType.period === "weekly"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            }`}
                          >
                            {getPeriodDisplay(shiftHoursType.period)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              shiftHoursType.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {shiftHoursType.isActive
                              ? t("shiftHoursTypes.status.active")
                              : t("shiftHoursTypes.status.inactive")}
                          </span>
                        </td>
                        <td
                          className={`p-4 text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {shiftHoursType.createdAt
                            ? formatDate(shiftHoursType.createdAt)
                            : "-"}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/admin-panel/shift-hours-types/${shiftHoursType.id}`}
                            >
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                title={t("shiftHoursTypes.actions.view")}
                              >
                                <Eye size={16} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/shift-hours-types/edit/${shiftHoursType.id}`}
                            >
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                                title={t("shiftHoursTypes.actions.edit")}
                              >
                                <Edit size={16} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(shiftHoursType)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title={t("shiftHoursTypes.actions.delete")}
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
              <table className="w-full text-sm">
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
                      {t("shiftHoursTypes.table.name")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.hours")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.status")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("shiftHoursTypes.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-2" : "ml-2"} text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("shiftHoursTypes.loading")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : !currentData || currentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className={`text-center p-8 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("shiftHoursTypes.noData")}
                      </td>
                    </tr>
                  ) : (
                    currentData.map((shiftHoursType) => (
                      <tr
                        key={shiftHoursType.id}
                        className={`border-b transition-colors ${
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
                              {shiftHoursType.nameArabic}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {shiftHoursType.code || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-500" />
                            <span
                              className={`text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-900"
                              }`}
                            >
                              {formatHours(shiftHoursType.hours)}h
                            </span>
                          </div>
                          <div
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {getPeriodDisplay(shiftHoursType.period)}
                          </div>
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              shiftHoursType.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {shiftHoursType.isActive
                              ? t("shiftHoursTypes.status.active")
                              : t("shiftHoursTypes.status.inactive")}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Link
                              to={`/admin-panel/shift-hours-types/${shiftHoursType.id}`}
                            >
                              <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors">
                                <Eye size={14} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/shift-hours-types/edit/${shiftHoursType.id}`}
                            >
                              <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors">
                                <Edit size={14} />
                              </button>
                            </Link>
                            <button
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                              onClick={() => handleDeleteClick(shiftHoursType)}
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
                    {t("shiftHoursTypes.pagination.showing")}{" "}
                    {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      pagination.totalCount
                    )}{" "}
                    {t("shiftHoursTypes.pagination.of")} {pagination.totalCount}{" "}
                    {t("shiftHoursTypes.pagination.items")}
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
                      {t("shiftHoursTypes.pagination.itemsPerPage")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                      className={`px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm ${
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
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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

export default ShiftHours;
