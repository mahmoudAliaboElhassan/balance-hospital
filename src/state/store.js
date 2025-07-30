import { configureStore } from "@reduxjs/toolkit";
import modeSlice from "./slices/mode";
import authSlice from "./slices/auth";
import categorySlice from "./slices/category";

export const store = configureStore({
  reducer: {
    mode: modeSlice,
    auth: authSlice,
    category: categorySlice,
  },
});
