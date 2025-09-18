// Updated UseInitialStates Hook
function UseInitialStates() {
  const initialStateMode = {
    mymode:
      typeof window !== "undefined"
        ? localStorage.getItem("mymode") || "light"
        : "light",
  };

  const initialStateAuth = {
    token:
      typeof window !== "undefined" ? localStorage.getItem("token") || "" : "",
    role:
      typeof window !== "undefined" ? localStorage.getItem("role") || "" : "",
    user: null,
    loadingAuth: false,
    expiresAt:
      typeof window !== "undefined"
        ? localStorage.getItem("expiresAt") || ""
        : "",

    departmentManagerId:
      typeof window !== "undefined"
        ? localStorage.getItem("departmentManagerId") || ""
        : "",

    categoryManagerId:
      typeof window !== "undefined"
        ? localStorage.getItem("categoryManagerId") || ""
        : "",

    loginRoleResponseDto:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("loginRoleResponseDto") || "{}")
        : null,
  };

  const initialStateCategories = {
    // Categories data
    categories: [],
    pagination: null,
    error: null,
    message: "",
    timestamp: null,
    categoryHead: {},
    // Category Types (Public)
    categoryTypes: [],
    categoryHeads: [],
    categoryHeadsPagination: {
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    loadingGetCategoryTypes: false,
    categoryTypesError: null,

    // Loading states for categories
    loadingGetCategoryHeads: false,
    loadingGetCategories: false,
    loadingCreateCategory: false,
    loadingGetSingleCategory: false,
    loadingUpdateCategory: false,
    loadingDeleteCategory: false,
    loadingRejectRequest: false,
    loadingRemoveCategoryHead: false,
    loadingAssignCategoryHead: false,

    // Create category states
    createSuccess: false,
    createMessage: "",
    createError: null,

    // Update category states
    updateSuccess: false,
    updateMessage: "",
    updateError: null,

    // Delete category states
    deleteSuccess: false,
    deleteMessage: "",
    deleteError: null,

    // Single category states
    selectedCategory: null,
    singleCategoryError: null,

    // Category filters
    filters: {
      search: "",
      isActive: true,
      orderBy: "createdAt",
      orderDesc: true,
      page: 1,
      pageSize: 10,
    },

    // Global pending doctor requests (all categories)
    pendingDoctorRequests: [],
    pendingDoctorRequestsPagination: null,
    pendingDoctorRequestsError: null,
    selectedRequest: null,
    loadingGetPendingDoctorRequests: false,

    // Pending doctor requests filters (global)
    pendingRequestsFilters: {
      status: "", // Pending|Approved|Rejected
      page: 1,
      pageSize: 10,
    },

    // Category-specific pending requests
    categoryPendingRequests: [],
    categoryPendingRequestsPagination: null,
    categoryPendingRequestsError: null,
    selectedCategoryId: null,
    loadingGetCategoryPendingRequests: false,

    // Category-specific pending requests filters
    categoryPendingRequestsFilters: {
      status: "",
      page: 1,
      pageSize: 10,
    },

    // Doctor Request Approval states - ADDED THESE
    loadingApproveRequest: false,
    approvalError: null,
    approvalSuccess: false,
    approvalMessage: "",
  };

  const initialStateDepartments = {
    // Department filters
    filters: {
      search: "",
      categoryId: "",
      isActive: true,
      createdFrom: null,
      createdTo: null,
      includeSubDepartments: true,
      includeManager: true,
      includeCategories: true,
      includeStatistics: true,
      includeCategory: true,
      orderBy: "nameArabic",
      orderDesc: true,
      page: 1,
      pageSize: 10,
    },

    // Department data
    departments: [],
    departmentsByCategory: [],
    pagination: null,
    error: null,
    message: "",
    timestamp: null,

    // Loading states
    loadingGetDepartments: false,
    loadingGetSingleDepartment: false,
    loadingCreateDepartment: false,
    loadingUpdateDepartment: false,
    loadingDeleteDepartment: false,
    loadingUpdateManagerPermission: false,
    loadingAssignManager: false,
    loadingLinkDepartmentToCategory: false,
    loadingGetDepartmentsByCategory: false,

    // Single department
    selectedDepartment: null,
    singleDepartmentError: null,

    // Create department
    createSuccess: false,
    createError: null,
    createMessage: "",

    // Update department
    updateSuccess: false,
    updateError: null,
    updateMessage: "",

    // Delete department
    deleteSuccess: false,
    deleteError: null,
    deleteMessage: "",
  };

  const initialStateSubDepartments = {
    subDepartments: [],
    pagination: null,
    filters: {
      search: "",
      departmentId: "",
      categoryId: "",
      isActive: "",
      createdFrom: "",
      createdTo: "",
      includeDepartment: true,
      includeStatistics: true,
      orderBy: "nameArabic",
      orderDesc: true,
      page: 1,
      pageSize: 10,
    },
    loadingGetSubDepartments: false,
    error: null,
    message: "",
    timestamp: null,

    // Single subDepartment
    selectedSubDepartment: null,
    loadingGetSingleSubDepartment: false,
    singleSubDepartmentError: null,

    // Create subDepartment
    loadingCreateSubDepartment: false,
    createError: null,
    createSuccess: false,
    createMessage: "",

    // Update subDepartment
    loadingUpdateSubDepartment: false,
    updateError: null,
    updateSuccess: false,
    updateMessage: "",

    // Delete subDepartment
    loadingDeleteSubDepartment: false,
    deleteError: null,
    deleteSuccess: false,
    deleteMessage: "",
  };

  const initialStateContractingTypes = {
    allContractingTypes: [],
    allActiveContractingTypes: [],
    contractingTypesForSignup: [],
    selectedContractingType: null,

    // Paginated/filtered data for display
    contractingTypes: [],
    activeContractingTypes: [],

    // Pagination state
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      startIndex: 0,
      endIndex: 0,
    },

    // Filter state
    filters: {
      search: "",
      statusFilter: true, // "all" or "active"
      page: 1,
      pageSize: 10,
    },

    // Loading states
    loadingGetContractingTypes: false,
    loadingGetActiveContractingTypes: false,
    loadingGetContractingTypesForSignup: false,
    loadingGetSingleContractingType: false,
    loadingCreateContractingType: false,
    loadingUpdateContractingType: false,
    loadingDeleteContractingType: false,

    // Error states
    error: null,
    singleContractingTypeError: null,
    createError: null,
    updateError: null,
    deleteError: null,

    // Success states
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,

    // Messages
    message: "",
    createMessage: "",
    updateMessage: "",
    deleteMessage: "",
    timestamp: null,
  };

  const initialStateScientificDegrees = {
    scientificDegrees: [],
    scientificDegreesForSignup: [],
    selectedScientificDegree: null,

    // Pagination
    pagination: null,

    // Filters
    filters: {
      search: "",
      code: "",
      isActive: undefined, // undefined = all, true = active, false = inactive
      createdFromDate: "",
      createdToDate: "",
      sortBy: 5, // Default to CreatedAt (based on API documentation)
      sortDirection: 1, // Default to Descending (newest first)
      page: 1,
      pageSize: 10,
    },

    // Loading states
    loadingGetScientificDegrees: false,
    loadingGetScientificDegreesForSignup: false,
    loadingGetSingleScientificDegree: false,
    loadingCreateScientificDegree: false,
    loadingUpdateScientificDegree: false,
    loadingDeleteScientificDegree: false,

    // Error states
    error: null,
    singleScientificDegreeError: null,
    createError: null,
    updateError: null,
    deleteError: null,

    // Success states
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,

    // Success messages
    createMessage: "",
    updateMessage: "",
    deleteMessage: "",

    // General
    message: "",
    timestamp: null,
  };

  const initialStateShiftHoursTypes = {
    // Data arrays
    shiftHoursTypes: [],
    allShiftHoursTypes: [],
    activeShiftHoursTypes: [],
    allActiveShiftHoursTypes: [],
    selectedShiftHoursType: null,
    shiftHoursTypesByPeriod: [],
    pagedShiftHoursTypes: {},

    // Loading states for GET operations
    loadingGetShiftHoursTypes: false,
    loadingGetActiveShiftHoursTypes: false,
    loadingGetSingleShiftHoursType: false,
    loadingGetShiftHoursTypesByPeriod: false,
    loadingGetPagedShiftHoursTypes: false,

    // Loading states for CUD operations
    loadingCreateShiftHoursType: false,
    loadingUpdateShiftHoursType: false,
    loadingDeleteShiftHoursType: false,

    // General error and success states
    error: null,
    message: "",
    timestamp: null,

    // Single shift hours type error
    singleShiftHoursTypeError: null,

    // Create operation states
    createSuccess: false,
    createError: null,
    createMessage: "",

    // Update operation states
    updateSuccess: false,
    updateError: null,
    updateMessage: "",

    // Delete operation states
    deleteSuccess: false,
    deleteError: null,
    deleteMessage: "",

    // Filters and pagination
    filters: {
      page: 1,
      pageSize: 10,
      search: "",
      period: "all", // "all", "daily", "weekly", "monthly"
      statusFilter: "all", // "all" or "active"
      isActive: undefined,
      sortBy: "",
      sortDirection: "asc", // "asc" or "desc"
    },

    // Pagination info
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  return {
    initialStateMode,
    initialStateAuth,
    initialStateCategories,
    initialStateDepartments,
    initialStateSubDepartments,
    initialStateContractingTypes,
    initialStateScientificDegrees,
    initialStateShiftHoursTypes,
  };
}

export default UseInitialStates;
