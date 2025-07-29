import { createSlice } from "@reduxjs/toolkit";
import UseInitialStates from "../../hooks/use-initial-state";
const { initialStateMode } = UseInitialStates();
export const modeSlice = createSlice({
  name: "modeSlice",
  initialState: initialStateMode,
  reducers: {
    changeMode: (state) => {
      localStorage.setItem(
        "mymode",
        localStorage.getItem("mymode") === "dark" ? "light" : "dark"
      );
      state.mymode = state.mymode === "dark" ? "light" : "dark";
    },
  },
});

export default modeSlice.reducer;
export const { changeMode } = modeSlice.actions;
