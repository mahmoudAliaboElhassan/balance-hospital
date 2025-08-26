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
  UserPlus,
  FileText,
} from "lucide-react";
import {
  clearAllErrors,
  clearFilters,
  selectFilters,
  setCurrentPage,
  setFilters,
  setPageSize,
} from "../../../state/slices/roster";
import { Link, useNavigate } from "react-router-dom";
// import DeleteRosterModal from "../../../components/DeleteRosterModal";
import { getRosterList } from "../../../state/act/actRosterManagement";

function Roster() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, title: "" });
  const { rosterList, pagination, loading, errors } = useSelector(
    (state) => state.rosterManagement
  );
  const { mymode } = useSelector((state) => state.mode);

  const [searchInput, setSearchInput] = useState(selectFilters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Check if we're in dark mode
  const isDark = mymode === "dark";

  // Check if current language is RTL
  const language = i18n.language;
  const isRTL = language === "ar";

  // Fetch roster when filters change
  useEffect(() => {
    dispatch(getRosterList(selectFilters));
  }, [dispatch, selectFilters]);

  const navigate = useNavigate();

  // Handle search with debounce
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

  // Format date
  const formatDate = (dateString) => {
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format month/year display
  const formatMonthYear = (month, year) => {
    const monthNames = {
      ar: [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
      en: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };

    const months = monthNames[language] || monthNames.en;
    return `${months[month - 1]} ${year}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      DRAFT_PARTIAL:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      PUBLISHED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      ARCHIVED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return (
      statusColors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination?.totalPages || 1;
    const currentPage = pagination?.page || 1;

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

  // Mobile card component for each roster
  const RosterCard = ({ roster }) => (
    <div
      className={`p-4 rounded-lg border mb-3 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3
            className={`font-semibold text-lg mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {roster.title}
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {formatMonthYear(roster.month, roster.year)}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            roster.status
          )}`}
        >
          {roster.statusDisplayName}
        </span>
      </div>

      <div className="text-sm mb-3">
        <span
          className={`font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {t("roster.table.createdAt")}:
        </span>
        <span className={`mr-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          {formatDate(roster.createdAt)}
        </span>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to={`/admin-panel/rosters/${roster.id}`}>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
            title={t("roster.actions.view")}
          >
            <Eye size={16} />
          </button>
        </Link>
        <Link to={`/admin-panel/rosters/${roster.id}/add-doctors`}>
          <button
            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition-colors cursor-pointer"
            title={t("roster.actions.addDoctors")}
          >
            <UserPlus size={16} />
          </button>
        </Link>
        <Link to={`/admin-panel/rosters/${roster.id}/edit`}>
          <button
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors cursor-pointer"
            title={t("roster.actions.edit")}
          >
            <Edit size={16} />
          </button>
        </Link>
        <button
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
          title={t("roster.actions.delete")}
          onClick={() => {
            setToDelete({
              id: roster.id,
              title: roster.title,
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
      {/* <DeleteRosterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        rosterId={toDelete.id}
        info={toDelete}
        rosterTitle={toDelete.title}
      /> */}
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
                {t("roster.title")}
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/admin-panel/rosters/create">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                    <Plus size={20} />
                    <span className="hidden sm:inline">
                      {t("roster.actions.addNew")}
                    </span>
                    <span className="sm:hidden">{t("roster.actions.add")}</span>
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

            {errors?.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex justify-between items-center">
                  <span>{errors.general}</span>
                  <button
                    onClick={() => dispatch(clearAllErrors())}
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
                    placeholder={t("roster.filters.searchPlaceholder")}
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
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 justify-center sm:justify-start cursor-pointer ${
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
                  {t("roster.filters.title")}
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
                      {t("roster.filters.status")}
                    </label>
                    <select
                      value={selectFilters.status || "all"}
                      onChange={(e) => {
                        const value =
                          e.target.value === "all" ? null : e.target.value;
                        handleFilterChange("status", value);
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="all">{t("roster.filters.all")}</option>
                      <option value="DRAFT_PARTIAL">
                        {t("roster.status.draftPartial")}
                      </option>
                      <option value="DRAFT">{t("roster.status.draft")}</option>
                      <option value="PUBLISHED">
                        {t("roster.status.published")}
                      </option>
                      <option value="ARCHIVED">
                        {t("roster.status.archived")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.filters.year")}
                    </label>
                    <select
                      value={selectFilters.year || "all"}
                      onChange={(e) => {
                        const value =
                          e.target.value === "all"
                            ? null
                            : parseInt(e.target.value);
                        handleFilterChange("year", value);
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="all">
                        {t("roster.filters.allYears")}
                      </option>
                      {[2024, 2025, 2026].map((year) => (
                        <option key={year} value={year}>
                          {year}
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
                      {t("roster.filters.orderBy")}
                    </label>
                    <select
                      value={selectFilters.orderBy || "createdAt"}
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
                        {t("roster.filters.sortBy.nameArabic")}
                      </option>
                      <option value="nameEnglish">
                        {t("roster.filters.sortBy.nameEnglish")}
                      </option>
                      <option value="createdAt">
                        {t("roster.filters.sortBy.createdAt")}
                      </option>
                      <option value="title">
                        {t("roster.filters.sortBy.title")}
                      </option>
                      <option value="year">
                        {t("roster.filters.sortBy.year")}
                      </option>
                      <option value="month">
                        {t("roster.filters.sortBy.month")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.filters.orderDirection")}
                    </label>
                    <select
                      value={(selectFilters.orderDesc || false).toString()}
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
                        {t("roster.filters.descending")}
                      </option>
                      <option value="false">
                        {t("roster.filters.ascending")}
                      </option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4">
                    <button
                      onClick={() => dispatch(clearFilters())}
                      className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t("roster.filters.clear")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className={`md:hidden ${showMobileTable ? "hidden" : "block"}`}>
            {loading?.fetch ? (
              <div className="text-center p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span
                    className={`${isRTL ? "mr-3" : "ml-3"} ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("gettingData.rosters")}
                  </span>
                </div>
              </div>
            ) : rosterList.length === 0 ? (
              <div className="text-center p-12">
                <div
                  className={`w-16 h-16 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full  mx-auto mb-4`}
                >
                  <FileText
                    size={32}
                    className={`${isDark ? "text-gray-600" : "text-gray-400"}`}
                  />
                </div>
                <h3
                  className={`text-lg font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  {t("roster.noRosters")}
                </h3>
                <p
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } mb-6`}
                >
                  {t("roster.createFirstRoster")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/admin-panel/rosters/create")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
                    {t("roster.actions.createBasic")}
                  </button>
                </div>
              </div>
            ) : (
              rosterList.map((roster) => (
                <RosterCard key={roster.id} roster={roster} />
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
                      {t("roster.table.title")}
                    </th>

                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("roster.table.status")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("roster.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading?.fetch ? (
                    <tr>
                      <td colSpan="4" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-3" : "ml-3"} ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("gettingData.rosters")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : rosterList.length === 0 ? (
                    <tr>
                      <div className="text-center p-12">
                        <div
                          className={`w-16 h-16 ${
                            isDark ? "bg-gray-700" : "bg-gray-100"
                          } rounded-full   mx-auto mb-4`}
                        >
                          <FileText
                            size={32}
                            className={`${
                              isDark ? "text-gray-600" : "text-gray-400"
                            }`}
                          />
                        </div>
                        <h3
                          className={`text-lg font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          } mb-2`}
                        >
                          {t("roster.noRosters")}
                        </h3>
                        <p
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          } mb-6`}
                        >
                          {t("roster.createFirstRoster")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={() =>
                              navigate("/admin-panel/rosters/create")
                            }
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus
                              size={16}
                              className={isRTL ? "ml-2" : "mr-2"}
                            />
                            {t("roster.actions.createBasic")}
                          </button>
                        </div>
                      </div>
                    </tr>
                  ) : (
                    rosterList.map((roster) => (
                      <tr
                        key={roster.id}
                        className={`border-b transition-colors ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-2 text-center">
                          <div>
                            <div
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {roster.title}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {formatMonthYear(roster.month, roster.year)}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              roster.status
                            )}`}
                          >
                            {roster.statusDisplayName}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex gap-1 justify-center">
                            <Link to={`/admin-panel/rosters/${roster.id}`}>
                              <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors cursor-pointer">
                                <Eye size={16} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/rosters/${roster.id}/add-doctors`}
                            >
                              <button className="p-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded transition-colors cursor-pointer">
                                <UserPlus size={16} />
                              </button>
                            </Link>
                            <Link to={`/admin-panel/rosters/${roster.id}/edit`}>
                              <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors cursor-pointer">
                                <Edit size={16} />
                              </button>
                            </Link>
                            <button
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors cursor-pointer"
                              onClick={() => {
                                setToDelete({
                                  id: roster.id,
                                  title: roster.title,
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
                      className={`text-center ${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("roster.table.title")}
                    </th>
                    <th
                      className={`text-center ${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("roster.table.status")}
                    </th>
                    <th
                      className={`text-center ${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("roster.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading.fetch ? (
                    <tr>
                      <td colSpan="3" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-2" : "ml-2"} text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("gettingData.rosters")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : rosterList.length === 0 ? (
                    <div className="text-center p-12">
                      <div
                        className={`w-16 h-16 ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        } rounded-full mx-auto mb-4`}
                      >
                        <FileText
                          size={32}
                          className={`${
                            isDark ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <h3
                        className={`text-lg font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        } mb-2`}
                      >
                        {t("roster.noRosters")}
                      </h3>
                      <p
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } mb-6`}
                      >
                        {t("roster.createFirstRoster")}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() =>
                            navigate("/admin-panel/rosters/create")
                          }
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
                          {t("roster.actions.createBasic")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    rosterList.map((roster) => (
                      <tr
                        key={roster.id}
                        className={`border-b transition-colors ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-2 text-center">
                          <div>
                            <div
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {roster.title}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {formatMonthYear(roster.month, roster.year)}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              roster.status
                            )}`}
                          >
                            {roster.statusDisplayName}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex gap-1">
                            <Link to={`/admin-panel/rosters/${roster.id}`}>
                              <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors cursor-pointer">
                                <Eye size={14} />
                              </button>
                            </Link>
                            <Link to={`/admin-panel/rosters/${roster.id}/edit`}>
                              <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors cursor-pointer">
                                <Edit size={14} />
                              </button>
                            </Link>
                            <button
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors cursor-pointer"
                              onClick={() => {
                                setToDelete({
                                  id: roster.id,
                                  name:
                                    language == "en"
                                      ? roster.nameEnglish
                                      : roster.nameArabic,
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
                    {t("displayRange", {
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
                      {t("roster.pagination.itemsPerPage")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
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
                      className={`px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
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
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
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

export default Roster;
