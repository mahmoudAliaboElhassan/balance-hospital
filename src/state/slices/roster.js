// src/state/slices/rosterManagement.js
import { createSlice } from "@reduxjs/toolkit";

// ===================================================================
// IMPORT ALL ACTIONS FROM ACTIONS FILE
// ===================================================================
import {
  // Phase 1: Basic Structure
  createBasicRoster,

  // Phase 2: Department Shifts
  addDepartmentShifts,
  getDepartmentShifts,
  deleteDepartmentShift,

  // Phase 3: Contracting Requirements
  addContractingRequirements,
  getContractingRequirements,
  updateContractingRequirements,
  getAvailableContractingTypes,

  // Phase 4: Working Hours
  addWorkingHours,
  getWorkingHours,
  updateDoctorRequirements,
  getWorkingHoursOverview,

  // Phase 5: Templates & Analytics
  applyContractingTemplate,
  getContractingAnalytics,
  validateContractingDistribution,

  // Phase 6: State Management
  markRosterReady,
  publishRoster,
  closeRoster,

  // Phase 7: Doctor Management
  assignDoctor,

  // Query Operations
  getRosterList,
  getRostersPaged,
  getRosterById,
  searchColleagues,
  getRosterAnalytics,
  getDoctorWorkloads,
  getDepartmentCoverage,
  getDepartmentSchedule,

  // Update & Management
  updateRosterBasicInfo,
  deleteRoster,
  archiveRoster,

  // Export & Additional
  exportRoster,
  duplicateRoster,
  updateRosterStatus,
} from "../act/actRosterManagement";
import i18next from "i18next";

// ===================================================================
// INITIAL STATE (الحالة الأولية)
// ===================================================================

const initialState = {
  // ===== ROSTER DATA (بيانات الروستر) =====
  rosters: [],
  selectedRoster: null,
  rosterList: [], // للقائمة المبسطة

  // ===== DEPARTMENT SHIFTS (شفتات الأقسام) =====
  departmentShifts: [],
  selectedDepartmentShifts: null,

  // ===== CONTRACTING DATA (بيانات التعاقدات) =====
  contractingRequirements: [],
  availableContractingTypes: [],
  contractingAnalytics: null,
  contractingValidation: null,

  // ===== WORKING HOURS DATA (بيانات ساعات العمل) =====
  workingHours: [],
  workingHoursOverview: null,
  doctorRequirements: [],

  // ===== ANALYTICS & REPORTS (التحليلات والتقارير) =====
  rosterAnalytics: null,
  doctorWorkloads: [],
  departmentCoverage: [],
  departmentSchedule: null,

  // ===== SEARCH & ASSISTANCE (البحث والمساعدة) =====
  colleagueSearchResults: [],

  // ===== PAGINATION (ترقيم الصفحات) =====
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  // ===== LOADING STATES (حالات التحميل) =====
  loading: {
    // Phase Operations
    createBasic: false,
    addShifts: false,
    addContracting: false,
    addWorkingHours: false,
    applyTemplate: false,
    markReady: false,
    publish: false,
    close: false,
    assign: false,

    // CRUD Operations
    fetch: false,
    update: false,
    delete: false,
    export: false,

    // Analytics & Reports
    analytics: false,
    workloads: false,
    coverage: false,
    validation: false,

    // Search Operations
    search: false,
    schedule: false,
  },

  // ===== SUCCESS STATES (حالات النجاح) =====
  success: {
    createBasic: false,
    addShifts: false,
    addContracting: false,
    addWorkingHours: false,
    applyTemplate: false,
    markReady: false,
    publish: false,
    close: false,
    assign: false,
    update: false,
    delete: false,
    export: false,
    archive: false,
    duplicate: false,
  },

  // ===== ERROR STATES (حالات الأخطاء) =====
  errors: {
    general: null,
    create: null,
    update: null,
    assign: null,
    export: null,
    analytics: null,
    search: null,
    validation: null,
    shifts: null,
    contracting: null,
    workingHours: null,
  },

  // ===== UI STATE (حالة واجهة المستخدم) =====
  ui: {
    currentPhase: 1, // 1-7 representing phases
    activeTab: "overview",
    viewMode: "grid", // grid, list, calendar
    selectedDepartmentId: null,
    selectedShiftId: null,
    filters: {
      categoryId: null,
      status: null,
      page: 1,
      month: null,
      year: null,
      departmentId: null,
      search: null,
    },
  },
};

// ===================================================================
// SLICE DEFINITION (تعريف الـ Slice)
// ===================================================================

