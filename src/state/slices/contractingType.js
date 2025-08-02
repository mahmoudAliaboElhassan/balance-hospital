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
import UseInitialStates from "../../hooks/use-initial-state";

// Initial state
const { initialStateContractingTypes } = UseInitialStates();

export const contractingTypeSlice = createSlice({
  name: "contractingTypeSlice",
  initialState: initialStateContractingTypes,
  reducers: {
    // ContractingType filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        isActive: null,
        createdFrom: null,
        createdTo: null,
        includeStatistics: true,
        orderBy: "nameArabic",
        orderDesc: true,
        page: 1,
        pageSize: 10,
      };
    },
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.filters.pageSize = action.payload;
      state.filters.page = 1;
    },

    // ContractingType data actions
    clearContractingTypes: (state) => {
      state.contractingTypes = [];
      state.pagination = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    // ContractingType success/error clearing actions
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

    // ContractingType form reset actions
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
          // API returns array directly, not paginated data for /All endpoint
          state.contractingTypes = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getContractingTypes.rejected, (state, action) => {
        state.loadingGetContractingTypes = false;
        state.contractingTypes = [];
        state.pagination = null;
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
          state.activeContractingTypes = response.data || [];
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getActiveContractingTypes.rejected, (state, action) => {
        state.loadingGetActiveContractingTypes = false;
        state.activeContractingTypes = [];
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

          // Remove deleted item from state
          if (response.deletedContractingTypeId) {
            state.contractingTypes = state.contractingTypes.filter(
              (item) => item.id !== response.deletedContractingTypeId
            );
            state.activeContractingTypes = state.activeContractingTypes.filter(
              (item) => item.id !== response.deletedContractingTypeId
            );
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
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,
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

export default contractingTypeSlice.reducer;
