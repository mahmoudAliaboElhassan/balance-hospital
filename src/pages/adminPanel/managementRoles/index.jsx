// pages/ManagementRoles/ManagementRoles.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
  UserCheck,
  UserX,
  Copy,
  Shield,
  ShieldOff,
  UserPlus,
} from "lucide-react";

// Import actions from the actions file
import {
  getManagementRoles,
  getManagementRoleById,
  createManagementRole,
  updateManagementRole,
  deleteManagementRole,
  assignRoleToUser,
  removeRoleFromUser,
  activateRole,
  deactivateRole,
  cloneRole,
  getRoleStatistics,
  getAvailableRoles,
  checkCanDeleteRole,
  checkRoleNameUnique,
} from "../../../state/act/actManagementRole";

// Import slice actions and selectors
import {
  clearError,
  clearSuccess,
  updateFilters,
  resetFilters,
  updatePagination,
  clearCanDeleteStatus,
  clearNameUniqueStatus,
  selectManagementRoles,
  selectCurrentRole,
  selectLoading,
  selectError,
  selectSuccess,
  selectFilters,
  selectPagination,
  selectRoleStatistics,
  selectAvailableRoles,
  selectCanDeleteStatus,
  selectNameUniqueStatus,
} from "../../../state/slices/managementRole.js";

import { Link } from "react-router-dom";
import DeleteRoleModal from "../../../components/DeleteRoleModal";
import AssignUserToRoleForm from "./assignUser.jsx";