const rosterManagementSlice = createSlice({
  name: "rosterManagement",
  initialState,
  reducers: {
    // ===== ERROR MANAGEMENT (إدارة الأخطاء) =====
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach((key) => {
        state.errors[key] = null;
      });
    },

    clearSpecificError: (state, action) => {
      const errorType = action.payload;
      if (state.errors[errorType] !== undefined) {
        state.errors[errorType] = null;
      }
    },

    setCurrentPage: (state, action) => {
      state.ui.filters.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.ui.filters.pageSize = action.payload;
      state.ui.filters.page = 1;
    },

    // ===== SUCCESS STATE MANAGEMENT (إدارة حالات النجاح) =====
    clearAllSuccess: (state) => {
      Object.keys(state.success).forEach((key) => {
        state.success[key] = false;
      });
    },

    clearSpecificSuccess: (state, action) => {
      const successType = action.payload;
      if (state.success[successType] !== undefined) {
        state.success[successType] = false;
      }
    },

    // ===== DATA MANAGEMENT (إدارة البيانات) =====
    clearSelectedRoster: (state) => {
      state.selectedRoster = null;
      state.rosterAnalytics = null;
      state.workingHoursOverview = null;
      state.contractingValidation = null;
    },

    clearAnalyticsData: (state) => {
      state.rosterAnalytics = null;
      state.doctorWorkloads = [];
      state.departmentCoverage = [];
      state.contractingAnalytics = null;
    },

    clearDepartmentShifts: (state) => {
      state.departmentShifts = [];
      state.selectedDepartmentShifts = null;
    },

    clearContractingData: (state) => {
      state.contractingRequirements = [];
      state.contractingValidation = null;
      state.contractingAnalytics = null;
    },

    clearWorkingHoursData: (state) => {
      state.workingHours = [];
      state.workingHoursOverview = null;
      state.doctorRequirements = [];
    },

    clearSearchResults: (state) => {
      state.colleagueSearchResults = [];
    },

    // ===== PAGINATION MANAGEMENT (إدارة ترقيم الصفحات) =====
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    resetPagination: (state) => {
      state.pagination = {
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    },

    // ===== UI STATE MANAGEMENT (إدارة حالة واجهة المستخدم) =====
    setCurrentPhase: (state, action) => {
      state.ui.currentPhase = action.payload;
    },

    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },

    setViewMode: (state, action) => {
      state.ui.viewMode = action.payload;
    },

    setSelectedDepartmentId: (state, action) => {
      state.ui.selectedDepartmentId = action.payload;
    },

    setSelectedShiftId: (state, action) => {
      state.ui.selectedShiftId = action.payload;
    },

    setFilters: (state, action) => {
      state.ui.filters = { ...state.ui.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.ui.filters = {
        categoryId: null,
        status: null,
        month: null,
        year: null,
        departmentId: null,
      };
    },

    // ===== ROSTER OPERATIONS (عمليات الروستر) =====
    updateRosterInList: (state, action) => {
      const { rosterId, updates } = action.payload;

      // Update in main rosters array
      const rosterIndex = state.rosters.findIndex((r) => r.id === rosterId);
      if (rosterIndex !== -1) {
        state.rosters[rosterIndex] = {
          ...state.rosters[rosterIndex],
          ...updates,
        };
      }

      // Update selected roster if it matches
      if (state.selectedRoster && state.selectedRoster.id === rosterId) {
        state.selectedRoster = { ...state.selectedRoster, ...updates };
      }
    },

    removeRosterFromList: (state, action) => {
      const rosterId = action.payload;
      state.rosters = state.rosters.filter((r) => r.id !== rosterId);

      if (state.selectedRoster && state.selectedRoster.id === rosterId) {
        state.selectedRoster = null;
      }
    },

    // ===== DEPARTMENT SHIFTS OPERATIONS (عمليات شفتات الأقسام) =====
    addShiftToList: (state, action) => {
      state.departmentShifts.push(action.payload);
    },

    removeShiftFromList: (state, action) => {
      const shiftId = action.payload;
      state.departmentShifts = state.departmentShifts.filter(
        (shift) => shift.id !== shiftId
      );
    },

    updateShiftInList: (state, action) => {
      const { shiftId, updates } = action.payload;
      const shiftIndex = state.departmentShifts.findIndex(
        (shift) => shift.id === shiftId
      );
      if (shiftIndex !== -1) {
        state.departmentShifts[shiftIndex] = {
          ...state.departmentShifts[shiftIndex],
          ...updates,
        };
      }
    },
  },

  extraReducers: (builder) => {
    // ===================================================================
    // PHASE 1: BASIC STRUCTURE (المرحلة 1: الهيكل الأساسي)
    // ===================================================================

    // Create Basic Roster
    builder
      .addCase(createBasicRoster.pending, (state) => {
        state.loading.createBasic = true;
        state.errors.create = null;
        state.success.createBasic = false;
      })
      .addCase(createBasicRoster.fulfilled, (state, action) => {
        state.loading.createBasic = false;
        state.success.createBasic = true;
        state.ui.currentPhase = 2; // Move to next phase
        console.log("action.payload", action.payload);
        localStorage.setItem("rosterId", action.payload.data.rosterId);

        if (action.payload?.data) {
          state.rosters.unshift(action.payload.data);
          state.selectedRoster = action.payload.data;
        }
      })
      .addCase(createBasicRoster.rejected, (state, action) => {
        state.loading.createBasic = false;
        state.errors.create = action.payload;
      });

    // ===================================================================
    // PHASE 2: DEPARTMENT SHIFTS (المرحلة 2: شفتات الأقسام)
    // ===================================================================

    // Add Department Shifts
    builder
      .addCase(addDepartmentShifts.pending, (state) => {
        state.loading.addShifts = true;
        state.errors.shifts = null;
        state.success.addShifts = false;
      })
      .addCase(addDepartmentShifts.fulfilled, (state, action) => {
        state.loading.addShifts = false;
        state.success.addShifts = true;

        if (action.payload?.data) {
          // Add new shifts to the list
          if (Array.isArray(action.payload.data)) {
            state.departmentShifts.push(...action.payload.data);
          } else {
            state.departmentShifts.push(action.payload.data);
          }
        }
      })
      .addCase(addDepartmentShifts.rejected, (state, action) => {
        state.loading.addShifts = false;
        state.errors.shifts = action.payload;
      });
    builder
      .addCase(updateRosterStatus.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(updateRosterStatus.fulfilled, (state, action) => {
        state.loading.update = false;
      })
      .addCase(updateRosterStatus.rejected, (state, action) => {
        state.loading.update = false;
      });

    // Get Department Shifts
    builder
      .addCase(getDepartmentShifts.pending, (state) => {
        state.loading.fetch = true;
        state.errors.shifts = null;
      })
      .addCase(getDepartmentShifts.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.selectedDepartmentShifts = action.payload?.data || null;
      })
      .addCase(getDepartmentShifts.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.shifts = action.payload;
      });

    // Delete Department Shift
    builder
      .addCase(deleteDepartmentShift.pending, (state) => {
        state.loading.delete = true;
        state.errors.shifts = null;
      })
      .addCase(deleteDepartmentShift.fulfilled, (state, action) => {
        state.loading.delete = false;

        if (action.payload?.data?.id) {
          rosterManagementSlice.caseReducers.removeShiftFromList(state, {
            payload: action.payload.data.id,
          });
        }
      })
      .addCase(deleteDepartmentShift.rejected, (state, action) => {
        state.loading.delete = false;
        state.errors.shifts = action.payload;
      });

    // ===================================================================
    // PHASE 3: CONTRACTING REQUIREMENTS (المرحلة 3: متطلبات التعاقد)
    // ===================================================================

    // Add Contracting Requirements
    builder
      .addCase(addContractingRequirements.pending, (state) => {
        state.loading.addContracting = true;
        state.errors.contracting = null;
        state.success.addContracting = false;
      })
      .addCase(addContractingRequirements.fulfilled, (state, action) => {
        state.loading.addContracting = false;
        state.success.addContracting = true;

        if (action.payload?.data) {
          state.contractingRequirements.push(
            ...(Array.isArray(action.payload.data)
              ? action.payload.data
              : [action.payload.data])
          );
        }
      })
      .addCase(addContractingRequirements.rejected, (state, action) => {
        state.loading.addContracting = false;
        state.errors.contracting = action.payload;
      });

    // Get Contracting Requirements
    builder
      .addCase(getContractingRequirements.pending, (state) => {
        state.loading.fetch = true;
        state.errors.contracting = null;
      })
      .addCase(getContractingRequirements.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.contractingRequirements = action.payload?.data || [];
      })
      .addCase(getContractingRequirements.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.contracting = action.payload;
      });

    // Update Contracting Requirements
    builder
      .addCase(updateContractingRequirements.pending, (state) => {
        state.loading.update = true;
        state.errors.contracting = null;
      })
      .addCase(updateContractingRequirements.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.update = true;

        if (action.payload?.data) {
          state.contractingRequirements = action.payload.data;
        }
      })
      .addCase(updateContractingRequirements.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.contracting = action.payload;
      });

    // Get Available Contracting Types
    builder
      .addCase(getAvailableContractingTypes.pending, (state) => {
        state.loading.fetch = true;
        state.errors.general = null;
      })
      .addCase(getAvailableContractingTypes.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.availableContractingTypes = action.payload?.data || [];
      })
      .addCase(getAvailableContractingTypes.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.general = action.payload;
      });

    // ===================================================================
    // PHASE 4: WORKING HOURS (المرحلة 4: ساعات العمل)
    // ===================================================================

    // Add Working Hours
    builder
      .addCase(addWorkingHours.pending, (state) => {
        state.loading.addWorkingHours = true;
        state.errors.workingHours = null;
        state.success.addWorkingHours = false;
      })
      .addCase(addWorkingHours.fulfilled, (state, action) => {
        state.loading.addWorkingHours = false;
        state.success.addWorkingHours = true;

        if (action.payload?.data) {
          state.workingHours.push(
            ...(Array.isArray(action.payload.data)
              ? action.payload.data
              : [action.payload.data])
          );
        }
      })
      .addCase(addWorkingHours.rejected, (state, action) => {
        state.loading.addWorkingHours = false;
        state.errors.workingHours = action.payload;
      });

    // Get Working Hours
    builder
      .addCase(getWorkingHours.pending, (state) => {
        state.loading.fetch = true;
        state.errors.workingHours = null;
      })
      .addCase(getWorkingHours.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.workingHours = action.payload?.data || [];
      })
      .addCase(getWorkingHours.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.workingHours = action.payload;
      });

    // Update Doctor Requirements
    builder
      .addCase(updateDoctorRequirements.pending, (state) => {
        state.loading.update = true;
        state.errors.workingHours = null;
      })
      .addCase(updateDoctorRequirements.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.update = true;

        if (action.payload?.data) {
          state.doctorRequirements = action.payload.data;
        }
      })
      .addCase(updateDoctorRequirements.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.workingHours = action.payload;
      });

    // Get Working Hours Overview
    builder
      .addCase(getWorkingHoursOverview.pending, (state) => {
        state.loading.fetch = true;
        state.errors.general = null;
      })
      .addCase(getWorkingHoursOverview.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.workingHoursOverview = action.payload?.data || null;
      })
      .addCase(getWorkingHoursOverview.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.general = action.payload;
      });

    // ===================================================================
    // PHASE 5: TEMPLATES & ANALYTICS (المرحلة 5: القوالب والتحليل)
    // ===================================================================

    // Apply Contracting Template
    builder
      .addCase(applyContractingTemplate.pending, (state) => {
        state.loading.applyTemplate = true;
        state.errors.contracting = null;
        state.success.applyTemplate = false;
      })
      .addCase(applyContractingTemplate.fulfilled, (state) => {
        state.loading.applyTemplate = false;
        state.success.applyTemplate = true;
      })
      .addCase(applyContractingTemplate.rejected, (state, action) => {
        state.loading.applyTemplate = false;
        state.errors.contracting = action.payload;
      });

    // Get Contracting Analytics
    builder
      .addCase(getContractingAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.errors.analytics = null;
      })
      .addCase(getContractingAnalytics.fulfilled, (state, action) => {
        state.loading.analytics = false;
        state.contractingAnalytics = action.payload?.data || null;
      })
      .addCase(getContractingAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.errors.analytics = action.payload;
      });

    // Validate Contracting Distribution
    builder
      .addCase(validateContractingDistribution.pending, (state) => {
        state.loading.validation = true;
        state.errors.validation = null;
      })
      .addCase(validateContractingDistribution.fulfilled, (state, action) => {
        state.loading.validation = false;
        state.contractingValidation = action.payload?.data || null;
      })
      .addCase(validateContractingDistribution.rejected, (state, action) => {
        state.loading.validation = false;
        state.errors.validation = action.payload;
      });

    // ===================================================================
    // PHASE 6: STATE MANAGEMENT (المرحلة 6: إدارة الحالات)
    // ===================================================================

    // Mark Roster Ready
    builder
      .addCase(markRosterReady.pending, (state) => {
        state.loading.markReady = true;
        state.errors.update = null;
        state.success.markReady = false;
      })
      .addCase(markRosterReady.fulfilled, (state, action) => {
        state.loading.markReady = false;
        state.success.markReady = true;

        if (action.payload?.data) {
          const updates = { status: "DRAFT_READY" };
          rosterManagementSlice.caseReducers.updateRosterInList(state, {
            payload: { rosterId: action.payload.data.id, updates },
          });
        }
      })
      .addCase(markRosterReady.rejected, (state, action) => {
        state.loading.markReady = false;
        state.errors.update = action.payload;
      });

    // Publish Roster
    builder
      .addCase(publishRoster.pending, (state) => {
        state.loading.publish = true;
        state.errors.update = null;
        state.success.publish = false;
      })
      .addCase(publishRoster.fulfilled, (state, action) => {
        state.loading.publish = false;
        state.success.publish = true;

        if (action.payload?.data) {
          const updates = { status: "PUBLISHED" };
          rosterManagementSlice.caseReducers.updateRosterInList(state, {
            payload: { rosterId: action.payload.data.id, updates },
          });
        }
      })
      .addCase(publishRoster.rejected, (state, action) => {
        state.loading.publish = false;
        state.errors.update = action.payload;
      });

    // Close Roster
    builder
      .addCase(closeRoster.pending, (state) => {
        state.loading.close = true;
        state.errors.update = null;
        state.success.close = false;
      })
      .addCase(closeRoster.fulfilled, (state, action) => {
        state.loading.close = false;
        state.success.close = true;

        if (action.payload?.data) {
          const updates = { status: "CLOSED" };
          rosterManagementSlice.caseReducers.updateRosterInList(state, {
            payload: { rosterId: action.payload.data.id, updates },
          });
        }
      })
      .addCase(closeRoster.rejected, (state, action) => {
        state.loading.close = false;
        state.errors.update = action.payload;
      });

    // ===================================================================
    // PHASE 7: DOCTOR MANAGEMENT (المرحلة 7: إدارة الأطباء)
    // ===================================================================

    // Assign Doctor
    builder
      .addCase(assignDoctor.pending, (state) => {
        state.loading.assign = true;
        state.errors.assign = null;
        state.success.assign = false;
      })
      .addCase(assignDoctor.fulfilled, (state) => {
        state.loading.assign = false;
        state.success.assign = true;
      })
      .addCase(assignDoctor.rejected, (state, action) => {
        state.loading.assign = false;
        state.errors.assign = action.payload;
      });

    // ===================================================================
    // QUERY OPERATIONS (عمليات الاستعلام)
    // ===================================================================

    // Get Roster List
    builder
      .addCase(getRosterList.pending, (state) => {
        state.loading.fetch = true;
        state.errors.general = null;
      })
      .addCase(getRosterList.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.rosterList = action.payload?.data || [];
        console.log("roster list", state.rosterList);
      })
      .addCase(getRosterList.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.general =
          // action.payload?.message ||
          i18next.t("roster.error.fetchFailed");
      });

    // Get Rosters Paged
    builder
      .addCase(getRostersPaged.pending, (state) => {
        state.loading.fetch = true;
        state.errors.general = null;
      })
      .addCase(getRostersPaged.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.rosterList = action.payload?.data.data || [];
        state.pagination.totalPages = action.payload.data.totalPages;
        state.pagination.totalItems = action.payload.data.totalCount;
        console.log("roster list", state.rosterList);
        console.log("totalItems", state.pagination.totalItems);
      })
      .addCase(getRostersPaged.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.general =
          // action.payload?.message ||
          i18next.t("roster.error.fetchFailed");
      });

    // Get Roster by ID
    builder
      .addCase(getRosterById.pending, (state) => {
        state.loading.fetch = true;
        state.errors.general = null;
      })
      .addCase(getRosterById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.selectedRoster = action.payload?.data || null;
      })
      .addCase(getRosterById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.general =
          action.payload || i18next.t("roster.error.fetchFailed");
      });

    // Search Colleagues
    builder
      .addCase(searchColleagues.pending, (state) => {
        state.loading.search = true;
        state.errors.search = null;
      })
      .addCase(searchColleagues.fulfilled, (state, action) => {
        state.loading.search = false;
        state.colleagueSearchResults = action.payload?.data || [];
      })
      .addCase(searchColleagues.rejected, (state, action) => {
        state.loading.search = false;
        state.errors.search = action.payload;
      });

    // Get Roster Analytics
    builder
      .addCase(getRosterAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.errors.analytics = null;
      })
      .addCase(getRosterAnalytics.fulfilled, (state, action) => {
        state.loading.analytics = false;
        state.rosterAnalytics = action.payload?.data || null;
      })
      .addCase(getRosterAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.errors.analytics = action.payload;
      });

    // Get Doctor Workloads
    builder
      .addCase(getDoctorWorkloads.pending, (state) => {
        state.loading.workloads = true;
        state.errors.analytics = null;
      })
      .addCase(getDoctorWorkloads.fulfilled, (state, action) => {
        state.loading.workloads = false;
        state.doctorWorkloads = action.payload?.data || [];
      })
      .addCase(getDoctorWorkloads.rejected, (state, action) => {
        state.loading.workloads = false;
        state.errors.analytics = action.payload;
      });

    // Get Department Coverage
    builder
      .addCase(getDepartmentCoverage.pending, (state) => {
        state.loading.coverage = true;
        state.errors.analytics = null;
      })
      .addCase(getDepartmentCoverage.fulfilled, (state, action) => {
        state.loading.coverage = false;
        state.departmentCoverage = action.payload?.data || [];
      })
      .addCase(getDepartmentCoverage.rejected, (state, action) => {
        state.loading.coverage = false;
        state.errors.analytics = action.payload;
      });

    // Get Department Schedule
    builder
      .addCase(getDepartmentSchedule.pending, (state) => {
        state.loading.schedule = true;
        state.errors.general = null;
      })
      .addCase(getDepartmentSchedule.fulfilled, (state, action) => {
        state.loading.schedule = false;
        state.departmentSchedule = action.payload?.data || null;
      })
      .addCase(getDepartmentSchedule.rejected, (state, action) => {
        state.loading.schedule = false;
        state.errors.general = action.payload;
      });

    // ===================================================================
    // UPDATE & MANAGEMENT OPERATIONS (عمليات التحديث والإدارة)
    // ===================================================================

    // Update Roster Basic Info
    builder
      .addCase(updateRosterBasicInfo.pending, (state) => {
        state.loading.update = true;
        state.errors.update = null;
        state.success.update = false;
      })
      .addCase(updateRosterBasicInfo.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.update = true;

        if (action.payload?.data) {
          rosterManagementSlice.caseReducers.updateRosterInList(state, {
            payload: {
              rosterId: action.payload.data.id,
              updates: action.payload.data,
            },
          });
        }
      })
      .addCase(updateRosterBasicInfo.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.update = action.payload;
      });

    // Delete Roster
    builder
      .addCase(deleteRoster.pending, (state) => {
        state.loading.delete = true;
        state.errors.general = null;
        state.success.delete = false;
      })
      .addCase(deleteRoster.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success.delete = true;

        if (action.payload?.data?.id) {
          rosterManagementSlice.caseReducers.removeRosterFromList(state, {
            payload: action.payload.data.id,
          });
        }
      })
      .addCase(deleteRoster.rejected, (state, action) => {
        state.loading.delete = false;
        state.errors.general = action.payload;
      });

    // Archive Roster
    builder
      .addCase(archiveRoster.pending, (state) => {
        state.loading.update = true;
        state.errors.general = null;
        state.success.archive = false;
      })
      .addCase(archiveRoster.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.archive = true;

        if (action.payload?.data) {
          const updates = { status: "ARCHIVED" };
          rosterManagementSlice.caseReducers.updateRosterInList(state, {
            payload: { rosterId: action.payload.data.id, updates },
          });
        }
      })
      .addCase(archiveRoster.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.general = action.payload;
      });

    // ===================================================================
    // EXPORT & ADDITIONAL OPERATIONS (التصدير والعمليات الإضافية)
    // ===================================================================

    // Export Roster
    builder
      .addCase(exportRoster.pending, (state) => {
        state.loading.export = true;
        state.errors.export = null;
        state.success.export = false;
      })
      .addCase(exportRoster.fulfilled, (state) => {
        state.loading.export = false;
        state.success.export = true;
      })
      .addCase(exportRoster.rejected, (state, action) => {
        state.loading.export = false;
        state.errors.export = action.payload;
      });

    // Duplicate Roster
    builder
      .addCase(duplicateRoster.pending, (state) => {
        state.loading.update = true;
        state.errors.general = null;
        state.success.duplicate = false;
      })
      .addCase(duplicateRoster.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.duplicate = true;

        if (action.payload?.data) {
          state.rosters.unshift(action.payload.data);
        }
      })
      .addCase(duplicateRoster.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.general = action.payload;
      });
  },
});

