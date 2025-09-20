function UseRoleSelect() {
  const roles = [
    {
      id: "category-manager",
      titleKey: "selectRole.categoryManager.title",
      descriptionKey: "selectRole.categoryManager.description",
      //   icon: CategoryIcon,
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
      //   icon: DepartmentIcon,
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
  return { roles };
}

export default UseRoleSelect;
