import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";
import {
  getScientificDegrees,
  getActiveScientificDegrees,
  getScientificDegreesForSignup,
  getScientificDegreeById,
  getScientificDegreeByCode,
  createScientificDegree,
  updateScientificDegree,
  deleteScientificDegree,
} from "../act/actScientificDegree";
import UseInitialStates from "../../hooks/use-initial-state";

// Helper functions for filtering and pagination
const filterData = (data, search) => {
  if (!search) return data;
  const searchTerm = search.toLowerCase();
  return data.filter(
    (item) =>
      item.nameArabic?.toLowerCase().includes(searchTerm) ||
      item.nameEnglish?.toLowerCase().includes(searchTerm) ||
      item.code?.toLowerCase().includes(searchTerm)
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

const { initialStateScientificDegrees } = UseInitialStates();
export const scientificDegreeSlice = createSlice({
  name: "scientificDegreeSlice",
  initialState: initialStateScientificDegrees,
  reducers: {
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
      state.pagination.page = action.payload;

      // Re-calculate pagination with current data
      const currentData =
        state.filters.statusFilter === "active"
          ? state.allActiveScientificDegrees
          : state.allScientificDegrees;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(
        filteredData,
        action.payload,
        state.filters.pageSize
      );

      if (state.filters.statusFilter === "active") {
        state.activeScientificDegrees = result.data;
      } else {
        state.scientificDegrees = result.data;
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
          ? state.allActiveScientificDegrees
          : state.allScientificDegrees;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(filteredData, 1, action.payload);

      if (state.filters.statusFilter === "active") {
        state.activeScientificDegrees = result.data;
      } else {
        state.scientificDegrees = result.data;
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
          ? state.allActiveScientificDegrees
          : state.allScientificDegrees;

      const filteredData = filterData(currentData, action.payload);
      const result = calculatePagination(
        filteredData,
        1,
        state.filters.pageSize
      );

      if (state.filters.statusFilter === "active") {
        state.activeScientificDegrees = result.data;
      } else {
        state.scientificDegrees = result.data;
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
          ? state.allActiveScientificDegrees
          : state.allScientificDegrees;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(
        filteredData,
        1,
        state.filters.pageSize
      );

      if (action.payload === "active") {
        state.activeScientificDegrees = result.data;
      } else {
        state.scientificDegrees = result.data;
      }
      state.pagination = result.pagination;
    },

    // Filter management
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        statusFilter: state.filters.statusFilter, // Keep status filter
      };
    },

    // Clear data
    clearScientificDegrees: (state) => {
      state.scientificDegrees = [];
      state.allScientificDegrees = [];
    },

    clearActiveScientificDegrees: (state) => {
      state.activeScientificDegrees = [];
      state.allActiveScientificDegrees = [];
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
      // Get Scientific Degrees (All)
      .addCase(getScientificDegrees.pending, (state) => {
        state.loadingGetScientificDegrees = true;
        state.error = null;
      })
      .addCase(getScientificDegrees.fulfilled, (state, action) => {
        state.loadingGetScientificDegrees = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Store all data
          state.allScientificDegrees = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;

          // Apply current filters and pagination
          const filteredData = filterData(
            state.allScientificDegrees,
            state.filters.search
          );
          const result = calculatePagination(
            filteredData,
            state.filters.page,
            state.filters.pageSize
          );

          state.scientificDegrees = response.data;
          state.pagination = result.pagination;
        }
      })
      .addCase(getScientificDegrees.rejected, (state, action) => {
        state.loadingGetScientificDegrees = false;
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("scientificDegrees.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Active Scientific Degrees
      .addCase(getActiveScientificDegrees.pending, (state) => {
        state.loadingGetActiveScientificDegrees = true;
        state.error = null;
      })
      .addCase(getActiveScientificDegrees.fulfilled, (state, action) => {
        state.loadingGetActiveScientificDegrees = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Store all active data
          state.allActiveScientificDegrees = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;

          // Apply current filters and pagination
          const filteredData = filterData(
            state.allActiveScientificDegrees,
            state.filters.search
          );
          const result = calculatePagination(
            filteredData,
            state.filters.page,
            state.filters.pageSize
          );

          state.activeScientificDegrees = response.data;
          //   state.pagination = result.pagination;
        }
      })
      .addCase(getActiveScientificDegrees.rejected, (state, action) => {
        state.loadingGetActiveScientificDegrees = false;
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

          // Add new item to the data arrays if response includes the created item
          if (response.data) {
            state.allScientificDegrees.push(response.data);
            if (response.data.isActive) {
              state.allActiveScientificDegrees.push(response.data);
            }

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveScientificDegrees
                : state.allScientificDegrees;

            const filteredData = filterData(currentData, state.filters.search);
            const result = calculatePagination(
              filteredData,
              state.filters.page,
              state.filters.pageSize
            );

            if (state.filters.statusFilter === "active") {
              state.activeScientificDegrees = result.data;
            } else {
              state.scientificDegrees = result.data;
            }
            state.pagination = result.pagination;
          }
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

            updateItem(state.allScientificDegrees);
            updateItem(state.allActiveScientificDegrees);

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveScientificDegrees
                : state.allScientificDegrees;

            const filteredData = filterData(currentData, state.filters.search);
            const result = calculatePagination(
              filteredData,
              state.filters.page,
              state.filters.pageSize
            );

            if (state.filters.statusFilter === "active") {
              state.activeScientificDegrees = result.data;
            } else {
              state.scientificDegrees = result.data;
            }
            state.pagination = result.pagination;
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

          // Remove deleted item from all arrays
          if (response.deletedId) {
            const removeItem = (array) => {
              return array.filter((item) => item.id !== response.deletedId);
            };

            state.allScientificDegrees = removeItem(state.allScientificDegrees);
            state.allActiveScientificDegrees = removeItem(
              state.allActiveScientificDegrees
            );

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveScientificDegrees
                : state.allScientificDegrees;

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
              state.activeScientificDegrees = result.data;
            } else {
              state.scientificDegrees = result.data;
            }
            state.pagination = result.pagination;
          }
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
  setCurrentPage,
  setPageSize,
  setSearchFilter,
  setStatusFilter,
  setFilters,
  clearFilters,
  clearScientificDegrees,
  clearActiveScientificDegrees,
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
