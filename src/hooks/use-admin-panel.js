import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function UseAdminPanel() {
  const { t } = useTranslation();
  const { loginRoleResponseDto } = useSelector((state) => state.auth);
  console.log(loginRoleResponseDto["userCanManageCategory"]);
  // All available routes with their permission requirements
  const allRoutes = [
    // {
    //   id: 0,
    //   name: t("adminPanel.dashboard"),
    //   icon: "📊",
    //   path: "/admin-panel/dashboard",
    //   permission: null, // Dashboard might not need specific permission
    // },
    {
      id: 1,
      name: t("adminPanel.categories"),
      icon: "📂",
      path: "/admin-panel/categories",
      permission: "userCanManageCategory",
    },
    {
      id: 3,
      name: t("adminPanel.departments"),
      icon: "🏢",
      path: "/admin-panel/departments",
      permission: "userCanManageDepartments",
    },
    // {
    //   id: 4,
    //   name: t("adminPanel.subDepartments"),
    //   icon: "🏗️",
    //   path: "/admin-panel/sub-departments",
    //   permission: "userCanManageSubDepartments",
    // },
    {
      id: 5,
      name: t("adminPanel.managementRoles"),
      icon: "👥",
      path: "/admin-panel/management-roles",
      permission: "userCanManageRole",
    },
    {
      id: 6,
      name: t("adminPanel.scientificDegrees"),
      icon: "🎓",
      path: "/admin-panel/scientific-degrees",
      permission: "userCanScientificDegree",
    },
    {
      id: 7,
      name: t("adminPanel.contractTypes"),
      icon: "📋",
      path: "/admin-panel/contracting-types",
      permission: "userCanContractingType",
    },
    {
      id: 8,
      name: t("adminPanel.shiftHours"),
      icon: "⏰",
      path: "/admin-panel/shift-hours-types",
      permission: "userCanShiftHoursType",
    },
    {
      id: 9,
      name: t("adminPanel.roster"),
      icon: "🗓️",
      path: "/admin-panel/rosters",
      permission: "userCanManageRostors",
    },
  ];

  // Filter routes based on user permissions
  const adminPanelRoutes = allRoutes.filter((route) => {
    // If no permission required or no loginRoleResponseDto available, show the route
    if (!route.permission || !loginRoleResponseDto) {
      return true;
    }

    // Check if user has the required permission
    return loginRoleResponseDto[route.permission] === true;
  });

  return { adminPanelRoutes };
}

export default UseAdminPanel;
