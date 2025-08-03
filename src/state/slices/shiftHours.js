import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";
import {
  getShiftHoursTypes,
  getShiftHoursTypeById,
  createShiftHoursType,
  updateShiftHoursType,
  deleteShiftHoursType,
} from "../act/actShiftHours";
import UseInitialStates from "../../hooks/use-initial-state";

// Helper function for client-side search filtering
const filterDataBySearch = (data, search) => {
  if (!search) return data;
  const searchTerm = search.toLowerCase();
  return data.filter(
    (item) =>
      item.nameArabic?.toLowerCase().includes(searchTerm) ||
      item.nameEnglish?.toLowerCase().includes(searchTerm) ||
      item.code?.toLowerCase().includes(searchTerm)
  );
};

// Helper function for client-side pagination
const paginateData = (data, page, pageSize) => {
  const totalCount = data.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const { initialStateShiftHoursTypes } = UseInitialStates();

// Enhanced initial state
const initialState = {
  ...initialStateShiftHoursTypes,
  // All data from server (filtered by server-side filters)
  allShiftHoursTypes: [],
  // Currently displayed data (after client-side search and pagination)
  shiftHoursTypes: [],
  // Loading states
  loadingGetShiftHoursTypes: false,
  loadingGetSingleShiftHoursType: false,
  loadingCreateShiftHoursType: false,
  loadingUpdateShiftHoursType: false,
  loadingDeleteShiftHoursType: false,
  // Error states
  error: null,
  singleShiftHoursTypeError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  // Success states
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  // Messages
  message: "",
  createMessage: "",
  updateMessage: "",
  deleteMessage: "",
  // Single item
  selectedShiftHoursType: null,
  // Filters
  filters: {
    search: "",
    statusFilter: "all", // all, active, inactive
    period: "", // empty string means all periods
    minHours: null,
    maxHours: null,
    createdFromDate: null,
    createdToDate: null,
    orderBy: "nameArabic",
    orderDesc: true,
    page: 1,
    pageSize: 10,
  },
  // Pagination info
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  // Timestamp
  timestamp: null,
};

export const shiftHoursTypeSlice = createSlice({
  name: "shiftHoursTypeSlice",
  initialState,
  reducers: {
    // Search filter (client-side)
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1;

      // Apply client-side search filtering and pagination
      const searchFiltered = filterDataBySearch(state.allShiftHoursTypes, action.payload);
      const result = paginateData(searchFiltered, 1, state.filters.pageSize);
      
      state.shiftHoursTypes = result.data;
      state.pagination = result.pagination;
    },

    // Server-side filters (will trigger API call)
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Status filter
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
      state.filters.page = 1;
    },

    // Period filter
    setPeriodFilter: (state, action) => {
      state.filters.period = action.payload;
      state.filters.page = 1;
    },

    // Pagination
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;

      // Apply client-side pagination
      const searchFiltered = filterDataBySearch(state.allShiftHoursTypes, state.filters.search);
      const result = paginateData(searchFiltered, action.payload, state.filters.pageSize);
      
      state.shiftHoursTypes = result.data;
      state.pagination = result.pagination;
    },

    setPageSize: (state, action) => {
      state.filters.pageSize = action.payload;
      state.filters.page = 1;

      // Apply client-side pagination
      const searchFiltered = filterDataBySearch(state.allShiftHoursTypes, state.filters.search);
      const result = paginateData(searchFiltered, 1, action.payload);
      
      state.shiftHoursTypes = result.data;
      state.pagination = result.pagination;
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        statusFilter: state.filters.statusFilter, // Keep status filter
      };
    },

    // Clear data
    clearShiftHoursTypes: (state) => {
      state.shiftHoursTypes = [];
      state.allShiftHoursTypes = [];
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
      state.loadingCreateShiftHoursType = false;
      state.createError = null;
      state.createSuccess = false;
      state.createMessage = "";
    },

    resetUpdateForm: (state) => {
      state.loadingUpdateShiftHoursType = false;
      state.updateError = null;
      state.updateSuccess = false;
      state.updateMessage = "";
    },

    resetDeleteForm: (state) => {
      state.loadingDeleteShiftHoursType = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },

    // Single shift hours type actions
    clearSingleShiftHoursType: (state) => {
      state.selectedShiftHoursType = null;
      state.singleShiftHoursTypeError = null;
    },

    clearSingleShiftHoursTypeError: (state) => {
      state.singleShiftHoursTypeError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Get Shift Hours Types
      .addCase(getShiftHoursTypes.pending, (state) => {
        state.loadingGetShiftHoursTypes = true;
        state.error = null;
      })
      .addCase(getShiftHoursTypes.fulfilled, (state, action) => {
        state.loadingGetShiftHoursTypes = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Store server-filtered data
          state.allShiftHoursTypes = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;

          // Apply client-side search filtering and pagination
          const searchFiltered = filterDataBySearch(state.allShiftHoursTypes, state.filters.search);
          const result = paginateData(searchFiltered, state.filters.page, state.filters.pageSize);
          
          state.shiftHoursTypes = result.data;
          state.pagination = result.pagination;
        }
      })
      .addCase(getShiftHoursTypes.rejected, (state, action) => {
        state.loadingGetShiftHoursTypes = false;
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("shiftHoursTypes.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Shift Hours Type by ID
      .addCase(getShiftHoursTypeById.pending, (state) => {
        state.loadingGetSingleShiftHoursType = true;
        state.singleShiftHoursTypeError = null;
      })
      .addCase(getShiftHoursTypeById.fulfilled, (state, action) => {
        state.loadingGetSingleShiftHoursType = false;
        state.singleShiftHoursTypeError = null;

        const response = action.payload;
        if (response.success) {
          state.selectedShiftHoursType = response.data;
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getShiftHoursTypeById.rejected, (state, action) => {
        state.loadingGetSingleShiftHoursType = false;
        state.selectedShiftHoursType = null;
        state.singleShiftHoursTypeError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("shiftHoursTypes.fetchError"),
          errors: action.payload?.errors || [],
          status: action.payload?.status || 500,
          timestamp: new Date().toISOString(),
        };
      })

      // Create Shift Hours Type
      .addCase(createShiftHoursType.pending, (state) => {
        state.loadingCreateShiftHoursType = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createShiftHoursType.fulfilled, (state, action) => {
        state.loadingCreateShiftHoursType = false;
        state.createError = null;

        const response = action.payload;
        if (response.success) {
          state.createSuccess = true;
          state.createMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("shiftHoursTypes.success.created");

          // Add new item to the data array if response includes the created item
          if (response.data) {
            state.allShiftHoursTypes = [response.data, ...state.allShiftHoursTypes];

            // Re-apply current view
            const searchFiltered = filterDataBySearch(state.allShiftHoursTypes, state.filters.search);
            const result = paginateData(searchFiltered, state.filters.page, state.filters.pageSize);
            
            state.shiftHoursTypes = result.data;
            state.pagination = result.pagination;
          }
        }
      })
      .addCase(createShiftHoursType.rejected, (state, action) => {
        state.loadingCreateShiftHoursType = false;
        state.createSuccess = false;
        state.createError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("shiftHoursTypes.error.createFailed"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Update Shift Hours Type
      .addCase(updateShiftHoursType.pending, (state) => {
        state.loadingUpdateShiftHoursType = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateShiftHoursType.fulfilled, (state, action) => {
        state.loadingUpdateShiftHoursType = false;
        state.updateError = null;

        const response = action.payload;
        if (response.success) {
          state.updateSuccess = true;
          state.updateMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("shiftHoursTypes.success.updated");

          // Update the selected shift hours type if it exists
          if (state.selectedShiftHoursType && response.data) {
            state.selectedShiftHoursType = response.data;
          }

          // Update in array if data is provided
          if (response.data) {
            const index = state.allShiftHoursTypes.findIndex(
              (item) => item.id === response.data.id
            );
            if (index !== -1) {
              state.allShiftHoursTypes[index] = response.data;
            }

            // Re-apply current view
            const searchFiltered = filterDataBySearch(state.allShiftHoursTypes, state.filters.search);
            const result = paginateData(searchFiltered, state.filters.page, state.filters.pageSize);
            
            state.shiftHoursTypes = result.data;
            state.pagination = result.pagination;
          }
        }
      })
      .addCase(updateShiftHoursType.rejected, (state, action) => {
        state.loadingUpdateShiftHoursType = false;
        state.updateSuccess = false;
        state.updateError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("shiftHoursTypes.error.updateFailed"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Delete Shift Hours Type
      .addCase(deleteShiftHoursType.pending, (state) => {
        state.loadingDeleteShiftHoursType = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteShiftHoursType.fulfilled, (state, action) => {
        state.loadingDeleteShiftHoursType = false;
        state.deleteError = null;

        const response = action.payload;
        if (response.success) {
          state.deleteSuccess = true;
          state.deleteMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("shiftHoursTypes.success.deleted");

          // Remove deleted item from array
          if (response.deletedId) {
            state.allShiftHoursTypes = state.allShiftHoursTypes.filter(
              (item) => item.id !== response.deletedId
            );

            // Re-apply current view and adjust page if necessary
            const searchFiltered = filterDataBySearch(state.allShiftHoursTypes, state.filters.search);
            let currentPage = state.filters.page;
            const maxPage = Math.ceil(searchFiltered.length / state.filters.pageSize);
            
            if (currentPage > maxPage && maxPage > 0) {
              currentPage = maxPage;
              state.filters.page = currentPage;
            }

            const result = paginateData(searchFiltered, currentPage, state.filters.pageSize);
            
            state.shiftHoursTypes = result.data;
            state.pagination = result.pagination;
          }
        }
      })
      .addCase(deleteShiftHoursType.rejected, (state, action) => {
        state.loadingDeleteShiftHoursType = false;
        state.deleteSuccess = false;
        state.deleteError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("shiftHoursTypes.error.deleteFailed"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      });
  },
});

export const {
  setSearchFilter,
  setFilters,
  setStatusFilter,
  setPeriodFilter,
  setCurrentPage,
  setPageSize,
  clearFilters,
  clearShiftHoursTypes,
  clearError,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  resetCreateForm,
  resetUpdateForm,
  resetDeleteForm,
  clearSingleShiftHoursType,
  clearSingleShiftHoursTypeError,
} = shiftHoursTypeSlice.actions;

export default shiftHoursTypeSlice.reducer;