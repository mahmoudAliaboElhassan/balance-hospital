// store/slices/managementRolesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getManagementRoles,
  getManagementRoleById,
  createManagementRole,
  updateManagementRole,
  deleteManagementRole,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoleHistory,
  getRoleAssignmentHistory,
  getAvailableRoles,
  getRoleStatistics,
  getRecentChanges,
  activateRole,
  deactivateRole,
  cloneRole,
  getRoleAnalytics,
  getRolePermissions,
  checkCanDeleteRole,
  checkRoleNameUnique,
} from "../act/actManagementRole";

// Initial State
const initialState = {
  roles: [],
  currentRole: "",
  statistics: "",
  recentChanges: [],
  userHistory: [],
  assignmentHistory: [],
  availableRoles: [],
  analytics: "",
  permissions: [],
  canDeleteStatus: "",
  nameUniqueStatus: "",
  pagination: {
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  loading: {
    list: false,
    details: false,
    create: false,
    update: false,
    delete: false,
    assign: false,
    statistics: false,
    history: false,
    activate: false,
    clone: false,
    analytics: false,
    permissions: false,
    canDelete: false,
    nameUnique: false,
  },
  error: "",
  success: "",
  filters: {
    searchTerm: "",
    isActive: "",
    isSystemRole: "",
    hasUsers: "",
    permissionFilter: "",
    sortBy: "CreatedAt",
    sortDirection: "desc",
  },
};

// Slice
const managementRolesSlice = createSlice({
  name: "managementRolesSlice",
  initialState,
  reducers: {
    // Clear current role
    clearCurrentRole: (state) => {
      state.currentRole = "";
    },

    // Clear error
    clearError: (state) => {
      state.error = "";
    },

    // Clear success message
    clearSuccess: (state) => {
      state.success = "";
    },

    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Update pagination
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset state
    resetState: (state) => {
      return initialState;
    },

    // Clear delete status
    clearCanDeleteStatus: (state) => {
      state.canDeleteStatus = "";
    },

    // Clear name unique status
    clearNameUniqueStatus: (state) => {
      state.nameUniqueStatus = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Management Roles
      .addCase(getManagementRoles.pending, (state) => {
        state.loading.list = true;
        state.error = "";
      })
      .addCase(getManagementRoles.fulfilled, (state, action) => {
        state.loading.list = false;
        if (action.payload.success) {
          state.roles = action.payload.data?.items || [];
          state.pagination = {
            totalCount: action.payload.data?.totalCount || 0,
            pageNumber: action.payload.data?.pageNumber || 1,
            pageSize: action.payload.data?.pageSize || 10,
            totalPages: action.payload.data?.totalPages || 0,
            hasNextPage: action.payload.data?.hasNextPage || false,
            hasPreviousPage: action.payload.data?.hasPreviousPage || false,
          };
        }
      })
      .addCase(getManagementRoles.rejected, (state, action) => {
        state.loading.list = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch management roles";
      })

      // Get Management Role by ID
      .addCase(getManagementRoleById.pending, (state) => {
        state.loading.details = true;
        state.error = "";
      })
      .addCase(getManagementRoleById.fulfilled, (state, action) => {
        state.loading.details = false;
        if (action.payload.success) {
          state.currentRole = action.payload.data;
        }
      })
      .addCase(getManagementRoleById.rejected, (state, action) => {
        state.loading.details = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch management role";
      })

      // Create Management Role
      .addCase(createManagementRole.pending, (state) => {
        state.loading.create = true;
        state.error = "";
        state.success = "";
      })
      .addCase(createManagementRole.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload.success) {
        }
      })
      .addCase(createManagementRole.rejected, (state, action) => {
        state.loading.create = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to create management role";
      })

      // Update Management Role
      .addCase(updateManagementRole.pending, (state) => {
        state.loading.update = true;
        state.error = "";
        state.success = "";
      })
      .addCase(updateManagementRole.fulfilled, (state, action) => {
        state.loading.update = false;
        if (action.payload.success) {
          state.currentRole = action.payload.data;

          // Update role in list if it exists
          const index = state.roles.findIndex(
            (role) => role.id === action.payload.data?.id
          );
          if (index !== -1) {
            state.roles[index] = action.payload.data;
          }
        }
      })
      .addCase(updateManagementRole.rejected, (state, action) => {
        state.loading.update = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to update management role";
      })

      // Delete Management Role
      .addCase(deleteManagementRole.pending, (state) => {
        state.loading.delete = true;
        state.error = "";
        state.success = "";
      })
      .addCase(deleteManagementRole.fulfilled, (state, action) => {
        state.loading.delete = false;
        if (action.payload.success) {
          // Remove role from list
          state.roles = state.roles.filter(
            (role) => role.id !== action.payload.deletedId
          );
        }
      })
      .addCase(deleteManagementRole.rejected, (state, action) => {
        state.loading.delete = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to delete management role";
      })

      // Assign Role to User
      .addCase(assignRoleToUser.pending, (state) => {
        state.loading.assign = true;
        state.error = "";
        state.success = "";
      })
      .addCase(assignRoleToUser.fulfilled, (state, action) => {
        state.loading.assign = false;
        if (action.payload.success) {
        }
      })
      .addCase(assignRoleToUser.rejected, (state, action) => {
        state.loading.assign = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to assign role to user";
      })

      // Remove Role from User
      .addCase(removeRoleFromUser.pending, (state) => {
        state.loading.assign = true;
        state.error = "";
        state.success = "";
      })
      .addCase(removeRoleFromUser.fulfilled, (state, action) => {
        state.loading.assign = false;
        if (action.payload.success) {
        }
      })
      .addCase(removeRoleFromUser.rejected, (state, action) => {
        state.loading.assign = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to remove role from user";
      })

      // Get User Role History
      .addCase(getUserRoleHistory.pending, (state) => {
        state.loading.history = true;
        state.error = "";
      })
      .addCase(getUserRoleHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        if (action.payload.success) {
          state.userHistory = action.payload.data || [];
        }
      })
      .addCase(getUserRoleHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch user role history";
      })

      // Get Role Assignment History
      .addCase(getRoleAssignmentHistory.pending, (state) => {
        state.loading.history = true;
        state.error = "";
      })
      .addCase(getRoleAssignmentHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        if (action.payload.success) {
          state.assignmentHistory = action.payload.data || [];
        }
      })
      .addCase(getRoleAssignmentHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch role assignment history";
      })

      // Get Available Roles
      .addCase(getAvailableRoles.pending, (state) => {
        state.loading.list = true;
        state.error = "";
      })
      .addCase(getAvailableRoles.fulfilled, (state, action) => {
        state.loading.list = false;
        if (action.payload.success) {
          state.availableRoles = action.payload.data || [];
        }
      })
      .addCase(getAvailableRoles.rejected, (state, action) => {
        state.loading.list = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch available roles";
      })

      // Get Role Statistics
      .addCase(getRoleStatistics.pending, (state) => {
        state.loading.statistics = true;
        state.error = "";
      })
      .addCase(getRoleStatistics.fulfilled, (state, action) => {
        state.loading.statistics = false;
        if (action.payload.success) {
          state.statistics = action.payload.data;
        }
      })
      .addCase(getRoleStatistics.rejected, (state, action) => {
        state.loading.statistics = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch role statistics";
      })

      // Get Recent Changes
      .addCase(getRecentChanges.pending, (state) => {
        state.loading.list = true;
        state.error = "";
      })
      .addCase(getRecentChanges.fulfilled, (state, action) => {
        state.loading.list = false;
        if (action.payload.success) {
          state.recentChanges = action.payload.data || [];
        }
      })
      .addCase(getRecentChanges.rejected, (state, action) => {
        state.loading.list = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch recent changes";
      })

      // Activate Role
      .addCase(activateRole.pending, (state) => {
        state.loading.activate = true;
        state.error = "";
        state.success = "";
      })
      .addCase(activateRole.fulfilled, (state, action) => {
        state.loading.activate = false;
        if (action.payload.success) {
          // Update role status in list
          const index = state.roles.findIndex(
            (role) => role.id === action.payload.roleId
          );
          if (index !== -1) {
            state.roles[index].isActive = true;
          }

          // Update current role if it's the same
          if (state.currentRole?.id === action.payload.roleId) {
            state.currentRole.isActive = true;
          }
        }
      })
      .addCase(activateRole.rejected, (state, action) => {
        state.loading.activate = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to activate role";
      })

      // Deactivate Role
      .addCase(deactivateRole.pending, (state) => {
        state.loading.activate = true;
        state.error = "";
        state.success = "";
      })
      .addCase(deactivateRole.fulfilled, (state, action) => {
        state.loading.activate = false;
        if (action.payload.success) {
          // Update role status in list
          const index = state.roles.findIndex(
            (role) => role.id === action.payload.roleId
          );
          if (index !== -1) {
            state.roles[index].isActive = false;
          }

          // Update current role if it's the same
          if (state.currentRole?.id === action.payload.roleId) {
            state.currentRole.isActive = false;
          }
        }
      })
      .addCase(deactivateRole.rejected, (state, action) => {
        state.loading.activate = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to deactivate role";
      })

      // Clone Role
      .addCase(cloneRole.pending, (state) => {
        state.loading.clone = true;
        state.error = "";
        state.success = "";
      })
      .addCase(cloneRole.fulfilled, (state, action) => {
        state.loading.clone = false;
        if (action.payload.success) {
        }
      })
      .addCase(cloneRole.rejected, (state, action) => {
        state.loading.clone = false;
        state.error =
          action.payload?.messageEn || action.payload || "Failed to clone role";
      })

      // Get Role Analytics
      .addCase(getRoleAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.error = "";
      })
      .addCase(getRoleAnalytics.fulfilled, (state, action) => {
        state.loading.analytics = false;
        if (action.payload.success) {
          state.analytics = action.payload.data;
        }
      })
      .addCase(getRoleAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch role analytics";
      })

      // Get Role Permissions
      .addCase(getRolePermissions.pending, (state) => {
        state.loading.permissions = true;
        state.error = "";
      })
      .addCase(getRolePermissions.fulfilled, (state, action) => {
        state.loading.permissions = false;

        console.log("role permission", action.payload);

        if (action.payload.success) {
          state.permissions = action.payload.data || [];
        }
      })
      .addCase(getRolePermissions.rejected, (state, action) => {
        state.loading.permissions = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch role permissions";
      })

      // Check Can Delete Role
      .addCase(checkCanDeleteRole.pending, (state) => {
        state.loading.canDelete = true;
        state.error = "";
      })
      .addCase(checkCanDeleteRole.fulfilled, (state, action) => {
        state.loading.canDelete = false;
        if (action.payload.success !== undefined) {
          state.canDeleteStatus = {
            roleId: action.payload.roleId,
            canDelete: action.payload.canDelete,
          };
        }
      })
      .addCase(checkCanDeleteRole.rejected, (state, action) => {
        state.loading.canDelete = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to check delete status";
      })

      // Check Role Name Uniqueness
      .addCase(checkRoleNameUnique.pending, (state) => {
        state.loading.nameUnique = true;
        state.error = "";
      })
      .addCase(checkRoleNameUnique.fulfilled, (state, action) => {
        state.loading.nameUnique = false;
        if (action.payload.success !== undefined) {
          state.nameUniqueStatus = action.payload.data;
        }
      })
      .addCase(checkRoleNameUnique.rejected, (state, action) => {
        state.loading.nameUnique = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to check name uniqueness";
      });
  },
});

