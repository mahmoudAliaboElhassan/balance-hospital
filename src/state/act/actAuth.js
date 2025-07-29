import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const logIn = createAsyncThunk(
  "authSlice/logIn",
  async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post("/api/v1/auth/login", userData);
      console.log("from slice res is");
      console.log(res);
      return res.data;
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.status === 400) {
        console.log("400 Forbidden - User not authorized from slice");
      }
      return rejectWithValue(error);
    }
  }
);
