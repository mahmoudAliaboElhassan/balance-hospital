// src/state/act/actRosterManagement.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Create Basic Roster
export const createBasicRoster = createAsyncThunk(
  "rosterManagement/createBasicRoster",
  async (rosterData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.post(
        "/api/v1/roster-management/create-basic",
        rosterData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create Complete Roster
export const createCompleteRoster = createAsyncThunk(
  "rosterManagement/createCompleteRoster",
  async (rosterData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.post(
        "/api/v1/roster-management/create-complete",
        rosterData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get All Rosters with pagination and filters
export const getRosters = createAsyncThunk(
  "rosterManagement/getRosters",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);
      if (params.categoryId)
        queryParams.append("categoryId", params.categoryId);
      if (params.status) queryParams.append("status", params.status);
      if (params.month) queryParams.append("month", params.month);
      if (params.year) queryParams.append("year", params.year);

      const url = `/api/v1/roster-management${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Roster by ID
export const getRosterById = createAsyncThunk(
  "rosterManagement/getRosterById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(`/api/v1/roster-management/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Roster Status
export const updateRosterStatus = createAsyncThunk(
  "rosterManagement/updateRosterStatus",
  async ({ id, status, reason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.put(
        `/api/v1/roster-management/${id}/status/${status}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add Working Hours
export const addWorkingHours = createAsyncThunk(
  "rosterManagement/addWorkingHours",
  async (workingHoursData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.post(
        "/api/v1/roster-management/working-hours",
        workingHoursData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Apply Contracting Template
export const applyContractingTemplate = createAsyncThunk(
  "rosterManagement/applyContractingTemplate",
  async (templateData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.post(
        "/api/v1/roster-management/contracting-template",
        templateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Roster Completion Status
export const getRosterCompletionStatus = createAsyncThunk(
  "rosterManagement/getRosterCompletionStatus",
  async (rosterId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(
        `/api/v1/roster-management/${rosterId}/completion-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Assign Doctor to Roster
export const assignDoctor = createAsyncThunk(
  "rosterManagement/assignDoctor",
  async ({ rosterId, assignmentData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.post(
        `/api/v1/roster-management/${rosterId}/assign-doctor`,
        assignmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Doctor Requests
export const getDoctorRequests = createAsyncThunk(
  "rosterManagement/getDoctorRequests",
  async ({ rosterId, params = {} }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.status) queryParams.append("status", params.status);
      if (params.requestType)
        queryParams.append("requestType", params.requestType);

      const url = `/api/v1/roster-management/${rosterId}/doctor-requests${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Process Doctor Request
export const processDoctorRequest = createAsyncThunk(
  "rosterManagement/processDoctorRequest",
  async ({ requestId, processData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.put(
        `/api/v1/roster-management/doctor-requests/${requestId}/process`,
        processData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Roster Analytics
export const getRosterAnalytics = createAsyncThunk(
  "rosterManagement/getRosterAnalytics",
  async (rosterId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(
        `/api/v1/roster-management/${rosterId}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Search Colleagues
export const searchColleagues = createAsyncThunk(
  "rosterDisplay/searchColleagues",
  async (searchParams, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const queryParams = new URLSearchParams();

      if (searchParams.searchDate)
        queryParams.append("searchDate", searchParams.searchDate);
      if (searchParams.departmentId)
        queryParams.append("departmentId", searchParams.departmentId);
      if (searchParams.categoryId)
        queryParams.append("categoryId", searchParams.categoryId);
      if (searchParams.doctorName)
        queryParams.append("doctorName", searchParams.doctorName);

      const url = `/api/v1/roster-display/search-colleagues?${queryParams.toString()}`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Doctor Schedule
export const getDoctorSchedule = createAsyncThunk(
  "rosterDisplay/getDoctorSchedule",
  async ({ rosterId, doctorId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(
        `/api/v1/roster-display/${rosterId}/doctor-schedule/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get My Schedule
export const getMySchedule = createAsyncThunk(
  "rosterDisplay/getMySchedule",
  async (rosterId = null, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const url = rosterId
        ? `/api/v1/roster-display/my-schedule?rosterId=${rosterId}`
        : `/api/v1/roster-display/my-schedule`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Export Roster
export const exportRoster = createAsyncThunk(
  "rosterDisplay/exportRoster",
  async ({ rosterId, format = "excel" }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosInstance.get(
        `/api/v1/roster-display/${rosterId}/export?format=${format}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob", // Important for file downloads
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
