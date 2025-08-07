// pages/ManagementRoles/SpecifiedManagementRole.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../styles/general.css";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Shield,
  ShieldOff,
  Users,
  Calendar,
  User,
  Settings,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  History,
  AlertTriangle,
  Search,
  Phone,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import actions - ADD getRoleUsers to the imports
import {
  getManagementRoleById,
  getRolePermissions,
  getRoleAnalytics,
  getRoleAssignmentHistory,
  deleteManagementRole,
  activateRole,
  deactivateRole,
  cloneRole,
  checkCanDeleteRole,
  getRoleUsers, // ADD THIS IMPORT
  removeRoleFromUser, // ADD THIS IMPORT
} from "../../../state/act/actManagementRole";

// Import slice actions and selectors - ADD new selectors
import {
  clearError,
  clearSuccess,
  selectCurrentRole,
  selectLoading,
  selectError,
  selectSuccess,
  selectRoleAnalytics,
  selectRolePermissions,
  selectAssignmentHistory,
  selectCanDeleteStatus,
  selectRoleUsers, // ADD THIS
  selectRoleUsersPagination, // ADD THIS
} from "../../../state/slices/managementRole.js";

import DeleteRoleModal from "../../../components/DeleteRoleModal";
import LoadingGetData from "../../../components/LoadingGetData.jsx";
import DeleteUserFromRoleModal from "../../../components/DeleteUserFromRoleModal"; // ADD THIS IMPORT

