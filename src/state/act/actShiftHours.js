import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Get All Shift Hours Types
export const getShiftHoursTypes = createAsyncThunk(
  "shiftHoursTypeSlice/getShiftHoursTypes",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get("/api/v1/ShiftHoursType", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Shift Hours Types fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching shift hours types:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Active Shift Hours Types
export const getActiveShiftHoursTypes = createAsyncThunk(
  "shiftHoursTypeSlice/getActiveShiftHoursTypes",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get("/api/v1/ShiftHoursType/active", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Active Shift Hours Types fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching active shift hours types:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Shift Hours Type by ID
export const getShiftHoursTypeById = createAsyncThunk(
  "shiftHoursTypeSlice/getShiftHoursTypeById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(`/api/v1/ShiftHoursType/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Shift Hours Type fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching shift hours type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Shift Hours Types by Period
export const getShiftHoursTypesByPeriod = createAsyncThunk(
  "shiftHoursTypeSlice/getShiftHoursTypesByPeriod",
  async (period, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/ShiftHoursType/period/${period}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Shift Hours Types by period fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching shift hours types by period:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Paged Shift Hours Types
export const getPagedShiftHoursTypes = createAsyncThunk(
  "shiftHoursTypeSlice/getPagedShiftHoursTypes",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("Page", params.page);
      if (params?.pageSize) queryParams.append("PageSize", params.pageSize);
      if (params?.search) queryParams.append("Search", params.search);
      if (params?.period) queryParams.append("Period", params.period);
      if (params?.isActive !== undefined)
        queryParams.append("IsActive", params.isActive);
      if (params?.sortBy) queryParams.append("SortBy", params.sortBy);
      if (params?.sortDirection)
        queryParams.append("SortDirection", params.sortDirection);

      const res = await axiosInstance.get(
        `/api/v1/ShiftHoursType/paged?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Paged Shift Hours Types fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching paged shift hours types:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create Shift Hours Type
export const createShiftHoursType = createAsyncThunk(
  "shiftHoursTypeSlice/createShiftHoursType",
  async (shiftHoursTypeData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        "/api/v1/ShiftHoursType",
        shiftHoursTypeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Shift Hours Type created successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error creating shift hours type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Shift Hours Type
export const updateShiftHoursType = createAsyncThunk(
  "shiftHoursTypeSlice/updateShiftHoursType",
  async ({ id, shiftHoursTypeData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.put(
        `/api/v1/ShiftHoursType/${id}`,
        shiftHoursTypeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Shift Hours Type updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error updating shift hours type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Shift Hours Type
export const deleteShiftHoursType = createAsyncThunk(
  "shiftHoursTypeSlice/deleteShiftHoursType",
  async ({ id, reason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(`/api/v1/ShiftHoursType/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: reason ? { reason } : undefined,
      });
      console.log("Shift Hours Type deleted successfully:", res);
      return { ...res.data, deletedId: id };
    } catch (error) {
      console.log("Error deleting shift hours type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
