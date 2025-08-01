import React from "react";

function UseInitialValues() {
  const INITIAL_VALUES_LOGIN = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const INITIAL_VALUES_FORGET_PASSWORD = {
    inputValue: "",
  };

  const INITIAL_VALUES_RESET_PASSWORD = {
    token: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const INITIAL_VALUES_ADD_CATEGORY = {
    nameArabic: "",
    nameEnglish: "",
    code: "",
    description: "",
    isActive: true,
  };

  // Department Form Initial Values
  const INITIAL_VALUES_ADD_DEPARTMENT = {
    nameArabic: "",
    nameEnglish: "",
    categoryId: "",
    location: "",
    description: "",
    isActive: true,
  };

  const INITIAL_VALUES_EDIT_DEPARTMENT = {
    nameArabic: "",
    nameEnglish: "",
    categoryId: "",
    location: "",
    description: "",
    isActive: true,
  };

  const INITIAL_VALUES_DEPARTMENT_FILTERS = {
    search: "",
    categoryId: null,
    isActive: null,
    createdFrom: null,
    createdTo: null,
    includeSubDepartments: true,
    includeStatistics: true,
    includeCategory: true,
    orderBy: "nameArabic",
    orderDesc: true,
    page: 1,
    pageSize: 10,
  };

  // SubDepartment Form Initial Values
  const INITIAL_VALUES_ADD_SUBDEPARTMENT = {
    nameArabic: "",
    nameEnglish: "",
    departmentId: "",
    location: "",
    isActive: true,
  };

  const INITIAL_VALUES_EDIT_SUBDEPARTMENT = {
    id: "",
    nameArabic: "",
    nameEnglish: "",
    departmentId: "",
    location: "",
    isActive: true,
  };

  // ContractingType Form Initial Values
  const INITIAL_VALUES_ADD_CONTRACTINGTYPE = {
    nameArabic: "",
    nameEnglish: "",
    allowOvertimeHours: false,
    maxHoursPerWeek: 168,
    isActive: true,
  };

  const INITIAL_VALUES_EDIT_CONTRACTINGTYPE = {
    id: "",
    nameArabic: "",
    nameEnglish: "",
    allowOvertimeHours: false,
    maxHoursPerWeek: 168,
    isActive: true,
  };

  const INITIAL_VALUES_CONTRACTINGTYPE_FILTERS = {
    search: "",
    isActive: null,
    createdFrom: null,
    createdTo: null,
    includeStatistics: true,
    orderBy: "nameArabic",
    orderDesc: true,
    page: 1,
    pageSize: 10,
  };

  return {
    INITIAL_VALUES_LOGIN,
    INITIAL_VALUES_FORGET_PASSWORD,
    INITIAL_VALUES_RESET_PASSWORD,
    INITIAL_VALUES_ADD_CATEGORY,
    INITIAL_VALUES_ADD_DEPARTMENT,
    INITIAL_VALUES_EDIT_DEPARTMENT,
    INITIAL_VALUES_DEPARTMENT_FILTERS,
    INITIAL_VALUES_ADD_SUBDEPARTMENT,
    INITIAL_VALUES_EDIT_SUBDEPARTMENT,
    INITIAL_VALUES_ADD_CONTRACTINGTYPE,
    INITIAL_VALUES_EDIT_CONTRACTINGTYPE,
    INITIAL_VALUES_CONTRACTINGTYPE_FILTERS,
  };
}

export default UseInitialValues;
