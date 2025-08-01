import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Get SubDepartments
export const getSubDepartments = createAsyncThunk(
  "subDepartmentSlice/getSubDepartments",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      // Add parameters if they exist
      if (params.search) queryParams.append("search", params.search);
      if (params.departmentId !== undefined)
        queryParams.append("departmentId", params.departmentId);
      if (params.categoryId !== undefined)
        queryParams.append("categoryId", params.categoryId);
      if (params.isActive !== undefined)
        queryParams.append("isActive", params.isActive);
      if (params.createdFrom)
        queryParams.append("createdFrom", params.createdFrom);
      if (params.createdTo) queryParams.append("createdTo", params.createdTo);
      if (params.includeDepartment !== undefined)
        queryParams.append("includeDepartment", params.includeDepartment);
      if (params.includeStatistics !== undefined)
        queryParams.append("includeStatistics", params.includeStatistics);
      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.orderBy) queryParams.append("orderBy", params.orderBy);
      if (params.orderDesc !== undefined)
        queryParams.append("orderDesc", params.orderDesc);

      // Construct the URL with query parameters
      const url = `/api/v1/SubDepartment${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("SubDepartments fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching sub departments:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get SubDepartment by ID
export const getSubDepartmentById = createAsyncThunk(
  "subDepartmentSlice/getSubDepartmentById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(`/api/v1/SubDepartment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("SubDepartment fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching sub department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create SubDepartment
export const createSubDepartment = createAsyncThunk(
  "subDepartmentSlice/createSubDepartment",
  async (subDepartmentData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        "/api/v1/SubDepartment",
        subDepartmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("SubDepartment created successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error creating sub department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update SubDepartment
export const updateSubDepartment = createAsyncThunk(
  "subDepartmentSlice/updateSubDepartment",
  async ({ id, subDepartmentData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.put(
        `/api/v1/SubDepartment/${id}`,
        subDepartmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("SubDepartment updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error updating sub department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete SubDepartment
export const deleteSubDepartment = createAsyncThunk(
  "subDepartmentSlice/deleteSubDepartment",
  async ({ id, reason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(`/api/v1/SubDepartment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: { deletedReason: reason },
      });
      console.log("SubDepartment deleted successfully:", res);
      return { ...res.data, deletedSubDepartmentId: id };
    } catch (error) {
      console.log("Error deleting sub department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
