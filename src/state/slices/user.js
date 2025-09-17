import { createSlice } from "@reduxjs/toolkit";
import { doctorForAssignment, getUserSummaries } from "../act/actUsers";

const initialState = {
  users: [],
  pagination: {
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  loading: {
    list: false,
  },
  error: "",
  filters: {
    searchTerm: "",
  },
};

const usersSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = "";
    },

    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Update pagination
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset state
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Summaries
      // .addCase(getUserSummaries.pending, (state) => {
      //   state.loading.list = true;
      //   state.error = "";
      // })
      // .addCase(getUserSummaries.fulfilled, (state, action) => {
      //   state.loading.list = false;
      //   if (action.payload.success) {
      //     state.users = action.payload.data?.items || [];
      //     state.pagination = {
      //       totalCount: action.payload.data?.totalCount || 0,
      //       page: action.payload.data?.page || 1,
      //       pageSize: action.payload.data?.pageSize || 10,
      //       totalPages: action.payload.data?.totalPages || 0,
      //       hasNextPage: action.payload.data?.hasNextPage || false,
      //       hasPreviousPage: action.payload.data?.hasPreviousPage || false,
      //     };
      //   }
      // })
      // .addCase(getUserSummaries.rejected, (state, action) => {
      //   state.loading.list = false;
      //   state.error =
      //     action.payload?.messageEn ||
      //     action.payload ||
      //     "Failed to fetch user summaries";
      // })
      .addCase(doctorForAssignment.pending, (state) => {
        state.loading.list = true;
        state.error = "";
      })
      .addCase(doctorForAssignment.fulfilled, (state, action) => {
        state.loading.list = false;
        if (action.payload.success) {
          state.users = action.payload.data || [];
          // state.pagination = {
          //   totalCount: action.payload.data?.totalCount || 0,
          //   page: action.payload.data?.page || 1,
          //   pageSize: action.payload.data?.pageSize || 10,
          //   totalPages: action.payload.data?.totalPages || 0,
          //   hasNextPage: action.payload.data?.hasNextPage || false,
          //   hasPreviousPage: action.payload.data?.hasPreviousPage || false,
          // };
        }
      })
      .addCase(doctorForAssignment.rejected, (state, action) => {
        state.loading.list = false;
        state.error =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch user summaries";
      });
  },
});

// Export actions
export const {
  clearError,
  updateFilters,
  resetFilters,
  updatePagination,
  resetState,
} = usersSlice.actions;

export { getUserSummaries };

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersFilters = (state) => state.users.filters;
export const selectUsersPagination = (state) => state.users.pagination;

export default usersSlice.reducer;
