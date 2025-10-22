import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getLeaves } from "../state/act/actLeaves"

function Leaves() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getLeaves({}))
  }, [])
  return <div>Leaves</div>
}

export default Leaves
