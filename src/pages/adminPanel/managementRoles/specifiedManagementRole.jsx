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
} from "lucide-react";

// Import actions
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
} from "../../../state/act/actManagementRole";

// Import slice actions and selectors
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
} from "../../../state/slices/managementRole.js";

import DeleteRoleModal from "../../../components/DeleteRoleModal";
import LoadingGetData from "../../../components/LoadingGetData.jsx";
// import RoleFormModal from "../../../components/RoleFormModal";

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

  console.log("assignmentHistory", assignmentHistory);

  const { mymode } = useSelector((state) => state.mode);

  // Local state
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });

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

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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
    if (!currentRole) return;

    // Check if role can be deleted
    const result = await dispatch(checkCanDeleteRole(currentRole.id));
    if (result.payload?.canDelete || result.payload?.success) {
      setToDelete({
        id: currentRole.id,
        name:
          language === "en" ? currentRole.roleNameEn : currentRole.roleNameAr,
      });
      setShowDeleteModal(true);
    } else {
      toast.error(
        t("managementRoles.delete.cannotDelete") ||
          "This role cannot be deleted as it is assigned to users or is a system role"
      );
    }
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
    return <LoadingGetData />;
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

      {/* <RoleFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        mode="edit"
        roleData={currentRole}
      /> */}

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
                  {t("managementRoles.users") || "Users"}
                </span>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
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

              {/* Assignment vs Removal Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Recent Activity Breakdown */}
                <div
                  className={`p-6 rounded-lg shadow ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managementRoles.analytics.recentActivity") ||
                      "Recent Activity"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("managementRoles.analytics.assignments") ||
                          "Assignments"}
                      </span>
                      <span className="text-lg font-semibold text-green-600">
                        +{analytics.RecentAssignments || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("managementRoles.analytics.removals") || "Removals"}
                      </span>
                      <span className="text-lg font-semibold text-red-600">
                        -{analytics.RecentRemovals || 0}
                      </span>
                    </div>
                    <div
                      className={`pt-2 border-t ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm font-semibold ${
                            isDark ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {t("managementRoles.analytics.netChange") ||
                            "Net Change"}
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            analytics.NetChange > 0
                              ? "text-green-600"
                              : analytics.NetChange < 0
                              ? "text-red-600"
                              : isDark
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          {analytics.NetChange > 0 ? "+" : ""}
                          {analytics.NetChange || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Assigners */}
                {analytics.TopAssigners &&
                  analytics.TopAssigners.length > 0 && (
                    <div
                      className={`p-6 rounded-lg shadow ${
                        isDark ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-4 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {t("managementRoles.analytics.topAssigners") ||
                          "Top Assigners"}
                      </h3>
                      <div className="space-y-3">
                        {analytics.TopAssigners.slice(0, 3).map(
                          (assigner, index) => (
                            <div
                              key={assigner.userId}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {assigner.userName}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {t(
                                    "managementRoles.analytics.lastAssigned"
                                  ) || "Last assigned"}
                                  : {formatDate(assigner.lastAssignmentDate)}
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`text-lg font-semibold ${
                                    isDark ? "text-blue-400" : "text-blue-600"
                                  }`}
                                >
                                  {assigner.assignmentCount}
                                </span>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {t(
                                    "managementRoles.analytics.assignments"
                                  ).toLowerCase() || "assignments"}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Change Type Breakdown */}
              {analytics.ChangeTypeBreakdown &&
                Object.keys(analytics.ChangeTypeBreakdown).length > 0 && (
                  <div
                    className={`p-6 rounded-lg shadow mb-6 ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("managementRoles.analytics.changeTypeBreakdown") ||
                        "Change Type Breakdown"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(analytics.ChangeTypeBreakdown).map(
                        ([changeType, count]) => (
                          <div key={changeType} className="text-center">
                            <div
                              className={`p-4 rounded-lg ${
                                changeType === "ASSIGNED"
                                  ? "bg-green-100 dark:bg-green-900/20"
                                  : changeType === "REMOVED"
                                  ? "bg-red-100 dark:bg-red-900/20"
                                  : "bg-blue-100 dark:bg-blue-900/20"
                              }`}
                            >
                              <p
                                className={`text-2xl font-bold ${
                                  changeType === "ASSIGNED"
                                    ? "text-green-600"
                                    : changeType === "REMOVED"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {count}
                              </p>
                              <p
                                className={`text-sm font-medium mt-1 ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {t(
                                  `managementRoles.analytics.changeTypes.${changeType}`
                                ) || changeType.toLowerCase().replace("_", " ")}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Monthly Trend */}
              {analytics.MonthlyTrend && analytics.MonthlyTrend.length > 0 && (
                <div
                  className={`p-6 rounded-lg shadow mb-6 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("managementRoles.analytics.monthlyTrend") ||
                      "Monthly Trend"}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th
                            className={`px-4 py-2 text-left text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("managementRoles.analytics.period") || "Period"}
                          </th>
                          <th
                            className={`px-4 py-2 text-left text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("managementRoles.analytics.assignments") ||
                              "Assignments"}
                          </th>
                          <th
                            className={`px-4 py-2 text-left text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("managementRoles.analytics.removals") ||
                              "Removals"}
                          </th>
                          <th
                            className={`px-4 py-2 text-left text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("managementRoles.analytics.netChange") ||
                              "Net Change"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.MonthlyTrend.map((trend, index) => {
                          const netChange =
                            (trend.assignments || 0) - (trend.removals || 0);
                          return (
                            <tr
                              key={index}
                              className={`border-b ${
                                isDark ? "border-gray-700" : "border-gray-200"
                              }`}
                            >
                              <td
                                className={`px-4 py-2 text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-900"
                                }`}
                              >
                                {trend.period ||
                                  trend.month ||
                                  `Period ${index + 1}`}
                              </td>
                              <td
                                className={`px-4 py-2 text-sm font-semibold text-green-600`}
                              >
                                +{trend.assignments || 0}
                              </td>
                              <td
                                className={`px-4 py-2 text-sm font-semibold text-red-600`}
                              >
                                -{trend.removals || 0}
                              </td>
                              <td
                                className={`px-4 py-2 text-sm font-semibold ${
                                  netChange > 0
                                    ? "text-green-600"
                                    : netChange < 0
                                    ? "text-red-600"
                                    : isDark
                                    ? "text-gray-300"
                                    : "text-gray-900"
                                }`}
                              >
                                {netChange > 0 ? "+" : ""}
                                {netChange}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Tabs */}
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
                {/* Basic Information */}
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

                {/* Role Details */}
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
