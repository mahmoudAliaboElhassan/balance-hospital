import { createSlice } from "@reduxjs/toolkit";
import {
  getRoleStatistics,
  getCategoriesManagersSummary,
  getCategoriesWithManagers,
  getCurrentManagers,
  getDepartmentHeads,
  getManagerHistory,
  addManager,
  removeManager,
  assignDepartmentHead,
  removeDepartmentHead,
  getUsersForManagerAssignment,
} from "../act/actManagementRole";

// Initial state for role management
const initialStateRole = {
  // Loading states

  // Loading states
  loadingUsersForManagerAssignment: false,

  // Error states
  usersForManagerAssignmentError: null,

  loadingRoleStatistics: false,
  loadingCategoriesSummary: false,
  loadingCategoriesWithManagers: false,
  loadingCurrentManagers: false,
  loadingDepartmentHeads: false,
  loadingManagerHistory: false,
  loadingAddManager: false,
  loadingRemoveManager: false,
  loadingAssignDepartmentHead: false,
  loadingRemoveDepartmentHead: false,
  addManagerSuccess: false,
  addManagerMessage: "",
  // Data
  roleStatistics: null,
  categoriesManagersSummary: null,
  categoriesWithManagers: [],
  currentManagers: [],
  departmentHeads: [],
  managerHistory: [],
  pagination: null,
  users: [],
  usersForManagerAssignment: [],
  // Error states
  roleStatisticsError: null,
  categoriesSummaryError: null,
  categoriesWithManagersError: null,
  currentManagersError: null,
  departmentHeadsError: null,
  managerHistoryError: null,
  addManagerError: null,
  removeManagerError: null,
  assignDepartmentHeadError: null,
  removeDepartmentHeadError: null,
};

