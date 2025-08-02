import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Get All Scientific Degrees
export const getScientificDegrees = createAsyncThunk(
  "scientificDegreeSlice/getScientificDegrees",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get("/api/v1/ScientificDegree", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Scientific Degrees fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching scientific degrees:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Active Scientific Degrees
export const getActiveScientificDegrees = createAsyncThunk(
  "scientificDegreeSlice/getActiveScientificDegrees",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get("/api/v1/ScientificDegree/active", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Active Scientific Degrees fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching active scientific degrees:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Scientific Degrees for Signup (Public)
export const getScientificDegreesForSignup = createAsyncThunk(
  "scientificDegreeSlice/getScientificDegreesForSignup",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        "/api/v1/ScientificDegree/scientific-degrees"
      );
      console.log("Scientific Degrees for signup fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching scientific degrees for signup:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Scientific Degree by ID
export const getScientificDegreeById = createAsyncThunk(
  "scientificDegreeSlice/getScientificDegreeById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(`/api/v1/ScientificDegree/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Scientific Degree fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching scientific degree:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Scientific Degree by Code
export const getScientificDegreeByCode = createAsyncThunk(
  "scientificDegreeSlice/getScientificDegreeByCode",
  async (code, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/ScientificDegree/code/${code}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Scientific Degree by code fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching scientific degree by code:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create Scientific Degree
export const createScientificDegree = createAsyncThunk(
  "scientificDegreeSlice/createScientificDegree",
  async (scientificDegreeData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        "/api/v1/ScientificDegree",
        scientificDegreeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Scientific Degree created successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error creating scientific degree:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Scientific Degree
export const updateScientificDegree = createAsyncThunk(
  "scientificDegreeSlice/updateScientificDegree",
  async ({ id, scientificDegreeData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.put(
        `/api/v1/ScientificDegree/${id}`,
        scientificDegreeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Scientific Degree updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error updating scientific degree:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Scientific Degree
export const deleteScientificDegree = createAsyncThunk(
  "scientificDegreeSlice/deleteScientificDegree",
  async ({ id, reason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(`/api/v1/ScientificDegree/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: reason ? { reason } : undefined,
      });
      console.log("Scientific Degree deleted successfully:", res);
      return { ...res.data, deletedId: id };
    } catch (error) {
      console.log("Error deleting scientific degree:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
