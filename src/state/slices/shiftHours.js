import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";
import {
  getShiftHoursTypes,
  getActiveShiftHoursTypes,
  getShiftHoursTypeById,
  getShiftHoursTypesByPeriod,
  getPagedShiftHoursTypes,
  createShiftHoursType,
  updateShiftHoursType,
  deleteShiftHoursType,
} from "../act/actShiftHours";
import UseInitialStates from "../../hooks/use-initial-state";

// Helper functions for filtering and pagination
const filterData = (data, search) => {
  if (!search) return data;
  const searchTerm = search.toLowerCase();
  return data.filter(
    (item) =>
      item.nameArabic?.toLowerCase().includes(searchTerm) ||
      item.nameEnglish?.toLowerCase().includes(searchTerm) ||
      item.code?.toLowerCase().includes(searchTerm) ||
      item.period?.toLowerCase().includes(searchTerm)
  );
};

const calculatePagination = (data, page, pageSize) => {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const { initialStateShiftHoursTypes } = UseInitialStates();

export const shiftHoursTypeSlice = createSlice({
  name: "shiftHoursTypeSlice",
  initialState: initialStateShiftHoursTypes,
  reducers: {
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
      state.pagination.page = action.payload;

      // Re-calculate pagination with current data
      const currentData =
        state.filters.statusFilter === "active"
          ? state.allActiveShiftHoursTypes
          : state.allShiftHoursTypes;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(
        filteredData,
        action.payload,
        state.filters.pageSize
      );

      if (state.filters.statusFilter === "active") {
        state.activeShiftHoursTypes = result.data;
      } else {
        state.shiftHoursTypes = result.data;
      }
      state.pagination = result.pagination;
    },

    setPageSize: (state, action) => {
      state.filters.pageSize = action.payload;
      state.filters.page = 1; // Reset to first page when changing page size
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1;

      // Re-calculate pagination with current data
      const currentData =
        state.filters.statusFilter === "active"
          ? state.allActiveShiftHoursTypes
          : state.allShiftHoursTypes;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(filteredData, 1, action.payload);

      if (state.filters.statusFilter === "active") {
        state.activeShiftHoursTypes = result.data;
      } else {
        state.shiftHoursTypes = result.data;
      }
      state.pagination = result.pagination;
    },

    // Search functionality
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to first page when searching
      state.pagination.page = 1;

      // Re-calculate pagination with filtered data
      const currentData =
        state.filters.statusFilter === "active"
          ? state.allActiveShiftHoursTypes
          : state.allShiftHoursTypes;

      const filteredData = filterData(currentData, action.payload);
      const result = calculatePagination(
        filteredData,
        1,
        state.filters.pageSize
      );

      if (state.filters.statusFilter === "active") {
        state.activeShiftHoursTypes = result.data;
      } else {
        state.shiftHoursTypes = result.data;
      }
      state.pagination = result.pagination;
    },

    // Status filter
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
      state.filters.page = 1;
      state.pagination.page = 1;

      // Get appropriate data
      const currentData =
        action.payload === "active"
          ? state.allActiveShiftHoursTypes
          : state.allShiftHoursTypes;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(
        filteredData,
        1,
        state.filters.pageSize
      );

      if (action.payload === "active") {
        state.activeShiftHoursTypes = result.data;
      } else {
        state.shiftHoursTypes = result.data;
      }
      state.pagination = result.pagination;
    },

    // Period filter
    setPeriodFilter: (state, action) => {
      state.filters.period = action.payload;
      state.filters.page = 1;
      state.pagination.page = 1;

      // Apply filters
      const baseData =
        state.filters.statusFilter === "active"
          ? state.allActiveShiftHoursTypes
          : state.allShiftHoursTypes;

      let filteredData = filterData(baseData, state.filters.search);

      // Apply period filter if specified
      if (action.payload && action.payload !== "all") {
        filteredData = filteredData.filter(
          (item) => item.period === action.payload
        );
      }

      const result = calculatePagination(
        filteredData,
        1,
        state.filters.pageSize
      );

      if (state.filters.statusFilter === "active") {
        state.activeShiftHoursTypes = result.data;
      } else {
        state.shiftHoursTypes = result.data;
      }
      state.pagination = result.pagination;
    },

    // Filter management
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        ...initialStateShiftHoursTypes.filters,
        statusFilter: state.filters.statusFilter, // Keep status filter
      };
    },

    // Clear data
    clearShiftHoursTypes: (state) => {
      state.shiftHoursTypes = [];
      state.allShiftHoursTypes = [];
    },

    clearActiveShiftHoursTypes: (state) => {
      state.activeShiftHoursTypes = [];
      state.allActiveShiftHoursTypes = [];
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
      // Get Shift Hours Types (All)
      .addCase(getShiftHoursTypes.pending, (state) => {
        state.loadingGetShiftHoursTypes = true;
        state.error = null;
      })
      .addCase(getShiftHoursTypes.fulfilled, (state, action) => {
        state.loadingGetShiftHoursTypes = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Store all data
          state.allShiftHoursTypes = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;

          // Apply current filters and pagination
          const filteredData = filterData(
            state.allShiftHoursTypes,
            state.filters.search
          );
          const result = calculatePagination(
            filteredData,
            state.filters.page,
            state.filters.pageSize
          );

          state.shiftHoursTypes = response.data;
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

      // Get Active Shift Hours Types
      .addCase(getActiveShiftHoursTypes.pending, (state) => {
        state.loadingGetActiveShiftHoursTypes = true;
        state.error = null;
      })
      .addCase(getActiveShiftHoursTypes.fulfilled, (state, action) => {
        state.loadingGetActiveShiftHoursTypes = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Store all active data
          state.allActiveShiftHoursTypes = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;

          // Apply current filters and pagination
          const filteredData = filterData(
            state.allActiveShiftHoursTypes,
            state.filters.search
          );
          const result = calculatePagination(
            filteredData,
            state.filters.page,
            state.filters.pageSize
          );

          state.activeShiftHoursTypes = response.data;
        }
      })
      .addCase(getActiveShiftHoursTypes.rejected, (state, action) => {
        state.loadingGetActiveShiftHoursTypes = false;
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

      // Get Shift Hours Types by Period
      .addCase(getShiftHoursTypesByPeriod.pending, (state) => {
        state.loadingGetShiftHoursTypesByPeriod = true;
        state.error = null;
      })
      .addCase(getShiftHoursTypesByPeriod.fulfilled, (state, action) => {
        state.loadingGetShiftHoursTypesByPeriod = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          state.shiftHoursTypesByPeriod = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getShiftHoursTypesByPeriod.rejected, (state, action) => {
        state.loadingGetShiftHoursTypesByPeriod = false;
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("shiftHoursTypes.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Paged Shift Hours Types
      .addCase(getPagedShiftHoursTypes.pending, (state) => {
        state.loadingGetPagedShiftHoursTypes = true;
        state.error = null;
      })
      .addCase(getPagedShiftHoursTypes.fulfilled, (state, action) => {
        state.loadingGetPagedShiftHoursTypes = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          state.pagedShiftHoursTypes = response.data || {};
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getPagedShiftHoursTypes.rejected, (state, action) => {
        state.loadingGetPagedShiftHoursTypes = false;
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("shiftHoursTypes.fetchError"),
          errors: action.payload?.errors || [],
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

          // Add new item to the data arrays if response includes the created item
          if (response.data) {
            state.allShiftHoursTypes.push(response.data);
            if (response.data.isActive) {
              state.allActiveShiftHoursTypes.push(response.data);
            }

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveShiftHoursTypes
                : state.allShiftHoursTypes;

            const filteredData = filterData(currentData, state.filters.search);
            const result = calculatePagination(
              filteredData,
              state.filters.page,
              state.filters.pageSize
            );

            if (state.filters.statusFilter === "active") {
              state.activeShiftHoursTypes = result.data;
            } else {
              state.shiftHoursTypes = result.data;
            }
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

          // Update in all arrays if data is provided
          if (response.data) {
            const updateItem = (array) => {
              const index = array.findIndex(
                (item) => item.id === response.data.id
              );
              if (index !== -1) {
                array[index] = response.data;
              }
            };

            updateItem(state.allShiftHoursTypes);
            updateItem(state.allActiveShiftHoursTypes);

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveShiftHoursTypes
                : state.allShiftHoursTypes;

            const filteredData = filterData(currentData, state.filters.search);
            const result = calculatePagination(
              filteredData,
              state.filters.page,
              state.filters.pageSize
            );

            if (state.filters.statusFilter === "active") {
              state.activeShiftHoursTypes = result.data;
            } else {
              state.shiftHoursTypes = result.data;
            }
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

          // Remove deleted item from all arrays
          if (response.deletedId) {
            const removeItem = (array) => {
              return array.filter((item) => item.id !== response.deletedId);
            };

            state.allShiftHoursTypes = removeItem(state.allShiftHoursTypes);
            state.allActiveShiftHoursTypes = removeItem(
              state.allActiveShiftHoursTypes
            );

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveShiftHoursTypes
                : state.allShiftHoursTypes;

            const filteredData = filterData(currentData, state.filters.search);

            // Adjust page if current page becomes empty
            let currentPage = state.filters.page;
            const maxPage = Math.ceil(
              filteredData.length / state.filters.pageSize
            );
            if (currentPage > maxPage && maxPage > 0) {
              currentPage = maxPage;
              state.filters.page = currentPage;
            }

            const result = calculatePagination(
              filteredData,
              currentPage,
              state.filters.pageSize
            );

            if (state.filters.statusFilter === "active") {
              state.activeShiftHoursTypes = result.data;
            } else {
              state.shiftHoursTypes = result.data;
            }
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

// Fixed export section for the slice
export const {
  setCurrentPage,
  setPageSize,
  setSearchFilter,
  setStatusFilter,
  setPeriodFilter,
  setFilters,
  clearFilters,
  clearShiftHoursTypes,
  clearActiveShiftHoursTypes,
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
