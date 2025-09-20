import React from "react";
import { useParams } from "react-router-dom";

function DoctorData() {
  const { id } = useParams();
  return <div>DoctorData {id}</div>;
}

export default DoctorData;