// ===================================================================
// EXPORT ACTIONS (تصدير الأكشنز)
// ===================================================================

export const {
  // Error Management
  clearAllErrors,
  clearSpecificError,

  // Success Management
  clearAllSuccess,
  clearSpecificSuccess,

  // Data Management
  clearSelectedRoster,
  clearAnalyticsData,
  clearDepartmentShifts,
  clearContractingData,
  clearWorkingHoursData,
  clearSearchResults,

  // Pagination
  setPagination,
  resetPagination,

  // UI State
  setCurrentPhase,
  setActiveTab,
  setViewMode,
  setSelectedDepartmentId,
  setSelectedShiftId,
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,
  // Roster Operations
  updateRosterInList,
  removeRosterFromList,

  // Department Shifts Operations
  addShiftToList,
  removeShiftFromList,
  updateShiftInList,
} = rosterManagementSlice.actions;

// ===================================================================
// SELECTORS (المحددات)
// ===================================================================

// Basic Selectors (المحددات الأساسية)
export const selectRosters = (state) => state.rosterManagement.rosters;
export const selectSelectedRoster = (state) =>
  state.rosterManagement.selectedRoster;
export const selectRosterList = (state) => state.rosterManagement.rosterList;
export const selectPagination = (state) => state.rosterManagement.pagination;

