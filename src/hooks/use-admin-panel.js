import { useTranslation } from "react-i18next";

function UseAdminPanel() {
  const { t } = useTranslation();

  const adminPanelRoutes = [
    // {
    //   id: 0,
    //   name: t("adminPanel.dashboard"),
    //   icon: "📊",
    //   path: "/admin-panel/dashboard",
    // },
    {
      id: 1,
      name: t("adminPanel.categories"),
      icon: "📂",
      path: "/admin-panel/categories",
    },

    {
      id: 3,
      name: t("adminPanel.departments"),
      icon: "🏢",
      path: "/admin-panel/departments",
    },

    // {
    //   id: 4,
    //   name: t("adminPanel.subDepartments"),
    //   icon: "🏗️",
    //   path: "/admin-panel/sub-departments",
    // },
    {
      id: 5,
      name: t("adminPanel.managementRoles"),
      icon: "👥",
      path: "/admin-panel/management-roles",
    },
    {
      id: 6,
      name: t("adminPanel.scientificDegrees"),
      icon: "🎓",
      path: "/admin-panel/scientific-degrees",
    },
    {
      id: 7,
      name: t("adminPanel.contractTypes"),
      icon: "📋",
      path: "/admin-panel/contracting-types",
    },
    {
      id: 8,
      name: t("adminPanel.shiftHours"),
      icon: "⏰",
      path: "/admin-panel/shift-hours-types",
    },
    {
      id: 9,
      name: t("adminPanel.roster"),
      icon: "🗓️",
      path: "/admin-panel/rosters",
    },
  ];

  return { adminPanelRoutes };
}

export default UseAdminPanel;
