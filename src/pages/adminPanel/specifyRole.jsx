"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UseDirection from "../../hooks/use-direction.js";
import { useNavigate } from "react-router-dom";
import {
  setCategoryManagerRole,
  setDepartmentManagerRole,
} from "../../state/slices/auth.js";
import i18next from "i18next";

// Icons
const CategoryIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="7" y="7" width="3" height="3"></rect>
    <rect x="14" y="7" width="3" height="3"></rect>
    <rect x="7" y="14" width="3" height="3"></rect>
    <rect x="14" y="14" width="3" height="3"></rect>
  </svg>
);

const DepartmentIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 21h18"></path>
    <path d="M5 21V7l8-4v18"></path>
    <path d="M19 21V11l-6-4"></path>
    <path d="M9 9v.01"></path>
    <path d="M9 12v.01"></path>
    <path d="M9 15v.01"></path>
    <path d="M9 18v.01"></path>
  </svg>
);

const CheckIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

const SpecifyRole = () => {
  const [hoveredRole, setHoveredRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const { t } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const { categoryManagerId, departmentManagerId } = useSelector(
    (state) => state.auth
  );
  const { direction } = UseDirection();
  const isRTL = direction.direction === "rtl";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categoryArabicName = localStorage.getItem("categoryArabicName");
  const categoryEnglishName = localStorage.getItem("categoryEnglishName");
  const departmentArabicName = localStorage.getItem("departmentArabicName");
  const departmentEnglishName = localStorage.getItem("departmentEnglishName");

  const language = i18next.language;

  const categoryName =
    language === "ar" ? categoryArabicName : categoryEnglishName;
  const departmentName =
    language === "ar" ? departmentArabicName : departmentEnglishName;

  // Theme-based classes
  const getThemeClasses = () => {
    const isDark = mymode === "dark";
    return {
      container: isDark
        ? "bg-gray-900 text-gray-100"
        : "bg-gray-50 text-gray-900",
      card: isDark
        ? "bg-gray-800 border-gray-700 shadow-xl"
        : "bg-white border-gray-200 shadow-lg",
      roleCard: isDark
        ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
        : "bg-gray-50 border-gray-200 hover:bg-gray-100",
      selectedCard: isDark
        ? "bg-blue-800 border-blue-600"
        : "bg-blue-50 border-blue-300",
      title: isDark ? "text-gray-100" : "text-gray-900",
      subtitle: isDark ? "text-gray-400" : "text-gray-600",
      roleTitle: isDark ? "text-gray-200" : "text-gray-800",
      roleDescription: isDark ? "text-gray-400" : "text-gray-600",
      featureText: isDark ? "text-gray-300" : "text-gray-700",
      iconPrimary: isDark ? "text-blue-400" : "text-blue-600",
      iconSecondary: isDark ? "text-green-400" : "text-green-600",
      button: isDark
        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      buttonDisabled: isDark
        ? "bg-gray-600 text-gray-400"
        : "bg-gray-300 text-gray-500",
    };
  };

  const themeClasses = getThemeClasses();

  const roles = [
    {
      id: "category-manager",
      titleKey: "selectRole.categoryManager.title",
      descriptionKey: "selectRole.categoryManager.description",
      displayName: categoryName, // Display the actual category name
      icon: CategoryIcon,
      features: [
        "selectRole.categoryManager.features.rosters",
        "selectRole.categoryManager.features.approve",
        "selectRole.categoryManager.features.doctors",
        "selectRole.categoryManager.features.editCategory",
        "selectRole.categoryManager.features.assignDepartment",
        "selectRole.categoryManager.features.removeDepartment",
      ],
      color: "blue",
    },
    {
      id: "department-manager",
      titleKey: "selectRole.departmentManager.title",
      descriptionKey: "selectRole.departmentManager.description",
      displayName: departmentName, // Display the actual department name
      icon: DepartmentIcon,
      features: [
        "selectRole.departmentManager.features.manageDepartment",
        "selectRole.departmentManager.features.staff",
        "selectRole.departmentManager.features.schedules",
        "selectRole.departmentManager.features.resources",
        "selectRole.departmentManager.features.reports",
      ],
      color: "green",
    },
  ];

  const handleRoleClick = (roleId) => {
    setSelectedRole(roleId);

    // Dispatch the appropriate role action and navigate
    if (roleId === "category-manager") {
      dispatch(setCategoryManagerRole());
      // Navigate to category manager panel with categoryId if available
      if (categoryManagerId) {
        navigate(`/admin-panel/category/${categoryManagerId}`);
      } else {
        navigate("/admin-panel/category-manager");
      }
    } else if (roleId === "department-manager") {
      dispatch(setDepartmentManagerRole());
      // Navigate to department manager panel with departmentId if available
      if (departmentManagerId) {
        navigate(`/admin-panel/department/${departmentManagerId}`);
      } else {
        navigate("/admin-panel/department-manager");
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${themeClasses.container}`}
      dir={direction.direction}
    >
      <div className="w-full max-w-4xl">
        <div
          className={`rounded-lg p-8 transition-all duration-200 ${themeClasses.card}`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className={`text-3xl font-bold mb-4 transition-colors duration-200 ${themeClasses.title}`}
            >
              {t("selectRole.title")}
            </h1>
            <p
              className={`text-lg transition-colors duration-200 ${themeClasses.subtitle}`}
            >
              {t("selectRole.subtitle")}
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              const isHovered = hoveredRole === role.id;

              return (
                <div
                  key={role.id}
                  className={`relative rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg ${
                    isSelected
                      ? themeClasses.selectedCard
                      : themeClasses.roleCard
                  }`}
                  onClick={() => handleRoleClick(role.id)}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div
                      className={`absolute top-4 ${
                        isRTL ? "left-4" : "right-4"
                      } w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center`}
                    >
                      <CheckIcon className="text-white" />
                    </div>
                  )}

                  {/* Role Header */}
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isRTL ? "ml-4" : "mr-4"
                      } transition-colors duration-200 ${
                        role.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      <Icon />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-semibold transition-colors duration-200 ${themeClasses.roleTitle}`}
                      >
                        {t(role.titleKey)}
                      </h3>
                      <p
                        className={`text-sm transition-colors duration-200 ${themeClasses.roleDescription}`}
                      >
                        {t(role.descriptionKey)}
                      </p>
                      {/* Display the actual category/department name */}
                      {role.displayName && (
                        <p
                          className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                            role.color === "blue"
                              ? themeClasses.iconPrimary
                              : themeClasses.iconSecondary
                          }`}
                        >
                          {role.displayName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    {role.features.map((featureKey, index) => (
                      <div key={index} className="flex items-start">
                        <CheckIcon
                          className={`${
                            isRTL ? "ml-3 mt-1" : "mr-3 mt-1"
                          } flex-shrink-0 transition-colors duration-200 ${
                            role.color === "blue"
                              ? themeClasses.iconPrimary
                              : themeClasses.iconSecondary
                          }`}
                        />
                        <span
                          className={`text-sm transition-colors duration-200 ${themeClasses.featureText}`}
                        >
                          {t(featureKey)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Effect Overlay */}
                  {isHovered && !isSelected && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none transition-opacity duration-300"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecifyRole;
