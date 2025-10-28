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
      // if (page !== undefined && page !== null) {
      //   params.append("page", page)
      // }
      // if (pageSize !== undefined && pageSize !== null) {
      //   params.append("pageSize", pageSize)
      // }

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
export const getReportsAttend = createAsyncThunk(
  "reports/getReportsAttend",
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
      // if (page !== undefined && page !== null) {
      //   params.append("page", page)
      // }
      // if (pageSize !== undefined && pageSize !== null) {
      //   params.append("pageSize", pageSize)
      // }

      const queryString = params.toString()
      const url = `api/v1/ScheduleReporting/attendance/monthly/${month}/${year}
${queryString ? `?${queryString}` : ""}`

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
export const exportExcel = createAsyncThunk(
  "reports/exportExcel",
  async (
    {
      month,
      year,
      categoryId,
      departmentId,
      doctorId,
      scientificDegreeId,
      contractingTypeId,
      language,
      format,
    },
    { rejectWithValue }
  ) => {
    try {
      // Build request body
      const requestBody = {
        month,
        year,
      }

      // Add optional parameters
      if (categoryId !== undefined && categoryId !== null) {
        requestBody.categoryId = categoryId
      }
      if (departmentId !== undefined && departmentId !== null) {
        requestBody.departmentId = departmentId
      }
      if (doctorId !== undefined && doctorId !== null) {
        requestBody.doctorId = doctorId
      }
      if (scientificDegreeId !== undefined && scientificDegreeId !== null) {
        requestBody.scientificDegreeId = scientificDegreeId
      }
      if (contractingTypeId !== undefined && contractingTypeId !== null) {
        requestBody.contractingTypeId = contractingTypeId
      }
      if (format !== undefined && format !== null) {
        requestBody.format = format
      }
      if (language !== undefined && language !== null) {
        requestBody.language = language
      }
      requestBody.IncludeStatistics = true
      requestBody.IncludeCategories = true

      const url = `/api/v1/ScheduleReporting/export/excel`

      const response = await axiosInstance.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      })

      // Return the blob wrapped in an object
      return {
        blob: response.data,
        format,
        contentType: response.headers["content-type"],
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في تصدير التقرير",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })
    }
  }
)
export const getDashboardData = createAsyncThunk(
  "reports/getDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const url = `/api/v1/Dashboard/overview`

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      return response.data
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب بيانات لوحة التحكم",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })
    }
  }
)
export const getDoctorReports = createAsyncThunk(
  "reports/getDoctorReports",
  async ({ doctorId, dateFrom, dateTo }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append("DateFrom", dateFrom)
      if (dateTo) params.append("DateTo", dateTo)

      const queryString = params.toString()
      const url = `/api/v1/Users/doctor/${doctorId}/report${
        queryString ? `?${queryString}` : ""
      }`

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      return response.data
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب بيانات الدكتور",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })
    }
  }
)
