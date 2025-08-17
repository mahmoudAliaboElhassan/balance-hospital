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
  Users,
} from "lucide-react";
import { getContractingTypes } from "../../../state/act/actContractingType";
import {
  clearError,
  setCurrentPage,
  setPageSize,
  setSearchFilter,
  setStatusFilter,
  setOvertimeFilter,
  setHoursRangeFilter,
  setDateRangeFilter,
  setSortFilter,
  clearFilters,
} from "../../../state/slices/contractingType";
import { Link } from "react-router-dom";
import DeleteContractingTypeModal from "../../../components/DeleteContractingType";
import "../../../styles/general.css";

function ContractingTypes() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);

  // Filter input states
  const [searchInput, setSearchInput] = useState("");
  const [minHoursInput, setMinHoursInput] = useState("");
  const [maxHoursInput, setMaxHoursInput] = useState("");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  const {
    contractingTypes,
    pagination,
    filters,
    loadingGetContractingTypes,
    error,
  } = useSelector((state) => state.contractingType);

  const { mymode } = useSelector((state) => state.mode);

  // Check if we're in dark mode
  const isDark = mymode === "dark";

  // Check if current language is RTL
  const language = i18n.language;
  const isRTL = language === "ar";

  // Initialize filter inputs from current filters
  useEffect(() => {
    setSearchInput(filters.search || "");
    setMinHoursInput(filters.minHoursPerWeek || "");
    setMaxHoursInput(filters.maxHoursPerWeek || "");
    setFromDateInput(filters.createdFromDate || "");
    setToDateInput(filters.createdToDate || "");
  }, [filters]);

  // Fetch contracting types when component mounts or filters change
  useEffect(() => {
    const params = {
      search: filters.search,
      allowOvertimeHours: filters.allowOvertimeHours,
      minHoursPerWeek: filters.minHoursPerWeek,
      maxHoursPerWeek: filters.maxHoursPerWeek,
      statusFilter: filters.statusFilter,
      createdFromDate: filters.createdFromDate,
      createdToDate: filters.createdToDate,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
      page: filters.page,
      pageSize: filters.pageSize,
    };

    dispatch(getContractingTypes(params));
  }, [dispatch, filters]);

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value) => {
      setSearchInput(value);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        dispatch(setSearchFilter(value));
      }, 500);

      setSearchTimeout(timeout);
    },
    [dispatch, searchTimeout]
  );

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(parseInt(newPageSize)));
  };

  // Handle filter changes
  const handleStatusChange = (value) => {
    dispatch(setStatusFilter(value));
  };

  const handleOvertimeChange = (value) => {
    const overtimeValue = value === "" ? undefined : value === "true";
    dispatch(setOvertimeFilter(overtimeValue));
  };

  const handleHoursRangeChange = () => {
    const minHours = minHoursInput === "" ? undefined : parseInt(minHoursInput);
    const maxHours = maxHoursInput === "" ? undefined : parseInt(maxHoursInput);
    dispatch(setHoursRangeFilter({ minHours, maxHours }));
  };

  const handleDateRangeChange = () => {
    dispatch(
      setDateRangeFilter({
        fromDate: fromDateInput,
        toDate: toDateInput,
      })
    );
  };

  const handleSortChange = (sortBy, sortDirection) => {
    dispatch(setSortFilter({ sortBy, sortDirection }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchInput("");
    setMinHoursInput("");
    setMaxHoursInput("");
    setFromDateInput("");
    setToDateInput("");
  };

  // Handle delete action
  const handleDeleteClick = (contractingType) => {
    const name =
      language === "ar"
        ? contractingType.nameArabic
        : contractingType.nameEnglish;
    setToDelete({ id: contractingType.id, name });
    setModalOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const locale = language === "ar" ? "ar-EG" : "en-US";
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

  // Mobile card component for each contracting type
  const ContractingTypeCard = ({ contractingType }) => (
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
            {language === "en"
              ? contractingType.nameEnglish
              : contractingType.nameArabic}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("contractingTypes.table.users")}:
          </span>
          <span
            className={`${isRTL ? "mr-2" : "ml-2"} ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {contractingType.usersCount}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to={`/admin-panel/contracting-types/${contractingType.id}`}>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
            title={t("contractingTypes.actions.view")}
          >
            <Eye size={16} />
          </button>
        </Link>
        <Link to={`/admin-panel/contracting-types/edit/${contractingType.id}`}>
          <button
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors cursor-pointer"
            title={t("contractingTypes.actions.edit")}
          >
            <Edit size={16} />
          </button>
        </Link>
        <button
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
          title={t("contractingTypes.actions.delete")}
          onClick={() => handleDeleteClick(contractingType)}
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
      <DeleteContractingTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contractingTypeId={toDelete.id}
        info={toDelete}
        contractingTypeName={toDelete.name}
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
                {t("contractingTypes.title")}
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/admin-panel/contracting-types/create">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                    <Plus size={20} />
                    <span className="hidden sm:inline">
                      {t("contractingTypes.addNew")}
                    </span>
                    <span className="sm:hidden">
                      {t("contractingTypes.add")}
                    </span>
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
                    className="text-red-500 hover:text-red-700 cursor-pointer"
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
                    placeholder={t("contractingTypes.search.placeholder")}
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
                  className={`px-4 py-2 rounded-lg cursor-pointer border transition-colors flex items-center gap-2 justify-center sm:justify-start ${
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
                  {t("contractingTypes.filters.title")}
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t ${
                    isDark ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  {/* Status Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.status")}
                    </label>
                    <select
                      value={filters.statusFilter}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value={true}>
                        {t("contractingTypes.status.active")}
                      </option>
                      <option value={false}>
                        {t("contractingTypes.status.inactive")}
                      </option>
                    </select>
                  </div>

                  {/* Overtime Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.overtime")}
                    </label>
                    <select
                      value={
                        filters.allowOvertimeHours === undefined
                          ? ""
                          : filters.allowOvertimeHours.toString()
                      }
                      onChange={(e) => handleOvertimeChange(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="">
                        {t("contractingTypes.filters.allOvertimes")}
                      </option>
                      <option value="true">
                        {t("contractingTypes.overtime.allowed")}
                      </option>
                      <option value="false">
                        {t("contractingTypes.overtime.notAllowed")}
                      </option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.sortBy")}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleSortChange(
                          parseInt(e.target.value),
                          filters.sortDirection
                        )
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value={1}>
                        {t("contractingTypes.filters.sortByOptions.nameArabic")}
                      </option>
                      <option value={2}>
                        {t(
                          "contractingTypes.filters.sortByOptions.nameEnglish"
                        )}
                      </option>
                      <option value={3}>
                        {t(
                          "contractingTypes.filters.sortByOptions.allowOvertime"
                        )}
                      </option>
                      <option value={4}>
                        {t("contractingTypes.filters.sortByOptions.maxHours")}
                      </option>
                      <option value={6}>
                        {t("contractingTypes.filters.sortByOptions.createdAt")}
                      </option>
                      <option value={7}>
                        {t("contractingTypes.filters.sortByOptions.updatedAt")}
                      </option>
                    </select>
                  </div>

                  {/* Sort Direction */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.sortDirection")}
                    </label>
                    <select
                      value={filters.sortDirection}
                      onChange={(e) =>
                        handleSortChange(
                          filters.sortBy,
                          parseInt(e.target.value)
                        )
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value={0}>
                        {t("contractingTypes.filters.ascending")}
                      </option>
                      <option value={1}>
                        {t("contractingTypes.filters.descending")}
                      </option>
                    </select>
                  </div>

                  {/* Min Hours Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.minHours")}
                    </label>
                    <input
                      type="number"
                      placeholder={t("contractingTypes.filters.minHours")}
                      value={minHoursInput}
                      onChange={(e) => setMinHoursInput(e.target.value)}
                      onBlur={handleHoursRangeChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>

                  {/* Max Hours Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.maxHours")}
                    </label>
                    <input
                      type="number"
                      placeholder={t("contractingTypes.filters.maxHours")}
                      value={maxHoursInput}
                      onChange={(e) => setMaxHoursInput(e.target.value)}
                      onBlur={handleHoursRangeChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>

                  {/* Date From */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.fromDate")}
                    </label>
                    <input
                      type="date"
                      value={fromDateInput}
                      onChange={(e) => setFromDateInput(e.target.value)}
                      onBlur={handleDateRangeChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.toDate")}
                    </label>
                    <input
                      type="date"
                      value={toDateInput}
                      onChange={(e) => setToDateInput(e.target.value)}
                      onBlur={handleDateRangeChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Clear Filters Button */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <button
                      onClick={handleClearFilters}
                      className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
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
            {loadingGetContractingTypes ? (
              <div className="text-center p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span
                    className={`${isRTL ? "mr-3" : "ml-3"} ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("gettingData.contractingTypes")}
                  </span>
                </div>
              </div>
            ) : contractingTypes && contractingTypes.length === 0 ? (
              <div
                className={`text-center p-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("contractingTypes.noData")}
              </div>
            ) : (
              contractingTypes?.map((contractingType) => (
                <ContractingTypeCard
                  key={contractingType.id}
                  contractingType={contractingType}
                />
              ))
            )}
          </div>

          {/* Desktop Table View / Mobile Table View */}
          <div
            className={`${showMobileTable ? "block" : "hidden md:block"} ${
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
                      {t("contractingTypes.table.nameArabic")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.nameEnglish")}
                    </th>

                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.users")}
                    </th>

                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingGetContractingTypes ? (
                    <tr>
                      <td colSpan="9" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-3" : "ml-3"} ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("gettingData.contractingTypes")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : contractingTypes && contractingTypes.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center p-8">
                        <span
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("contractingTypes.noData")}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    contractingTypes?.map((contractingType, index) => (
                      <tr
                        key={contractingType.id}
                        className={`border-b ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        } hover:${
                          isDark ? "bg-gray-700" : "bg-gray-50"
                        } transition-colors`}
                      >
                        <td
                          className={`p-4 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {contractingType.nameArabic}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {contractingType.nameEnglish}
                        </td>

                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            {contractingType.usersCount}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/admin-panel/contracting-types/${contractingType.id}`}
                            >
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                                title={t("contractingTypes.actions.view")}
                              >
                                <Eye size={16} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/contracting-types/edit/${contractingType.id}`}
                            >
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                                title={t("contractingTypes.actions.edit")}
                              >
                                <Edit size={16} />
                              </button>
                            </Link>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                              title={t("contractingTypes.actions.delete")}
                              onClick={() => handleDeleteClick(contractingType)}
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              className={`mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {/* Page Info */}
              <div className="text-sm">
                {t("contractingTypes.pagination.showing")}{" "}
                <span className="font-medium">{pagination.startIndex}</span>{" "}
                {t("contractingTypes.pagination.to")}{" "}
                <span className="font-medium">{pagination.endIndex}</span>{" "}
                {t("contractingTypes.pagination.of")}{" "}
                <span className="font-medium">{pagination.totalCount}</span>{" "}
                {t("contractingTypes.pagination.results")}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2 text-sm">
                  <span>{t("contractingTypes.pagination.perPage")}:</span>
                  <select
                    value={pagination.pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    className={`px-2 py-1 border rounded ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1">
                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                      pagination.hasPreviousPage
                        ? `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`
                        : `border-gray-200 dark:border-gray-700 cursor-not-allowed ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        pageNum === pagination.page
                          ? "bg-blue-600 border-blue-600 text-white"
                          : `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                      pagination.hasNextPage
                        ? `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`
                        : `border-gray-200 dark:border-gray-700 cursor-not-allowed ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`
                    }`}
                  >
                    <ChevronRight size={16} />
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

export default ContractingTypes;
