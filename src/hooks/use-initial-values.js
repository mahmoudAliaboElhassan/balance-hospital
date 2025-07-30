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
  return {
    INITIAL_VALUES_LOGIN,
    INITIAL_VALUES_FORGET_PASSWORD,
    INITIAL_VALUES_RESET_PASSWORD,
    INITIAL_VALUES_ADD_CATEGORY,
  };
}

export default UseInitialValues;
