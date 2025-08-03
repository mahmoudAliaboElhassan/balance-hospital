import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Get Role Statistics
export const getRoleStatistics = createAsyncThunk(
  "roleSlice/getRoleStatistics",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      if (params.categoryId)
        queryParams.append("categoryId", params.categoryId);

      const url = `/api/v1/role/statistics${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Role statistics fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching role statistics:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Categories Managers Summary
export const getCategoriesManagersSummary = createAsyncThunk(
  "roleSlice/getCategoriesManagersSummary",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const url = `/api/v1/role/categories-managers-summary`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Categories managers summary fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching categories managers summary:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Categories with Managers
export const getCategoriesWithManagers = createAsyncThunk(
  "roleSlice/getCategoriesWithManagers",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const url = `/api/v1/role/categories-with-managers`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Categories with managers fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching categories with managers:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Current Managers
export const getCurrentManagers = createAsyncThunk(
  "roleSlice/getCurrentManagers",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const url = `/api/v1/role/current-managers`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Current managers fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching current managers:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Department Heads
export const getDepartmentHeads = createAsyncThunk(
  "roleSlice/getDepartmentHeads",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      if (params.searchTerm)
        queryParams.append("SearchTerm", params.searchTerm);
      if (params.categoryId)
        queryParams.append("CategoryId", params.categoryId);
      if (params.isActive !== undefined)
        queryParams.append("IsActive", params.isActive);
      if (params.page) queryParams.append("Page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.limit) queryParams.append("Limit", params.limit);

      const url = `/api/v1/role/department-heads${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Department heads fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching department heads:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Manager History (Recent Activity)
export const getManagerHistory = createAsyncThunk(
  "roleSlice/getManagerHistory",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      if (params.categoryId)
        queryParams.append("categoryId", params.categoryId);
      if (params.userId) queryParams.append("userId", params.userId);
      if (params.fromDate) queryParams.append("fromDate", params.fromDate);
      if (params.toDate) queryParams.append("toDate", params.toDate);
      if (params.managerType)
        queryParams.append("managerType", params.managerType);
      if (params.isActive !== undefined)
        queryParams.append("isActive", params.isActive);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      const url = `/api/v1/role/managers/history${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Manager history fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching manager history:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeManager = createAsyncThunk(
  "roleSlice/removeManager",
  async ({ userId, revocationReason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const url = `/api/v1/role/managers/${userId}`;

      const res = await axiosInstance.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: { revocationReason },
      });
      console.log("Manager removed successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error removing manager:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Assign Department Head
export const assignDepartmentHead = createAsyncThunk(
  "roleSlice/assignDepartmentHead",
  async (departmentHeadData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const url = `/api/v1/role/department-heads`;

      const res = await axiosInstance.post(url, departmentHeadData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Department head assigned successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error assigning department head:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove Department Head
export const removeDepartmentHead = createAsyncThunk(
  "roleSlice/removeDepartmentHead",
  async ({ userId, removalData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const url = `/api/v1/role/department-heads/${userId}`;

      const res = await axiosInstance.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: removalData,
      });
      console.log("Department head removed successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error removing department head:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Note: Make sure your addManager action exists and matches this signature:
export const addManager = createAsyncThunk(
  "roleSlice/addManager",
  async (managerData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const url = `/api/v1/role/managers`;

      const res = await axiosInstance.post(url, managerData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Manager added successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error adding manager:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
