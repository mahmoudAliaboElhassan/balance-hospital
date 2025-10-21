// reportSlice.js - Add these to your existing category slice

import { createSlice } from "@reduxjs/toolkit"
import { getReports } from "../act/actReports"

// Initial state additions
const initialState = {
  reports: null,
  loadingGetReports: false,
  getReportsError: null,
}

// Reducer cases for getReports
export const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    // ... existing reducers
    clearReports: (state) => {
      state.reports = null
      state.getReportsError = null
    },
    clearReportsError: (state) => {
      state.getReportsError = null
    },
  },
  extraReducers: (builder) => {
    // ... existing extra reducers

    // Get Reports
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
  },
})

export const { clearReports, clearReportsError } = reportSlice.actions

export default reportSlice.reducer
