import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"

// Get leaves list
export const getLeaves = createAsyncThunk(
  "leaves/getLeaves",
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()

      if (categoryId !== undefined && categoryId !== null) {
        params.append("categoryId", categoryId)
      }

      const queryString = params.toString()
      const url = `/api/v1/Leaves/inbox${queryString ? `?${queryString}` : ""}`

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      return { leaves: response.data }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب الأجازات",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })
    }
  }
)

// Get single leave for review
export const getLeaveForReview = createAsyncThunk(
  "leaves/getLeaveForReview",
  async ({ id }, { rejectWithValue }) => {
    try {
      const url = `/api/v1/Leaves/${id}/review`

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      return { leave: response.data }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب تفاصيل الأجازة",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })
    }
  }
)

// Approve leave
export const approveLeave = createAsyncThunk(
  "leaves/approveLeave",
  async ({ id }, { rejectWithValue }) => {
    try {
      const url = `/api/v1/Leaves/${id}/approve`

      const response = await axiosInstance.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )

      return { leave: response.data, id }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في الموافقة على الأجازة",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })
    }
  }
)

// Reject leave - FIXED: was using wrong action type "leaves/getLeaveForReview"
export const rejectLeave = createAsyncThunk(
  "leaves/rejectLeave",
  async ({ id }, { rejectWithValue }) => {
    try {
      const url = `/api/v1/Leaves/${id}/reject`

      const response = await axiosInstance.put(
        url,
        { reason: "Rejected via admin panel" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )

      return { leave: response.data, id }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في رفض الأجازة",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })
    }
  }
)
