import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"

// Get User Summaries action
export const getUserSummaries = createAsyncThunk(
  "usersSlice/getUserSummaries",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const { page = 1, pageSize = 1000, categoryId, searchTerm = "" } = params

      // Build query params object
      const queryParams = {
        isEmailVerified: true,
        isApproved: true,
      }

      // Add optional parameters if provided
      if (page) queryParams.page = page
      if (pageSize) queryParams.pageSize = pageSize
      if (searchTerm) queryParams.searchTerm = searchTerm
      if (categoryId) queryParams.categoryId = categoryId

      const res = await axiosInstance.get("/api/v1/Users/summaries", {
        params: queryParams,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("User summaries fetched successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error fetching user summaries:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const doctorForAssignment = createAsyncThunk(
  "usersSlice/doctorForAssignment",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const queryParams = new URLSearchParams()
      queryParams.append("IsActive", true)
      if (params.search) queryParams.append("Search", params.search)
      if (params.categoryId !== undefined)
        queryParams.append("CategoryId", params.categoryId)
      const res = await axiosInstance.get(
        `/api/v1/role/doctors-for-assignment${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("User for assignment fetched successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error fetching user summaries:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const getDoctorData = createAsyncThunk(
  "usersSlice/getDoctorData",
  async ({ userId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.get(`/api/v1/Users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("User Data  fetched successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error fetching user Data:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const updateDoctorData = createAsyncThunk(
  "usersSlice/updateDoctorData",
  async ({ userId, userData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.put(
        `/api/v1/Users/${userId}`,
        userData, // empty body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("User Data  updated successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error updating user Data:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