function SpecifiedManagementRole() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Selectors
  const currentRole = useSelector(selectCurrentRole);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const analytics = useSelector(selectRoleAnalytics);
  const permissions = useSelector(selectRolePermissions);
  const assignmentHistory = useSelector(selectAssignmentHistory);
  const canDeleteStatus = useSelector(selectCanDeleteStatus);
  const roleUsers = useSelector(selectRoleUsers); // ADD THIS
  const roleUsersPagination = useSelector(selectRoleUsersPagination); // ADD THIS

  const { mymode } = useSelector((state) => state.mode);

  // Local state
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });

  // ADD: Delete user modal state
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // ADD: Users tab state
  const [usersSearchTerm, setUsersSearchTerm] = useState("");
  const [usersFilters, setUsersFilters] = useState({
    isActive: "",
    sortBy: 0, // NameArabic = 0
    sortDirection: 0, // Asc = 0
    page: 1,
    pageSize: 10,
  });

  // Theme and language
  const isDark = mymode === "dark";
  const language = i18n.language;
  const isRTL = language === "ar";

  // Load role data on component mount
  useEffect(() => {
    if (id) {
      dispatch(getManagementRoleById(id));
      dispatch(getRolePermissions(id));
      dispatch(getRoleAnalytics(id));
      dispatch(getRoleAssignmentHistory(id));
    }
  }, [dispatch, id]);

  // ADD: Load users when users tab is active
  useEffect(() => {
    if (id && activeTab === "users") {
      dispatch(
        getRoleUsers({
          id,
          params: {
            search: usersSearchTerm,
            ...usersFilters,
          },
        })
      );
    }
  }, [dispatch, id, activeTab, usersSearchTerm, usersFilters]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());

      // Refresh role data after successful operations
      if (
        success.includes("updated") ||
        success.includes("activated") ||
        success.includes("deactivated") ||
        success.includes("cloned")
      ) {
        dispatch(getManagementRoleById(id));
      }

      // Navigate back to list after deletion
      if (success.includes("deleted")) {
        navigate("/admin-panel/management-roles");
      }
    }
  }, [success, dispatch, id, navigate]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(clearError());
  //   }
  // }, [error, dispatch]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle delete confirmation

  const handleDeleteClick = async () => {
    // Check if role can be deleted

    toast.info(t("managementRoles.delete.checking"));

    dispatch(checkCanDeleteRole(currentRole.id))
      .unwrap()
      .then((data) => {
        const canDelete = data.canDelete.data;
        if (canDelete.canDelete) {
          setToDelete({
            id: currentRole.id,
            name:
              language === "en"
                ? currentRole.roleNameEn
                : currentRole.roleNameAr,
          });
          setShowDeleteModal(true);
        } else {
          toast.error(canDelete.reason);
        }
      });
  };

  // Handle activate/deactivate
  const handleToggleActive = async () => {
    if (!currentRole) return;

    if (currentRole.isActive) {
      await dispatch(deactivateRole(currentRole.id));
    } else {
      await dispatch(activateRole(currentRole.id));
    }
  };

  // Handle clone role
  const handleClone = async () => {
    if (!currentRole) return;
    await dispatch(
      cloneRole({
        id: currentRole.id,
        newRoleNameEn: `${currentRole.roleNameEn} (Copy)`,
        newRoleNameAr: `${currentRole.roleNameAr} (نسخة)`,
      })
    );
  };

  // ADD: Users search and pagination handlers
  const handleUsersSearch = (searchTerm) => {
    setUsersSearchTerm(searchTerm);
    setUsersFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleUsersPageChange = (newPage) => {
    setUsersFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleUsersSortChange = (sortBy, sortDirection) => {
    setUsersFilters((prev) => ({
      ...prev,
      sortBy,
      sortDirection,
      page: 1,
    }));
  };

  // ADD: Handle delete user from role
  const handleDeleteUserFromRole = (user) => {
    setUserToDelete(user);
    setShowDeleteUserModal(true);
  };

  // ADD: Handle successful user removal (refresh users list)
  const handleUserRemovalSuccess = () => {
    // Refresh users list
    dispatch(
      getRoleUsers({
        id,
        params: {
          search: usersSearchTerm,
          ...usersFilters,
        },
      })
    );
    // Refresh role data to update user count
    dispatch(getManagementRoleById(id));
  };

  // Permission groups for display
  const permissionGroups = [
    {
      key: "core",
      title: t("managementRoles.permissions.core") || "Core Management",
      icon: <Shield size={16} />,
      permissions: [
        {
          key: "userCanManageCategory",
          label:
            t("managementRoles.permissions.manageCategory") ||
            "Manage Categories",
        },
        {
          key: "userCanManageRole",
          label: t("managementRoles.permissions.manageRole") || "Manage Roles",
        },
        {
          key: "userCanManageUsers",
          label: t("managementRoles.permissions.manageUsers") || "Manage Users",
        },
        {
          key: "userCanManageRostors",
          label:
            t("managementRoles.permissions.manageRostors") || "Manage Rosters",
        },
      ],
    },
    {
      key: "configuration",
      title: t("managementRoles.permissions.configuration") || "Configuration",
      icon: <Settings size={16} />,
      permissions: [
        {
          key: "userCanContractingType",
          label:
            t("managementRoles.permissions.contractingType") ||
            "Contracting Types",
        },
        {
          key: "userCanShiftHoursType",
          label:
            t("managementRoles.permissions.shiftHoursType") ||
            "Shift Hours Types",
        },
        {
          key: "userCanScientificDegree",
          label:
            t("managementRoles.permissions.scientificDegree") ||
            "Scientific Degrees",
        },
      ],
    },
    {
      key: "departments",
      title:
        t("managementRoles.permissions.departments") || "Department Management",
      icon: <Users size={16} />,
      permissions: [
        {
          key: "userCanManageDepartments",
          label:
            t("managementRoles.permissions.manageDepartments") ||
            "Manage Departments",
        },
        {
          key: "userCanManageSubDepartments",
          label:
            t("managementRoles.permissions.manageSubDepartments") ||
            "Manage Sub-Departments",
        },
      ],
    },
    {
      key: "operations",
      title: t("managementRoles.permissions.operations") || "Operations",
      icon: <Activity size={16} />,
      permissions: [
        {
          key: "userCanViewReports",
          label: t("managementRoles.permissions.viewReports") || "View Reports",
        },
        {
          key: "userCanManageSchedules",
          label:
            t("managementRoles.permissions.manageSchedules") ||
            "Manage Schedules",
        },
        {
          key: "userCanManageRequests",
          label:
            t("managementRoles.permissions.manageRequests") ||
            "Manage Requests",
        },
      ],
    },
  ];

  if (loading.details) {
    return <LoadingGetData text={t("gettingData.roleData")} />;
  }

  if (!currentRole) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <AlertTriangle
            className={`mx-auto h-12 w-12 mb-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <h3
            className={`text-lg font-medium mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("managementRoles.notFound") || "Role Not Found"}
          </h3>
          <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {t("managementRoles.notFoundDescription") ||
              "The requested role could not be found."}
          </p>
          <Link
            to="/admin-panel/management-roles"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className={isRTL ? "ml-2" : "mr-2"} />
            {t("managementRoles.backToList") || "Back to Roles"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DeleteRoleModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        info={toDelete}
        role={currentRole}
      />

      {/* ADD: Delete User From Role Modal */}
      <DeleteUserFromRoleModal
        isOpen={showDeleteUserModal}
        onClose={() => {
          setShowDeleteUserModal(false);
          setUserToDelete(null);
        }}
        user={userToDelete}
        role={currentRole}
        onSuccess={handleUserRemovalSuccess}
      />

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link
                  to="/admin-panel/management-roles"
                  className={`p-2 rounded-lg border transition-colors ${
                    isDark
                      ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1
                    className={`text-2xl sm:text-3xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {language === "en"
                      ? currentRole.roleNameEn
                      : currentRole.roleNameAr}
                  </h1>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                {!currentRole.isSystemRole && (
                  <>
                    <Link to={`/admin-panel/management-roles/edit/${id}`}>
                      <button
                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center"
                        disabled={loading.update}
                      >
                        <Edit size={16} />
                        <span className="hidden sm:inline">
                          {t("managementRoles.actions.edit") || "Edit"}
                        </span>
                      </button>
                    </Link>
                    <button
                      onClick={handleToggleActive}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center ${
                        currentRole.isActive
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      disabled={loading.activate}
                    >
                      {currentRole.isActive ? (
                        <ShieldOff size={16} />
                      ) : (
                        <Shield size={16} />
                      )}
                      <span className="hidden sm:inline">
                        {currentRole.isActive
                          ? t("managementRoles.actions.deactivate") ||
                            "Deactivate"
                          : t("managementRoles.actions.activate") || "Activate"}
                      </span>
                    </button>

                    <button
                      onClick={handleDeleteClick}
                      className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center"
                      disabled={loading.delete}
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">
                        {t("managementRoles.actions.delete") || "Delete"}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentRole.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {currentRole.isActive
                  ? t("managementRoles.status.active") || "Active"
                  : t("managementRoles.status.inactive") || "Inactive"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentRole.isSystemRole
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                {currentRole.isSystemRole
                  ? t("managementRoles.type.system") || "System Role"
                  : t("managementRoles.type.custom") || "Custom Role"}
              </span>
              {currentRole.usersCount > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Users size={14} className="inline mr-1" />
                  {currentRole.usersCount}{" "}
                  {t("managementRoles.users.users") || "Users"}
                </span>
              )}
            </div>
          </div>

          {/* Statistics Cards - keeping existing code */}
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Active Users Count */}
                <div
                  className={`p-4 rounded-lg shadow ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("managementRoles.analytics.activeUsers") ||
                          "Active Users"}
                      </p>
                      <p
                        className={`text-2xl font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {analytics.ActiveUsersCount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Assignments */}
                <div
                  className={`p-4 rounded-lg shadow ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("managementRoles.analytics.recentAssignments") ||
                          "Recent Assignments"}
                      </p>
                      <p
                        className={`text-2xl font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {analytics.RecentAssignments || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage Percentage */}
                <div
                  className={`p-4 rounded-lg shadow ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("managementRoles.analytics.usagePercentage") ||
                          "Usage Percentage"}
                      </p>
                      <p
                        className={`text-2xl font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {analytics.UsagePercentage
                          ? `${analytics.UsagePercentage.toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Net Change */}
                <div
                  className={`p-4 rounded-lg shadow ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("managementRoles.analytics.netChange") ||
                          "Net Change"}
                      </p>
                      <p
                        className={`text-2xl font-semibold ${
                          analytics.NetChange > 0
                            ? "text-green-600"
                            : analytics.NetChange < 0
                            ? "text-red-600"
                            : isDark
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {analytics.NetChange > 0 ? "+" : ""}
                        {analytics.NetChange || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tabs - ADD USERS TAB */}
          <div
            className={`border-b mb-6 ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <nav className="flex space-x-8">
              {[
                {
                  key: "overview",
                  label: t("managementRoles.tabs.overview") || "Overview",
                  icon: <Settings size={16} />,
                },
                {
                  key: "permissions",
                  label: t("managementRoles.tabs.permissions") || "Permissions",
                  icon: <Shield size={16} />,
                },
                {
                  key: "users", // ADD THIS TAB
                  label: t("managementRoles.tabs.users") || "Assigned Users",
                  icon: <Users size={16} />,
                },
                {
                  key: "history",
                  label:
                    t("managementRoles.tabs.history") || "Assignment History",
                  icon: <History size={16} />,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : `border-transparent hover:border-gray-300 ${
                          isDark
                            ? "text-gray-400 hover:text-gray-300"
                            : "text-gray-500 hover:text-gray-700"
                        }`
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === "overview" && (
              <>
                {/* Basic Information - keeping existing code */}
                <div className="lg:col-span-2">
                  <div
                    className={`rounded-lg shadow border ${
                      isDark
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="p-6">
                      <h3
                        className={`text-lg font-semibold mb-4 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {t("managementRoles.overview.basicInfo") ||
                          "Basic Information"}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("managementRoles.form.roleNameAr") ||
                              "Arabic Name"}
                          </label>
                          <p
                            className={`mt-1 text-sm ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {currentRole.roleNameAr}
                          </p>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("managementRoles.form.roleNameEn") ||
                              "English Name"}
                          </label>
                          <p
                            className={`mt-1 text-sm ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {currentRole.roleNameEn}
                          </p>
                        </div>
                        {currentRole.description && (
                          <div>
                            <label
                              className={`block text-sm font-medium ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {t("managementRoles.form.description") ||
                                "Description"}
                            </label>
                            <p
                              className={`mt-1 text-sm ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {currentRole.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Details - keeping existing code */}
                <div>
                  <div
                    className={`rounded-lg shadow border ${
                      isDark
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="p-6">
                      <h3
                        className={`text-lg font-semibold mb-4 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {t("managementRoles.overview.details") ||
                          "Role Details"}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("managementRoles.table.createdAt") || "Created"}
                          </span>
                          <span
                            className={`text-sm ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatDate(currentRole.createdAt)}
                          </span>
                        </div>
                        {currentRole.updatedAt && (
                          <div className="flex justify-between">
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("managementRoles.table.updatedAt") ||
                                "Updated"}
                            </span>
                            <span
                              className={`text-sm ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {formatDate(currentRole.updatedAt)}
                            </span>
                          </div>
                        )}
                        {currentRole.createdByName && (
                          <div className="flex justify-between">
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("managementRoles.table.createdBy") ||
                                "Created By"}
                            </span>
                            <span
                              className={`text-sm ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {currentRole.createdByName}
                            </span>
                          </div>
                        )}
                        {currentRole.updatedByName && (
                          <div className="flex justify-between">
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("managementRoles.table.updatedBy") ||
                                "Updated By"}
                            </span>
                            <span
                              className={`text-sm ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {currentRole.updatedByName}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("managementRoles.table.users") ||
                              "Assigned Users"}
                          </span>
                          <span
                            className={`text-sm ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {currentRole.usersCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "permissions" && (
              <div className="lg:col-span-3">
                <div
                  className={`rounded-lg shadow border ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-6">
                    <h3
                      className={`text-lg font-semibold mb-6 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.tabs.permissions") ||
                        "Role Permissions"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {permissionGroups.map((group) => (
                        <div
                          key={group.key}
                          className={`border rounded-lg p-4 ${
                            isDark
                              ? "border-gray-600 bg-gray-700/50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            {group.icon}
                            <h4
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {group.title}
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {group.permissions.map((permission) => (
                              <div
                                key={permission.key}
                                className="flex items-center justify-between"
                              >
                                <span
                                  className={`text-sm ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {permission.label}
                                </span>
                                {currentRole[permission.key] ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADD USERS TAB CONTENT - Use the updated users tab code from artifact above */}
            {activeTab === "users" && (
              <div className="lg:col-span-3">
                <div
                  className={`rounded-lg shadow border ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <h3
                        className={`text-lg font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {t("managementRoles.tabs.users") || "Assigned Users"}
                        {roleUsers.length > 0 && (
                          <span
                            className={`ml-2 text-sm font-normal ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            ({roleUsersPagination.totalCount}{" "}
                            {t("managementRoles.users.users") || "users"})
                          </span>
                        )}
                      </h3>

                      {/* Search and Filters */}
                      <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder={
                              t("managementRoles.search.users") ||
                              "Search users..."
                            }
                            value={usersSearchTerm}
                            onChange={(e) => handleUsersSearch(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full rounded-lg border transition-colors ${
                              isDark
                                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500"
                            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                          />
                        </div>

                        <select
                          value={usersFilters.sortBy}
                          onChange={(e) =>
                            handleUsersSortChange(
                              parseInt(e.target.value),
                              usersFilters.sortDirection
                            )
                          }
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            isDark
                              ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                              : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
                          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        >
                          <option value={0}>
                            {t("managementRoles.filters.sortBy.nameArabic") ||
                              "Arabic Name"}
                          </option>
                          <option value={1}>
                            {t("managementRoles.filters.sortBy.nameEnglish") ||
                              "English Name"}
                          </option>
                          <option value={2}>
                            {t("managementRoles.filters.sortBy.mobile") ||
                              "Mobile"}
                          </option>
                          <option value={3}>
                            {t(
                              "managementRoles.filters.sortBy.primaryCategory"
                            ) || "Primary Category"}
                          </option>
                        </select>

                        <select
                          value={usersFilters.sortDirection}
                          onChange={(e) =>
                            handleUsersSortChange(
                              usersFilters.sortBy,
                              parseInt(e.target.value)
                            )
                          }
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            isDark
                              ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                              : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
                          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        >
                          <option value={0}>
                            {t("managementRoles.filters.ascending") ||
                              "Ascending"}
                          </option>
                          <option value={1}>
                            {t("managementRoles.filters.descending") ||
                              "Descending"}
                          </option>
                        </select>
                      </div>
                    </div>

                    {loading.roleUsers ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p
                          className={`mt-2 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {t("managementRoles.loadingUsers") ||
                            "Loading users..."}
                        </p>
                      </div>
                    ) : roleUsers && roleUsers.length > 0 ? (
                      <>
                        {/* Users Table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead
                              className={isDark ? "bg-gray-700" : "bg-gray-50"}
                            >
                              <tr>
                                <th
                                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    isDark ? "text-gray-300" : "text-gray-500"
                                  }`}
                                >
                                  {t("managementRoles.table.users") || "User"}
                                </th>
                                <th
                                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    isDark ? "text-gray-300" : "text-gray-500"
                                  }`}
                                >
                                  {t("managementRoles.table.mobile") ||
                                    "Mobile"}
                                </th>
                                <th
                                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    isDark ? "text-gray-300" : "text-gray-500"
                                  }`}
                                >
                                  {t("managementRoles.table.category") ||
                                    "Primary Category"}
                                </th>
                                <th
                                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    isDark ? "text-gray-300" : "text-gray-500"
                                  }`}
                                >
                                  {t("managementRoles.table.role") || "Role"}
                                </th>
                                <th
                                  className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                                    isDark ? "text-gray-300" : "text-gray-500"
                                  }`}
                                >
                                  {t("managementRoles.table.actions") ||
                                    "Actions"}
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              className={`divide-y ${
                                isDark
                                  ? "bg-gray-800 divide-gray-700"
                                  : "bg-white divide-gray-200"
                              }`}
                            >
                              {roleUsers.map((user) => (
                                <tr
                                  key={user.id}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div
                                        className={`flex-shrink-0 h-10 w-10 ${
                                          isDark ? "bg-gray-600" : "bg-gray-200"
                                        } rounded-full flex items-center justify-center`}
                                      >
                                        <User className="h-5 w-5 text-gray-500" />
                                      </div>
                                      <div className="ml-4">
                                        <div
                                          className={`text-sm font-medium ${
                                            isDark
                                              ? "text-white"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {language === "ar"
                                            ? user.nameArabic
                                            : user.nameEnglish}
                                        </div>
                                        <div
                                          className={`text-sm ${
                                            isDark
                                              ? "text-gray-400"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          ID: {user.id}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                      <span
                                        className={`text-sm ${
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {user.mobile}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`text-sm ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {language === "ar"
                                        ? user.primaryCategoryNameAr
                                        : user.primaryCategoryNameEn}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                      {user.role}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex gap-2 justify-center">
                                      {/* <Link
                                        to={`/admin-panel/management-roles/edit-assign-user-to-role/${user.id}`}
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
                                      </Link> */}
                                      <button
                                        onClick={() =>
                                          handleDeleteUserFromRole(user)
                                        }
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                                        title={
                                          t(
                                            "managementRoles.users.removeUser"
                                          ) || "Remove User from Role"
                                        }
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

                        {/* Pagination - keeping existing code */}
                        {roleUsersPagination.totalPages > 1 && (
                          <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex-1 flex justify-between sm:hidden">
                              <button
                                onClick={() =>
                                  handleUsersPageChange(usersFilters.page - 1)
                                }
                                disabled={!roleUsersPagination.hasPreviousPage}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                  !roleUsersPagination.hasPreviousPage
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                }`}
                              >
                                {t("managementRoles.pagination.previous") ||
                                  "Previous"}
                              </button>
                              <button
                                onClick={() =>
                                  handleUsersPageChange(usersFilters.page + 1)
                                }
                                disabled={!roleUsersPagination.hasNextPage}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                  !roleUsersPagination.hasNextPage
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                }`}
                              >
                                {t("managementRoles.pagination.next") || "Next"}
                              </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                              <div>
                                <p
                                  className={`text-sm ${
                                    isDark ? "text-gray-400" : "text-gray-700"
                                  }`}
                                >
                                  {t("managementRoles.pagination.showing")}{" "}
                                  <span className="font-medium">
                                    {roleUsersPagination.startIndex ||
                                      (usersFilters.page - 1) *
                                        usersFilters.pageSize +
                                        1}
                                  </span>{" "}
                                  {t("managementRoles.pagination.to")}{" "}
                                  <span className="font-medium">
                                    {roleUsersPagination.endIndex ||
                                      Math.min(
                                        usersFilters.page *
                                          usersFilters.pageSize,
                                        roleUsersPagination.totalCount
                                      )}
                                  </span>{" "}
                                  {t("managementRoles.pagination.of")}{" "}
                                  <span className="font-medium">
                                    {roleUsersPagination.totalCount}
                                  </span>{" "}
                                  {t("managementRoles.pagination.results")}
                                </p>
                              </div>
                              <div>
                                <nav
                                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                  aria-label="Pagination"
                                >
                                  <button
                                    onClick={() =>
                                      handleUsersPageChange(
                                        usersFilters.page - 1
                                      )
                                    }
                                    disabled={
                                      !roleUsersPagination.hasPreviousPage
                                    }
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                      !roleUsersPagination.hasPreviousPage
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-500 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    }`}
                                  >
                                    <ChevronLeft className="h-5 w-5" />
                                  </button>

                                  {Array.from(
                                    {
                                      length: Math.min(
                                        5,
                                        roleUsersPagination.totalPages
                                      ),
                                    },
                                    (_, i) => {
                                      const pageNum = usersFilters.page - 2 + i;
                                      if (
                                        pageNum < 1 ||
                                        pageNum > roleUsersPagination.totalPages
                                      )
                                        return null;
                                      return (
                                        <button
                                          key={pageNum}
                                          onClick={() =>
                                            handleUsersPageChange(pageNum)
                                          }
                                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            pageNum === usersFilters.page
                                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                          }`}
                                        >
                                          {pageNum}
                                        </button>
                                      );
                                    }
                                  )}

                                  <button
                                    onClick={() =>
                                      handleUsersPageChange(
                                        usersFilters.page + 1
                                      )
                                    }
                                    disabled={!roleUsersPagination.hasNextPage}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                      !roleUsersPagination.hasNextPage
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-500 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    }`}
                                  >
                                    <ChevronRight className="h-5 w-5" />
                                  </button>
                                </nav>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <UserCheck
                          className={`mx-auto h-12 w-12 mb-4 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <p
                          className={`text-lg font-medium mb-2 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("managementRoles.users.noUsers") ||
                            "No Users Assigned"}
                        </p>
                        <p
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("managementRoles.users.noUsersDescription") ||
                            "This role has not been assigned to any users yet."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="lg:col-span-3">
                <div
                  className={`rounded-lg shadow border ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-6">
                    <h3
                      className={`text-lg font-semibold mb-6 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.tabs.history") ||
                        "Assignment History"}
                    </h3>
                    {loading.history ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p
                          className={`mt-2 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {t("managementRoles.loadingHistory") ||
                            "Loading history..."}
                        </p>
                      </div>
                    ) : assignmentHistory && assignmentHistory.length > 0 ? (
                      <div className="space-y-4">
                        {assignmentHistory.map((entry, index) => (
                          <div
                            key={index}
                            className={`border-l-4 ${
                              entry.changeType === "ASSIGNED"
                                ? "border-green-500"
                                : entry.changeType === "REMOVED"
                                ? "border-red-500"
                                : "border-blue-500"
                            } pl-4 py-2 ${
                              isDark ? "bg-gray-700/50" : "bg-blue-50"
                            } rounded`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p
                                  className={`font-medium ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {entry.changeType === "ASSIGNED"
                                    ? t("managementRoles.history.assigned", {
                                        roleName: entry.newRoleName,
                                      })
                                    : entry.changeType === "REMOVED"
                                    ? t("managementRoles.history.removed", {
                                        roleName: entry.oldRoleName,
                                      })
                                    : entry.changeType === "UPDATED"
                                    ? t("managementRoles.history.modified", {
                                        oldRoleName: entry.oldRoleName,
                                        newRoleName: entry.newRoleName,
                                      })
                                    : entry.changeType}
                                </p>
                                {entry.changeReason && (
                                  <p
                                    className={`text-sm ${
                                      isDark ? "text-gray-300" : "text-gray-600"
                                    }`}
                                  >
                                    {t("managementRoles.history.reason") ||
                                      "Reason"}
                                    : {entry.changeReason}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {formatDate(entry.changedAt)}
                                </p>
                                {entry.changedByName && (
                                  <p
                                    className={`text-xs ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {t("managementRoles.history.by") || "by"}{" "}
                                    {entry.changedByName}
                                  </p>
                                )}
                              </div>
                            </div>
                            {entry.notes && (
                              <div
                                className={`text-sm mt-2 p-2 rounded ${
                                  isDark
                                    ? "bg-gray-600/50 text-gray-300"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <span className="font-medium">
                                  {t("managementRoles.history.notes") ||
                                    "Notes"}
                                  :
                                </span>{" "}
                                {entry.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History
                          className={`mx-auto h-12 w-12 mb-4 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <p
                          className={`text-lg font-medium mb-2 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("managementRoles.history.noHistory") ||
                            "No Assignment History"}
                        </p>
                        <p
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("managementRoles.history.noHistoryDescription") ||
                            "This role has not been assigned to any users yet."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecifiedManagementRole;
