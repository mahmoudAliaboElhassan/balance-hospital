import { createSlice } from "@reduxjs/toolkit";
import {
  getManagementRoles,
  getManagementRoleUsers,
  getRoleStatistics,
  getRecentChanges,
  getManagementRoleHistory,
  getRolePermissions,
  getUserAssignmentHistory,
} from "../act/actManagementRole";
import "../../translation/i18n";
import i18next from "i18next";

// Initial State
const initialState = {
  roles: [],
  roleUsers: [], // Add this
  permissions: [],

  userAssignmentHistory: [],
  userAssignmentHistoryPagination: {
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  userRoleAssignment: {
    data: null,
    loading: false,
    error: null,
  },

  roleUsersPagination: {
    // Add this
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  assignmentHistoryPagination: {
    // Add this
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  currentRole: "",
  statistics: "",
  recentChanges: [],
  userHistory: [],
  assignmentHistory: [],
  availableRoles: [],
  analytics: "",
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
    history: false,
    permissions: false,
    userHistory: false,

    create: false,
    update: false,
    delete: false,
    roleUsers: false, // Add this

    assign: false,
    statistics: false,
    history: false,
    activate: false,
    clone: false,
    analytics: false,
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
      // Get Management Roles (Simple list for dropdowns - /list endpoint)
      .addCase(getManagementRoles.pending, (state) => {
        state.loading.list = true;
        state.error = "";
      })
      .addCase(getManagementRoles.fulfilled, (state, action) => {
        state.loading.list = false;
        if (action.payload.success) {
          // Store simple list in managementRoles
          state.roles = action.payload.data || [];
        }
      })
      .addCase(getManagementRoles.rejected, (state, action) => {
        state.loading.list = false;
        state.error = "Failed to fetch management roles list";
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
        state.error = i18next.t("managementRoles.fetchError");
      })
      //
      .addCase(getRolePermissions.pending, (state) => {
        state.loading.permissions = true;
        state.error = "";
      })
      .addCase(getRolePermissions.fulfilled, (state, action) => {
        state.loading.permissions = false;
        state.permissions = action.payload.data || [];
      })
      .addCase(getRolePermissions.rejected, (state, action) => {
        state.loading.permissions = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch role permissions";
      })

      // Management Role Users (basic - for role details)
      .addCase(getManagementRoleUsers.pending, (state) => {
        state.loading.roleUsers = true;
        state.error = "";
      })
      .addCase(getManagementRoleUsers.fulfilled, (state, action) => {
        state.loading.roleUsers = false;
        if (action.payload.success) {
          state.roleUsers = action.payload.data?.items || [];
          state.roleUsersPagination = {
            totalCount: action.payload.data?.totalCount || 0,
            pageNumber: action.payload.data?.page || 1,
            pageSize: action.payload.data?.pageSize || 10,
            totalPages: action.payload.data?.totalPages || 0,
            hasNextPage: action.payload.data?.hasNext || false,
            hasPreviousPage: action.payload.data?.hasPrevious || false,
          };
        }
      })
      .addCase(getManagementRoleUsers.rejected, (state, action) => {
        state.loading.roleUsers = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch management role users";
      })

      // Management Role History
      .addCase(getManagementRoleHistory.pending, (state) => {
        state.loading.history = true;
        state.error = "";
      })
      .addCase(getManagementRoleHistory.fulfilled, (state, action) => {
        state.loading.history = false;

        state.assignmentHistory = action.payload.data.items || [];
        state.assignmentHistoryPagination = {
          totalCount: action.payload.data?.totalCount || 0,
          pageNumber: action.payload.data?.page || 1,
          pageSize: action.payload.data?.pageSize || 10,
          totalPages: action.payload.data?.totalPages || 0,
          hasNextPage: action.payload.data?.hasNext || false,
          hasPreviousPage: action.payload.data?.hasPrevious || false,
        };
      })
      .addCase(getManagementRoleHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch role assignment history";
      })

      // Create Management Role
      // .addCase(createManagementRole.pending, (state) => {
      //   state.loading.create = true;
      //   state.error = "";
      //   state.success = "";
      // })
      // .addCase(createManagementRole.fulfilled, (state, action) => {
      //   state.loading.create = false;
      //   if (action.payload.success) {
      //   }
      // })
      // .addCase(createManagementRole.rejected, (state, action) => {
      //   state.loading.create = false;
      //   state.error =
      //     action.payload?.messageEn ||
      //     action.payload ||
      //     "Failed to create management role";
      // })

      // // Update Management Role
      // .addCase(updateManagementRole.pending, (state) => {
      //   state.loading.update = true;
      //   state.error = "";
      //   state.success = "";
      // })
      // .addCase(updateManagementRole.fulfilled, (state, action) => {
      //   state.loading.update = false;
      //   if (action.payload.success) {
      //     state.currentRole = action.payload.data;

      //     // Update role in list if it exists
      //     const index = state.roles.findIndex(
      //       (role) => role.id === action.payload.data?.id
      //     );
      //     if (index !== -1) {
      //       state.roles[index] = action.payload.data;
      //     }
      //   }
      // })
      // .addCase(updateManagementRole.rejected, (state, action) => {
      //   state.loading.update = false;
      //   state.error =
      //     action.payload?.messageEn ||
      //     action.payload ||
      //     "Failed to update management role";
      // })

      // // Delete Management Role
      // .addCase(deleteManagementRole.pending, (state) => {
      //   state.loading.delete = true;
      //   state.error = "";
      //   state.success = "";
      // })
      // .addCase(deleteManagementRole.fulfilled, (state, action) => {
      //   state.loading.delete = false;
      //   if (action.payload.success) {
      //     // Remove role from list
      //     state.roles = state.roles.filter(
      //       (role) => role.id !== action.payload.deletedId
      //     );
      //   }
      // })
      // .addCase(deleteManagementRole.rejected, (state, action) => {
      //   state.loading.delete = false;
      //   state.error =
      //     action.payload?.messageEn ||
      //     action.payload ||
      //     "Failed to delete management role";
      // })

      // // Assign Role to User
      // .addCase(assignRoleToUser.pending, (state) => {
      //   state.loading.assign = true;
      //   state.error = "";
      //   state.success = "";
      // })
      // .addCase(assignRoleToUser.fulfilled, (state, action) => {
      //   state.loading.assign = false;
      //   if (action.payload.success) {
      //   }
      // })
      // .addCase(assignRoleToUser.rejected, (state, action) => {
      //   state.loading.assign = false;
      //   state.error =
      //     action.payload?.messageEn ||
      //     action.payload ||
      //     "Failed to assign role to user";
      // })

      // // Remove Role from User
      // .addCase(removeRoleFromUser.pending, (state) => {
      //   state.loading.assign = true;
      //   state.error = "";
      //   state.success = "";
      // })
      // .addCase(removeRoleFromUser.fulfilled, (state, action) => {
      //   state.loading.assign = false;
      //   if (action.payload.success) {
      //   }
      // })
      // .addCase(removeRoleFromUser.rejected, (state, action) => {
      //   state.loading.assign = false;
      //   state.error =
      //     action.payload?.messageEn ||
      //     action.payload ||
      //     "Failed to remove role from user";
      // })

      // // Get User Role History
      // .addCase(getUserRoleHistory.pending, (state) => {
      //   state.loading.history = true;
      //   state.error = "";
      // })
      // .addCase(getUserRoleHistory.fulfilled, (state, action) => {
      //   state.loading.history = false;
      //   if (action.payload.success) {
      //     state.userHistory = action.payload.data || [];
      //   }
      // })
      // .addCase(getUserRoleHistory.rejected, (state, action) => {
      //   state.loading.history = false;
      //   state.error =
      //     action.payload?.messageEn ||
      //     action.payload ||
      //     "Failed to fetch user role history";
      // })

      // // Get Role Assignment History

      // // Get Available Roles
      // .addCase(getAvailableRoles.pending, (state) => {
      //   state.loading.list = true;
      //   state.error = "";
      // })
      // .addCase(getAvailableRoles.fulfilled, (state, action) => {
      //   state.loading.list = false;
      //   if (action.payload.success) {
      //     state.availableRoles = action.payload.data || [];
      //   }
      // })
      // .addCase(getAvailableRoles.rejected, (state, action) => {
      //   state.loading.list = false;
      //   state.error = i18next.t("managementRoles.fetchError");
      // })

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
      .addCase(getUserAssignmentHistory.pending, (state) => {
        state.loading.userHistory = true;
        state.error = "";
      })
      .addCase(getUserAssignmentHistory.fulfilled, (state, action) => {
        state.loading.userHistory = false;

        state.userAssignmentHistory = action.payload.data.items || [];
        state.userAssignmentHistoryPagination = {
          totalCount: action.payload.data?.totalItems || 0,
          pageNumber: action.payload.data?.page || 1,
          pageSize: action.payload.data?.pageSize || 10,
          totalPages: action.payload.data?.totalPages || 0,
          hasNextPage: action.payload.data?.hasNext || false,
          hasPreviousPage: action.payload.data?.hasPrevious || false,
        };
      })
      .addCase(getUserAssignmentHistory.rejected, (state, action) => {
        state.loading.userHistory = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch user assignment history";
      });

    // Deactivate Role
    // .addCase(deactivateRole.pending, (state) => {
    //   state.loading.activate = true;
    //   state.error = "";
    //   state.success = "";
    // })
    // .addCase(deactivateRole.fulfilled, (state, action) => {
    //   state.loading.activate = false;
    //   if (action.payload.success) {
    //     // Update role status in list
    //     const index = state.roles.findIndex(
    //       (role) => role.id === action.payload.roleId
    //     );
    //     if (index !== -1) {
    //       state.roles[index].isActive = false;
    //     }

    //     // Update current role if it's the same
    //     if (state.currentRole?.id === action.payload.roleId) {
    //       state.currentRole.isActive = false;
    //     }
    //   }
    // })
    // .addCase(deactivateRole.rejected, (state, action) => {
    //   state.loading.activate = false;
    //   state.error =
    //     action.payload?.messageEn ||
    //     action.payload ||
    //     "Failed to deactivate role";
    // })

    // // Clone Role
    // .addCase(cloneRole.pending, (state) => {
    //   state.loading.clone = true;
    //   state.error = "";
    //   state.success = "";
    // })
    // .addCase(cloneRole.fulfilled, (state, action) => {
    //   state.loading.clone = false;
    //   if (action.payload.success) {
    //   }
    // })
    // .addCase(cloneRole.rejected, (state, action) => {
    //   state.loading.clone = false;
    //   state.error =
    //     action.payload?.messageEn || action.payload || "Failed to clone role";
    // })

    // // Get Role Analytics
    // .addCase(getRoleAnalytics.pending, (state) => {
    //   state.loading.analytics = true;
    //   state.error = "";
    // })
    // .addCase(getRoleAnalytics.fulfilled, (state, action) => {
    //   state.loading.analytics = false;
    //   console.log("state.analytics", action.payload.data.analytics);
    //   if (action.payload.success) {
    //     state.analytics = action.payload.data;
    //   }
    // })
    // .addCase(getRoleAnalytics.rejected, (state, action) => {
    //   state.loading.analytics = false;
    //   state.error =
    //     action.payload?.messageEn ||
    //     action.payload ||
    //     "Failed to fetch role analytics";
    // })

    // // Check Can Delete Role
    // .addCase(checkCanDeleteRole.pending, (state) => {
    //   state.loading.canDelete = true;
    //   state.error = "";
    // })
    // .addCase(checkCanDeleteRole.fulfilled, (state, action) => {
    //   state.loading.canDelete = false;
    //   if (action.payload.success !== undefined) {
    //     state.canDeleteStatus = {
    //       roleId: action.payload.roleId,
    //       canDelete: action.payload.canDelete,
    //     };
    //   }
    // })
    // .addCase(checkCanDeleteRole.rejected, (state, action) => {
    //   state.loading.canDelete = false;
    //   state.error =
    //     action.payload?.messageEn ||
    //     action.payload ||
    //     "Failed to check delete status";
    // })

    // // Check Role Name Uniqueness
    // .addCase(checkRoleNameUnique.pending, (state) => {
    //   state.loading.nameUnique = true;
    //   state.error = "";
    // })
    // .addCase(checkRoleNameUnique.fulfilled, (state, action) => {
    //   state.loading.nameUnique = false;
    //   if (action.payload.success !== undefined) {
    //     state.nameUniqueStatus = action.payload.data;
    //   }
    // })
    // .addCase(checkRoleNameUnique.rejected, (state, action) => {
    //   state.loading.nameUnique = false;
    //   state.error =
    //     action.payload?.messageEn ||
    //     action.payload ||
    //     "Failed to check name uniqueness";
    // })
    // .addCase(getRoleUsers.pending, (state) => {
    //   state.loading.roleUsers = true;
    //   state.error = "";
    // })
    // .addCase(getRoleUsers.fulfilled, (state, action) => {
    //   state.loading.roleUsers = false;
    //   if (action.payload.success) {
    //     state.roleUsers = action.payload.data?.items || [];
    //     state.roleUsersPagination = {
    //       totalCount: action.payload.data?.totalCount || 0,
    //       pageNumber: action.payload.data?.page || 1,
    //       pageSize: action.payload.data?.pageSize || 10,
    //       totalPages: action.payload.data?.totalPages || 0,
    //       hasNextPage: action.payload.data?.hasNext || false,
    //       hasPreviousPage: action.payload.data?.hasPrevious || false,
    //     };
    //   }
    // })
    // .addCase(getRoleUsers.rejected, (state, action) => {
    //   state.loading.roleUsers = false;
    //   state.error =
    //     action.payload?.messageEn ||
    //     action.payload ||
    //     "Failed to fetch role users";
    // })
    // .addCase(getUserRoleAssignment.pending, (state) => {
    //   state.userRoleAssignment.loading = true;
    //   state.userRoleAssignment.error = null;
    // })
    // .addCase(getUserRoleAssignment.fulfilled, (state, action) => {
    //   state.userRoleAssignment.loading = false;
    //   state.userRoleAssignment.data = action.payload.data;
    //   state.userRoleAssignment.error = null;
    // })
    // .addCase(getUserRoleAssignment.rejected, (state, action) => {
    //   state.userRoleAssignment.loading = false;
    //   state.userRoleAssignment.error =
    //     action.payload?.message || action.error.message;
    //   state.userRoleAssignment.data = null;
    // });
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

export const selectAvailableRoles = (state) =>
  state.managementRoles.availableRoles;
export const selectRoleAnalytics = (state) => state.managementRoles.analytics;

export const selectCanDeleteStatus = (state) =>
  state.managementRoles.canDeleteStatus;
export const selectNameUniqueStatus = (state) =>
  state.managementRoles.nameUniqueStatus;
export const selectLoading = (state) => state.managementRoles.loading;
export const selectError = (state) => state.managementRoles.error;
export const selectSuccess = (state) => state.managementRoles.success;
export const selectFilters = (state) => state.managementRoles.filters;
export const selectPagination = (state) => state.managementRoles.pagination;

export const selectUserRoleAssignment = (state) =>
  state.managementRoles.userRoleAssignment.data;
export const selectUserRoleAssignmentLoading = (state) =>
  state.managementRoles.userRoleAssignment.loading;
export const selectUserRoleAssignmentError = (state) =>
  state.managementRoles.userRoleAssignment.error;

export const selectRoleUsers = (state) => state.managementRole?.roleUsers;
export const selectRoleUsersPagination = (state) =>
  state.managementRole?.roleUsersPagination;
export const selectAssignmentHistory = (state) =>
  state.managementRole?.assignmentHistory;
export const selectRolePermissions = (state) =>
  state.managementRole?.permissions;

export default managementRolesSlice.reducer;
