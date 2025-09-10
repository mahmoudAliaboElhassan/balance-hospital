import { createSlice } from "@reduxjs/toolkit";
import UseInitialStates from "../../hooks/use-initial-state";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  updateManagerPermission,
  removeManager,
  assignManager,
  availabelDepartmentsForCategory,
} from "../act/actDepartment";
import i18next from "i18next";
import "../../translation/i18n";

const { initialStateDepartments } = UseInitialStates();

export const departmentSlice = createSlice({
  name: "departmentSlice",
  initialState: initialStateDepartments,
  reducers: {
    // Department filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        categoryId: "",
        isActive: null,
        createdFrom: null,
        createdTo: null,
        includeSubDepartments: true,
        includeStatistics: true,
        includeCategory: true,
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
    setCategoryFilter: (state, action) => {
      state.filters.categoryId = action.payload;
      state.filters.page = 1;
    },

    // Department data actions
    clearDepartments: (state) => {
      state.departments = [];
      state.pagination = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Department success/error clearing actions
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

    // Department form reset actions
    resetCreateForm: (state) => {
      state.loadingCreateDepartment = false;
      state.createError = null;
      state.createSuccess = false;
      state.createMessage = "";
    },
    resetUpdateForm: (state) => {
      state.loadingUpdateDepartment = false;
      state.updateError = null;
      state.updateSuccess = false;
      state.updateMessage = "";
    },
    resetDeleteForm: (state) => {
      state.loadingDeleteDepartment = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },

    // Single department actions
    clearSingleDepartment: (state) => {
      state.selectedDepartment = null;
      state.singleDepartmentError = null;
    },
    clearSingleDepartmentError: (state) => {
      state.singleDepartmentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Departments
      .addCase(getDepartments.pending, (state) => {
        state.loadingGetDepartments = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loadingGetDepartments = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          state.departments = response.data.items;
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
      .addCase(getDepartments.rejected, (state, action) => {
        state.loadingGetDepartments = false;
        state.departments = [];
        state.pagination = null;
        state.error = {
          message:
            action.payload?.message || i18next.t("department.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })
      .addCase(availabelDepartmentsForCategory.pending, (state) => {
        state.loadingGetDepartments = true;
        state.error = null;
      })
      .addCase(availabelDepartmentsForCategory.fulfilled, (state, action) => {
        state.loadingGetDepartments = false;
        state.error = null;

        const response = action.payload;
        if (response.success) {
          state.departments = response.data;
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
      .addCase(availabelDepartmentsForCategory.rejected, (state, action) => {
        state.loadingGetDepartments = false;
        state.departments = [];
        state.pagination = null;
        state.error = {
          message:
            action.payload?.message || i18next.t("department.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Create Department
      .addCase(createDepartment.pending, (state) => {
        state.loadingCreateDepartment = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loadingCreateDepartment = false;
        state.createError = null;

        const response = action.payload;
        if (response.success) {
          state.createSuccess = true;
          state.createMessage = response.messageAr || response.messageEn;

          if (state.filters.page === 1) {
            state.departments.unshift(response.data);
            if (state.pagination) {
              state.pagination.totalCount += 1;
              state.pagination.totalPages = Math.ceil(
                state.pagination.totalCount / state.pagination.pageSize
              );
            }
          }
        }
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loadingCreateDepartment = false;
        state.createSuccess = false;
        state.createError = {
          message: action.payload?.message || "حدث خطأ في إنشاء القسم",
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Single Department
      .addCase(getDepartmentById.pending, (state) => {
        state.loadingGetSingleDepartment = true;
        state.singleDepartmentError = null;
      })
      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.loadingGetSingleDepartment = false;
        state.singleDepartmentError = null;

        const response = action.payload;
        if (response.success) {
          state.selectedDepartment = response.data;
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getDepartmentById.rejected, (state, action) => {
        state.loadingGetSingleDepartment = false;
        state.selectedDepartment = null;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في جلب القسم";

        if (payload?.status === 404) {
          errorMessage = payload.message || "القسم غير موجود";
        } else if (payload?.status === 403) {
          errorMessage = payload.message || "ليس لديك صلاحية للوصول لهذا القسم";
        } else if (payload?.message) {
          errorMessage = payload.message;
        }

        state.singleDepartmentError = {
          message: errorMessage,
          errors: payload?.errors || [],
          status: payload?.status,
          timestamp: new Date().toISOString(),
        };
      })

      // Update Department
      .addCase(updateDepartment.pending, (state) => {
        state.loadingUpdateDepartment = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loadingUpdateDepartment = false;
        state.updateError = null;

        const response = action.payload;
        if (response.success) {
          state.updateSuccess = true;
          state.updateMessage = response.messageAr || response.messageEn;
          state.selectedDepartment = response.data;

          const departmentIndex = state.departments.findIndex(
            (dept) => dept.id === response.data.id
          );
          if (departmentIndex !== -1) {
            state.departments[departmentIndex] = response.data;
          }
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loadingUpdateDepartment = false;
        state.updateSuccess = false;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في تحديث القسم";

        if (payload?.status === 404) {
          errorMessage = payload.message || "القسم غير موجود";
        } else if (payload?.status === 403) {
          errorMessage = payload.message || "ليس لديك صلاحية لتحديث هذا القسم";
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
      .addCase(updateManagerPermission.pending, (state) => {
        state.loadingUpdateManagerPermission = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateManagerPermission.fulfilled, (state, action) => {
        state.loadingUpdateManagerPermission = false;
        state.updateError = null;

        const response = action.payload;
        if (response.success) {
          state.updateSuccess = true;
          state.updateMessage = response.messageAr || response.messageEn;
          state.selectedDepartment = response.data;

          const departmentIndex = state.departments.findIndex(
            (dept) => dept.id === response.data.id
          );
          if (departmentIndex !== -1) {
            state.departments[departmentIndex] = response.data;
          }
        }
      })
      .addCase(updateManagerPermission.rejected, (state, action) => {
        state.loadingUpdateManagerPermission = false;
        state.updateSuccess = false;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في تحديث القسم";

        if (payload?.status === 404) {
          errorMessage = payload.message || "القسم غير موجود";
        } else if (payload?.status === 403) {
          errorMessage = payload.message || "ليس لديك صلاحية لتحديث هذا القسم";
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
      .addCase(removeManager.pending, (state) => {
        state.loadingRemoveManager = true;
      })
      .addCase(removeManager.fulfilled, (state, action) => {
        state.loadingRemoveManager = false;
        state.selectedDepartment.manager = null;
        state.selectedDepartment.hasManager = false;
      })
      .addCase(removeManager.rejected, (state, action) => {
        state.loadingRemoveManager = false;
      })
      .addCase(assignManager.pending, (state) => {
        state.loadingAssignManager = true;
      })
      .addCase(assignManager.fulfilled, (state, action) => {
        state.loadingAssignManager = false;
      })
      .addCase(assignManager.rejected, (state, action) => {
        state.loadingAssignManager = false;
      })

      // Delete Department
      .addCase(deleteDepartment.pending, (state) => {
        state.loadingDeleteDepartment = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loadingDeleteDepartment = false;
        state.deleteError = null;

        const response = action.payload;
        if (response.success) {
          state.deleteSuccess = true;
          state.deleteMessage = response.messageAr || response.messageEn;
          console.log(Number(localStorage.getItem("deletedDepartmentId")));
          state.departments = state.departments.filter(
            (dept) =>
              dept.id != Number(localStorage.getItem("deletedDepartmentId"))
          );

          if (state.pagination) {
            state.pagination.totalCount -= 1;
            state.pagination.totalPages = Math.ceil(
              state.pagination.totalCount / state.pagination.pageSize
            );
          }

          if (state.selectedDepartment?.id === response.deletedDepartmentId) {
            state.selectedDepartment = null;
          }
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loadingDeleteDepartment = false;
        state.deleteSuccess = false;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في حذف القسم";

        if (payload?.status === 404) {
          errorMessage = payload.message || "القسم غير موجود";
        } else if (payload?.status === 403) {
          errorMessage = payload.message || "ليس لديك صلاحية لحذف هذا القسم";
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
  // Department filters
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,
  setCategoryFilter,

  // Department data
  clearDepartments,
  clearError,

  // Department success/error clearing
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,

  // Department form resets
  resetCreateForm,
  resetUpdateForm,
  resetDeleteForm,

  // Single department
  clearSingleDepartment,
  clearSingleDepartmentError,
} = departmentSlice.actions;

export default departmentSlice.reducer;

// Export async thunks
export {
  getDepartments,
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
