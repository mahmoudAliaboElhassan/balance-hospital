import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function UseAdminPanel() {
  const { t } = useTranslation();
  const { loginRoleResponseDto, categoryManagerId, departmentManagerId } =
    useSelector((state) => state.auth);
  console.log(loginRoleResponseDto["userCanManageCategory"]);

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
      name:
        loginRoleResponseDto?.roleNameEn == "System Administrator"
          ? t("adminPanel.categories")
          : t("adminPanel.yourCategory"),
      icon: "📂",
      path:
        loginRoleResponseDto?.roleNameEn == "System Administrator"
          ? "/admin-panel/categories"
          : `/admin-panel/category/${categoryManagerId}`,
      permission: "userCanManageCategory",
    },
    {
      id: 3,
      name:
        loginRoleResponseDto?.roleNameEn == "System Administrator"
          ? t("adminPanel.departments")
          : t("adminPanel.yourDepartment"),
      icon: "🏢",
      path:
        loginRoleResponseDto?.roleNameEn == "System Administrator"
          ? "/admin-panel/departments"
          : `/admin-panel/department/${departmentManagerId}`,
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
  ];

  const specifyRole = {
    id: 10,
    name: t("selectRole.title2"),
    icon: "🎭",
    path: "/specify-role",
    permission: null, // No specific permission check needed for role specification
  };

  const roster = {
    id: 9,
    name: t("adminPanel.roster"),
    icon: "🗓️",
    path: "/admin-panel/rosters",
    permission: "userCanManageRostors",
  };

  // Filter routes based on user permissions
  const adminPanelRoutes = allRoutes.filter((route) => {
    // If no permission required or no loginRoleResponseDto available, show the route
    if (!route.permission || !loginRoleResponseDto) {
      return true;
    }

    // Check if user has the required permission
    return loginRoleResponseDto[route.permission] === true;
  });

  if (loginRoleResponseDto.roleNameEn == "System Administrator") {
    adminPanelRoutes.push(roster);
  }
  if (departmentManagerId && categoryManagerId) {
    adminPanelRoutes.push(specifyRole);
  }
  return { adminPanelRoutes };
}

export default UseAdminPanel;
