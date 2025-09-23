import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getDoctorsReuests } from "../../../state/act/actRosterManagement";

function ManageDoctors() {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDoctorsReuests({ status: "PENDING", rosterId: id }));
  }, []);

  return <div>ManageDoctors {id}</div>;
}

export default ManageDoctors;
