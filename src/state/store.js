import { configureStore } from "@reduxjs/toolkit";
import modeSlice from "./slices/mode";
import authSlice from "./slices/auth";
import categorySlice from "./slices/category";
import departmentSlice from "./slices/department";
import shiftHoursTypeSlice from "./slices/shiftHours";
import subDepartmentSlice from "./slices/subDepartment";
import contractingTypeSlice from "./slices/contractingType";
import scientificDegreeSlice from "./slices/scientificDegree";
import managementRolesSlice from "./slices/managementRole";
import usersSlice from "./slices/user";
import rosterManagementSlice from "./slices/roster";

export const store = configureStore({
  reducer: {
    mode: modeSlice,
    auth: authSlice,
    category: categorySlice,
    department: departmentSlice,
    subDepartment: subDepartmentSlice,
    contractingType: contractingTypeSlice,
    scientificDegree: scientificDegreeSlice,
    shiftHour: shiftHoursTypeSlice,
    managementRoles: managementRolesSlice,
    users: usersSlice,
    rosterManagement: rosterManagementSlice,
  },
});
