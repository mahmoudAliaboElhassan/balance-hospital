import { createSlice } from "@reduxjs/toolkit";
import {
  createContractingType,
  getContractingTypes,
  getContractingTypeById,
  updateContractingType,
  deleteContractingType,
  getContractingTypesForSignup,
} from "../act/actContractingType";
import i18next from "i18next";

// Initial state
const initialState = {
  // Data from API
  contractingTypes: [],
  contractingTypesForSignup: [],
  selectedContractingType: null,

  // Pagination state (now handled by API)
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
    statusFilter: true, // "all", "active", "inactive"
    allowOvertimeHours: undefined, // undefined, true, false
    minHoursPerWeek: undefined,
    maxHoursPerWeek: undefined,
    createdFromDate: "",
    createdToDate: "",
    sortBy: 0, // 0: createdAt, 1: nameArabic, 2: nameEnglish, 3: code, 4: usersCount, 5: maxHours
    sortDirection: 1, // 0: ascending, 1: descending
    page: 1,
    pageSize: 10,
  },

  // Loading states
  loadingGetContractingTypes: false,
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
    },

    setPageSize: (state, action) => {
      state.filters.pageSize = action.payload;
      state.filters.page = 1; // Reset to first page when changing page size
    },

    // Filter actions
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to first page when searching
    },

    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
      state.filters.page = 1; // Reset to first page when changing status
    },

    setOvertimeFilter: (state, action) => {
      state.filters.allowOvertimeHours = action.payload;
      state.filters.page = 1;
    },

    setHoursRangeFilter: (state, action) => {
      const { minHours, maxHours } = action.payload;
      state.filters.minHoursPerWeek = minHours;
      state.filters.maxHoursPerWeek = maxHours;
      state.filters.page = 1;
    },

    setDateRangeFilter: (state, action) => {
      const { fromDate, toDate } = action.payload;
      state.filters.createdFromDate = fromDate;
      state.filters.createdToDate = toDate;
      state.filters.page = 1;
    },

    setSortFilter: (state, action) => {
      const { sortBy, sortDirection } = action.payload;
      state.filters.sortBy = sortBy;
      state.filters.sortDirection = sortDirection;
      state.filters.page = 1;
    },

    clearFilters: (state) => {
      state.filters = {
        search: "",
        statusFilter: "",
        allowOvertimeHours: undefined,
        minHoursPerWeek: undefined,
        maxHoursPerWeek: undefined,
        createdFromDate: "",
        createdToDate: "",
        sortBy: 0,
        sortDirection: 1,
        page: 1,
        pageSize: state.filters.pageSize, // Keep current page size
      };
    },

    // Clear data actions
    clearContractingTypes: (state) => {
      state.contractingTypes = [];
      state.pagination = initialState.pagination;
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
      // Get ContractingTypes
      .addCase(getContractingTypes.pending, (state) => {
        state.loadingGetContractingTypes = true;
        state.error = null;
      })
      .addCase(getContractingTypes.fulfilled, (state, action) => {
        state.loadingGetContractingTypes = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          // Set data and pagination from API response
          state.contractingTypes = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;

          // Update pagination from API response
          if (response.pagination) {
            state.pagination = {
              page: response.pagination.page,
              pageSize: response.pagination.pageSize,
              totalCount: response.pagination.totalCount,
              totalPages: response.pagination.totalPages,
              hasNextPage: response.pagination.hasNextPage,
              hasPreviousPage: response.pagination.hasPreviousPage,
              startIndex: response.pagination.startIndex,
              endIndex: response.pagination.endIndex,
            };
          }
        }
      })
      .addCase(getContractingTypes.rejected, (state, action) => {
        state.loadingGetContractingTypes = false;
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

          // Update the selected contracting type if it's the one being edited
          if (
            response.data &&
            state.selectedContractingType?.id === response.data.id
          ) {
            state.selectedContractingType = response.data;
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
        console.log("response from delete", response);
        if (response.success) {
          state.deleteSuccess = true;
          state.contractingTypes = state.contractingTypes.filter(
            (dept) => dept.id !== response.deletedContractingTypeId
          );
          state.deleteMessage =
            response.messageAr ||
            response.messageEn ||
            i18next.t("contractingTypes.success.deleted");
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

// Export actions
export const {
  setCurrentPage,
  setPageSize,
  setSearchFilter,
  setStatusFilter,
  setOvertimeFilter,
  setHoursRangeFilter,
  setDateRangeFilter,
  setSortFilter,
  clearFilters,
  clearContractingTypes,
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

// Export reducer
export default contractingTypeSlice.reducer;
