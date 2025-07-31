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
  };

  return {
    initialStateMode,
    initialStateAuth,
    initialStateCategories,
  };
}

export default UseInitialStates;
