import { createSlice } from "@reduxjs/toolkit";
import UseInitialStates from "../../hooks/use-initial-state";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../act/actCategory";

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
    // Clear update success
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
      state.updateMessage = "";
    },
    // Clear delete success
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },
    // Reset create form
    resetCreateForm: (state) => {
      state.loadingCreateCategory = false;
      state.createError = null;
      state.createSuccess = false;
      state.createMessage = "";
    },
    // Reset update form
    resetUpdateForm: (state) => {
      state.loadingUpdateCategory = false;
      state.updateError = null;
      state.updateSuccess = false;
      state.updateMessage = "";
    },
    // Reset delete form
    resetDeleteForm: (state) => {
      state.loadingDeleteCategory = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },
    clearSingleCategory: (state) => {
      state.selectedCategory = null;
      state.singleCategoryError = null;
    },
    // Clear single category error
    clearSingleCategoryError: (state) => {
      state.singleCategoryError = null;
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
      })
      .addCase(getCategoryById.pending, (state) => {
        state.loadingGetSingleCategory = true;
        state.singleCategoryError = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loadingGetSingleCategory = false;
        state.singleCategoryError = null;

        const response = action.payload;
        console.log("Single category fetched successfully:", response);

        if (response.success) {
          state.selectedCategory = response.data;
          state.message = response.messageAr || response.message;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loadingGetSingleCategory = false;
        state.selectedCategory = null;

        // Handle error with specific messages
        const payload = action.payload;
        let errorMessage = "حدث خطأ في جلب الفئة";

        if (payload?.status === 404) {
          errorMessage = payload.message || "الفئة غير موجودة";
        } else if (payload?.status === 403) {
          errorMessage = payload.message || "ليس لديك صلاحية للوصول لهذه الفئة";
        } else if (payload?.message) {
          errorMessage = payload.message;
        }

        state.singleCategoryError = {
          message: errorMessage,
          errors: payload?.errors || [],
          status: payload?.status,
          timestamp: new Date().toISOString(),
        };
      })
      // Update category reducers
      .addCase(updateCategory.pending, (state) => {
        state.loadingUpdateCategory = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loadingUpdateCategory = false;
        state.updateError = null;

        const response = action.payload;
        console.log("Category updated successfully:", response);

        if (response.success) {
          state.updateSuccess = true;
          state.updateMessage = response.messageAr || response.message;

          // Update the selected category
          state.selectedCategory = response.data;

          // Update the category in the categories list if it exists
          const categoryIndex = state.categories.findIndex(
            (cat) => cat.id === response.data.id
          );
          if (categoryIndex !== -1) {
            state.categories[categoryIndex] = response.data;
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loadingUpdateCategory = false;
        state.updateSuccess = false;

        // Handle error with specific messages
        const payload = action.payload;
        let errorMessage = "حدث خطأ في تحديث الفئة";

        if (payload?.status === 404) {
          errorMessage = payload.message || "الفئة غير موجودة";
        } else if (payload?.status === 403) {
          errorMessage = payload.message || "ليس لديك صلاحية لتحديث هذه الفئة";
        } else if (payload?.status === 400) {
          errorMessage = payload.message || "بيانات غير صحيحة أو عدم تطابق ID";
        } else if (payload?.message) {
          errorMessage = payload.message;
        }

        state.updateError = {
          message: errorMessage,
          errors: payload?.errors || [],
          status: payload?.status,
          timestamp: new Date().toISOString(),
        };
      })
      // Delete category reducers
      .addCase(deleteCategory.pending, (state) => {
        state.loadingDeleteCategory = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loadingDeleteCategory = false;
        state.deleteError = null;

        const response = action.payload;
        console.log("Category deleted successfully:", response);

        if (response.success) {
          state.deleteSuccess = true;
          state.deleteMessage = response.messageAr || response.message;

          // Remove the category from the list
          state.categories = state.categories.filter(
            (cat) => cat.id !== response.deletedCategoryId
          );

          // Update pagination
          if (state.pagination) {
            state.pagination.totalCount -= 1;
            state.pagination.totalPages = Math.ceil(
              state.pagination.totalCount / state.pagination.pageSize
            );
          }

          // Clear selected category if it was the deleted one
          if (state.selectedCategory?.id === response.deletedCategoryId) {
            state.selectedCategory = null;
          }
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loadingDeleteCategory = false;
        state.deleteSuccess = false;

        // Handle error with specific messages
        const payload = action.payload;
        let errorMessage = "حدث خطأ في حذف الفئة";

        if (payload?.status === 404) {
          errorMessage = payload.message || "الفئة غير موجودة";
        } else if (payload?.status === 403) {
          errorMessage = payload.message || "ليس لديك صلاحية لحذف هذه الفئة";
        } else if (payload?.status === 400) {
          errorMessage =
            payload.message || "بيانات غير صحيحة أو سبب الحذف مطلوب";
        } else if (payload?.message) {
          errorMessage = payload.message;
        }

        state.deleteError = {
          message: errorMessage,
          errors: payload?.errors || [],
          status: payload?.status,
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
  clearUpdateSuccess,
  clearDeleteSuccess,
  resetCreateForm,
  resetUpdateForm,
  resetDeleteForm,
  clearSingleCategory,
  clearSingleCategoryError,
} = categorySlice.actions;

export default categorySlice.reducer;
export {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