export const roleSlice = createSlice({
  name: "roleSlice",
  initialState: initialStateRole,
  reducers: {
    clearAddManagerSuccess: (state) => {
      state.addManagerSuccess = false;
      state.addManagerMessage = "";
    },
    clearUsersData: (state) => {
      state.users = [];
      state.usersForManagerAssignment = [];
      state.usersError = null;
      state.usersForManagerAssignmentError = null;
    },
    clearRoleErrors: (state) => {
      state.roleStatisticsError = null;
      state.categoriesSummaryError = null;
      state.categoriesWithManagersError = null;
      state.currentManagersError = null;
      state.departmentHeadsError = null;
      state.managerHistoryError = null;
      state.addManagerError = null;
      state.removeManagerError = null;
      state.assignDepartmentHeadError = null;
      state.removeDepartmentHeadError = null;
    },
    resetRoleData: (state) => {
      return initialStateRole;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Role Statistics
      .addCase(getRoleStatistics.pending, (state) => {
        state.loadingRoleStatistics = true;
        state.roleStatisticsError = null;
      })
      .addCase(getRoleStatistics.fulfilled, (state, action) => {
        state.loadingRoleStatistics = false;
        state.roleStatistics = action.payload.data;
      })
      .addCase(getRoleStatistics.rejected, (state, action) => {
        state.loadingRoleStatistics = false;
        state.roleStatisticsError = action.payload;
      })

      // Get Categories Managers Summary
      .addCase(getCategoriesManagersSummary.pending, (state) => {
        state.loadingCategoriesSummary = true;
        state.categoriesSummaryError = null;
      })
      .addCase(getCategoriesManagersSummary.fulfilled, (state, action) => {
        state.loadingCategoriesSummary = false;
        state.categoriesManagersSummary = action.payload.data;
      })
      .addCase(getCategoriesManagersSummary.rejected, (state, action) => {
        state.loadingCategoriesSummary = false;
        state.categoriesSummaryError = action.payload;
      })

      // Get Categories with Managers
      .addCase(getCategoriesWithManagers.pending, (state) => {
        state.loadingCategoriesWithManagers = true;
        state.categoriesWithManagersError = null;
      })
      .addCase(getCategoriesWithManagers.fulfilled, (state, action) => {
        state.loadingCategoriesWithManagers = false;
        state.categoriesWithManagers = action.payload.data;
      })
      .addCase(getCategoriesWithManagers.rejected, (state, action) => {
        state.loadingCategoriesWithManagers = false;
        state.categoriesWithManagersError = action.payload;
      })

      // Get Current Managers
      .addCase(getCurrentManagers.pending, (state) => {
        state.loadingCurrentManagers = true;
        state.currentManagersError = null;
      })
      .addCase(getCurrentManagers.fulfilled, (state, action) => {
        state.loadingCurrentManagers = false;
        state.currentManagers = action.payload.data;
      })
      .addCase(getCurrentManagers.rejected, (state, action) => {
        state.loadingCurrentManagers = false;
        state.currentManagersError = action.payload;
      })

      // Get Department Heads
      .addCase(getDepartmentHeads.pending, (state) => {
        state.loadingDepartmentHeads = true;
        state.departmentHeadsError = null;
      })
      .addCase(getDepartmentHeads.fulfilled, (state, action) => {
        state.loadingDepartmentHeads = false;
        state.departmentHeads =
          action.payload.data.items || action.payload.data;
        state.pagination = action.payload.data.items
          ? {
              page: action.payload.data.page,
              pageSize: action.payload.data.pageSize,
              totalCount: action.payload.data.totalCount,
              totalPages: action.payload.data.totalPages,
              hasPrevious: action.payload.data.hasPrevious,
              hasNext: action.payload.data.hasNext,
            }
          : null;
      })
      .addCase(getDepartmentHeads.rejected, (state, action) => {
        state.loadingDepartmentHeads = false;
        state.departmentHeadsError = action.payload;
      })

      // Get Manager History
      .addCase(getManagerHistory.pending, (state) => {
        state.loadingManagerHistory = true;
        state.managerHistoryError = null;
      })
      .addCase(getManagerHistory.fulfilled, (state, action) => {
        state.loadingManagerHistory = false;
        state.managerHistory = action.payload.data.items || action.payload.data;
      })
      .addCase(getManagerHistory.rejected, (state, action) => {
        state.loadingManagerHistory = false;
        state.managerHistoryError = action.payload;
      })

      // Add Manager
      .addCase(addManager.pending, (state) => {
        state.loadingAddManager = true;
        state.addManagerError = null;
        state.addManagerSuccess = false;
      })
      .addCase(addManager.fulfilled, (state, action) => {
        state.loadingAddManager = false;
        state.addManagerSuccess = true;
        state.addManagerMessage =
          action.payload.messageEn ||
          action.payload.messageAr ||
          "Manager assigned successfully";
      })
      .addCase(addManager.rejected, (state, action) => {
        state.loadingAddManager = false;
        state.addManagerError = action.payload;
        state.addManagerSuccess = false;
      })

      // Remove Manager
      .addCase(removeManager.pending, (state) => {
        state.loadingRemoveManager = true;
        state.removeManagerError = null;
      })
      .addCase(removeManager.fulfilled, (state, action) => {
        state.loadingRemoveManager = false;
        // Optionally refresh managers list or remove from current list
      })
      .addCase(removeManager.rejected, (state, action) => {
        state.loadingRemoveManager = false;
        state.removeManagerError = action.payload;
      })

      // Assign Department Head
      .addCase(assignDepartmentHead.pending, (state) => {
        state.loadingAssignDepartmentHead = true;
        state.assignDepartmentHeadError = null;
      })
      .addCase(assignDepartmentHead.fulfilled, (state, action) => {
        state.loadingAssignDepartmentHead = false;
        // Optionally refresh department heads list or add to current list
      })
      .addCase(assignDepartmentHead.rejected, (state, action) => {
        state.loadingAssignDepartmentHead = false;
        state.assignDepartmentHeadError = action.payload;
      })

      // Remove Department Head
      .addCase(removeDepartmentHead.pending, (state) => {
        state.loadingRemoveDepartmentHead = true;
        state.removeDepartmentHeadError = null;
      })
      .addCase(removeDepartmentHead.fulfilled, (state, action) => {
        state.loadingRemoveDepartmentHead = false;
        // Optionally refresh department heads list or remove from current list
      })
      .addCase(removeDepartmentHead.rejected, (state, action) => {
        state.loadingRemoveDepartmentHead = false;
        state.removeDepartmentHeadError = action.payload;
      })
      .addCase(getUsersForManagerAssignment.pending, (state) => {
        state.loadingUsersForManagerAssignment = true;
        state.usersForManagerAssignmentError = null;
      })
      .addCase(getUsersForManagerAssignment.fulfilled, (state, action) => {
        state.loadingUsersForManagerAssignment = false;
        state.usersForManagerAssignment = action.payload.data.items || [];
      })
      .addCase(getUsersForManagerAssignment.rejected, (state, action) => {
        state.loadingUsersForManagerAssignment = false;
        state.usersForManagerAssignmentError = action.payload;
      });
  },
});

export default roleSlice.reducer;
export const { clearRoleErrors, resetRoleData, clearUsersData } =
  roleSlice.actions;
