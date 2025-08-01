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
  };

  const initialStateCategories = {
    // Categories data
    categories: [],
    pagination: null,
    error: null,
    message: "",
    timestamp: null,

    // Category Types (Public)
    categoryTypes: [],
    loadingGetCategoryTypes: false,
    categoryTypesError: null,

    // Loading states for categories
    loadingGetCategories: false,
    loadingCreateCategory: false,
    loadingGetSingleCategory: false,
    loadingUpdateCategory: false,
    loadingDeleteCategory: false,

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
      includeStatistics: true,
      includeCategory: true,
      orderBy: "nameArabic",
      orderDesc: true,
      page: 1,
      pageSize: 10,
    },

    // Department data
    departments: [],
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
    // ContractingType filters
    filters: {
      search: "",
      isActive: null,
      createdFrom: null,
      createdTo: null,
      includeStatistics: true,
      orderBy: "nameArabic",
      orderDesc: true,
      page: 1,
      pageSize: 10,
    },

    // ContractingType data
    contractingTypes: [],
    activeContractingTypes: [],
    contractingTypesForSignup: [],
    pagination: null,
    error: null,
    message: "",
    timestamp: null,

    // Loading states
    loadingGetContractingTypes: false,
    loadingGetActiveContractingTypes: false,
    loadingGetContractingTypesForSignup: false,
    loadingGetSingleContractingType: false,
    loadingCreateContractingType: false,
    loadingUpdateContractingType: false,
    loadingDeleteContractingType: false,

    // Single contracting type
    selectedContractingType: null,
    singleContractingTypeError: null,

    // Create contracting type
    createSuccess: false,
    createError: null,
    createMessage: "",

    // Update contracting type
    updateSuccess: false,
    updateError: null,
    updateMessage: "",

    // Delete contracting type
    deleteSuccess: false,
    deleteError: null,
    deleteMessage: "",
  };

  return {
    initialStateMode,
    initialStateAuth,
    initialStateCategories,
    initialStateDepartments,
    initialStateSubDepartments,
    initialStateContractingTypes,
  };
}

export default UseInitialStates;
