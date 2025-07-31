function UseInitialStates() {
  const initialStateMode = {
    mymode: localStorage.getItem("mymode") || "light",
  };

  const initialStateAuth = {
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    user: null,
    loadingAuth: false,
  };

  const initialStateCategories = {
    // Existing properties...
    categories: [],
    pagination: null,
    error: null,
    message: "",
    timestamp: null,

    // Loading states
    loadingGetCategories: false,
    loadingCreateCategory: false,
    loadingGetSingleCategory: false,
    loadingUpdateCategory: false,
    loadingDeleteCategory: false, // New loading state for delete

    // Create category states
    createSuccess: false,
    createMessage: "",
    createError: null,

    // Update category states
    updateSuccess: false,
    updateMessage: "",
    updateError: null,

    // Delete category states (New)
    deleteSuccess: false,
    deleteMessage: "",
    deleteError: null,

    // Single category states
    selectedCategory: null,
    singleCategoryError: null,

    // Filters
    filters: {
      search: "",
      isActive: true,
      orderBy: "createdAt",
      orderDesc: true,
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
