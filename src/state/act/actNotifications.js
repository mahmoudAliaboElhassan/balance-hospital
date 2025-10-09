import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axiosInstance"

// Get Notifications (Light)
export const getNotifications = createAsyncThunk(
  "notificationsSlice/getNotifications",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const { page = 1, pageSize = 20, isRead } = params

      const queryParams = new URLSearchParams()
      queryParams.append("page", page)
      queryParams.append("pageSize", pageSize)
      if (isRead !== undefined) queryParams.append("isRead", isRead)

      const res = await axiosInstance.get(
        `/api/v1/Notifications?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("Notifications fetched successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error fetching notifications:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Get Notification By Id
export const getNotificationById = createAsyncThunk(
  "notificationsSlice/getNotificationById",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.get(`/api/v1/Notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("Notification fetched successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error fetching notification:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Mark Notification As Read
export const markNotificationAsRead = createAsyncThunk(
  "notificationsSlice/markNotificationAsRead",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.put(
        `/api/v1/Notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("Notification marked as read:", res)
      return { id, data: res.data }
    } catch (error) {
      console.log("Error marking notification as read:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Mark Multiple As Read
export const markMultipleAsRead = createAsyncThunk(
  "notificationsSlice/markMultipleAsRead",
  async (ids, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.put(
        `/api/v1/Notifications/mark-multiple-read`,
        ids,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("Multiple notifications marked as read:", res)
      return { ids, data: res.data }
    } catch (error) {
      console.log("Error marking multiple notifications as read:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Mark All As Read
export const markAllAsRead = createAsyncThunk(
  "notificationsSlice/markAllAsRead",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.put(
        `/api/v1/Notifications/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("All notifications marked as read:", res)
      return res.data
    } catch (error) {
      console.log("Error marking all notifications as read:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Get Unread Count
export const getUnreadCount = createAsyncThunk(
  "notificationsSlice/getUnreadCount",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.get(
        `/api/v1/Notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("Unread count fetched successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error fetching unread count:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Delete Notification
export const deleteNotification = createAsyncThunk(
  "notificationsSlice/deleteNotification",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.delete(`/api/v1/Notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("Notification deleted successfully:", res)
      return { id, data: res.data }
    } catch (error) {
      console.log("Error deleting notification:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Delete Multiple Notifications
export const deleteMultipleNotifications = createAsyncThunk(
  "notificationsSlice/deleteMultipleNotifications",
  async (ids, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.delete(
        `/api/v1/Notifications/bulk-delete`,
        {
          data: ids,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("Multiple notifications deleted successfully:", res)
      return { ids, data: res.data }
    } catch (error) {
      console.log("Error deleting multiple notifications:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Get Notification Preferences
export const getNotificationPreferences = createAsyncThunk(
  "notificationsSlice/getNotificationPreferences",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.get(`/api/v1/Notifications/preferences`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("Notification preferences fetched successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error fetching notification preferences:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Update Notification Preferences
export const updateNotificationPreferences = createAsyncThunk(
  "notificationsSlice/updateNotificationPreferences",
  async (preferences, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
      const res = await axiosInstance.put(
        `/api/v1/Notifications/preferences`,
        preferences,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("Notification preferences updated successfully:", res)
      return res.data
    } catch (error) {
      console.log("Error updating notification preferences:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
