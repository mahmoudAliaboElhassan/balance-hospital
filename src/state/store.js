import { configureStore } from "@reduxjs/toolkit";
import modeSlice from "./slices/mode";
import authSlice from "./slices/auth";
import categorySlice from "./slices/category";
import departmentSlice from "./slices/department";
import subDepartmentSlice from "./slices/subDepartment";
import contractingTypeSlice from "./slices/contractingType";

export const store = configureStore({
  reducer: {
    mode: modeSlice,
    auth: authSlice,
    category: categorySlice,
    department: departmentSlice,
    subDepartment: subDepartmentSlice,
    contractingType: contractingTypeSlice,
  },
});
