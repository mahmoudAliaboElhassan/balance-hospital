import React from "react";
import { useParams } from "react-router-dom";
import { selectSelectedRoster } from "../../../state/slices/roster";

function RosterDetails() {
  const { rosterId } = useParams();
  return <div>{rosterId}</div>;
}

export default RosterDetails;
