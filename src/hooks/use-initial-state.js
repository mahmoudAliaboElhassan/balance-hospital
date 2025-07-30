import { m } from "framer-motion";
import React from "react";

function UseInitialStates() {
  const initialStateMode = {
    mymode: localStorage.getItem("mymode") || "light",
  };
  const initialStateAuth = {
    token: localStorage.getItem("token") || "",
  };
  return { initialStateMode, initialStateAuth };
}

export default UseInitialStates;
