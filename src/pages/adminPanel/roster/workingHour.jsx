import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getWorkingHour } from "../../../state/act/actRosterManagement";

function WorkingHour() {
  const { workingHourId } = useParams();
  const { workingHour, loading } = useSelector(
    (state) => state.rosterManagement
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (workingHourId) {
      dispatch(getWorkingHour({ workingHourId }));
    }
  }, [dispatch, workingHourId]);
  return <div>{workingHourId}</div>;
}

export default WorkingHour;