// Department Shifts Selectors (محددات شفتات الأقسام)
export const selectDepartmentShifts = (state) =>
  state.rosterManagement.departmentShifts;
export const selectSelectedDepartmentShifts = (state) =>
  state.rosterManagement.selectedDepartmentShifts;

// Contracting Selectors (محددات التعاقدات)
export const selectContractingRequirements = (state) =>
  state.rosterManagement.contractingRequirements;
export const selectAvailableContractingTypes = (state) =>
  state.rosterManagement.availableContractingTypes;
export const selectContractingAnalytics = (state) =>
  state.rosterManagement.contractingAnalytics;
export const selectContractingValidation = (state) =>
  state.rosterManagement.contractingValidation;

// Working Hours Selectors (محددات ساعات العمل)
export const selectWorkingHours = (state) =>
  state.rosterManagement.workingHours;
export const selectWorkingHoursOverview = (state) =>
  state.rosterManagement.workingHoursOverview;
export const selectDoctorRequirements = (state) =>
  state.rosterManagement.doctorRequirements;

// Loading Selectors (محددات التحميل)
export const selectLoadingStates = (state) => state.rosterManagement.loading;
export const selectIsCreatingBasic = (state) =>
  state.rosterManagement.loading.createBasic;
export const selectIsFetching = (state) => state.rosterManagement.loading.fetch;
export const selectIsUpdating = (state) =>
  state.rosterManagement.loading.update;
