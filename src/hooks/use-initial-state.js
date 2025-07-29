import { m } from "framer-motion";
import React from "react";

function UseInitialStates() {
  const initialStateMode = {
    mymode: localStorage.getItem("mymode") || "light",
  };
  return { initialStateMode };
}

export default UseInitialStates;
