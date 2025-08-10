import { createSlice } from "@reduxjs/toolkit";
import UseInitialStates from "../../hooks/use-initial-state";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTypes,
  getCategoryPendingRequests,
  approveDoctorRequest, // Add the new action import
} from "../act/actCategory";
import i18next from "i18next";
import "../../translation/i18n";

const { initialStateCategories } = UseInitialStates();

export const categorySlice = createSlice({
  name: "categorySlice",
  initialState: initialStateCategories,
  reducers: {
    // Category filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        isActive: "",
        orderBy: "createdAt",
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

    // Category data actions
    clearCategories: (state) => {
      state.categories = [];
      state.pagination = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Category Types actions
    clearCategoryTypes: (state) => {
      state.categoryTypes = [];
      state.categoryTypesError = null;
    },
    clearCategoryTypesError: (state) => {
      state.categoryTypesError = null;
    },

    // Category success/error clearing actions
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

    // Category form reset actions
    resetCreateForm: (state) => {
      state.loadingCreateCategory = false;
      state.createError = null;
      state.createSuccess = false;
      state.createMessage = "";
    },
    resetUpdateForm: (state) => {
      state.loadingUpdateCategory = false;
      state.updateError = null;
      state.updateSuccess = false;
      state.updateMessage = "";
    },
    resetDeleteForm: (state) => {
      state.loadingDeleteCategory = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.deleteMessage = "";
    },

    // Single category actions
    clearSingleCategory: (state) => {
      state.selectedCategory = null;
      state.singleCategoryError = null;
    },
    clearSingleCategoryError: (state) => {
      state.singleCategoryError = null;
    },

    // Global Pending Doctor Requests filters
    setPendingRequestsFilters: (state, action) => {
      state.pendingRequestsFilters = {
        ...state.pendingRequestsFilters,
        ...action.payload,
      };
    },
    clearPendingRequestsFilters: (state) => {
      state.pendingRequestsFilters = {
        status: "",
        page: 1,
        pageSize: 10,
      };
    },
    setPendingRequestsCurrentPage: (state, action) => {
      state.pendingRequestsFilters.page = action.payload;
    },
    setPendingRequestsPageSize: (state, action) => {
      state.pendingRequestsFilters.pageSize = action.payload;
      state.pendingRequestsFilters.page = 1;
    },
    setPendingRequestsStatusFilter: (state, action) => {
      state.pendingRequestsFilters.status = action.payload;
      state.pendingRequestsFilters.page = 1;
    },

    // Global Pending Doctor Requests data actions
    clearPendingDoctorRequests: (state) => {
      state.pendingDoctorRequests = [];
      state.pendingDoctorRequestsPagination = null;
      state.pendingDoctorRequestsError = null;
    },
    clearPendingDoctorRequestsError: (state) => {
      state.pendingDoctorRequestsError = null;
    },
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },

    // Category-specific Pending Requests filters
    setCategoryPendingRequestsFilters: (state, action) => {
      state.categoryPendingRequestsFilters = {
        ...state.categoryPendingRequestsFilters,
        ...action.payload,
      };
    },
    clearCategoryPendingRequestsFilters: (state) => {
      state.categoryPendingRequestsFilters = {
        status: "",
        page: 1,
        pageSize: 10,
      };
    },
    setCategoryPendingRequestsCurrentPage: (state, action) => {
      state.categoryPendingRequestsFilters.page = action.payload;
    },
    setCategoryPendingRequestsPageSize: (state, action) => {
      state.categoryPendingRequestsFilters.pageSize = action.payload;
      state.categoryPendingRequestsFilters.page = 1;
    },
    setCategoryPendingRequestsStatusFilter: (state, action) => {
      state.categoryPendingRequestsFilters.status = action.payload;
      state.categoryPendingRequestsFilters.page = 1;
    },

    // Category-specific Pending Requests data actions
    clearCategoryPendingRequests: (state) => {
      state.categoryPendingRequests = [];
      state.categoryPendingRequestsPagination = null;
      state.categoryPendingRequestsError = null;
      state.selectedCategoryId = null;
    },
    clearCategoryPendingRequestsError: (state) => {
      state.categoryPendingRequestsError = null;
    },
    setSelectedCategoryId: (state, action) => {
      state.selectedCategoryId = action.payload;
    },

    // Doctor Request Approval actions
    clearApprovalSuccess: (state) => {
      state.approvalSuccess = false;
      state.approvalMessage = "";
    },
    clearApprovalError: (state) => {
      state.approvalError = null;
    },
    resetApprovalForm: (state) => {
      state.loadingApproveRequest = false;
      state.approvalError = null;
      state.approvalSuccess = false;
      state.approvalMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.loadingGetCategories = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loadingGetCategories = false;
        state.error = null;

        const response = action.payload;
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
        state.error = {
          message:
            action.payload?.message || i18next.t("categories.fetchError"),
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Category Types (Public)
      .addCase(getCategoryTypes.pending, (state) => {
        state.loadingGetCategoryTypes = true;
        state.categoryTypesError = null;
      })
      .addCase(getCategoryTypes.fulfilled, (state, action) => {
        state.loadingGetCategoryTypes = false;
        state.categoryTypesError = null;

        const response = action.payload;
        if (response.success) {
          state.categoryTypes = response.data;
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
        console.log(state.categoryTypes);
      })
      .addCase(getCategoryTypes.rejected, (state, action) => {
        state.loadingGetCategoryTypes = false;
        state.categoryTypes = [];
        state.categoryTypesError = {
          message: action.payload?.message || "حدث خطأ في جلب أنواع الفئات",
          errors: action.payload?.errors || [],
          status: action.payload?.status,
          timestamp: new Date().toISOString(),
        };
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loadingCreateCategory = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loadingCreateCategory = false;
        state.createError = null;

        const response = action.payload;
        if (response.success) {
          state.createSuccess = true;
          state.createMessage = response.message;

          if (state.filters.page === 1) {
            state.categories.unshift(response.data);
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
        state.createError = {
          message: action.payload?.message || "حدث خطأ في إنشاء الفئة",
          errors: action.payload?.errors || [],
          timestamp: new Date().toISOString(),
        };
      })

      // Get Single Category
      .addCase(getCategoryById.pending, (state) => {
        state.loadingGetSingleCategory = true;
        state.singleCategoryError = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loadingGetSingleCategory = false;
        state.singleCategoryError = null;

        const response = action.payload;
        if (response.success) {
          state.selectedCategory = response.data;
          state.message = response.messageAr || response.message;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loadingGetSingleCategory = false;
        state.selectedCategory = null;

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

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loadingUpdateCategory = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loadingUpdateCategory = false;
        state.updateError = null;

        const response = action.payload;
        if (response.success) {
          state.updateSuccess = true;
          state.updateMessage = response.messageAr || response.message;
          state.selectedCategory = response.data;

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

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loadingDeleteCategory = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loadingDeleteCategory = false;
        state.deleteError = null;

        const response = action.payload;
        if (response.success) {
          state.deleteSuccess = true;
          state.deleteMessage = response.messageAr || response.message;

          state.categories = state.categories.filter(
            (cat) => cat.id !== response.deletedCategoryId
          );

          if (state.pagination) {
            state.pagination.totalCount -= 1;
            state.pagination.totalPages = Math.ceil(
              state.pagination.totalCount / state.pagination.pageSize
            );
          }

          if (state.selectedCategory?.id === response.deletedCategoryId) {
            state.selectedCategory = null;
          }
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loadingDeleteCategory = false;
        state.deleteSuccess = false;

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
      })

      // Get Category-specific Pending Doctor Requests
      .addCase(getCategoryPendingRequests.pending, (state) => {
        state.loadingGetCategoryPendingRequests = true;
        state.categoryPendingRequestsError = null;
      })
      .addCase(getCategoryPendingRequests.fulfilled, (state, action) => {
        state.loadingGetCategoryPendingRequests = false;
        state.categoryPendingRequestsError = null;

        const response = action.payload;
        if (response.success) {
          state.categoryPendingRequests = response.data.items;
          state.categoryPendingRequestsPagination = {
            page: response.data.page,
            pageSize: response.data.pageSize,
            totalCount: response.data.totalCount,
            totalPages: response.data.totalPages,
            hasPrevious: response.data.hasPrevious,
            hasNext: response.data.hasNext,
            startIndex: response.data.startIndex,
            endIndex: response.data.endIndex,
          };
          state.selectedCategoryId = response.categoryId;
          state.message = response.messageAr || response.messageEn;
          state.timestamp = response.timestamp;
        }
      })
      .addCase(getCategoryPendingRequests.rejected, (state, action) => {
        state.loadingGetCategoryPendingRequests = false;
        state.categoryPendingRequests = [];
        state.categoryPendingRequestsPagination = null;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في جلب طلبات الفئة";

        if (payload?.status === 404) {
          errorMessage = payload.message || "الفئة غير موجودة";
        } else if (payload?.status === 403) {
          errorMessage =
            payload.message || "ليس لديك صلاحية للوصول لهذه البيانات";
        } else if (payload?.status === 401) {
          errorMessage = payload.message || "يجب تسجيل الدخول أولاً";
        } else if (payload?.message) {
          errorMessage = payload.message;
        }

        state.categoryPendingRequestsError = {
          message: errorMessage,
          errors: payload?.errors || [],
          status: payload?.status,
          timestamp: new Date().toISOString(),
        };
      })

      // Approve/Reject Doctor Request
      .addCase(approveDoctorRequest.pending, (state) => {
        state.loadingApproveRequest = true;
        state.approvalError = null;
        state.approvalSuccess = false;
      })
      .addCase(approveDoctorRequest.fulfilled, (state, action) => {
        state.loadingApproveRequest = false;
        state.approvalError = null;

        const response = action.payload;
        if (response.success) {
          state.approvalSuccess = true;
          state.approvalMessage = response.messageAr || response.message;

          // Update the request status in the categoryPendingRequests array
          const requestIndex = state.categoryPendingRequests.findIndex(
            (request) => request.userId === response.userId
          );

          if (requestIndex !== -1) {
            const updatedRequest = {
              ...state.categoryPendingRequests[requestIndex],
              status: response.isApproved ? "Approved" : "Rejected",
              processedAt: new Date().toISOString(),
              processedByName: response.processedByName || "System",
              processedNotes: response.processedNotes || "",
            };
            state.categoryPendingRequests[requestIndex] = updatedRequest;
          }

          // Also update in global pending requests if they exist
          if (
            state.pendingDoctorRequests &&
            state.pendingDoctorRequests.length > 0
          ) {
            const globalRequestIndex = state.pendingDoctorRequests.findIndex(
              (request) => request.userId === response.userId
            );

            if (globalRequestIndex !== -1) {
              const updatedGlobalRequest = {
                ...state.pendingDoctorRequests[globalRequestIndex],
                status: response.isApproved ? "Approved" : "Rejected",
                processedAt: new Date().toISOString(),
                processedByName: response.processedByName || "System",
                processedNotes: response.processedNotes || "",
              };
              state.pendingDoctorRequests[globalRequestIndex] =
                updatedGlobalRequest;
            }
          }
        }
      })
      .addCase(approveDoctorRequest.rejected, (state, action) => {
        state.loadingApproveRequest = false;
        state.approvalSuccess = false;

        const payload = action.payload;
        let errorMessage = "حدث خطأ في معالجة الطلب";

        if (payload?.status === 400) {
          errorMessage =
            payload.message || "معرف الطلب غير صحيح أو الطلب تم معالجته مسبقاً";
        } else if (payload?.status === 403) {
          errorMessage = payload.message || "لا توجد صلاحية لمعالجة هذا الطلب";
        } else if (payload?.status === 404) {
          errorMessage = payload.message || "الطلب غير موجود";
        } else if (payload?.message) {
          errorMessage = payload.message;
        }

        state.approvalError = {
          message: errorMessage,
          errors: payload?.errors || [],
          status: payload?.status,
          timestamp: new Date().toISOString(),
        };
      });
  },
});

export const {
  // Category filters
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,

  // Category data
  clearCategories,
  clearError,

  // Category Types
  clearCategoryTypes,
  clearCategoryTypesError,

  // Category success/error clearing
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,

  // Category form resets
  resetCreateForm,
  resetUpdateForm,
  resetDeleteForm,

  // Single category
  clearSingleCategory,
  clearSingleCategoryError,

  // Global Pending Doctor Requests
  setPendingRequestsFilters,
  clearPendingRequestsFilters,
  setPendingRequestsCurrentPage,
  setPendingRequestsPageSize,
  setPendingRequestsStatusFilter,
  clearPendingDoctorRequests,
  clearPendingDoctorRequestsError,
  clearSelectedRequest,

  // Category-specific Pending Requests
  setCategoryPendingRequestsFilters,
  clearCategoryPendingRequestsFilters,
  setCategoryPendingRequestsCurrentPage,
  setCategoryPendingRequestsPageSize,
  setCategoryPendingRequestsStatusFilter,
  clearCategoryPendingRequests,
  clearCategoryPendingRequestsError,
  setSelectedCategoryId,

  // Doctor Request Approval
  clearApprovalSuccess,
  clearApprovalError,
  resetApprovalForm,
} = categorySlice.actions;

export default categorySlice.reducer;

// Export async thunks
export {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTypes,
  getCategoryPendingRequests,
  approveDoctorRequest,
};
