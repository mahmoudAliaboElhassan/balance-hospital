import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminPanelIndex = () => {
  // Extract manager IDs from user data
  const {
    categoryManagerId,
    departmentManagerId,
    loginRoleResponseDto,
    hyprid,
  } = useSelector((state) => state.auth);

  // Conditional navigation based on manager IDs
  if (
    loginRoleResponseDto.roleNameEn == "Category Head" ||
    hyprid == "category"
  ) {
    // If user is a category manager, redirect to specific category
    return (
      <Navigate to={`/admin-panel/category/${categoryManagerId}`} replace />
    );
  }

  if (
    loginRoleResponseDto.roleNameEn == "Department Manager" ||
    hyprid == "department"
  ) {
    // If user is a department manager, redirect to specific department
    return (
      <Navigate to={`/admin-panel/department/${departmentManagerId}`} replace />
    );
  }

  return <Navigate to="/admin-panel/categories" replace />;
};

export default AdminPanelIndex;
