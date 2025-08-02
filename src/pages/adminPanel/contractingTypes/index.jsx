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
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { getContractingTypes } from "../../../state/act/actContractingType";
import {
  clearError,
  setCurrentPage,
  setFilters,
  setPageSize,
} from "../../../state/slices/contractingType";
import { Link } from "react-router-dom";
import DeleteContractingTypeModal from "../../../components/DeleteContractingType";

function ContractingTypes() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });

  const {
    contractingTypes,
    pagination,
    filters,
    loadingGetContractingTypes,
    error,
  } = useSelector((state) => state.contractingType);

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

  // Fetch contracting types when filters change
  useEffect(() => {
    dispatch(getContractingTypes(filters));
  }, [dispatch, filters]);

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchTerm) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        dispatch(setFilters({ search: searchTerm, page: 1 }));
      }, 500);
      setSearchTimeout(timeout);
    },
    [dispatch, searchTimeout]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(newPageSize));
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

  // Get contracting type name based on current language
  const getContractingTypeName = (contractingType) => {
    return language === "ar"
      ? contractingType.nameArabic
      : contractingType.nameEnglish;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US");
  };

  // Pagination component
  const PaginationComponent = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const {
      page: currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    } = pagination;

    return (
      <div className="flex items-center justify-between mt-6 px-4">
        <div className="text-sm text-gray-500">
          {t("common.pagination.showing")}{" "}
          {(currentPage - 1) * filters.pageSize + 1} -{" "}
          {Math.min(currentPage * filters.pageSize, pagination.totalCount)}{" "}
          {t("common.pagination.of")} {pagination.totalCount}{" "}
          {t("common.pagination.items")}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className={`p-2 rounded-lg border ${
              !hasPreviousPage
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <span className="px-3 py-1 text-sm font-medium">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`p-2 rounded-lg border ${
              !hasNextPage
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                {t("contractingTypes.title")}
              </h1>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t("contractingTypes.description")}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <Link
                to="/admin-panel/contracting-types/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className={`${isRTL ? "ml-2" : "mr-2"}`} />
                {t("contractingTypes.addNew")}
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm border ${
            isDark ? "border-gray-700" : "border-gray-200"
          } mb-6`}
        >
          <div className="p-6">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <Search
                  className={`absolute ${
                    isRTL ? "right-3" : "left-3"
                  } top-1/2 transform -translate-y-1/2 text-gray-400`}
                  size={20}
                />
                <input
                  type="text"
                  placeholder={t("contractingTypes.search.placeholder")}
                  value={searchInput}
                  onChange={handleSearchChange}
                  className={`w-full ${
                    isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white"
                  }`}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`mt-3 md:mt-0 md:ml-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } transition-colors`}
              >
                <Filter size={20} className={`${isRTL ? "ml-2" : "mr-2"}`} />
                {t("contractingTypes.filters.title")}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      {t("contractingTypes.filters.status")}
                    </label>
                    <select
                      value={
                        filters.isActive === null
                          ? ""
                          : filters.isActive.toString()
                      }
                      onChange={(e) =>
                        handleFilterChange(
                          "isActive",
                          e.target.value === ""
                            ? null
                            : e.target.value === "true"
                        )
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      <option value="">
                        {t("contractingTypes.filters.allStatuses")}
                      </option>
                      <option value="true">
                        {t("contractingTypes.status.active")}
                      </option>
                      <option value="false">
                        {t("contractingTypes.status.inactive")}
                      </option>
                    </select>
                  </div>

                  {/* Order By */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      {t("contractingTypes.filters.orderBy")}
                    </label>
                    <select
                      value={filters.orderBy}
                      onChange={(e) =>
                        handleFilterChange("orderBy", e.target.value)
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      <option value="nameArabic">
                        {t("contractingTypes.filters.sortBy.nameArabic")}
                      </option>
                      <option value="nameEnglish">
                        {t("contractingTypes.filters.sortBy.nameEnglish")}
                      </option>
                      <option value="createdAt">
                        {t("contractingTypes.filters.sortBy.createdAt")}
                      </option>
                    </select>
                  </div>

                  {/* Order Direction */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      {t("contractingTypes.filters.orderDirection")}
                    </label>
                    <select
                      value={filters.orderDesc.toString()}
                      onChange={(e) =>
                        handleFilterChange(
                          "orderDesc",
                          e.target.value === "true"
                        )
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      <option value="false">
                        {t("contractingTypes.filters.ascending")}
                      </option>
                      <option value="true">
                        {t("contractingTypes.filters.descending")}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error.message}</p>
          </div>
        )}

        {/* Mobile Table Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileTable(!showMobileTable)}
            className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            <Menu size={20} className={`${isRTL ? "ml-2" : "mr-2"}`} />
            {showMobileTable ? t("common.hideTable") : t("common.showTable")}
          </button>
        </div>

        {/* Table */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm border ${
            isDark ? "border-gray-700" : "border-gray-200"
          } ${
            showMobileTable || window.innerWidth >= 768
              ? "block"
              : "hidden md:block"
          }`}
        >
          {loadingGetContractingTypes ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : contractingTypes && contractingTypes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                  <tr>
                    <th
                      className={`px-6 py-3 ${
                        isRTL ? "text-right" : "text-left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("contractingTypes.table.name")}
                    </th>
                    <th
                      className={`px-6 py-3 ${
                        isRTL ? "text-right" : "text-left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("contractingTypes.table.overtime")}
                    </th>
                    <th
                      className={`px-6 py-3 ${
                        isRTL ? "text-right" : "text-left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("contractingTypes.table.maxHours")}
                    </th>
                    <th
                      className={`px-6 py-3 ${
                        isRTL ? "text-right" : "text-left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("contractingTypes.table.users")}
                    </th>
                    <th
                      className={`px-6 py-3 ${
                        isRTL ? "text-right" : "text-left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("contractingTypes.table.status")}
                    </th>
                    <th
                      className={`px-6 py-3 ${
                        isRTL ? "text-right" : "text-left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("contractingTypes.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${
                    isDark ? "bg-gray-800" : "bg-white"
                  } divide-y divide-gray-200`}
                >
                  {contractingTypes.map((contractingType) => (
                    <tr
                      key={contractingType.id}
                      className={`hover:${
                        isDark ? "bg-gray-700" : "bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {getContractingTypeName(contractingType)}
                          </div>
                          <div
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {language === "ar"
                              ? contractingType.nameEnglish
                              : contractingType.nameArabic}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {contractingType.allowOvertimeHours ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : (
                            <XCircle className="text-red-500" size={20} />
                          )}
                          <span
                            className={`ml-2 text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {contractingType.allowOvertimeHours
                              ? t("contractingTypes.overtime.allowed")
                              : t("contractingTypes.overtime.notAllowed")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                            size={16}
                          />
                          <span
                            className={`ml-2 text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {contractingType.maxHoursPerWeek}{" "}
                            {t("contractingTypes.hoursPerWeek")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users
                            className={`${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                            size={16}
                          />
                          <span
                            className={`ml-2 text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {contractingType.usersCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            contractingType.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {contractingType.isActive
                            ? t("contractingTypes.status.active")
                            : t("contractingTypes.status.inactive")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin-panel/contracting-types/${contractingType.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title={t("contractingTypes.actions.view")}
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/admin-panel/contracting-types/edit/${contractingType.id}`}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                            title={t("contractingTypes.actions.edit")}
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(contractingType)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title={t("contractingTypes.actions.delete")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {t("contractingTypes.noData")}
              </p>
            </div>
          )}

          {/* Pagination */}
          <PaginationComponent />
        </div>

        {/* Delete Modal */}
        <DeleteContractingTypeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          contractingTypeId={toDelete.id}
          contractingTypeName={toDelete.name}
        />
      </div>
    </div>
  );
}

export default ContractingTypes;
