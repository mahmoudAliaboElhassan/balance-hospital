import { configureStore } from "@reduxjs/toolkit";
import modeSlice from "./slices/mode";

export const store = configureStore({
  reducer: {
    mode: modeSlice,
  },
});
