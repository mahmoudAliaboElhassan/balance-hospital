import { createSlice } from "@reduxjs/toolkit"
import {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markMultipleAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  deleteMultipleNotifications,
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../act/actNotifications"

const initialState = {
  notifications: [],
  selectedNotification: null,
  unreadCount: 0,
  preferences: null,
  pagination: {
    totalCount: 0,
    page: 1,
    pageSize: 20,
    hasMore: false,
  },
  loading: {
    list: false,
    single: false,
    markAsRead: false,
    delete: false,
    preferences: false,
    unreadCount: false,
  },
  error: {
    list: null,
    single: null,
    markAsRead: null,
    delete: null,
    preferences: null,
  },
  lastUpdated: null,
}

const notificationsSlice = createSlice({
  name: "notificationsSlice",
  initialState,
  reducers: {
    clearError: (state, action) => {
      const errorType = action.payload
      if (errorType) {
        state.error[errorType] = null
      } else {
        state.error = {
          list: null,
          single: null,
          markAsRead: null,
          delete: null,
          preferences: null,
        }
      }
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading.list = true
        state.error.list = null
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading.list = false
        if (action.payload.success) {
          state.notifications = action.payload.data?.notifications || []
          state.unreadCount = action.payload.data?.notifications.length || 0
          state.pagination = {
            totalCount: action.payload.data?.totalCount || 0,
            page: action.payload.data?.page || 1,
            pageSize: action.payload.data?.pageSize || 20,
            hasMore: action.payload.data?.hasMore || false,
          }
          state.lastUpdated = action.payload.data?.lastUpdated
        }
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading.list = false
        state.error.list =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch notifications"
      })

      // Get Notification By Id
      .addCase(getNotificationById.pending, (state) => {
        state.loading.single = true
        state.error.single = null
      })
      .addCase(getNotificationById.fulfilled, (state, action) => {
        state.loading.single = false
        if (action.payload.success) {
          state.selectedNotification = action.payload.data
        }
      })
      .addCase(getNotificationById.rejected, (state, action) => {
        state.loading.single = false
        state.error.single =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch notification"
      })

      // Mark Notification As Read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading.markAsRead = true
        state.error.markAsRead = null
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading.markAsRead = false
        const notificationId = action.payload.id
        const notification = state.notifications.find(
          (n) => n.id === notificationId
        )
        if (notification) {
          notification.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        if (
          state.selectedNotification &&
          state.selectedNotification.id === notificationId
        ) {
          state.selectedNotification.isRead = true
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading.markAsRead = false
        state.error.markAsRead =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to mark notification as read"
      })

      // Mark Multiple As Read
      .addCase(markMultipleAsRead.pending, (state) => {
        state.loading.markAsRead = true
        state.error.markAsRead = null
      })
      .addCase(markMultipleAsRead.fulfilled, (state, action) => {
        state.loading.markAsRead = false
        const ids = action.payload.ids
        ids.forEach((id) => {
          const notification = state.notifications.find((n) => n.id === id)
          if (notification && !notification.isRead) {
            notification.isRead = true
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
        })
      })
      .addCase(markMultipleAsRead.rejected, (state, action) => {
        state.loading.markAsRead = false
        state.error.markAsRead =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to mark notifications as read"
      })

      // Mark All As Read
      .addCase(markAllAsRead.pending, (state) => {
        state.loading.markAsRead = true
        state.error.markAsRead = null
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading.markAsRead = false
        state.notifications.forEach((notification) => {
          notification.isRead = true
        })
        state.unreadCount = 0
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading.markAsRead = false
        state.error.markAsRead =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to mark all notifications as read"
      })

      // Get Unread Count
      .addCase(getUnreadCount.pending, (state) => {
        state.loading.unreadCount = true
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.loading.unreadCount = false
        if (action.payload.success) {
          state.unreadCount = action.payload.data || 0
        }
      })
      .addCase(getUnreadCount.rejected, (state) => {
        state.loading.unreadCount = false
      })

      // Delete Notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading.delete = true
        state.error.delete = null
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading.delete = false
        const notificationId = action.payload.id
        const notification = state.notifications.find(
          (n) => n.id === notificationId
        )
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.notifications = state.notifications.filter(
          (n) => n.id !== notificationId
        )
        state.pagination.totalCount = Math.max(
          0,
          state.pagination.totalCount - 1
        )
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading.delete = false
        state.error.delete =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to delete notification"
      })

      // Delete Multiple Notifications
      .addCase(deleteMultipleNotifications.pending, (state) => {
        state.loading.delete = true
        state.error.delete = null
      })
      .addCase(deleteMultipleNotifications.fulfilled, (state, action) => {
        state.loading.delete = false
        const ids = action.payload.ids
        ids.forEach((id) => {
          const notification = state.notifications.find((n) => n.id === id)
          if (notification && !notification.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
        })
        state.notifications = state.notifications.filter(
          (n) => !ids.includes(n.id)
        )
        state.pagination.totalCount = Math.max(
          0,
          state.pagination.totalCount - ids.length
        )
      })
      .addCase(deleteMultipleNotifications.rejected, (state, action) => {
        state.loading.delete = false
        state.error.delete =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to delete notifications"
      })

      // Get Notification Preferences
      .addCase(getNotificationPreferences.pending, (state) => {
        state.loading.preferences = true
        state.error.preferences = null
      })
      .addCase(getNotificationPreferences.fulfilled, (state, action) => {
        state.loading.preferences = false
        if (action.payload.success) {
          state.preferences = action.payload.data
        }
      })
      .addCase(getNotificationPreferences.rejected, (state, action) => {
        state.loading.preferences = false
        state.error.preferences =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to fetch notification preferences"
      })

      // Update Notification Preferences
      .addCase(updateNotificationPreferences.pending, (state) => {
        state.loading.preferences = true
        state.error.preferences = null
      })
      .addCase(updateNotificationPreferences.fulfilled, (state) => {
        state.loading.preferences = false
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.loading.preferences = false
        state.error.preferences =
          action.payload?.messageEn ||
          action.payload ||
          "Failed to update notification preferences"
      })
  },
})

export const {
  clearError,
  clearSelectedNotification,
  updatePagination,
  resetState,
} = notificationsSlice.actions

// Selectors
export const selectNotifications = (state) => state.notifications.notifications
export const selectSelectedNotification = (state) =>
  state.notifications.selectedNotification
export const selectUnreadCount = (state) => state.notifications.unreadCount
export const selectNotificationPreferences = (state) =>
  state.notifications.preferences
export const selectNotificationsLoading = (state) => state.notifications.loading
export const selectNotificationsError = (state) => state.notifications.error
export const selectNotificationsPagination = (state) =>
  state.notifications.pagination

export default notificationsSlice.reducer
