import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"

export const getReports = createAsyncThunk(
  "reports/getReports",
  async (
    {
      month,
      year,
      categoryId,
      departmentId,
      doctorId,
      scientificDegreeId,
      contractingTypeId,
      page = 1,
      pageSize,
    },
    { rejectWithValue }
  ) => {
    try {
      // Build query parameters
      const params = new URLSearchParams()

      if (categoryId !== undefined && categoryId !== null) {
        params.append("categoryId", categoryId)
      }
      if (departmentId !== undefined && departmentId !== null) {
        params.append("departmentId", departmentId)
      }
      if (doctorId !== undefined && doctorId !== null) {
        params.append("doctorId", doctorId)
      }
      if (scientificDegreeId !== undefined && scientificDegreeId !== null) {
        params.append("scientificDegreeId", scientificDegreeId)
      }
      if (contractingTypeId !== undefined && contractingTypeId !== null) {
        params.append("contractingTypeId", contractingTypeId)
      }
      if (page !== undefined && page !== null) {
        params.append("page", page)
      }
      if (pageSize !== undefined && pageSize !== null) {
        params.append("pageSize", pageSize)
      }

      const queryString = params.toString()
      const url = `/api/v1/ScheduleReporting/monthly/${month}/${year}${
        queryString ? `?${queryString}` : ""
      }`

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      return { reports: response.data, pageSize }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب أنواع الفئات",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })
    }
  }
)
