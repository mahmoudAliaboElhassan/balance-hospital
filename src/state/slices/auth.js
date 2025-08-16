import { createSlice } from "@reduxjs/toolkit";

import UseInitialStates from "../../hooks/use-initial-state";
import {
  forgetPassword,
  logIn,
  resendForgetPasswordCode,
  resetPassword,
} from "../act/actAuth";
const { initialStateAuth } = UseInitialStates();

export const authSlice = createSlice({
  name: "authSlice",
  initialState: initialStateAuth,
  reducers: {
    logOut: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("expiresAt");
      state.token = "";
      state.role = "";
      state.expiresAt = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state, action) => {
        state.loadingAuth = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loadingAuth = false;
        localStorage.setItem("token", action.payload.data.accessToken);
        state.token = action.payload.data.accessToken;
        localStorage.setItem("role", action.payload.data.user.role);
        state.role = action.payload.data.user.role;
        localStorage.setItem("expiresAt", action.payload.data.expiresAt);
        state.expiresAt = action.payload.data.expiresAt;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loadingAuth = false;
      })
      .addCase(forgetPassword.pending, (state, action) => {
        state.loadingAuth = true;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loadingAuth = false;
        console.log("action.payload", action.payload);
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loadingAuth = false;
      })
      .addCase(resetPassword.pending, (state, action) => {
        state.loadingAuth = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loadingAuth = false;
        console.log("action.payload", action.payload);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loadingAuth = false;
      })
      .addCase(resendForgetPasswordCode.pending, (state, action) => {
        state.loadingAuth = true;
      })
      .addCase(resendForgetPasswordCode.fulfilled, (state, action) => {
        state.loadingAuth = false;
        console.log("action.payload", action.payload);
      })
      .addCase(resendForgetPasswordCode.rejected, (state, action) => {
        state.loadingAuth = false;
      });
  },
});

export default authSlice.reducer;
export const { logOut } = authSlice.actions;
export { logIn };