export const selectIsAddingShifts = (state) =>
  state.rosterManagement.loading.addShifts;
export const selectIsAddingContracting = (state) =>
  state.rosterManagement.loading.addContracting;
export const selectIsAddingWorkingHours = (state) =>
  state.rosterManagement.loading.addWorkingHours;
export const selectIsPublishing = (state) =>
  state.rosterManagement.loading.publish;
export const selectIsAssigning = (state) =>
  state.rosterManagement.loading.assign;

// Error Selectors (محددات الأخطاء)
export const selectErrors = (state) => state.rosterManagement.errors;
export const selectCreateError = (state) =>
  state.rosterManagement.errors.create;
export const selectUpdateError = (state) =>
  state.rosterManagement.errors.update;
export const selectShiftsError = (state) =>
  state.rosterManagement.errors.shifts;
export const selectContractingError = (state) =>
  state.rosterManagement.errors.contracting;
export const selectWorkingHoursError = (state) =>
  state.rosterManagement.errors.workingHours;
export const selectAnalyticsError = (state) =>
  state.rosterManagement.errors.analytics;

// Success Selectors (محددات النجاح)
export const selectSuccessStates = (state) => state.rosterManagement.success;
export const selectCreateBasicSuccess = (state) =>
  state.rosterManagement.success.createBasic;
