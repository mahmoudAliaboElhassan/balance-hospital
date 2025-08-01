import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getDepartments = createAsyncThunk(
  "departmentSlice/getDepartments",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      // Add parameters if they exist
      if (params.search) queryParams.append("search", params.search);
      if (params.categoryId !== undefined)
        queryParams.append("categoryId", params.categoryId);
      if (params.isActive !== undefined)
        queryParams.append("isActive", params.isActive);
      if (params.createdFrom)
        queryParams.append("createdFrom", params.createdFrom);
      if (params.createdTo) queryParams.append("createdTo", params.createdTo);
      if (params.includeSubDepartments !== undefined)
        queryParams.append(
          "includeSubDepartments",
          params.includeSubDepartments
        );
      if (params.includeStatistics !== undefined)
        queryParams.append("includeStatistics", params.includeStatistics);
      if (params.includeCategory !== undefined)
        queryParams.append("includeCategory", params.includeCategory);
      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.orderBy) queryParams.append("orderBy", params.orderBy);
      if (params.orderDesc !== undefined)
        queryParams.append("orderDesc", params.orderDesc);

      // Construct the URL with query parameters
      const url = `/api/v1/Department${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Departments fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching departments:", error);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDepartmentById = createAsyncThunk(
  "departmentSlice/getDepartmentById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(`/api/v1/Department/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Department fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  "departmentSlice/createDepartment",
  async (departmentData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        "/api/v1/Department",
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Department created successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error creating department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "departmentSlice/updateDepartment",
  async ({ id, departmentData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.put(
        `/api/v1/Department/${id}`,
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Department updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error updating department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "departmentSlice/deleteDepartment",
  async ({ id, reason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(
        `/api/v1/Department/${id}?reason=${reason}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Department deleted successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error deleting department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
