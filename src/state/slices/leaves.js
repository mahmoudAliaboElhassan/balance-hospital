import { createSlice } from "@reduxjs/toolkit"
import {
  approveLeave,
  getLeaveForReview,
  getLeaves,
  rejectLeave,
} from "../act/actLeaves"

const initialState = {
  leaves: [],
  currentLeave: null,
  loading: false,
  actionLoading: false, // For approve/reject actions
  error: null,
  actionError: null,
  currentFilter: null,
  lastAction: null, // Track last action (approve/reject)
}

// Slice
const leavesSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.actionError = null
    },
    clearActionError: (state) => {
      state.actionError = null
    },
    setFilter: (state, action) => {
      state.currentFilter = action.payload
    },
    clearLeaves: (state) => {
      state.leaves = []
      state.currentLeave = null
      state.error = null
      state.actionError = null
    },
    clearCurrentLeave: (state) => {
      state.currentLeave = null
    },
    clearLastAction: (state) => {
      state.lastAction = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Leaves
      .addCase(getLeaves.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getLeaves.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = action.payload.leaves.data
        state.error = null
      })
      .addCase(getLeaves.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Get Leave for Review
      .addCase(getLeaveForReview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getLeaveForReview.fulfilled, (state, action) => {
        state.loading = false
        state.currentLeave = action.payload.leave
        state.error = null
      })
      .addCase(getLeaveForReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Approve Leave
      .addCase(approveLeave.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.lastAction = null
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.actionLoading = false
        state.lastAction = { type: "approve", id: action.payload.id }
        state.actionError = null

        // Update the leave in the list if it exists
        const index = state.leaves.findIndex(
          (leave) => leave.id === action.payload.id
        )
        if (index !== -1) {
          state.leaves[index] = {
            ...state.leaves[index],
            ...action.payload.leave,
          }
        }

        // Update current leave if it matches
        if (state.currentLeave?.id === action.payload.id) {
          state.currentLeave = {
            ...state.currentLeave,
            ...action.payload.leave,
          }
        }
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload
        state.lastAction = null
      })

      // Reject Leave
      .addCase(rejectLeave.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.lastAction = null
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.actionLoading = false
        state.lastAction = { type: "reject", id: action.payload.id }
        state.actionError = null

        // Update the leave in the list if it exists
        const index = state.leaves.findIndex(
          (leave) => leave.id === action.payload.id
        )
        if (index !== -1) {
          state.leaves[index] = {
            ...state.leaves[index],
            ...action.payload.leave,
          }
        }

        // Update current leave if it matches
        if (state.currentLeave?.id === action.payload.id) {
          state.currentLeave = {
            ...state.currentLeave,
            ...action.payload.leave,
          }
        }
      })
      .addCase(rejectLeave.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload
        state.lastAction = null
      })
  },
})

// Export actions
export const {
  clearError,
  clearActionError,
  setFilter,
  clearLeaves,
  clearCurrentLeave,
  clearLastAction,
} = leavesSlice.actions

// Export selectors
export const selectLeaves = (state) => state.leaves.leaves
export const selectCurrentLeave = (state) => state.leaves.currentLeave
export const selectLeavesLoading = (state) => state.leaves.loading
export const selectActionLoading = (state) => state.leaves.actionLoading
export const selectLeavesError = (state) => state.leaves.error
export const selectActionError = (state) => state.leaves.actionError
export const selectCurrentFilter = (state) => state.leaves.currentFilter
export const selectLastAction = (state) => state.leaves.lastAction

// Export reducer
export { getLeaves, approveLeave, rejectLeave }

export default leavesSlice.reducer