export const selectAddShiftsSuccess = (state) =>
  state.rosterManagement.success.addShifts;
export const selectPublishSuccess = (state) =>
  state.rosterManagement.success.publish;

// Analytics Selectors (محددات التحليلات)
export const selectRosterAnalytics = (state) =>
  state.rosterManagement.rosterAnalytics;
export const selectDoctorWorkloads = (state) =>
  state.rosterManagement.doctorWorkloads;
export const selectDepartmentCoverage = (state) =>
  state.rosterManagement.departmentCoverage;
export const selectDepartmentSchedule = (state) =>
  state.rosterManagement.departmentSchedule;

// Search Selectors (محددات البحث)
export const selectColleagueSearchResults = (state) =>
  state.rosterManagement.colleagueSearchResults;

// UI Selectors (محددات واجهة المستخدم)
export const selectUIState = (state) => state.rosterManagement.ui;
export const selectCurrentPhase = (state) =>
  state.rosterManagement.ui.currentPhase;
export const selectActiveTab = (state) => state.rosterManagement.ui.activeTab;
export const selectViewMode = (state) => state.rosterManagement.ui.viewMode;
export const selectSelectedDepartmentId = (state) =>
  state.rosterManagement.ui.selectedDepartmentId;
export const selectSelectedShiftId = (state) =>
  state.rosterManagement.ui.selectedShiftId;
