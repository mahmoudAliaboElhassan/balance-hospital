import { createSlice } from "@reduxjs/toolkit"
import {
  getDashboardData,
  getDoctorReports,
  getReports,
  getReportsAttend,
} from "../act/actReports"

// Initial state additions
const initialState = {
  reports: null,
  reportsAttend: null,
  loadingGetReports: false,
  loadingGetReportsAttend: false,
  getReportsError: null,
  getReportsAttendError: null,
  dashboardData: null,
  loadingGetDashboardData: false,
  dashboardError: null,
  lastUpdated: null,
  doctorReport: null,
  loadingDoctorReport: false,
  doctorReportError: null,
}

// Reducer cases for getReports
export const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReports: (state) => {
      state.reports = null
      state.getReportsError = null
    },
    clearReportsAttend: (state) => {
      state.reportsAttend = null
      state.getReportsAttendError = null
    },
    clearReportsError: (state) => {
      state.getReportsError = null
    },
    clearDashboardData: (state) => {
      state.dashboardData = null
      state.dashboardError = null
      state.lastUpdated = null
    },
    clearDashboardError: (state) => {
      state.dashboardError = null
    },
    clearDoctorReport: (state) => {
      state.doctorReport = null
      state.loadingDoctorReport = false
      state.doctorReportError = null
    },
    clearDoctorReportError: (state) => {
      state.doctorReportError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReports.pending, (state) => {
        state.loadingGetReports = true
        state.getReportsError = null
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loadingGetReports = false
        state.reports = action.payload.reports.data
        const pageSize = action.payload.pageSize
        console.log("Page Size:", pageSize)
        state.totalPages = Math.ceil(
          action.payload.reports.data.totalRecords / pageSize
        )

        console.log("Total Pages:", state.totalPages)
        state.getReportsError = null
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loadingGetReports = false
        state.getReportsError = action.payload
      })
      .addCase(getReportsAttend.pending, (state) => {
        state.loadingGetReportsAttend = true
        state.getReportsError = null
      })
      .addCase(getReportsAttend.fulfilled, (state, action) => {
        state.loadingGetReportsAttend = false
        state.reportsAttend = action.payload.reports.data
        // const pageSize = action.payload.pageSize
        // console.log("Page Size:", pageSize)
        // state.totalPages = Math.ceil(
        //   action.payload.reports.data.totalRecords / pageSize
        // )

        console.log("reportsAttend:", action.payload)

        console.log("Total Pages:", state.totalPages)
        state.getReportsError = null
      })
      .addCase(getReportsAttend.rejected, (state, action) => {
        state.loadingGetReportsAttend = false
        state.getReportsAttendError = action.payload
      })

      .addCase(getDashboardData.pending, (state) => {
        state.loadingGetDashboardData = true
        state.dashboardError = null
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loadingGetDashboardData = false
        state.dashboardData = action.payload.data
        state.lastUpdated = new Date().toISOString()
        state.dashboardError = null
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loadingGetDashboardData = false
        state.dashboardError = action.payload
        state.dashboardData = null
      })
      .addCase(getDoctorReports.pending, (state) => {
        state.loadingDoctorReport = true
        state.doctorReportError = null
      })
      .addCase(getDoctorReports.fulfilled, (state, action) => {
        state.loadingDoctorReport = false
        state.doctorReport = action.payload.data
      })
      .addCase(getDoctorReports.rejected, (state, action) => {
        state.loadingDoctorReport = false
        state.doctorReportError = action.payload
      })
  },
})

export const {
  clearReports,
  clearReportsError,
  clearDashboardData,
  clearDashboardError,
  clearDoctorReport,
  clearDoctorReportError,
} = reportSlice.actions

export default reportSlice.reducer
