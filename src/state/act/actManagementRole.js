import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Get All Management Roles with Query Parameters
export const getManagementRoles = createAsyncThunk(
  "managementRolesSlice/getManagementRoles",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      // Add parameters if they exist
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);
      if (params.isActive !== undefined)
        queryParams.append("isActive", params.isActive);
      if (params.isSystemRole !== undefined)
        queryParams.append("isSystemRole", params.isSystemRole);
      if (params.hasUsers !== undefined)
        queryParams.append("hasUsers", params.hasUsers);
      if (params.permissionFilter)
        queryParams.append("permissionFilter", params.permissionFilter);
      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortDirection)
        queryParams.append("sortDirection", params.sortDirection);

      // Construct the URL with query parameters
      const url = `/api/v1/management-roles${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Management Roles fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching management roles:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Management Role by ID
export const getManagementRoleById = createAsyncThunk(
  "managementRolesSlice/getManagementRoleById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(`/api/v1/management-roles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Management Role fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching management role:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create Management Role
export const createManagementRole = createAsyncThunk(
  "managementRolesSlice/createManagementRole",
  async (roleData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        "/api/v1/management-roles",
        roleData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Management Role created successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error creating management role:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Management Role
export const updateManagementRole = createAsyncThunk(
  "managementRolesSlice/updateManagementRole",
  async ({ id, roleData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.put(
        `/api/v1/management-roles/${id}`,
        roleData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Management Role updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error updating management role:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Management Role
export const deleteManagementRole = createAsyncThunk(
  "managementRolesSlice/deleteManagementRole",
  async ({ id, deleteReason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();
      if (deleteReason) queryParams.append("deleteReason", deleteReason);

      const url = `/api/v1/management-roles/${id}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Management Role deleted successfully:", res);
      return { ...res.data, deletedId: id };
    } catch (error) {
      console.log("Error deleting management role:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Assign Role to User
export const assignRoleToUser = createAsyncThunk(
  "managementRolesSlice/assignRoleToUser",
  async ({ roleId, userId, changeReason, notes }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        `/api/v1/management-roles/assign-to-user/${userId}`,
        { roleId, changeReason, notes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Role assigned to user successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error assigning role to user:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove Role from User
export const removeRoleFromUser = createAsyncThunk(
  "managementRolesSlice/removeRoleFromUser",
  async ({ removeReason, userId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(
        `/api/v1/management-roles/remove-from-user/${userId}?removeReason=${removeReason}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Role removed from user successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error removing role from user:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get User Role History
export const getUserRoleHistory = createAsyncThunk(
  "managementRolesSlice/getUserRoleHistory",
  async (userId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/management-roles/user-history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("User role history fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching user role history:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Role Assignment History
export const getRoleAssignmentHistory = createAsyncThunk(
  "managementRolesSlice/getRoleAssignmentHistory",
  async (roleId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/management-roles/${roleId}/assignment-history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Role assignment history fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching role assignment history:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Available Roles
export const getAvailableRoles = createAsyncThunk(
  "managementRolesSlice/getAvailableRoles",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        "/api/v1/management-roles/available",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Available roles fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching available roles:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Role Statistics
export const getRoleStatistics = createAsyncThunk(
  "managementRolesSlice/getRoleStatistics",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        "/api/v1/management-roles/statistics",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Role statistics fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching role statistics:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Recent Changes
export const getRecentChanges = createAsyncThunk(
  "managementRolesSlice/getRecentChanges",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        "/api/v1/management-roles/recent-changes",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Recent changes fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching recent changes:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Activate Role
export const activateRole = createAsyncThunk(
  "managementRolesSlice/activateRole",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        `/api/v1/management-roles/${id}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Role activated successfully:", res);
      return { ...res.data, roleId: id };
    } catch (error) {
      console.log("Error activating role:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Deactivate Role
export const deactivateRole = createAsyncThunk(
  "managementRolesSlice/deactivateRole",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        `/api/v1/management-roles/${id}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Role deactivated successfully:", res);
      return { ...res.data, roleId: id };
    } catch (error) {
      console.log("Error deactivating role:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Clone Role
export const cloneRole = createAsyncThunk(
  "managementRolesSlice/cloneRole",
  async ({ id, newRoleNameEn, newRoleNameAr }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        `/api/v1/management-roles/${id}/clone`,
        { newRoleNameEn, newRoleNameAr },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Role cloned successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error cloning role:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Role Analytics
export const getRoleAnalytics = createAsyncThunk(
  "managementRolesSlice/getRoleAnalytics",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/management-roles/${id}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Role analytics fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching role analytics:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Role Permissions
export const getRolePermissions = createAsyncThunk(
  "managementRolesSlice/getRolePermissions",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/management-roles/${id}/permissions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Role permissions fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching role permissions:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Check if Role Can Be Deleted
export const checkCanDeleteRole = createAsyncThunk(
  "managementRolesSlice/checkCanDeleteRole",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/management-roles/${id}/can-delete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Role delete check completed successfully:", res);
      return { roleId: id, canDelete: res.data };
    } catch (error) {
      console.log("Error checking if role can be deleted:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkRoleNameUnique = createAsyncThunk(
  "managementRolesSlice/checkRoleNameUnique",
  async ({ nameEn, excludeId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();
      if (nameEn) queryParams.append("roleNameEn", nameEn);
      if (excludeId) queryParams.append("excludeRoleId", excludeId);

      const url = `/api/v1/management-roles/check-name-unique${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Role name uniqueness check completed successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error checking role name uniqueness:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add this action to your existing actManagementRole.js file

// Get Role Users with Query Parameters
export const getRoleUsers = createAsyncThunk(
  "managementRolesSlice/getRoleUsers",
  async ({ id, params = {} }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      // Add parameters if they exist
      if (params.search) queryParams.append("search", params.search);
      if (params.isActive !== undefined)
        queryParams.append("isActive", params.isActive);
      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.sortBy !== undefined)
        queryParams.append("sortBy", params.sortBy);
      if (params.sortDirection !== undefined)
        queryParams.append("sortDirection", params.sortDirection);

      // Construct the URL with query parameters
      const url = `/api/v1/management-roles/${id}/users${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Role users fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching role users:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserRoleAssignment = createAsyncThunk(
  "managementRolesSlice/getUserRoleAssignment",
  async ({ userId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/management-roles/user/${userId}/role`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("User role assignment fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching user role assignment:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