export const selectFilters = (state) => state.rosterManagement.ui.filters;

// Complex Selectors (المحددات المعقدة)
export const selectRosterById = (rosterId) => (state) =>
  state.rosterManagement.rosters.find((roster) => roster.id === rosterId);

export const selectShiftById = (shiftId) => (state) =>
  state.rosterManagement.departmentShifts.find((shift) => shift.id === shiftId);

export const selectIsRosterReadyForPublication = (state) => {
  const roster = state.rosterManagement.selectedRoster;
  const validation = state.rosterManagement.contractingValidation;
  return roster?.status === "DRAFT_READY" && validation?.isValid === true;
};

export const selectCanProgressToNextPhase = (state) => {
  const currentPhase = state.rosterManagement.ui.currentPhase;
  const roster = state.rosterManagement.selectedRoster;

  switch (currentPhase) {
    case 1:
      return roster !== null;
    case 2:
      return state.rosterManagement.departmentShifts.length > 0;
    case 3:
      return state.rosterManagement.contractingRequirements.length > 0;
    case 4:
      return state.rosterManagement.workingHours.length > 0;
    case 5:
      return state.rosterManagement.contractingValidation?.isValid === true;
    case 6:
      return roster?.status === "DRAFT_READY";
    default:
      return false;
  }
};

