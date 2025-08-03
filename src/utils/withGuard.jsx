import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export const withGuard = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const location = useLocation();

    useEffect(() => {
      // Don't redirect while still loading auth state

      if (!token && location.pathname.startsWith("/admin-panel")) {
        // Save current path for redirect after login
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
      }

      if (token && location.pathname === "/login") {
        navigate("/admin-panel", { replace: true });
      }
    }, [navigate, token, location.pathname]);

    // Show loading while checking auth

    // Don't render if no token on protected route
    if (!token && location.pathname.startsWith("/admin-panel")) {
      return null;
    }

    return <Component {...props} />;
  };

  Wrapper.displayName = `withGuard(${Component.displayName || Component.name})`;
  return Wrapper;
};

export default withGuard;
