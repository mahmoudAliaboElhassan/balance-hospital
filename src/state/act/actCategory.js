import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getCategories = createAsyncThunk(
  "categorySlice/getCategories",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const queryParams = new URLSearchParams();

      // Add parameters if they exist
      if (params.search) queryParams.append("search", params.search);
      if (params.categoryId !== undefined)
        queryParams.append("categoryId", params.categoryId);
      if (params.isActive !== undefined)
        queryParams.append("isActive", params.isActive);
      if (params.createdFrom)
        queryParams.append("createdFrom", params.createdFrom);
      if (params.createdTo) queryParams.append("createdTo", params.createdTo);
      if (params.includeDepartments !== undefined)
        queryParams.append("includeDepartments", params.includeDepartments);
      if (params.includeStatistics !== undefined)
        queryParams.append("includeStatistics", params.includeStatistics);
      if (params.includeChief !== undefined)
        queryParams.append("includeChief", params.includeChief);
      if (params.page) queryParams.append("page", params.page);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.orderBy) queryParams.append("orderBy", params.orderBy);
      if (params.orderDesc !== undefined)
        queryParams.append("orderDesc", params.orderDesc);

      // Construct the URL with query parameters
      const url = `/api/v1/Category${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Categories fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching categories:", error);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "categorySlice/getCategoryById",
  async ({ categoryId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      // Validate categoryId
      if (!categoryId) {
        return rejectWithValue({
          message: "معرف الفئة مطلوب",
          messageEn: "Category ID is required",
        });
      }

      const res = await axiosInstance.get(`/api/v1/Category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Category fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching category:", error);

      // Handle specific error cases
      if (error.response?.status === 404) {
        return rejectWithValue({
          message: "الفئة غير موجودة",
          messageEn: "Category not found",
          status: 404,
        });
      }

      if (error.response?.status === 403) {
        return rejectWithValue({
          message: "ليس لديك صلاحية للوصول لهذه الفئة",
          messageEn: "You don't have permission to access this category",
          status: 403,
        });
      }

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categorySlice/createCategory",
  async (categoryData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post("/api/v1/Category", categoryData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Category created successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error creating category:", error);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categorySlice/updateCategory",
  async ({ categoryId, categoryData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      // Validate categoryId
      if (!categoryId) {
        return rejectWithValue({
          message: "معرف الفئة مطلوب",
          messageEn: "Category ID is required",
        });
      }

      const res = await axiosInstance.put(
        `/api/v1/Category/${categoryId}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Category updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error updating category:", error);

      // Handle specific error cases
      if (error.response?.status === 404) {
        return rejectWithValue({
          message: "الفئة غير موجودة",
          messageEn: "Category not found",
          status: 404,
        });
      }

      if (error.response?.status === 403) {
        return rejectWithValue({
          message: "ليس لديك صلاحية لتحديث هذه الفئة",
          messageEn: "You don't have permission to update this category",
          status: 403,
        });
      }

      if (error.response?.status === 400) {
        return rejectWithValue({
          message: "بيانات غير صحيحة أو عدم تطابق ID",
          messageEn: "Invalid data or ID mismatch",
          status: 400,
          errors: error.response?.data?.errors || [],
        });
      }

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categorySlice/deleteCategory",
  async ({ categoryId, reason }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(`/api/v1/Category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: { reason },
      });

      console.log("Category deleted successfully:", res);
      return { ...res.data, deletedCategoryId: categoryId };
    } catch (error) {
      console.log("Error deleting category:", error);

      // Handle specific error cases
      if (error.response?.status === 404) {
        return rejectWithValue({
          message: "الفئة غير موجودة",
          messageEn: "Category not found",
          status: 404,
        });
      }

      if (error.response?.status === 403) {
        return rejectWithValue({
          message: "ليس لديك صلاحية لحذف هذه الفئة",
          messageEn: "You don't have permission to delete this category",
          status: 403,
        });
      }

      if (error.response?.status === 400) {
        return rejectWithValue({
          message: "بيانات غير صحيحة أو سبب الحذف مطلوب",
          messageEn: "Invalid data or reason is required",
          status: 400,
          errors: error.response?.data?.errors || [],
        });
      }

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const approveDoctorRequest = createAsyncThunk(
  "categorySlice/approveDoctorRequest",
  async ({ userId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      // Validate userId
      if (!userId) {
        return rejectWithValue({
          message: "معرف المستخدم مطلوب",
          messageEn: "User ID is required",
        });
      }

      const res = await axiosInstance.post(
        "/api/v1/Category/approve-doctor-request",
        null, // no body
        {
          params: { userId }, // ?userId=...
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Doctor request processed successfully:", res);
      return { ...res.data, userId };
    } catch (error) {
      console.log("Error processing doctor request:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        return rejectWithValue({
          message: "معرف الطلب غير صحيح أو الطلب تم معالجته مسبقاً",
          messageEn: "Invalid request ID or request already processed",
          status: 400,
        });
      }

      if (error.response?.status === 403) {
        return rejectWithValue({
          message: "لا توجد صلاحية لمعالجة هذا الطلب",
          messageEn: "You don't have permission to process this request",
          status: 403,
        });
      }

      if (error.response?.status === 404) {
        return rejectWithValue({
          message: "الطلب غير موجود",
          messageEn: "Request not found",
          status: 404,
        });
      }

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const rejectDoctorRequest = createAsyncThunk(
  "categorySlice/rejectDoctorRequest", // Different action type
  async ({ userId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      // Validate userId
      if (!userId) {
        return rejectWithValue({
          message: "معرف المستخدم مطلوب",
          messageEn: "User ID is required",
        });
      }

      const res = await axiosInstance.post(
        "/api/v1/Category/reject-doctor-request",
        null, // no body
        {
          params: { userId }, // ?userId=...
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Doctor request rejected successfully:", res);
      return { ...res.data, userId }; // Added isApproved: false
    } catch (error) {
      console.log("Error rejecting doctor request:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        return rejectWithValue({
          message: "معرف الطلب غير صحيح أو الطلب تم معالجته مسبقاً",
          messageEn: "Invalid request ID or request already processed",
          status: 400,
        });
      }

      if (error.response?.status === 403) {
        return rejectWithValue({
          message: "لا توجد صلاحية لمعالجة هذا الطلب",
          messageEn: "You don't have permission to process this request",
          status: 403,
        });
      }

      if (error.response?.status === 404) {
        return rejectWithValue({
          message: "الطلب غير موجود",
          messageEn: "Request not found",
          status: 404,
        });
      }

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCategoryTypes = createAsyncThunk(
  "category/getCategoryTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/Category/categories-types"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب أنواع الفئات",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// Get Pending Doctor Requests for Specific Category
export const getCategoryPendingRequests = createAsyncThunk(
  "category/getCategoryPendingRequests",
  async ({ categoryId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      console.log(
        "Fetching pending doctor requests for category from act :",
        categoryId
      );
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page);
      if (filters.pageSize) params.append("pageSize", filters.pageSize);

      const queryString = params.toString();
      const url = `/api/v1/Category/${categoryId}/pending-doctor-requests${
        queryString ? `?${queryString}` : ""
      }`;
      console.log("→ fetching pending requests from URL:", url);

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return { ...response.data, categoryId };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب طلبات الفئة",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export const getCategoryHeads = createAsyncThunk(
  "category/getCategoryHeads",
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `api/v1/role/category-heads?CategoryId=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب أنواع الفئات",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);
export const assignCategoryHead = createAsyncThunk(
  "category/assignCategoryHead",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `api/v1/Role/category-head/assign`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب أنواع الفئات",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);
export const removeCategoryHead = createAsyncThunk(
  "category/removeCategoryHead",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/Role/category-head/remove`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { ...response.data, catHeadId: data.CategoryId };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.messageAr ||
          error.response?.data?.messageEn ||
          "حدث خطأ في جلب أنواع الفئات",
        errors: error.response?.data?.errors || [],
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      });
    }
  }
);
