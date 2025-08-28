import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getRosterById,
  getWorkingHours,
} from "../../../state/act/actRosterManagement";
import { useDispatch } from "react-redux";

function RosterDetails() {
  const { rosterId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRosterById({ rosterId }))
      .unwrap()
      .then((data) => console.log("data", data));
    dispatch(getWorkingHours({ rosterId }));
  });
  return <div>{rosterId}</div>;
}

export default RosterDetails;