// Export actions
export const {
  clearCurrentRole,
  clearError,
  clearSuccess,
  updateFilters,
  resetFilters,
  updatePagination,
  resetState,
  clearCanDeleteStatus,
  clearNameUniqueStatus,
} = managementRolesSlice.actions;

// Selectors
export const selectManagementRoles = (state) => state.managementRoles.roles;
export const selectCurrentRole = (state) => state.managementRoles.currentRole;
export const selectRoleStatistics = (state) => state.managementRoles.statistics;
export const selectRecentChanges = (state) =>
  state.managementRoles.recentChanges;
export const selectUserHistory = (state) => state.managementRoles.userHistory;
export const selectAssignmentHistory = (state) =>
  state.managementRoles.assignmentHistory;
export const selectAvailableRoles = (state) =>
  state.managementRoles.availableRoles;
export const selectRoleAnalytics = (state) => state.managementRoles.analytics;
export const selectRolePermissions = (state) =>
  state.managementRoles.permissions;
export const selectCanDeleteStatus = (state) =>
  state.managementRoles.canDeleteStatus;
export const selectNameUniqueStatus = (state) =>
  state.managementRoles.nameUniqueStatus;
export const selectLoading = (state) => state.managementRoles.loading;
export const selectError = (state) => state.managementRoles.error;
export const selectSuccess = (state) => state.managementRoles.success;
export const selectFilters = (state) => state.managementRoles.filters;
export const selectPagination = (state) => state.managementRoles.pagination;

export default managementRolesSlice.reducer;
