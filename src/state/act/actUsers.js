import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Get User Summaries action
export const getUserSummaries = createAsyncThunk(
  "usersSlice/getUserSummaries",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      //   const { page = 1, pageSize = 10, searchTerm = "" } = params;

      const res = await axiosInstance.get("/api/v1/Users/summaries", {
        params: {
          isEmailVerified: true,
          isApproved: true,
          // page,
          // pageSize,
          // searchTerm,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("User summaries fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching user summaries:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