function ManagementRoles() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });

  // Selectors
  const roles = useSelector(selectManagementRoles);
  const currentRole = useSelector(selectCurrentRole);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const statistics = useSelector(selectRoleStatistics);
  const availableRoles = useSelector(selectAvailableRoles);
  const canDeleteStatus = useSelector(selectCanDeleteStatus);
  const nameUniqueStatus = useSelector(selectNameUniqueStatus);

  const { mymode } = useSelector((state) => state.mode);

  console.log("statistics ", statistics);

  const [searchInput, setSearchInput] = useState(filters.searchTerm || "");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Check if we're in dark mode
  const isDark = mymode === "dark";

  // Check if current language is RTL
  const language = i18n.language;
  const isRTL = language === "ar";

  // Fetch roles when filters change
  useEffect(() => {
    loadRoles();
  }, [dispatch, filters, pagination.pageNumber, pagination.pageSize]);

  // Load initial data
  useEffect(() => {
    dispatch(getRoleStatistics());
    dispatch(getAvailableRoles());
  }, [dispatch]);

  // Load roles with current filters and pagination
  const loadRoles = () => {
    dispatch(
      getManagementRoles({
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
        searchTerm: filters.searchTerm,
        isActive: filters.isActive,
        isSystemRole: filters.isSystemRole,
        hasUsers: filters.hasUsers,
        permissionFilter: filters.permissionFilter,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
      })
    );
  };

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());

      // Refresh roles list after successful operations
      if (
        success.includes("created") ||
        success.includes("updated") ||
        success.includes("deleted") ||
        success.includes("activated") ||
        success.includes("deactivated") ||
        success.includes("cloned")
      ) {
        loadRoles();
      }
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value) => {
      setSearchInput(value);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        dispatch(updateFilters({ searchTerm: value }));
        dispatch(updatePagination({ pageNumber: 1 }));
      }, 500);

      setSearchTimeout(timeout);
    },
    [dispatch, searchTimeout]
  );

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    dispatch(updateFilters({ [key]: value }));
    dispatch(updatePagination({ pageNumber: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(updatePagination({ pageNumber: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    dispatch(
      updatePagination({ pageSize: parseInt(newPageSize), pageNumber: 1 })
    );
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
    const currentPage = pagination?.pageNumber || 1;

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

  // Handle delete confirmation
  const handleDeleteClick = async (role) => {
    // Check if role can be deleted

    toast.info(t("managementRoles.delete.checking"));

    const result = await dispatch(checkCanDeleteRole(role.id));
    if (result.payload?.canDelete || result.payload?.success) {
      setToDelete({
        id: role.id,
        name: language === "en" ? role.roleNameEn : role.roleNameAr,
      });
      setModalOpen(true);
    } else {
      toast.error(
        t("managementRoles.delete.cannotDelete") ||
          "This role cannot be deleted as it is assigned to users or is a system role"
      );
    }
  };

  // Handle activate/deactivate
  const handleToggleActive = async (role) => {
    if (role.isActive) {
      dispatch(deactivateRole(role.id))
        .unwrap()
        .then(() => {
          toast.success(t("role-deactived-success"));
        });
    } else {
      dispatch(activateRole(role.id))
        .unwrap()
        .then(() => {
          toast.success(t("role-activated-success"));
        });
    }
  };

  // Handle clone role
  const handleClone = async (roleId, nameAr, nameEn) => {
    console.log(nameAr, nameEn);
    dispatch(
      cloneRole({ id: roleId, newRoleNameEn: nameEn, newRoleNameAr: nameAr })
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchInput("");
    dispatch(resetFilters());
    dispatch(updatePagination({ pageNumber: 1 }));
  };

  // Mobile card component for each role
  const RoleCard = ({ role }) => (
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
            {role.roleNameAr}
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {role.roleNameEn}
          </p>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              role.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {role.isActive
              ? t("managementRoles.status.active") || "Active"
              : t("managementRoles.status.inactive") || "Inactive"}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              role.isSystemRole
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            }`}
          >
            {role.isSystemRole
              ? t("managementRoles.type.system") || "System"
              : t("managementRoles.type.custom") || "Custom"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("managementRoles.table.users") || "Users"}:
          </span>
          <span
            className={`mr-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}
          >
            {role.usersCount || 0}
          </span>
        </div>
        <div>
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("managementRoles.table.createdAt") || "Created"}:
          </span>
          <span
            className={`mr-2 text-xs ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {formatDate(role.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to={`/admin-panel/management-roles/role/${role.id}`}>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
            title={t("managementRoles.actions.view") || "View"}
          >
            <Eye size={16} />
          </button>
        </Link>
        {!role.isSystemRole && (
          <>
            <Link to={`/admin-panel/management-roles/edit/${role.id}`}>
              <button
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors cursor-pointer"
                title={t("managementRoles.actions.edit") || "Edit"}
              >
                <Edit size={16} />
              </button>
            </Link>
            <button
              onClick={() => handleToggleActive(role)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                role.isActive
                  ? "text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900"
                  : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
              }`}
              title={
                role.isActive
                  ? t("managementRoles.actions.deactivate") || "Deactivate"
                  : t("managementRoles.actions.activate") || "Activate"
              }
            >
              {role.isActive ? <ShieldOff size={16} /> : <Shield size={16} />}
            </button>

            <button
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
              title={t("managementRoles.actions.delete") || "Delete"}
              onClick={() => handleDeleteClick(role)}
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DeleteRoleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        roleId={toDelete.id}
        info={toDelete}
        roleName={toDelete.name}
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
                {t("managementRoles.title") || "Management Roles"}
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/admin-panel/management-roles/create">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                    <Plus size={20} />
                    <span className="hidden sm:inline">
                      {t("managementRoles.actions.addNew") || "Add New Role"}
                    </span>
                    <span className="sm:hidden">
                      {t("managementRoles.actions.add") || "Add"}
                    </span>
                  </button>
                </Link>
                <Link to="/admin-panel/management-roles/assign-user-to-role">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                    <UserPlus size={20} />
                    <span className="hidden sm:inline">
                      {t("managementRoles.actions.assignUser") || "Assign User"}
                    </span>
                    <span className="sm:hidden">
                      {t("managementRoles.actions.assign") || "Assign"}
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
                  <span>{error}</span>
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

          {/* Statistics Cards */}
          {!loading.statistics && statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div
                className={`p-4 rounded-lg shadow ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("managementRoles.stats.total") || "Total Roles"}
                </h3>
                <p className="text-2xl text-blue-600">
                  {statistics.TotalRoles || 0}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg shadow ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("managementRoles.stats.active") || "Active Roles"}
                </h3>
                <p className="text-2xl text-green-600">
                  {statistics.ActiveRoles}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg shadow ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("managementRoles.stats.system") || "System Roles"}
                </h3>
                <p className="text-2xl text-purple-600">
                  {statistics.SystemRoles || 0}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg shadow ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("managementRoles.stats.custom") || "Custom Roles"}
                </h3>
                <p className="text-2xl text-orange-600">
                  {statistics.CustomRoles || 0}
                </p>
              </div>
            </div>
          )}

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
                    placeholder={
                      t("managementRoles.search.placeholder") ||
                      "Search roles..."
                    }
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
                  {t("managementRoles.filters.title") || "Filters"}
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
                      {t("managementRoles.filters.status") || "Status"}
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
                      <option value="all">
                        {t("managementRoles.filters.all") || "All"}
                      </option>
                      <option value="true">
                        {t("managementRoles.status.active") || "Active"}
                      </option>
                      <option value="false">
                        {t("managementRoles.status.inactive") || "Inactive"}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managementRoles.filters.type") || "Type"}
                    </label>
                    <select
                      value={
                        filters.isSystemRole === null
                          ? "all"
                          : filters.isSystemRole.toString()
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value === "all"
                            ? null
                            : e.target.value === "true";
                        handleFilterChange("isSystemRole", value);
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="all">
                        {t("managementRoles.filters.all") || "All"}
                      </option>
                      <option value="true">
                        {t("managementRoles.type.system") || "System"}
                      </option>
                      <option value="false">
                        {t("managementRoles.type.custom") || "Custom"}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managementRoles.filters.orderBy") || "Sort By"}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="CreatedAt">
                        {t("managementRoles.filters.sortBy.createdAt") ||
                          "Created Date"}
                      </option>
                      <option value="roleNameAr">
                        {t("managementRoles.filters.sortBy.nameArabic") ||
                          "Arabic Name"}
                      </option>
                      <option value="roleNameEn">
                        {t("managementRoles.filters.sortBy.nameEnglish") ||
                          "English Name"}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("managementRoles.filters.orderDirection") || "Order"}
                    </label>
                    <select
                      value={filters.sortDirection}
                      onChange={(e) =>
                        handleFilterChange("sortDirection", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="desc">
                        {t("managementRoles.filters.descending") ||
                          "Descending"}
                      </option>
                      <option value="asc">
                        {t("managementRoles.filters.ascending") || "Ascending"}
                      </option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4">
                    <button
                      onClick={handleResetFilters}
                      className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t("managementRoles.filters.clear") || "Clear Filters"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className={`md:hidden ${showMobileTable ? "hidden" : "block"}`}>
            {loading.list ? (
              <div className="text-center p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span
                    className={`${isRTL ? "mr-3" : "ml-3"} ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("managementRoles.loading") || "Loading..."}
                  </span>
                </div>
              </div>
            ) : roles.length === 0 ? (
              <div
                className={`text-center p-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("managementRoles.noData") || "No roles found"}
              </div>
            ) : (
              roles.map((role) => <RoleCard key={role.id} role={role} />)
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
                      {t("managementRoles.table.nameArabic") || "Arabic Name"}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.table.nameEnglish") || "English Name"}
                    </th>

                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.table.type") || "Type"}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.table.status") || "Status"}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.table.users") || "Users"}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.table.createdAt") || "Created"}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.table.actions") || "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading.list ? (
                    <tr>
                      <td colSpan="8" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-3" : "ml-3"} ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("managementRoles.loading") || "Loading..."}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : roles.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className={`text-center p-8 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("managementRoles.noData") || "No roles found"}
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr
                        key={role.id}
                        className={`border-b transition-colors ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 text-center font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {role.roleNameAr}
                        </td>
                        <td
                          className={`p-4 text-center ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {role.roleNameEn}
                        </td>

                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              role.isSystemRole
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {role.isSystemRole
                              ? t("managementRoles.type.system") || "System"
                              : t("managementRoles.type.custom") || "Custom"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              role.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {role.isActive
                              ? t("managementRoles.status.active") || "Active"
                              : t("managementRoles.status.inactive") ||
                                "Inactive"}
                          </span>
                        </td>
                        <td
                          className={`p-4 text-center ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {role.usersCount || 0}
                        </td>
                        <td
                          className={`p-4 text-center text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {formatDate(role.createdAt)}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Link
                              to={`/admin-panel/management-roles/role/${role.id}`}
                            >
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                                title={
                                  t("managementRoles.actions.view") || "View"
                                }
                              >
                                <Eye size={16} />
                              </button>
                            </Link>
                            {!role.isSystemRole && (
                              <>
                                <Link
                                  to={`/admin-panel/management-roles/edit/${role.id}`}
                                >
                                  <button
                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors cursor-pointer"
                                    title={
                                      t("managementRoles.actions.edit") ||
                                      "Edit"
                                    }
                                  >
                                    <Edit size={16} />
                                  </button>
                                </Link>
                                <button
                                  onClick={() => handleToggleActive(role)}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                    role.isActive
                                      ? "text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900"
                                      : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                                  }`}
                                  title={
                                    role.isActive
                                      ? t(
                                          "managementRoles.actions.deactivate"
                                        ) || "Deactivate"
                                      : t("managementRoles.actions.activate") ||
                                        "Activate"
                                  }
                                >
                                  {role.isActive ? (
                                    <ShieldOff size={16} />
                                  ) : (
                                    <Shield size={16} />
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDeleteClick(role)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                                  title={
                                    t("managementRoles.actions.delete") ||
                                    "Delete"
                                  }
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
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
                      {t("managementRoles.table.name") || "Name"}
                    </th>
                    <th
                      className={`text-center ${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.table.status") || "Status"}
                    </th>
                    <th
                      className={`text-center ${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.table.actions") || "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading.list ? (
                    <tr>
                      <td colSpan="3" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-2" : "ml-2"} text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("managementRoles.loading") || "Loading..."}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : roles.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className={`text-center p-8 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("managementRoles.noData") || "No roles found"}
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr
                        key={role.id}
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
                              {role.roleNameAr}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {role.roleNameEn}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="space-y-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                role.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {role.isActive
                                ? t("managementRoles.status.active") || "Active"
                                : t("managementRoles.status.inactive") ||
                                  "Inactive"}
                            </span>
                            <br />
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                role.isSystemRole
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              }`}
                            >
                              {role.isSystemRole
                                ? t("managementRoles.type.system") || "System"
                                : t("managementRoles.type.custom") || "Custom"}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex gap-1 justify-center">
                            <Link
                              to={`/admin-panel/management-roles/role/${role.id}`}
                            >
                              <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors cursor-pointer">
                                <Eye size={14} />
                              </button>
                            </Link>
                            {!role.isSystemRole && (
                              <>
                                <Link
                                  to={`/admin-panel/management-roles/edit/${role.id}`}
                                >
                                  <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors cursor-pointer">
                                    <Edit size={14} />
                                  </button>
                                </Link>
                                <button
                                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors cursor-pointer"
                                  onClick={() => handleDeleteClick(role)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
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
                      start:
                        (pagination.pageNumber - 1) * pagination.pageSize + 1,
                      end: Math.min(
                        pagination.pageNumber * pagination.pageSize,
                        pagination.totalCount
                      ),
                      total: pagination.totalCount,
                    }) ||
                      `Showing ${
                        (pagination.pageNumber - 1) * pagination.pageSize + 1
                      } to ${Math.min(
                        pagination.pageNumber * pagination.pageSize,
                        pagination.totalCount
                      )} of ${pagination.totalCount} results`}
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
                      {t("managementRoles.pagination.itemsPerPage") ||
                        "items per page"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.pageNumber - 1)}
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
                        pageNum === pagination.pageNumber
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
                    onClick={() => handlePageChange(pagination.pageNumber + 1)}
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

export default ManagementRoles;
