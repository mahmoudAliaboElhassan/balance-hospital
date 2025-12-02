import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Forbidden from "../components/forbidden"

// Route to permission mapping
const ROUTE_PERMISSIONS = {
  // Categories
  "/admin-panel/categories": "userCanManageCategory",
  "/admin-panel/category": "userCanManageCategory",

  // Departments
  "/admin-panel/departments": "userCanManageDepartments",
  "/admin-panel/department": [
    "userCanManageCategory",
    "userCanManageDepartments",
  ],

  // Sub-departments
  "/admin-panel/sub-departments": "userCanManageSubDepartments",
  "/admin-panel/sub-department": "userCanManageSubDepartments",

  // Management Roles
  "/admin-panel/management-roles": "userCanManageRole",

  // Scientific Degrees
  "/admin-panel/scientific-degrees": "userCanScientificDegree",

  // Contracting Types
  "/admin-panel/contracting-types": "userCanContractingType",

  // Shift Hours
  "/admin-panel/shift-hours-types": "userCanShiftHoursType",

  // Rosters
  "/admin-panel/rosters": "userCanManageRostors",

  // Users (if you have user management)
  "/admin-panel/users": "userCanManageUsers",

  // Schedules
  "/admin-panel/schedules": "userCanManageSchedules",

  // Reports
  "/admin-panel/reports": "userCanManageCategory",
}

// Routes that require Admin role specifically
const ADMIN_ONLY_ROUTES = [
  "/admin-panel/categories",
  "/admin-panel/departments",
  "/admin-panel/rosters",
  "/admin-panel/dashboard",
]

// Function to check if route requires Admin role
const isAdminOnlyRoute = (pathname) => {
  return ADMIN_ONLY_ROUTES.some((route) => pathname === route)
}

const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (typeof requiredPermissions === "string") {
    return userPermissions[requiredPermissions] === true
  }

  if (Array.isArray(requiredPermissions)) {
    return requiredPermissions.some(
      (permission) => userPermissions[permission] === true
    )
  }

  return false
}

// Function to get required permission for a route
const getRequiredPermission = (pathname) => {
  // Check for exact matches first
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname]
  }

  // Check for partial matches (for nested routes)
  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) {
      return permission
    }
  }

  return null // No specific permission required
}

export const withGuard = (Component, specificPermission = null) => {
  const Wrapper = (props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { token, loginRoleResponseDto } = useSelector((state) => state.auth)
    const location = useLocation()

    useEffect(() => {
      // Authentication check
      if (!token && location.pathname.startsWith("/admin-panel")) {
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        })
        return
      }

      if (
        (token && location.pathname === "/login") ||
        (token && location.pathname === "/login")
      ) {
        navigate("/admin-panel", { replace: true })
        return
      }
    }, [navigate, token, location.pathname])

    // Don't render if no token on protected route (authentication)
    if (!token && location.pathname.startsWith("/admin-panel")) {
      return null
    }

    // Authorization check (permission-based and role-based)
    if (token && location.pathname.startsWith("/admin-panel")) {
      // Check if route requires Admin role
      if (isAdminOnlyRoute(location.pathname)) {
        if (loginRoleResponseDto?.roleNameEn !== "System Administrator") {
          return <Forbidden />
        }
      }

      // Regular permission check for other routes
      const requiredPermission =
        specificPermission || getRequiredPermission(location.pathname)

      if (requiredPermission && loginRoleResponseDto) {
        const hasPermission = hasAnyPermission(
          loginRoleResponseDto,
          requiredPermission
        )

        if (!hasPermission) {
          return <Forbidden />
        }
      }
    }

    return <Component {...props} />
  }

  Wrapper.displayName = `withGuard(${Component.displayName || Component.name})`
  return Wrapper
}

export default withGuard
