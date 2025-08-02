import { createSlice } from "@reduxjs/toolkit";
import {
  createContractingType,
  getContractingTypes,
  getContractingTypeById,
  updateContractingType,
  deleteContractingType,
  getActiveContractingTypes,
  getContractingTypesForSignup,
} from "../act/actContractingType";
import i18next from "i18next";

// Helper function to calculate pagination
const calculatePagination = (allData, page, pageSize) => {
  const totalCount = allData.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = allData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalCount),
    },
  };
};

// Helper function to filter data (search functionality)
const filterData = (allData, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") {
    return allData;
  }

  const term = searchTerm.toLowerCase().trim();
  return allData.filter(
    (item) =>
      item.nameArabic?.toLowerCase().includes(term) ||
      item.nameEnglish?.toLowerCase().includes(term) ||
      item.code?.toLowerCase().includes(term)
  );
};

// Initial state
const initialState = {
  // Raw data from API (all items)
  allContractingTypes: [],
  allActiveContractingTypes: [],
  contractingTypesForSignup: [],
  selectedContractingType: null,

  // Paginated/filtered data for display
  contractingTypes: [],
  activeContractingTypes: [],

  // Pagination state
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    startIndex: 0,
    endIndex: 0,
  },

  // Filter state
  filters: {
    search: "",
    statusFilter: "all", // "all" or "active"
    page: 1,
    pageSize: 10,
  },

  // Loading states
  loadingGetContractingTypes: false,
  loadingGetActiveContractingTypes: false,
  loadingGetContractingTypesForSignup: false,
  loadingGetSingleContractingType: false,
  loadingCreateContractingType: false,
  loadingUpdateContractingType: false,
  loadingDeleteContractingType: false,

  // Error states
  error: null,
  singleContractingTypeError: null,
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
  timestamp: null,
};

