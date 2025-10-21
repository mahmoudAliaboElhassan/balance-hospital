import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

const Home = () => {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (!token && location.pathname.startsWith("/admin-panel")) {
      // Save current path for redirect after login
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      })
    } else {
      navigate("/admin-panel")
    }
  }, [navigate, token, location.pathname])
}

export default Home
