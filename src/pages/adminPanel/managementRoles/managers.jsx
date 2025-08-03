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
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";

// Redux actions
import {
  getCurrentManagers,
  getManagerHistory,
  removeManager,
} from "../../../state/act/actManagementRole";
import { clearRoleErrors } from "../../../state/slices/managementRole";

// Components
import RemoveManagerModal from "../../../components/RemoveManagerModal";

// Hooks

import i18next from "i18next";

const Managers = () => {
  const { t } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const language = i18next.language;
  const isRTL = language === "ar";
  const dispatch = useDispatch();

  // Redux state
  const {
    currentManagers,
    managerHistory,
    loadingCurrentManagers,
    loadingManagerHistory,
    loadingRemoveManager,
    currentManagersError,
    removeManagerError,
  } = useSelector((state) => state.role);

  // Local state
  const [modalOpen, setModalOpen] = useState(false);
  const [toRemove, setToRemove] = useState({ id: null, name: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    pageSize: 10,
  });

  // Filtered data
  const [filteredManagers, setFilteredManagers] = useState([]);
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
    dispatch(getCurrentManagers());
    dispatch(getManagerHistory({ limit: 50 })); // Get more history for filtering
  }, [dispatch]);

  // Filter and paginate managers when data or filters change
  useEffect(() => {
    if (currentManagers) {
      let filtered = [...currentManagers];

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (manager) =>
            manager.nameArabic?.toLowerCase().includes(searchTerm) ||
            manager.nameEnglish?.toLowerCase().includes(searchTerm) ||
            manager.email?.toLowerCase().includes(searchTerm) ||
            manager.mobile?.toLowerCase().includes(searchTerm)
        );
      }

      // Calculate pagination
      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / filters.pageSize);
      const startIndex = (filters.page - 1) * filters.pageSize;
      const endIndex = startIndex + filters.pageSize;
      const paginatedData = filtered.slice(startIndex, endIndex);

      setFilteredManagers(paginatedData);
      setPagination({
        page: filters.page,
        pageSize: filters.pageSize,
        totalCount,
        totalPages,
        hasNextPage: filters.page < totalPages,
        hasPreviousPage: filters.page > 1,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, totalCount),
      });
    }
  }, [currentManagers, filters]);

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

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setFilters((prev) => ({
      ...prev,
      pageSize: parseInt(newPageSize),
      page: 1,
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      page: 1,
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

  // Get manager assignment info from history
  const getManagerInfo = (managerId) => {
    const managerHistoryRecord = managerHistory?.find(
      (record) => record.userId === managerId
    );
    return managerHistoryRecord;
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
      <RemoveManagerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        managerId={toRemove.id}
        managerName={toRemove.name}
        onRemove={() => {
          dispatch(getCurrentManagers());
          setModalOpen(false);
        }}
      />

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
                  {t("managementRoles.backToRoles")}
                </span>
              </Link>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("managers.title")}
              </h1>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link to="/admin-panel/management-roles/managers/assign">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center">
                  <Plus size={20} />
                  <span className="hidden sm:inline">
                    {t("managers.assignNew")}
                  </span>
                  <span className="sm:hidden">{t("managers.assign")}</span>
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
          {(currentManagersError || removeManagerError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div className="flex justify-between items-center">
                <span>
                  {language === "ar"
                    ? currentManagersError?.messageAr ||
                      removeManagerError?.messageAr ||
                      "حدث خطأ"
                    : currentManagersError?.messageEn ||
                      removeManagerError?.messageEn ||
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
                  placeholder={t("managers.search.placeholder")}
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
                    {t("managers.filters.title")}
                  </span>
                </button>

                {filters.search && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {t("managers.filters.clear")}
                  </button>
                )}
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managers.filters.itemsPerPage")}
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
                        5 {t("managers.filters.perPage")}
                      </option>
                      <option value={10}>
                        10 {t("managers.filters.perPage")}
                      </option>
                      <option value={25}>
                        25 {t("managers.filters.perPage")}
                      </option>
                      <option value={50}>
                        50 {t("managers.filters.perPage")}
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
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                <h3
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentManagers?.length || 0}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("managers.statistics.totalManagers")}
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
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                <h3
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {managerHistory?.filter(
                    (h) => h.managerType === "MANAGER" && h.isActive
                  )?.length || 0}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("managers.statistics.activeAssignments")}
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
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                <h3
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {managerHistory?.filter((h) => h.managerType === "MANAGER")
                    ?.length || 0}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("managers.statistics.totalAssignments")}
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
                    {t("managers.table.name")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managers.table.contact")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managers.table.assignedDate")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managers.table.assignedBy")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managers.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingCurrentManagers ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span
                          className={`${isRTL ? "mr-3" : "ml-3"} ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {t("managers.loading")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredManagers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8">
                      <div
                        className={`text-center ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <UserCheck className="mx-auto h-12 w-12 mb-2 opacity-50" />
                        <p className="text-lg font-medium mb-1">
                          {t("managers.noData")}
                        </p>
                        <p className="text-sm">
                          {t("managers.noDataDescription")}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredManagers.map((manager) => {
                    const managerInfo = getManagerInfo(manager.id);
                    return (
                      <tr
                        key={manager.id}
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
                                ? manager.nameArabic
                                : manager.nameEnglish}
                            </div>
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              ID: {manager.id}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              <span
                                className={`text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {manager.email}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <span
                                className={`text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-600"
                                } ${isRTL ? "font-arabic" : ""}`}
                              >
                                {manager.mobile}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {formatDate(managerInfo?.assignedAt)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {managerInfo?.assignedByName || "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Link
                              to={`/admin-panel/management-roles/managers/history/user/${manager.id}`}
                            >
                              <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                                <Eye size={16} />
                              </button>
                            </Link>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                              onClick={() => {
                                setToRemove({
                                  id: manager.id,
                                  name:
                                    language === "ar"
                                      ? manager.nameArabic
                                      : manager.nameEnglish,
                                });
                                setModalOpen(true);
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4">
          {loadingCurrentManagers ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <span
                className={`${isRTL ? "mr-3" : "ml-3"} ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("managers.loading")}
              </span>
            </div>
          ) : filteredManagers.length === 0 ? (
            <div
              className={`text-center p-8 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <UserCheck className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p className="text-lg font-medium mb-1">{t("managers.noData")}</p>
              <p className="text-sm">{t("managers.noDataDescription")}</p>
            </div>
          ) : (
            filteredManagers.map((manager) => {
              const managerInfo = getManagerInfo(manager.id);
              return (
                <div
                  key={manager.id}
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
                          ? manager.nameArabic
                          : manager.nameEnglish}
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ID: {manager.id}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Link
                        to={`/admin-panel/management-roles/managers/history/user/${manager.id}`}
                      >
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                      </Link>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                        onClick={() => {
                          setToRemove({
                            id: manager.id,
                            name:
                              language === "ar"
                                ? manager.nameArabic
                                : manager.nameEnglish,
                          });
                          setModalOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {manager.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        } ${isRTL ? "font-arabic" : ""}`}
                      >
                        {manager.mobile}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {t("managers.assignedOn")}:{" "}
                        {formatDate(managerInfo?.assignedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
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
                  {t("managers.pagination.showing")} {pagination.startIndex} -{" "}
                  {pagination.endIndex} {t("managers.pagination.of")}{" "}
                  {pagination.totalCount} {t("managers.pagination.managers")}
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

export default Managers;
