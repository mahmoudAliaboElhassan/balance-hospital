import { createSlice } from "@reduxjs/toolkit";
import UseInitialStates from "../../hooks/use-initial-state";
import { createCategory, getCategories } from "../act/actCategory";

const { initialStateCategories } = UseInitialStates();

export const categorySlice = createSlice({
  name: "categorySlice",
  initialState: initialStateCategories,
  reducers: {
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        search: "",
        isActive: null,
        orderBy: "createdAt",
        orderDesc: true,
        page: 1,
        pageSize: 10,
      };
    },
    // Set current page
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
    },
    // Set page size
    setPageSize: (state, action) => {
      state.filters.pageSize = action.payload;
      state.filters.page = 1; // Reset to first page when changing page size
    },
    // Clear categories data
    clearCategories: (state) => {
      state.categories = [];
      state.pagination = null;
      state.error = null;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
      state.createMessage = "";
    },
    // Reset create form
    resetCreateForm: (state) => {
      state.loadingCreateCategory = false;
      state.createError = null;
      state.createSuccess = false;
      state.createMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loadingGetCategories = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loadingGetCategories = false;
        state.error = null;

        const response = action.payload;
        console.log("Categories fetched successfully:", response);

        if (response.success) {
          state.categories = response.data.items;
          state.pagination = {
            totalCount: response.data.totalCount,
            page: response.data.page,
            pageSize: response.data.pageSize,
            totalPages: response.data.totalPages,
            hasNextPage: response.data.hasNextPage,
            hasPreviousPage: response.data.hasPreviousPage,
          };
          state.message = response.message;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loadingGetCategories = false;
        state.categories = [];
        state.pagination = null;

        // Handle error
        state.error = {
          message: action.payload?.message || "حدث خطأ في جلب الفئات",
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })
      .addCase(createCategory.pending, (state) => {
        state.loadingCreateCategory = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loadingCreateCategory = false;
        state.createError = null;

        const response = action.payload;
        console.log("Category created successfully:", response);

        if (response.success) {
          state.createSuccess = true;
          state.createMessage = response.message;

          // Add new category to the beginning of the list if we're on the first page
          if (state.filters.page === 1) {
            state.categories.unshift(response.data);

            // Update pagination if needed
            if (state.pagination) {
              state.pagination.totalCount += 1;
              state.pagination.totalPages = Math.ceil(
                state.pagination.totalCount / state.pagination.pageSize
              );
            }
          }
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loadingCreateCategory = false;
        state.createSuccess = false;

        // Handle error
        state.createError = {
          message: action.payload?.message || "حدث خطأ في إنشاء الفئة",
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
  clearCategories,
  clearError,
  clearCreateSuccess,
  resetCreateForm,
} = categorySlice.actions;

export default categorySlice.reducer;
export { getCategories, createCategory };
