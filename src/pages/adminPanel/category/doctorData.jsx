import React from "react";
import { useParams } from "react-router-dom";
import DoctorsPerRoster from "../roster/doctorsPerRoster";

function DoctorData() {
  const { id } = useParams();
  return <div></div>;
}

export default DoctorData;
