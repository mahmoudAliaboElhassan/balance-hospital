// src/state/slices/rosterManagement.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createBasicRoster,
  createCompleteRoster,
  getRosters,
  getRosterById,
  updateRosterStatus,
  addWorkingHours,
  applyContractingTemplate,
  getRosterCompletionStatus,
  assignDoctor,
  getDoctorRequests,
  processDoctorRequest,
  getRosterAnalytics,
  searchColleagues,
  getDoctorSchedule,
  getMySchedule,
  exportRoster,
} from "../act/actRosterManagement";

const initialState = {
  // Roster Management
  rosters: [],
  selectedRoster: null,
  rosterCompletionStatus: null,
  rosterAnalytics: null,

  // Doctor Requests
  doctorRequests: [],
  selectedRequest: null,

  // Schedule and Display
  doctorSchedule: null,
  mySchedule: null,
  colleagueSearchResults: [],

  // Pagination
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
  },

  // Loading States
  loading: {
    create: false,
    update: false,
    delete: false,
    fetch: false,
    assign: false,
    export: false,
    analytics: false,
  },

  // Success States
  success: {
    create: false,
    update: false,
    delete: false,
    assign: false,
    export: false,
  },

  // Error States
  error: null,
  createError: null,
  updateError: null,
  assignError: null,
  exportError: null,
};

const rosterManagementSlice = createSlice({
  name: "rosterManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.assignError = null;
      state.exportError = null;
    },
    clearSuccess: (state) => {
      state.success = {
        create: false,
        update: false,
        delete: false,
        assign: false,
        export: false,
      };
    },
    clearSelectedRoster: (state) => {
      state.selectedRoster = null;
      state.rosterCompletionStatus = null;
      state.rosterAnalytics = null;
    },
    clearDoctorRequests: (state) => {
      state.doctorRequests = [];
      state.selectedRequest = null;
    },
    clearScheduleData: (state) => {
      state.doctorSchedule = null;
      state.mySchedule = null;
      state.colleagueSearchResults = [];
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Create Basic Roster
    builder
      .addCase(createBasicRoster.pending, (state) => {
        state.loading.create = true;
        state.createError = null;
        state.success.create = false;
      })
      .addCase(createBasicRoster.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success.create = true;
        state.rosters.unshift(action.payload.data);
      })
      .addCase(createBasicRoster.rejected, (state, action) => {
        state.loading.create = false;
        state.createError = action.payload;
      });

    // Create Complete Roster
    builder
      .addCase(createCompleteRoster.pending, (state) => {
        state.loading.create = true;
        state.createError = null;
        state.success.create = false;
      })
      .addCase(createCompleteRoster.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success.create = true;
        state.rosters.unshift(action.payload.data);
      })
      .addCase(createCompleteRoster.rejected, (state, action) => {
        state.loading.create = false;
        state.createError = action.payload;
      });

    // Get Rosters
    builder
      .addCase(getRosters.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(getRosters.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.rosters = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getRosters.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    // Get Roster By ID
    builder
      .addCase(getRosterById.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(getRosterById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.selectedRoster = action.payload.data;
      })
      .addCase(getRosterById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    // Update Roster Status
    builder
      .addCase(updateRosterStatus.pending, (state) => {
        state.loading.update = true;
        state.updateError = null;
        state.success.update = false;
      })
      .addCase(updateRosterStatus.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.update = true;
        if (state.selectedRoster) {
          state.selectedRoster.status = action.payload.data.status;
        }
        // Update in rosters array too
        const index = state.rosters.findIndex(
          (r) => r.id === action.payload.data.id
        );
        if (index !== -1) {
          state.rosters[index] = {
            ...state.rosters[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(updateRosterStatus.rejected, (state, action) => {
        state.loading.update = false;
        state.updateError = action.payload;
      });

    // Add Working Hours
    builder
      .addCase(addWorkingHours.pending, (state) => {
        state.loading.update = true;
        state.updateError = null;
        state.success.update = false;
      })
      .addCase(addWorkingHours.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.update = true;
      })
      .addCase(addWorkingHours.rejected, (state, action) => {
        state.loading.update = false;
        state.updateError = action.payload;
      });

    // Apply Contracting Template
    builder
      .addCase(applyContractingTemplate.pending, (state) => {
        state.loading.update = true;
        state.updateError = null;
        state.success.update = false;
      })
      .addCase(applyContractingTemplate.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.update = true;
      })
      .addCase(applyContractingTemplate.rejected, (state, action) => {
        state.loading.update = false;
        state.updateError = action.payload;
      });

    // Get Roster Completion Status
    builder
      .addCase(getRosterCompletionStatus.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(getRosterCompletionStatus.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.rosterCompletionStatus = action.payload.data;
      })
      .addCase(getRosterCompletionStatus.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    // Assign Doctor
    builder
      .addCase(assignDoctor.pending, (state) => {
        state.loading.assign = true;
        state.assignError = null;
        state.success.assign = false;
      })
      .addCase(assignDoctor.fulfilled, (state, action) => {
        state.loading.assign = false;
        state.success.assign = true;
      })
      .addCase(assignDoctor.rejected, (state, action) => {
        state.loading.assign = false;
        state.assignError = action.payload;
      });

    // Get Doctor Requests
    builder
      .addCase(getDoctorRequests.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(getDoctorRequests.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.doctorRequests = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getDoctorRequests.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    // Process Doctor Request
    builder
      .addCase(processDoctorRequest.pending, (state) => {
        state.loading.update = true;
        state.updateError = null;
        state.success.update = false;
      })
      .addCase(processDoctorRequest.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.update = true;
        // Update the request in the array
        const index = state.doctorRequests.findIndex(
          (r) => r.id === action.payload.data.id
        );
        if (index !== -1) {
          state.doctorRequests[index] = {
            ...state.doctorRequests[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(processDoctorRequest.rejected, (state, action) => {
        state.loading.update = false;
        state.updateError = action.payload;
      });

    // Get Roster Analytics
    builder
      .addCase(getRosterAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.error = null;
      })
      .addCase(getRosterAnalytics.fulfilled, (state, action) => {
        state.loading.analytics = false;
        state.rosterAnalytics = action.payload.data;
      })
      .addCase(getRosterAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.error = action.payload;
      });

    // Search Colleagues
    builder
      .addCase(searchColleagues.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(searchColleagues.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.colleagueSearchResults = action.payload.data || [];
      })
      .addCase(searchColleagues.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    // Get Doctor Schedule
    builder
      .addCase(getDoctorSchedule.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(getDoctorSchedule.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.doctorSchedule = action.payload.data;
      })
      .addCase(getDoctorSchedule.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    // Get My Schedule
    builder
      .addCase(getMySchedule.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(getMySchedule.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.mySchedule = action.payload.data;
      })
      .addCase(getMySchedule.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    // Export Roster
    builder
      .addCase(exportRoster.pending, (state) => {
        state.loading.export = true;
        state.exportError = null;
        state.success.export = false;
      })
      .addCase(exportRoster.fulfilled, (state, action) => {
        state.loading.export = false;
        state.success.export = true;
      })
      .addCase(exportRoster.rejected, (state, action) => {
        state.loading.export = false;
        state.exportError = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearSelectedRoster,
  clearDoctorRequests,
  clearScheduleData,
  setPagination,
} = rosterManagementSlice.actions;

export default rosterManagementSlice.reducer;
