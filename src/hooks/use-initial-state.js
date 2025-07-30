import React from "react";

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
    // Loading states
    loadingGetCategories: false,

    // Data
    categories: [],

    // Pagination info
    pagination: {
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },

    // Filters state
    filters: {
      search: "",
      isActive: true, // null = all, true = active only, false = inactive only
      orderBy: "createdAt", // createdAt, nameArabic, nameEnglish, code
      orderDesc: true,
      page: 1,
      pageSize: 10,
      includeDepartments: true,
      includeStatistics: true,
      includeChief: false,
    },

    // API response metadata
    message: "",
    timestamp: null,

    // Error handling
    error: null,
    createSuccess: false,
    createMessage: "",
    createError: null,
  };

  return {
    initialStateMode,
    initialStateAuth,
    initialStateCategories,
  };
}

export default UseInitialStates;
