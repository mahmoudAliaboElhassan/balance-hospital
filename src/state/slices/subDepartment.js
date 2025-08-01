import { createSlice } from "@reduxjs/toolkit";
import UseInitialStates from "../../hooks/use-initial-state";
import {
  createSubDepartment,
  getSubDepartments,
  getSubDepartmentById,
  updateSubDepartment,
  deleteSubDepartment,
} from "../act/actSubDepartment";
import i18next from "i18next";

const { initialStateSubDepartments } = UseInitialStates();

export const subDepartmentSlice = createSlice({
  name: "subDepartmentSlice",
  initialState: initialStateSubDepartments,
  reducers: {
    // SubDepartment filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        departmentId: null,
        categoryId: null,
        isActive: null,
        createdFrom: null,
        createdTo: null,
        includeDepartment: true,
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
    setDepartmentFilter: (state, action) => {
      state.filters.departmentId = action.payload;
      state.filters.page = 1;
    },
    setCategoryFilter: (state, action) => {
      state.filters.categoryId = action.payload;
      state.filters.page = 1;
    },

    // SubDepartment data actions
    clearSubDepartments: (state) => {
      state.subDepartments = [];
      state.pagination = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    // SubDepartment success/error clearing actions
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

    // SubDepartment form reset actions
    resetCreateForm: (state) => {
      state.loadingCreateSubDepartment = false;
      state.createError = null;
      state.createSuccess = false;
      state.createMessage = "";
    },
    resetUpdateForm: (state) => {
      state.loadingUpdateSubDepartment = false;
      state.updateError = null;
      state.updateSuccess = false;
      state.updateMessage = "";
    },
    resetDeleteForm: (state) => {
      state.loadingDeleteSubDepartment = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },

    // Single subDepartment actions
    clearSingleSubDepartment: (state) => {
      state.selectedSubDepartment = null;
      state.singleSubDepartmentError = null;
    },
    clearSingleSubDepartmentError: (state) => {
      state.singleSubDepartmentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get SubDepartments
      .addCase(getSubDepartments.pending, (state) => {
        state.loadingGetSubDepartments = true;
        state.error = null;
      })
      .addCase(getSubDepartments.fulfilled, (state, action) => {
        state.loadingGetSubDepartments = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          state.subDepartments = response.data.items;
          state.pagination = {
            totalCount: response.data.totalCount,
            page: response.data.page,
            pageSize: response.data.pageSize,
            totalPages: response.data.totalPages,
            hasNextPage: response.data.hasNext,
            hasPreviousPage: response.data.hasPrevious,
          };
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getSubDepartments.rejected, (state, action) => {
        state.loadingGetSubDepartments = false;
        state.subDepartments = [];
        state.pagination = null;
        state.error = {
          message:
            action.payload?.message || i18next.t("subDepartments.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Create SubDepartment
      .addCase(createSubDepartment.pending, (state) => {
        state.loadingCreateSubDepartment = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createSubDepartment.fulfilled, (state, action) => {
        state.loadingCreateSubDepartment = false;
        state.createError = null;

        const response = action.payload;
        if (response.success) {
          state.createSuccess = true;
          state.createMessage = response.messageAr || response.messageEn;

          if (state.filters.page === 1) {
            state.subDepartments.unshift(response.data);
            if (state.pagination) {
              state.pagination.totalCount += 1;
              state.pagination.totalPages = Math.ceil(
                state.pagination.totalCount / state.pagination.pageSize
              );
            }
          }
        }
      })
      .addCase(createSubDepartment.rejected, (state, action) => {
        state.loadingCreateSubDepartment = false;
        state.createSuccess = false;
        state.createError = {
          message: action.payload?.message || "حدث خطأ في إنشاء القسم الفرعي",
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Single SubDepartment
      .addCase(getSubDepartmentById.pending, (state) => {
        state.loadingGetSingleSubDepartment = true;
        state.singleSubDepartmentError = null;
      })
      .addCase(getSubDepartmentById.fulfilled, (state, action) => {
        state.loadingGetSingleSubDepartment = false;
        state.singleSubDepartmentError = null;

        const response = action.payload;
        if (response.success) {
          state.selectedSubDepartment = response.data;
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getSubDepartmentById.rejected, (state, action) => {
        state.loadingGetSingleSubDepartment = false;
        state.selectedSubDepartment = null;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في جلب القسم الفرعي";

        if (payload?.status === 404) {
          errorMessage = payload.message || "القسم الفرعي غير موجود";
        } else if (payload?.status === 403) {
          errorMessage =
            payload.message || "ليس لديك صلاحية للوصول لهذا القسم الفرعي";
        } else if (payload?.message) {
          errorMessage = payload.message;
        }

        state.singleSubDepartmentError = {
          message: errorMessage,
          errors: payload?.errors || [],
          status: payload?.status,
          timestamp: new Date().toISOString(),
        };
      })

      // Update SubDepartment
      .addCase(updateSubDepartment.pending, (state) => {
        state.loadingUpdateSubDepartment = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateSubDepartment.fulfilled, (state, action) => {
        state.loadingUpdateSubDepartment = false;
        state.updateError = null;

        const response = action.payload;
        if (response.success) {
          state.updateSuccess = true;
          state.updateMessage = response.messageAr || response.messageEn;
          state.selectedSubDepartment = response.data;

          const subDepartmentIndex = state.subDepartments.findIndex(
            (subDept) => subDept.id === response.data.id
          );
          if (subDepartmentIndex !== -1) {
            state.subDepartments[subDepartmentIndex] = response.data;
          }
        }
      })
      .addCase(updateSubDepartment.rejected, (state, action) => {
        state.loadingUpdateSubDepartment = false;
        state.updateSuccess = false;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في تحديث القسم الفرعي";

        if (payload?.status === 404) {
          errorMessage = payload.message || "القسم الفرعي غير موجود";
        } else if (payload?.status === 403) {
          errorMessage =
            payload.message || "ليس لديك صلاحية لتحديث هذا القسم الفرعي";
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

      // Delete SubDepartment
      .addCase(deleteSubDepartment.pending, (state) => {
        state.loadingDeleteSubDepartment = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteSubDepartment.fulfilled, (state, action) => {
        state.loadingDeleteSubDepartment = false;
        state.deleteError = null;

        const response = action.payload;
        if (response.success) {
          state.deleteSuccess = true;
          state.deleteMessage = response.messageAr || response.messageEn;

          state.subDepartments = state.subDepartments.filter(
            (subDept) => subDept.id !== response.deletedSubDepartmentId
          );

          if (state.pagination) {
            state.pagination.totalCount -= 1;
            state.pagination.totalPages = Math.ceil(
              state.pagination.totalCount / state.pagination.pageSize
            );
          }

          if (
            state.selectedSubDepartment?.id === response.deletedSubDepartmentId
          ) {
            state.selectedSubDepartment = null;
          }
        }
      })
      .addCase(deleteSubDepartment.rejected, (state, action) => {
        state.loadingDeleteSubDepartment = false;
        state.deleteSuccess = false;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في حذف القسم الفرعي";

        if (payload?.status === 404) {
          errorMessage = payload.message || "القسم الفرعي غير موجود";
        } else if (payload?.status === 403) {
          errorMessage =
            payload.message || "ليس لديك صلاحية لحذف هذا القسم الفرعي";
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
  // SubDepartment filters
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,
  setDepartmentFilter,
  setCategoryFilter,

  // SubDepartment data
  clearSubDepartments,
  clearError,

  // SubDepartment success/error clearing
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,

  // SubDepartment form resets
  resetCreateForm,
  resetUpdateForm,
  resetDeleteForm,

  // Single subDepartment
  clearSingleSubDepartment,
  clearSingleSubDepartmentError,
} = subDepartmentSlice.actions;

export default subDepartmentSlice.reducer;

// Export async thunks
export {
  getSubDepartments,
  createSubDepartment,
  getSubDepartmentById,
  updateSubDepartment,
  deleteSubDepartment,
};
