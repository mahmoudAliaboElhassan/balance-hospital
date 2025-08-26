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
  const INITIAL_VALUES_ADD_SCIENTIFIC_DEGREE = {
    nameArabic: "",
    nameEnglish: "",
    code: "",
    isActive: true,
  };
  const INITIAL_VALUES_ADD_SHIFT_HOUR_TYPE = {
    nameArabic: "",
    nameEnglish: "",
    code: "",
    period: "",
    hours: "",
    startTime: "",
    endTime: "",
    isActive: true,
    isOvertime: false,
    description: "",
  };

  const INITIAL_VALUES_ADD_ROLE = {
    roleNameAr: "",
    roleNameEn: "",
    description: "",
    userCanManageCategory: false,
    userCanManageRole: false,
    userCanManageRostors: false,
    userCanManageUsers: false,
    userCanContractingType: false,
    userCanShiftHoursType: false,
    userCanScientificDegree: false,
    userCanManageDepartments: false,
    userCanManageSubDepartments: false,
    userCanViewReports: false,
    userCanManageSchedules: false,
    userCanManageRequests: false,
  };

  const INITIAL_VALUES_ASSIGN_USER_TO_ROLE = {
    userId: "",
    roleId: "",
    changeReason: "",
    notes: "",
  };

  const currentDate = new Date();
  const nextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  const INITIAL_VALUES_CREATE_BASIC_ROASTER = {
    categoryId: "",
    title: "",
    description: "",
    month: nextMonth.getMonth() + 1,
    year: nextMonth.getFullYear(),
    submissionDeadline: "",
    departments: [
      {
        departmentId: "",
        subDepartmentId: "",
        notes: "",
      },
    ],
    allowSwapRequests: true,
    allowLeaveRequests: true,
    // maxConsecutiveDays: 7,
    // minRestDaysBetween: 1,
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
    INITIAL_VALUES_ADD_SCIENTIFIC_DEGREE,
    INITIAL_VALUES_ADD_SHIFT_HOUR_TYPE,
    INITIAL_VALUES_ADD_ROLE,
    INITIAL_VALUES_ASSIGN_USER_TO_ROLE,
    INITIAL_VALUES_CREATE_BASIC_ROASTER,
  };
}

export default UseInitialValues;
