import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Get ContractingTypes
export const getContractingTypes = createAsyncThunk(
  "contractingTypeSlice/getContractingTypes",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      // Add parameters if they exist
      if (params.search) queryParams.append("search", params.search);
      if (params.isActive !== undefined)
        queryParams.append("isActive", params.isActive);
      if (params.createdFrom)
        queryParams.append("createdFrom", params.createdFrom);
      if (params.createdTo) queryParams.append("createdTo", params.createdTo);
      if (params.includeStatistics !== undefined)
        queryParams.append("includeStatistics", params.includeStatistics);
      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.orderBy) queryParams.append("orderBy", params.orderBy);
      if (params.orderDesc !== undefined)
        queryParams.append("orderDesc", params.orderDesc);

      // Use /All endpoint for admin management
      const url = `/api/v1/ContractingType/All${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("ContractingTypes fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching contracting types:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Active ContractingTypes
export const getActiveContractingTypes = createAsyncThunk(
  "contractingTypeSlice/getActiveContractingTypes",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.orderBy) queryParams.append("orderBy", params.orderBy);
      if (params.orderDesc !== undefined)
        queryParams.append("orderDesc", params.orderDesc);

      const url = `/api/v1/ContractingType/active${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Active ContractingTypes fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching active contracting types:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get ContractingTypes for Signup (Public)
export const getContractingTypesForSignup = createAsyncThunk(
  "contractingTypeSlice/getContractingTypesForSignup",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        "/api/v1/ContractingType/contracting-types"
      );
      console.log("ContractingTypes for signup fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching contracting types for signup:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get ContractingType by ID
export const getContractingTypeById = createAsyncThunk(
  "contractingTypeSlice/getContractingTypeById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(`/api/v1/ContractingType/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("ContractingType fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching contracting type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create ContractingType
export const createContractingType = createAsyncThunk(
  "contractingTypeSlice/createContractingType",
  async (contractingTypeData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        "/api/v1/ContractingType",
        contractingTypeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("ContractingType created successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error creating contracting type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update ContractingType
export const updateContractingType = createAsyncThunk(
  "contractingTypeSlice/updateContractingType",
  async ({ id, contractingTypeData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.put(
        `/api/v1/ContractingType/${id}`,
        contractingTypeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("ContractingType updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error updating contracting type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete ContractingType
export const deleteContractingType = createAsyncThunk(
  "contractingTypeSlice/deleteContractingType",
  async ({ id, reason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(
        `/api/v1/ContractingType/${id}${reason ? `?reason=${reason}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("ContractingType deleted successfully:", res);
      return { ...res.data, deletedContractingTypeId: id };
    } catch (error) {
      console.log("Error deleting contracting type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
