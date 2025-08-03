import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";
import {
  getScientificDegrees,
  getScientificDegreesForSignup,
  getScientificDegreeById,
  getScientificDegreeByCode,
  createScientificDegree,
  updateScientificDegree,
  deleteScientificDegree,
} from "../act/actScientificDegree";
import UseInitialStates from "../../hooks/use-initial-state";

const { initialStateScientificDegrees } = UseInitialStates();

export const scientificDegreeSlice = createSlice({
  name: "scientificDegreeSlice",
  initialState: initialStateScientificDegrees,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
    },

    setPageSize: (state, action) => {
      state.filters.pageSize = action.payload;
      state.filters.page = 1; // Reset to first page when changing page size
    },

    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to first page when searching
    },

    setCodeFilter: (state, action) => {
      state.filters.code = action.payload;
      state.filters.page = 1;
    },

    setStatusFilter: (state, action) => {
      state.filters.isActive = action.payload;
      state.filters.page = 1;
    },

    setDateRangeFilter: (state, action) => {
      state.filters.createdFromDate = action.payload.fromDate;
      state.filters.createdToDate = action.payload.toDate;
      state.filters.page = 1;
    },

    setSortFilter: (state, action) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortDirection = action.payload.sortDirection;
    },

    clearFilters: (state) => {
      state.filters = {
        search: "",
        code: "",
        isActive: undefined,
        createdFromDate: "",
        createdToDate: "",
        sortBy: 5, // Default to CreatedAt
        sortDirection: 1, // Default to Descending (newest first)
        page: 1,
        pageSize: 10,
      };
    },

    // Clear data
    clearScientificDegrees: (state) => {
      state.scientificDegrees = [];
      state.pagination = null;
    },

    // Clear errors and states
    clearError: (state) => {
      state.error = null;
    },

    clearCreateSuccess: (state) => {
      state.createSuccess = false;
      state.createMessage = "";
    },

    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
      state.updateMessage = "";
    },

    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },

    // Reset form states
    resetCreateForm: (state) => {
      state.loadingCreateScientificDegree = false;
      state.createError = null;
      state.createSuccess = false;
      state.createMessage = "";
    },

    resetUpdateForm: (state) => {
      state.loadingUpdateScientificDegree = false;
      state.updateError = null;
      state.updateSuccess = false;
      state.updateMessage = "";
    },

    resetDeleteForm: (state) => {
      state.loadingDeleteScientificDegree = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },

    // Single scientific degree actions
    clearSingleScientificDegree: (state) => {
      state.selectedScientificDegree = null;
      state.singleScientificDegreeError = null;
    },

    clearSingleScientificDegreeError: (state) => {
      state.singleScientificDegreeError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Get Scientific Degrees
      .addCase(getScientificDegrees.pending, (state) => {
        state.loadingGetScientificDegrees = true;
        state.error = null;
      })
      .addCase(getScientificDegrees.fulfilled, (state, action) => {
        state.loadingGetScientificDegrees = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Handle paginated response
          if (response.data.items) {
            state.scientificDegrees = response.data.items;
            state.pagination = {
              totalCount: response.data.totalCount,
              page: response.data.page,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
              hasNextPage: response.data.hasNextPage,
              hasPreviousPage: response.data.hasPreviousPage,
            };
          } else {
            // Handle non-paginated response
            state.scientificDegrees = response.data || [];
            state.pagination = null;
          }

          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getScientificDegrees.rejected, (state, action) => {
        state.loadingGetScientificDegrees = false;
        state.scientificDegrees = [];
        state.pagination = null;
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("scientificDegrees.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Scientific Degrees for Signup
      .addCase(getScientificDegreesForSignup.pending, (state) => {
        state.loadingGetScientificDegreesForSignup = true;
        state.error = null;
      })
      .addCase(getScientificDegreesForSignup.fulfilled, (state, action) => {
        state.loadingGetScientificDegreesForSignup = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          state.scientificDegreesForSignup = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getScientificDegreesForSignup.rejected, (state, action) => {
        state.loadingGetScientificDegreesForSignup = false;
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("scientificDegrees.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Scientific Degree by ID
      .addCase(getScientificDegreeById.pending, (state) => {
        state.loadingGetSingleScientificDegree = true;
        state.singleScientificDegreeError = null;
      })
      .addCase(getScientificDegreeById.fulfilled, (state, action) => {
        state.loadingGetSingleScientificDegree = false;
        state.singleScientificDegreeError = null;

        const response = action.payload;
        if (response.success) {
          state.selectedScientificDegree = response.data;
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getScientificDegreeById.rejected, (state, action) => {
        state.loadingGetSingleScientificDegree = false;
        state.selectedScientificDegree = null;
        state.singleScientificDegreeError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("scientificDegrees.fetchError"),
          errors: action.payload?.errors || [],
          status: action.payload?.status || 500,
          timestamp: new Date().toISOString(),
        };
      })

      // Get Scientific Degree by Code
      .addCase(getScientificDegreeByCode.pending, (state) => {
        state.loadingGetSingleScientificDegree = true;
        state.singleScientificDegreeError = null;
      })
      .addCase(getScientificDegreeByCode.fulfilled, (state, action) => {
        state.loadingGetSingleScientificDegree = false;
        state.singleScientificDegreeError = null;

        const response = action.payload;
        if (response.success) {
          state.selectedScientificDegree = response.data;
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getScientificDegreeByCode.rejected, (state, action) => {
        state.loadingGetSingleScientificDegree = false;
        state.selectedScientificDegree = null;
        state.singleScientificDegreeError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("scientificDegrees.fetchError"),
          errors: action.payload?.errors || [],
          status: action.payload?.status || 500,
          timestamp: new Date().toISOString(),
        };
      })

      // Create Scientific Degree
      .addCase(createScientificDegree.pending, (state) => {
        state.loadingCreateScientificDegree = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createScientificDegree.fulfilled, (state, action) => {
        state.loadingCreateScientificDegree = false;
        state.createError = null;

        const response = action.payload;
        if (response.success) {
          state.createSuccess = true;
          state.createMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("scientificDegrees.success.created");
        }
      })
      .addCase(createScientificDegree.rejected, (state, action) => {
        state.loadingCreateScientificDegree = false;
        state.createSuccess = false;
        state.createError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("scientificDegrees.error.createFailed"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Update Scientific Degree
      .addCase(updateScientificDegree.pending, (state) => {
        state.loadingUpdateScientificDegree = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateScientificDegree.fulfilled, (state, action) => {
        state.loadingUpdateScientificDegree = false;
        state.updateError = null;

        const response = action.payload;
        if (response.success) {
          state.updateSuccess = true;
          state.updateMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("scientificDegrees.success.updated");

          // Update the selected scientific degree if it exists
          if (state.selectedScientificDegree && response.data) {
            state.selectedScientificDegree = response.data;
          }
        }
      })
      .addCase(updateScientificDegree.rejected, (state, action) => {
        state.loadingUpdateScientificDegree = false;
        state.updateSuccess = false;
        state.updateError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("scientificDegrees.error.updateFailed"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Delete Scientific Degree
      .addCase(deleteScientificDegree.pending, (state) => {
        state.loadingDeleteScientificDegree = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteScientificDegree.fulfilled, (state, action) => {
        state.loadingDeleteScientificDegree = false;
        state.deleteError = null;

        const response = action.payload;
        if (response.success) {
          state.deleteSuccess = true;
          state.deleteMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("scientificDegrees.success.deleted");
        }
      })
      .addCase(deleteScientificDegree.rejected, (state, action) => {
        state.loadingDeleteScientificDegree = false;
        state.deleteSuccess = false;
        state.deleteError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("scientificDegrees.error.deleteFailed"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      });
  },
});

export const {
  setFilters,
  setCurrentPage,
  setPageSize,
  setSearchFilter,
  setCodeFilter,
  setStatusFilter,
  setDateRangeFilter,
  setSortFilter,
  clearFilters,
  clearScientificDegrees,
  clearError,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  resetCreateForm,
  resetUpdateForm,
  resetDeleteForm,
  clearSingleScientificDegree,
  clearSingleScientificDegreeError,
} = scientificDegreeSlice.actions;

export default scientificDegreeSlice.reducer;