export const selectPhaseCompletionStatus = (state) => {
  const roster = state.rosterManagement.selectedRoster;
  const departmentShifts = state.rosterManagement.departmentShifts;
  const contractingRequirements =
    state.rosterManagement.contractingRequirements;
  const workingHours = state.rosterManagement.workingHours;
  const validation = state.rosterManagement.contractingValidation;

  return {
    phase1: roster !== null,
    phase2: departmentShifts.length > 0,
    phase3: contractingRequirements.length > 0,
    phase4: workingHours.length > 0,
    phase5: validation?.isValid === true,
    phase6: roster?.status === "DRAFT_READY" || roster?.status === "PUBLISHED",
    phase7: roster?.status === "PUBLISHED",
  };
};

export const selectRostersByStatus = (status) => (state) =>
  state.rosterManagement.rosters.filter((roster) => roster.status === status);

export const selectFilteredRosters = (state) => {
  const rosters = state.rosterManagement.rosters;
  const filters = state.rosterManagement.ui.filters;

  return rosters.filter((roster) => {
    if (filters.categoryId && roster.categoryId !== filters.categoryId) {
      return false;
    }
    if (filters.status && roster.status !== filters.status) {
      return false;
    }
    if (filters.departmentId && roster.departmentId !== filters.departmentId) {
      return false;
    }
    if (filters.month && roster.month !== filters.month) {
      return false;
    }
    if (filters.year && roster.year !== filters.year) {
      return false;
    }
    return true;
  });
};

// Statistics Selectors (محددات الإحصائيات)
export const selectRosterStatistics = (state) => {
  const rosters = state.rosterManagement.rosters;

  return {
    total: rosters.length,
    draft: rosters.filter((r) => r.status === "DRAFT").length,
    draftReady: rosters.filter((r) => r.status === "DRAFT_READY").length,
    published: rosters.filter((r) => r.status === "PUBLISHED").length,
    closed: rosters.filter((r) => r.status === "CLOSED").length,
    archived: rosters.filter((r) => r.status === "ARCHIVED").length,
  };
};

export const selectDepartmentShiftsStatistics = (state) => {
  const shifts = state.rosterManagement.departmentShifts;

  return {
    total: shifts.length,
    withContracting: shifts.filter((s) => s.hasContractingRequirements).length,
    withWorkingHours: shifts.filter((s) => s.hasWorkingHours).length,
    completed: shifts.filter((s) => s.isCompleted).length,
  };
};

// Validation Selectors (محددات التحقق)
export const selectHasValidationErrors = (state) => {
  const validation = state.rosterManagement.contractingValidation;
  return validation?.errors && validation.errors.length > 0;
};

export const selectValidationErrors = (state) => {
  const validation = state.rosterManagement.contractingValidation;
  return validation?.errors || [];
};

// Phase Navigation Selectors (محددات التنقل بين المراحل)
export const selectCanGoToPreviousPhase = (state) => {
  return state.rosterManagement.ui.currentPhase > 1;
};

export const selectCanGoToNextPhase = (state) => {
  const currentPhase = state.rosterManagement.ui.currentPhase;
  return currentPhase < 7 && selectCanProgressToNextPhase(state);
};

export const selectPhaseProgress = (state) => {
  const currentPhase = state.rosterManagement.ui.currentPhase;
  const completionStatus = selectPhaseCompletionStatus(state);

  let completedPhases = 0;
  Object.values(completionStatus).forEach((isComplete) => {
    if (isComplete) completedPhases++;
  });

  return {
    currentPhase,
    completedPhases,
    totalPhases: 7,
    progressPercentage: (completedPhases / 7) * 100,
  };
};

// Export the reducer as default
export default rosterManagementSlice.reducer;
