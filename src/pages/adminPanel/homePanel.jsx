import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminPanelIndex = () => {
  // Extract manager IDs from user data
  const { categoryManagerId, departmentManagerId, loginRoleResponseDto } =
    useSelector((state) => state.auth);

  // Conditional navigation based on manager IDs
  if (loginRoleResponseDto.roleNameEn == "Category Head") {
    // If user is a category manager, redirect to specific category
    return (
      <Navigate to={`/admin-panel/category/${categoryManagerId}`} replace />
    );
  }

  if (loginRoleResponseDto.roleNameEn == "Department Manager") {
    // If user is a department manager, redirect to specific department
    return (
      <Navigate to={`/admin-panel/department/${departmentManagerId}`} replace />
    );
  }

  // If neither manager ID exists, redirect to categories (default behavior)
  return <Navigate to="/admin-panel/categories" replace />;
};

export default AdminPanelIndex;