export const contractingTypeSlice = createSlice({
  name: "contractingTypeSlice",
  initialState,
  reducers: {
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
      state.pagination.page = action.payload;

      // Re-calculate pagination with current data
      const currentData =
        state.filters.statusFilter === "active"
          ? state.allActiveContractingTypes
          : state.allContractingTypes;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(
        filteredData,
        action.payload,
        state.filters.pageSize
      );

      if (state.filters.statusFilter === "active") {
        state.activeContractingTypes = result.data;
      } else {
        state.contractingTypes = result.data;
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
          ? state.allActiveContractingTypes
          : state.allContractingTypes;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(filteredData, 1, action.payload);

      if (state.filters.statusFilter === "active") {
        state.activeContractingTypes = result.data;
      } else {
        state.contractingTypes = result.data;
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
          ? state.allActiveContractingTypes
          : state.allContractingTypes;

      const filteredData = filterData(currentData, action.payload);
      const result = calculatePagination(
        filteredData,
        1,
        state.filters.pageSize
      );

      if (state.filters.statusFilter === "active") {
        state.activeContractingTypes = result.data;
      } else {
        state.contractingTypes = result.data;
      }
      state.pagination = result.pagination;
    },

    // Status filter (all/active)
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
      state.filters.page = 1;
      state.pagination.page = 1;

      // Switch data source and re-calculate pagination
      const currentData =
        action.payload === "active"
          ? state.allActiveContractingTypes
          : state.allContractingTypes;

      const filteredData = filterData(currentData, state.filters.search);
      const result = calculatePagination(
        filteredData,
        1,
        state.filters.pageSize
      );

      if (action.payload === "active") {
        state.activeContractingTypes = result.data;
      } else {
        state.contractingTypes = result.data;
      }
      state.pagination = result.pagination;
    },

    // General filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        statusFilter: "all",
        page: 1,
        pageSize: 10,
      };

      // Reset to show all data
      const result = calculatePagination(state.allContractingTypes, 1, 10);
      state.contractingTypes = result.data;
      state.pagination = result.pagination;
    },

    // Clear data actions
    clearContractingTypes: (state) => {
      state.allContractingTypes = [];
      state.contractingTypes = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
    clearActiveContractingTypes: (state) => {
      state.allActiveContractingTypes = [];
      state.activeContractingTypes = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Success/error clearing actions
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
      state.createMessage = "";
      state.createError = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
      state.updateMessage = "";
      state.updateError = null;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
      state.deleteMessage = "";
      state.deleteError = null;
    },

    // Form reset actions
    resetCreateForm: (state) => {
      state.loadingCreateContractingType = false;
      state.createError = null;
      state.createSuccess = false;
      state.createMessage = "";
    },
    resetUpdateForm: (state) => {
      state.loadingUpdateContractingType = false;
      state.updateError = null;
      state.updateSuccess = false;
      state.updateMessage = "";
    },
    resetDeleteForm: (state) => {
      state.loadingDeleteContractingType = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },

    // Single contracting type actions
    clearSingleContractingType: (state) => {
      state.selectedContractingType = null;
      state.singleContractingTypeError = null;
    },
    clearSingleContractingTypeError: (state) => {
      state.singleContractingTypeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get ContractingTypes (All)
      .addCase(getContractingTypes.pending, (state) => {
        state.loadingGetContractingTypes = true;
        state.error = null;
      })
      .addCase(getContractingTypes.fulfilled, (state, action) => {
        state.loadingGetContractingTypes = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Store all data
          state.allContractingTypes = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;

          // Apply current filters and pagination
          const filteredData = filterData(
            state.allContractingTypes,
            state.filters.search
          );
          const result = calculatePagination(
            filteredData,
            state.filters.page,
            state.filters.pageSize
          );

          state.contractingTypes = result.data;
          state.pagination = result.pagination;
        }
      })
      .addCase(getContractingTypes.rejected, (state, action) => {
        state.loadingGetContractingTypes = false;
        state.allContractingTypes = [];
        state.contractingTypes = [];
        state.pagination = initialState.pagination;
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("contractingTypes.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Active ContractingTypes
      .addCase(getActiveContractingTypes.pending, (state) => {
        state.loadingGetActiveContractingTypes = true;
        state.error = null;
      })
      .addCase(getActiveContractingTypes.fulfilled, (state, action) => {
        state.loadingGetActiveContractingTypes = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Store all active data
          state.allActiveContractingTypes = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;

          // If currently viewing active filter, apply pagination
          if (state.filters.statusFilter === "active") {
            const filteredData = filterData(
              state.allActiveContractingTypes,
              state.filters.search
            );
            const result = calculatePagination(
              filteredData,
              state.filters.page,
              state.filters.pageSize
            );

            state.activeContractingTypes = result.data;
            state.pagination = result.pagination;
          }
        }
      })
      .addCase(getActiveContractingTypes.rejected, (state, action) => {
        state.loadingGetActiveContractingTypes = false;
        state.allActiveContractingTypes = [];
        state.activeContractingTypes = [];
        if (state.filters.statusFilter === "active") {
          state.pagination = initialState.pagination;
        }
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("contractingTypes.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get ContractingTypes for Signup
      .addCase(getContractingTypesForSignup.pending, (state) => {
        state.loadingGetContractingTypesForSignup = true;
        state.error = null;
      })
      .addCase(getContractingTypesForSignup.fulfilled, (state, action) => {
        state.loadingGetContractingTypesForSignup = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          state.contractingTypesForSignup = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getContractingTypesForSignup.rejected, (state, action) => {
        state.loadingGetContractingTypesForSignup = false;
        state.contractingTypesForSignup = [];
        state.error = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("contractingTypes.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get ContractingType by ID
      .addCase(getContractingTypeById.pending, (state) => {
        state.loadingGetSingleContractingType = true;
        state.singleContractingTypeError = null;
      })
      .addCase(getContractingTypeById.fulfilled, (state, action) => {
        state.loadingGetSingleContractingType = false;
        state.singleContractingTypeError = null;

        const response = action.payload;
        if (response.success) {
          state.selectedContractingType = response.data;
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getContractingTypeById.rejected, (state, action) => {
        state.loadingGetSingleContractingType = false;
        state.selectedContractingType = null;
        state.singleContractingTypeError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("contractingTypes.fetchError"),
          errors: action.payload?.errors || [],
          status: action.payload?.status || 500,
          timestamp: new Date().toISOString(),
        };
      })

      // Create ContractingType
      .addCase(createContractingType.pending, (state) => {
        state.loadingCreateContractingType = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createContractingType.fulfilled, (state, action) => {
        state.loadingCreateContractingType = false;
        state.createError = null;

        const response = action.payload;
        if (response.success) {
          state.createSuccess = true;
          state.createMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("contractingTypes.success.created");

          // Add new item to the data arrays if response includes the created item
          if (response.data) {
            state.allContractingTypes.push(response.data);
            if (response.data.isActive) {
              state.allActiveContractingTypes.push(response.data);
            }

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveContractingTypes
                : state.allContractingTypes;

            const filteredData = filterData(currentData, state.filters.search);
            const result = calculatePagination(
              filteredData,
              state.filters.page,
              state.filters.pageSize
            );

            if (state.filters.statusFilter === "active") {
              state.activeContractingTypes = result.data;
            } else {
              state.contractingTypes = result.data;
            }
            state.pagination = result.pagination;
          }
        }
      })
      .addCase(createContractingType.rejected, (state, action) => {
        state.loadingCreateContractingType = false;
        state.createSuccess = false;
        state.createError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("contractingTypes.error.createFailed"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Update ContractingType
      .addCase(updateContractingType.pending, (state) => {
        state.loadingUpdateContractingType = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateContractingType.fulfilled, (state, action) => {
        state.loadingUpdateContractingType = false;
        state.updateError = null;

        const response = action.payload;
        if (response.success) {
          state.updateSuccess = true;
          state.updateMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("contractingTypes.success.updated");

          // Update item in data arrays if response includes the updated item
          if (response.data) {
            const updatedItem = response.data;

            // Update in all arrays
            const allIndex = state.allContractingTypes.findIndex(
              (item) => item.id === updatedItem.id
            );
            if (allIndex !== -1) {
              state.allContractingTypes[allIndex] = updatedItem;
            }

            const activeIndex = state.allActiveContractingTypes.findIndex(
              (item) => item.id === updatedItem.id
            );
            if (updatedItem.isActive) {
              if (activeIndex !== -1) {
                state.allActiveContractingTypes[activeIndex] = updatedItem;
              } else {
                state.allActiveContractingTypes.push(updatedItem);
              }
            } else {
              if (activeIndex !== -1) {
                state.allActiveContractingTypes.splice(activeIndex, 1);
              }
            }

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveContractingTypes
                : state.allContractingTypes;

            const filteredData = filterData(currentData, state.filters.search);
            const result = calculatePagination(
              filteredData,
              state.filters.page,
              state.filters.pageSize
            );

            if (state.filters.statusFilter === "active") {
              state.activeContractingTypes = result.data;
            } else {
              state.contractingTypes = result.data;
            }
            state.pagination = result.pagination;
          }
        }
      })
      .addCase(updateContractingType.rejected, (state, action) => {
        state.loadingUpdateContractingType = false;
        state.updateSuccess = false;
        state.updateError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("contractingTypes.error.updateFailed"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Delete ContractingType
      .addCase(deleteContractingType.pending, (state) => {
        state.loadingDeleteContractingType = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteContractingType.fulfilled, (state, action) => {
        state.loadingDeleteContractingType = false;
        state.deleteError = null;

        const response = action.payload;
        if (response.success) {
          state.deleteSuccess = true;
          state.deleteMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("contractingTypes.success.deleted");

          // Remove deleted item from all arrays
          if (response.deletedContractingTypeId) {
            const deletedId = response.deletedContractingTypeId;

            state.allContractingTypes = state.allContractingTypes.filter(
              (item) => item.id !== deletedId
            );
            state.allActiveContractingTypes =
              state.allActiveContractingTypes.filter(
                (item) => item.id !== deletedId
              );

            // Re-calculate current view pagination
            const currentData =
              state.filters.statusFilter === "active"
                ? state.allActiveContractingTypes
                : state.allContractingTypes;

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
              state.activeContractingTypes = result.data;
            } else {
              state.contractingTypes = result.data;
            }
            state.pagination = result.pagination;
          }
        }
      })
      .addCase(deleteContractingType.rejected, (state, action) => {
        state.loadingDeleteContractingType = false;
        state.deleteSuccess = false;
        state.deleteError = {
          message:
            action.payload?.messageEn ||
            action.payload?.messageAr ||
            i18next.t("contractingTypes.error.deleteFailed"),
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
  clearContractingTypes,
  clearActiveContractingTypes,
  clearError,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  resetCreateForm,
  resetUpdateForm,
  resetDeleteForm,
  clearSingleContractingType,
  clearSingleContractingTypeError,
} = contractingTypeSlice.actions;

export default contractingTypeSlice.reducer;
