import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Helper function to get authorization headers
 */
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/**
 * Helper function to build query parameters
 */
const buildQueryParams = (params) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });
  return queryParams.toString();
};

/**
 * Generic error handler for thunks
 */
const handleError = (error, rejectWithValue) => {
  return rejectWithValue(error.response?.data || error.message);
};

// ===================================================================
// PHASE 1: BASIC ROSTER STRUCTURE (المرحلة 1: إنشاء الهيكل الأساسي)
// ===================================================================

/**
 * Create basic roster structure - Phase 1 (Required)
 * إنشاء الهيكل الأساسي للروستر - المرحلة الأولى الإجبارية
 */
export const createBasicRoster = createAsyncThunk(
  "rosterManagement/createBasicRoster",
  async (rosterData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/api/v1/RosterManagement/basic",
        rosterData,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ===================================================================
// PHASE 2: DEPARTMENT SHIFTS MANAGEMENT (المرحلة 2: إدارة شفتات الأقسام)
// ===================================================================

/**
 * Add department shifts to roster
 * إضافة شفتات للأقسام في الروستر
 */
export const addDepartmentShifts = createAsyncThunk(
  "rosterManagement/addDepartmentShifts",
  async ({ rosterDepartmentId, shiftsData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/RosterManagement/roster-departments/${rosterDepartmentId}/shifts`,
        shiftsData,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get department shifts for roster
 * الحصول على شفتات قسم محدد في الروستر
 */
export const getDepartmentShifts = createAsyncThunk(
  "rosterManagement/getDepartmentShifts",
  async ({ rosterDepartmentId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/roster-departments/${rosterDepartmentId}/shifts`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Delete specific department shift
 * حذف شفت محدد من قسم
 */
export const deleteDepartmentShift = createAsyncThunk(
  "rosterManagement/deleteDepartmentShift",
  async (departmentShiftId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/api/v1/RosterManagement/department-shifts/${departmentShiftId}`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ===================================================================
// PHASE 3: CONTRACTING REQUIREMENTS (المرحلة 3: متطلبات التعاقد)
// ===================================================================

/**
 * Add contracting requirements to department shift
 * إضافة متطلبات التعاقد لشفت قسم
 */

export const getShiftContractingTypes = createAsyncThunk(
  "rosterManagement/getShiftContractingTypes",
  async ({ departmentShiftId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/department-shifts/${departmentShiftId}/contracting-types`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Shift contracting types fetched successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error fetching shift contracting types:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add contracting types to a department shift
export const addShiftContractingTypes = createAsyncThunk(
  "rosterManagement/addShiftContractingTypes",
  async ({ departmentShiftId, contractingTypesData }, thunkAPI) => {
    console.log("contractingTypesData", contractingTypesData);
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.post(
        `/api/v1/RosterManagement/department-shifts/${departmentShiftId}/contracting-types`,
        contractingTypesData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Shift contracting types added successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error adding shift contracting types:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update shift contracting type
export const updateShiftContractingType = createAsyncThunk(
  "rosterManagement/updateShiftContractingType",
  async ({ shiftContractingTypeId, updateData }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/shift-contracting-types/${shiftContractingTypeId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Shift contracting type updated successfully:", res);
      return res.data;
    } catch (error) {
      console.log("Error updating shift contracting type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete shift contracting type
export const deleteShiftContractingType = createAsyncThunk(
  "rosterManagement/deleteShiftContractingType",
  async ({ contractingId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosInstance.delete(
        `/api/v1/RosterManagement/shift-contracting-types/${contractingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Shift contracting type deleted successfully:", res);
      return { ...res.data, deletedId: contractingId };
    } catch (error) {
      console.log("Error deleting shift contracting type:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ===================================================================
// PHASE 4: WORKING HOURS MANAGEMENT (المرحلة 4: إدارة ساعات العمل)
// ===================================================================

/**
 * Add working hours to department shift
 * إضافة ساعات عمل لشفت قسم
 */
export const addWorkingHours = createAsyncThunk(
  "rosterManagement/addWorkingHours",
  async (workingHours, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/rostermanagement/working-hours/generate`,
        workingHours,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get working hours for department shift
 * الحصول على ساعات العمل لشفت قسم
 */
export const getWorkingHours = createAsyncThunk(
  "rosterManagement/getWorkingHours",
  async ({ rosterId, params = {} }, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(params);

      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/working-hours${
          queryString ? `?${queryString}` : ""
        }`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);
export const getWorkingHour = createAsyncThunk(
  "rosterManagement/getWorkingHour",
  async ({ workingHourId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/working-hours/${workingHourId}`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);
export const updateWorkingHour = createAsyncThunk(
  "rosterManagement/updateWorkingHour",
  async ({ workingHourId, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/working-hours/${workingHourId}`,
        data,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Update doctor requirements for working hours
 * تحديث متطلبات الأطباء لساعات العمل
 */
export const updateDoctorRequirements = createAsyncThunk(
  "rosterManagement/updateDoctorRequirements",
  async ({ workingHoursId, requirements }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/working-hours/${workingHoursId}/doctor-requirements`,
        requirements,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get working hours overview for roster
 * نظرة عامة على ساعات العمل للروستر
 */
export const getWorkingHoursOverview = createAsyncThunk(
  "rosterManagement/getWorkingHoursOverview",
  async (rosterId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/working-hours-overview`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ===================================================================
// PHASE 5: TEMPLATES & ANALYTICS (المرحلة 5: القوالب والتحليل)
// ===================================================================

/**
 * Apply contracting template to roster
 * تطبيق قالب التعاقدات على الروستر
 */
export const applyContractingTemplate = createAsyncThunk(
  "rosterManagement/applyContractingTemplate",
  async ({ rosterId, templateData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/RosterManagement/${rosterId}/apply-contracting-template`,
        templateData,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get contracting analytics for roster
 * تحليل التعاقدات للروستر
 */
export const getContractingAnalytics = createAsyncThunk(
  "rosterManagement/getContractingAnalytics",
  async (rosterId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/contracting-analytics`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Validate contracting distribution
 * التحقق من صحة توزيع التعاقدات
 */
export const validateContractingDistribution = createAsyncThunk(
  "rosterManagement/validateContractingDistribution",
  async (rosterId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/validate-contracting`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ===================================================================
// PHASE 6: ROSTER STATE MANAGEMENT (المرحلة 6: إدارة حالات الروستر)
// ===================================================================

/**
 * Mark roster as ready for publication
 * تحديد الروستر كجاهز للنشر
 */
export const markRosterReady = createAsyncThunk(
  "rosterManagement/markRosterReady",
  async ({ rosterId, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/${rosterId}/mark-ready`,
        { reason },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Publish roster for actual use
 * نشر الروستر للاستخدام الفعلي
 */
export const publishRoster = createAsyncThunk(
  "rosterManagement/publishRoster",
  async ({ rosterId, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/${rosterId}/publish`,
        { reason },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Close roster
 * إغلاق الروستر
 */
export const closeRoster = createAsyncThunk(
  "rosterManagement/closeRoster",
  async ({ rosterId, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/${rosterId}/close`,
        { reason },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ===================================================================
// PHASE 7: DOCTOR MANAGEMENT & SCHEDULING (المرحلة 7: إدارة الأطباء والجدولة)
// ===================================================================

/**
 * Assign doctor to roster
 * تعيين طبيب على الروستر
 */
export const assignDoctor = createAsyncThunk(
  "rosterManagement/assignDoctor",
  async (assignmentData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/RosterManagement/doctor-assignments`,
        assignmentData,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ===================================================================
// QUERY OPERATIONS (عمليات البحث والاستعلامات)
// ===================================================================

/**
 * Get simple roster list
 * قائمة الروسترز المبسطة
 */
export const getRosterList = createAsyncThunk(
  "rosterManagement/getRosterList",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(filters);
      const url = `/api/v1/RosterManagement/list${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await axiosInstance.get(url, { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get paginated roster list
 * قائمة الروسترز مع ترقيم الصفحات
 */
export const getRostersPaged = createAsyncThunk(
  "rosterManagement/getRostersPaged",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryParams(params);
      const url = `/api/v1/RosterManagement/paged${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await axiosInstance.get(url, { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);
export const getRosterByCategory = createAsyncThunk(
  "rosterManagement/getRostersPaged",
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const url = `/api/v1/RosterManagement/categories/${categoryId}`;
      const res = await axiosInstance.get(url, { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get roster by ID
 * الحصول على روستر بالمعرف
 */
export const getRosterById = createAsyncThunk(
  "rosterManagement/getRosterById",
  async ({ rosterId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Search for colleagues on specific date
 * البحث عن زملاء في تاريخ محدد
 */
export const searchColleagues = createAsyncThunk(
  "rosterManagement/searchColleagues",
  async (searchParams, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/RosterManagement/search-colleagues`,
        searchParams,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get comprehensive roster analytics
 * تحليلات الروستر الشاملة
 */
export const getRosterAnalytics = createAsyncThunk(
  "rosterManagement/getRosterAnalytics",
  async (rosterId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/analytics`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get doctor workloads
 * أعباء عمل الأطباء
 */
export const getDoctorWorkloads = createAsyncThunk(
  "rosterManagement/getDoctorWorkloads",
  async (rosterId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/doctor-workloads`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get department coverage
 * تغطية الأقسام
 */
export const getDepartmentCoverage = createAsyncThunk(
  "rosterManagement/getDepartmentCoverage",
  async (rosterId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/department-coverage`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Get department schedule
 * جدول قسم محدد
 */
export const getDepartmentSchedule = createAsyncThunk(
  "rosterManagement/getDepartmentSchedule",
  async ({ rosterId, departmentId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/department/${departmentId}/schedule`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ===================================================================
// UPDATE & MANAGEMENT OPERATIONS (عمليات التحديث والإدارة)
// ===================================================================

/**
 * Update basic roster information
 * تحديث معلومات الروستر الأساسية
 */
export const updateRosterBasicInfo = createAsyncThunk(
  "rosterManagement/updateRosterBasicInfo",
  async ({ rosterId, updateData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/${rosterId}`,
        updateData,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);
export const updateRosterStatus = createAsyncThunk(
  "rosterManagement/updateRosterStatus",
  async ({ rosterId, updateData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/${rosterId}/status`,
        updateData,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Delete roster (soft delete)
 * حذف الروستر (حذف ناعم)
 */
export const deleteRoster = createAsyncThunk(
  "rosterManagement/deleteRoster",
  async ({ rosterId, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/api/v1/RosterManagement/${rosterId}`,
        {
          data: { reason },
          headers: getAuthHeaders(),
        }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Archive roster
 * أرشفة الروستر
 */
export const archiveRoster = createAsyncThunk(
  "rosterManagement/archiveRoster",
  async ({ rosterId, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/RosterManagement/${rosterId}/archive`,
        { reason },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ===================================================================
// EXPORT & ADDITIONAL OPERATIONS (التصدير والعمليات الإضافية)
// ===================================================================

/**
 * Export roster in different formats
 * تصدير الروستر بصيغ مختلفة
 */
export const exportRoster = createAsyncThunk(
  "rosterManagement/exportRoster",
  async ({ rosterId, format = "excel" }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/export?format=${format}`,
        {
          headers: getAuthHeaders(),
          responseType: "blob",
        }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

/**
 * Duplicate existing roster
 * نسخ الروستر الموجود
 */
export const duplicateRoster = createAsyncThunk(
  "rosterManagement/duplicateRoster",
  async ({ rosterId, duplicateData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/RosterManagement/${rosterId}/duplicate`,
        duplicateData,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);
export const getRosterDepartments = createAsyncThunk(
  "rosterManagement/getRosterDepartments",
  async ({ rosterId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/RosterManagement/${rosterId}/departments`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);
