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
      if (params.includeManager)
        queryParams.append("includeManager", params.includeManager);
      if (params.includeCategories)
        queryParams.append("includeCategories", params.includeCategories);
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
export const updateManagerPermission = createAsyncThunk(
  "departmentSlice/updateManagerPermission",
  async ({ id, data }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.put(
        `api/v1/Department/${id}/manager`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Department Manger updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error deleting department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const removeDepManager = createAsyncThunk(
  "departmentSlice/removeDepManager",
  async ({ data }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        `api/v1/role/department-manager/remove`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Department Manger updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error deleting department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const assignDepManager = createAsyncThunk(
  "departmentSlice/assignDepManager",
  async ({ data }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        `api/v1/role/department-manager/assign`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Department Manger updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error deleting department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const availabelDepartmentsForCategory = createAsyncThunk(
  "departmentSlice/availabelDepartmentsForCategory",
  async ({ categoryId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `api/v1/Department/available-for-category/${categoryId}?includeCategories=true&includeManager=true`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("avaialbe departments:", res);
      return res.data;
    } catch (error) {
      console.log("Error deleting department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const linkDepartmentToCategory = createAsyncThunk(
  "departmentSlice/linkDepartmentToCategory",
  async ({ id, categoryId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        `api/v1/Department/${id}/categories/${categoryId}`,
        { categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("link departments:", res);
      return { depId: id };
    } catch (error) {
      console.log("Error deleting department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const unlinkDepartmentFromCategory = createAsyncThunk(
  "departmentSlice/unlinkDepartmentFromCategory",
  async ({ id, categoryId, revocationReason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(
        `api/v1/Department/${id}/categories/${categoryId}`,
        {
          data: { revocationReason },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("un link:", res);
      return { depId: id };
    } catch (error) {
      console.log("Error deleting department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getDepartmentByCategory = createAsyncThunk(
  "departmentSlice/getDepartmentByCategory",
  async ({ categoryId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `api/v1/Department/by-category/${categoryId}?includeCategories=true&includeManager=true`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("departments by category:", res);
      return res.data;
    } catch (error) {
      console.log("Error deleting department:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getDepartmentMonthList = createAsyncThunk(
  "departmentSlice/getDepartmentMonthList",
  async ({ departmentId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `api/v1/DepartmentManager/department/${departmentId}/months-list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("departments month list :", res);
      return res.data;
    } catch (error) {
      console.log("Error department month list:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getDepartmentMonthView = createAsyncThunk(
  "departmentSlice/getDepartmentMonthView",
  async ({ departmentId, month, year }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/DepartmentManager/department/${departmentId}/month-view?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("departments month list :", res);
      return res.data;
    } catch (error) {
      console.log("Error department month list:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getDepartmentRosterCalender = createAsyncThunk(
  "departmentSlice/getDepartmentRosterCalender",
  async ({ departmentId, ids }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("ids", id));

    try {
      const res = await axiosInstance.get(
        `/api/v1/DepartmentManager/${departmentId}/calendar?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("calender calender calender calender :", res);
      return res.data;
    } catch (error) {
      console.log("Error department month list:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
