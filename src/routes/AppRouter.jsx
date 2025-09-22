import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "../components/Loader";
import withGuard from "../utils/withGuard";

// =============================================================================
// LAZY LOADED COMPONENTS
// =============================================================================

// Department specific imports (non-lazy for immediate use)
import AssignDepartmentManager from "../pages/adminPanel/department/assignDepartmentManager";
import AdminPanelIndex from "../pages/adminPanel/homePanel.jsx";
import SpecifyRole from "../pages/adminPanel/specifyRole.jsx";

// Roster Management Components
const EditManagerPermission = lazy(() =>
  import("../pages/adminPanel/department/editManagerPermission")
);
const AddRosterDepartment = lazy(() =>
  import("../pages/adminPanel/roster/addRosterDepartment")
);
const EditWorkingHour = lazy(() =>
  import("../pages/adminPanel/roster/editWorkingHours")
);
const DoctorSchedule = lazy(() =>
  import("../pages/adminPanel/roster/doctorSchedule")
);
const AssignDoctor = lazy(() =>
  import("../pages/adminPanel/roster/assignDoctor")
);
const WorkingHours = lazy(() =>
  import("../pages/adminPanel/roster/workingHours")
);
const WorkingHour = lazy(() =>
  import("../pages/adminPanel/roster/workingHour")
);
const EditWorkingHours = lazy(() =>
  import("../pages/adminPanel/roster/editWorkingHours")
);
const RosterDepartments = lazy(() =>
  import("../pages/adminPanel/roster/rosterDepartments")
);
const GenerateWorkingHours = lazy(() =>
  import("../pages/adminPanel/roster/generateWorkingHours")
);

// Core Layout Components
const RootLayout = lazy(() => import("../pages/rootLayout"));
const ErrorPage = lazy(() => import("../pages/error"));

// Public Pages (No authentication required)
const Home = lazy(() => import("../pages/home"));
const Login = lazy(() => import("../pages/auth/login"));
const SignUp = lazy(() => import("../pages/auth/signup"));
const ForgetPassword = lazy(() => import("../pages/auth/forgetPassword"));
const ResetPassword = lazy(() => import("../pages/auth/resetPassword"));
const LoginSelection = lazy(() => import("../pages/auth/loginRoleSelection"));

// Admin Panel Main Component
const AdminPanel = lazy(() => import("../pages/adminPanel"));

// Category Management Components
const Category = lazy(() => import("../pages/adminPanel/category"));
const DoctorDetails = lazy(() =>
  import("../pages/adminPanel/category/doctorData.jsx")
);
const CreateCategory = lazy(() =>
  import("../pages/adminPanel/category/createCategory")
);
const SpecificCategory = lazy(() =>
  import("../pages/adminPanel/category/specificCategory")
);
const EditCategory = lazy(() =>
  import("../pages/adminPanel/category/editCategory")
);
const PendingDoctorRequests = lazy(() =>
  import("../pages/adminPanel/category/pendingDoctors")
);

// Department Management Components
const Department = lazy(() => import("../pages/adminPanel/department"));
const CreateDepartment = lazy(() =>
  import("../pages/adminPanel/department/createDepartment")
);
const EditDepartment = lazy(() =>
  import("../pages/adminPanel/department/editDepartment")
);
const SpecificDepartment = lazy(() =>
  import("../pages/adminPanel/department/specificDepartment")
);
const CreateDepartmentSpecificCategory = lazy(() =>
  import("../pages/adminPanel/department/createDepartmentSpecificCategory")
);

// Sub-Department Management Components
const SubDepartment = lazy(() => import("../pages/adminPanel/subDepartment"));
const CreateSubDepartment = lazy(() =>
  import("../pages/adminPanel/subDepartment/createSubDepartment")
);
const EditSubDepartment = lazy(() =>
  import("../pages/adminPanel/subDepartment/editSubDepartment")
);
const SpecificSubDepartment = lazy(() =>
  import("../pages/adminPanel/subDepartment/specificSubDepartment")
);
const CreateSubDepartmentSpecificDepartment = lazy(() =>
  import("../pages/adminPanel/subDepartment/createSpecificSubDepartment")
);

// Contracting Types Management Components
const ContractingTypes = lazy(() =>
  import("../pages/adminPanel/contractingTypes")
);
const CreateContractingType = lazy(() =>
  import("../pages/adminPanel/contractingTypes/createContractingType")
);
const EditContractingType = lazy(() =>
  import("../pages/adminPanel/contractingTypes/editContractingType")
);
const SpecificContractingType = lazy(() =>
  import("../pages/adminPanel/contractingTypes/specificContractingType")
);

// Scientific Degrees Management Components
const ScientificDegrees = lazy(() =>
  import("../pages/adminPanel/scientificDegree")
);
const CreateScientificDegree = lazy(() =>
  import("../pages/adminPanel/scientificDegree/createScientificDegree")
);
const EditScientificDegree = lazy(() =>
  import("../pages/adminPanel/scientificDegree/editScientificDegree")
);
const SpecificScientificDegree = lazy(() =>
  import("../pages/adminPanel/scientificDegree/specificScientificDegree")
);

// Shift Hours Management Components
const ShiftHours = lazy(() => import("../pages/adminPanel/shiftHours"));
const CreateShiftHourType = lazy(() =>
  import("../pages/adminPanel/shiftHours/createShiftHours")
);
const SpecificShiftHoursType = lazy(() =>
  import("../pages/adminPanel/shiftHours/specificShiftHours")
);
const EditShiftHourType = lazy(() =>
  import("../pages/adminPanel/shiftHours/editShiftHours")
);

// Management Roles Components
const ManagementRoles = lazy(() =>
  import("../pages/adminPanel/managementRoles")
);
const SpecifiedManagementRole = lazy(() =>
  import("../pages/adminPanel/managementRoles/specifiedManagementRole")
);
const UserRoleHistory = lazy(() =>
  import("../pages/adminPanel/managementRoles/userAssignmentHistory.jsx")
);
const CreateManagementRole = lazy(() =>
  import("../pages/adminPanel/managementRoles/createManagementRole")
);
const EditManagementRole = lazy(() =>
  import("../pages/adminPanel/managementRoles/editManagementRole")
);
const AssignUserToRole = lazy(() =>
  import("../pages/adminPanel/managementRoles/assignUser")
);
const EditAssignUserToRole = lazy(() =>
  import("../pages/adminPanel/managementRoles/editAssignUserToRole")
);

// Roster Management Components
const roster = lazy(() => import("../pages/adminPanel/roster"));
const CreateRoster = lazy(() =>
  import("../pages/adminPanel/roster/createRoster")
);
const DoctorPerRoster = lazy(() =>
  import("../pages/adminPanel/roster/doctorsPerRoster.jsx")
);
const RosterDetails = lazy(() =>
  import("../pages/adminPanel/roster/rosterDetails")
);
const EditRoster = lazy(() => import("../pages/adminPanel/roster/editRoster"));

// =============================================================================
// PROTECTED COMPONENTS WITH PERMISSIONS
// =============================================================================

// Main Admin Panel (Authentication required only)
const ProtectedAdminPanel = withGuard(AdminPanel);

// Category Management (Requires userCanManageCategory permission)
const ProtectedCategory = withGuard(Category, "userCanManageCategory");
const ProtectedDocotrDetails = withGuard(
  DoctorDetails,
  "userCanManageCategory"
);
const ProtectedCreateCategory = withGuard(
  CreateCategory,
  "userCanManageCategory"
);
const ProtectedSpecificCategory = withGuard(
  SpecificCategory,
  "userCanManageCategory"
);
const ProtectedEditCategory = withGuard(EditCategory, "userCanManageCategory");
const ProtectedPendingDoctorRequests = withGuard(
  PendingDoctorRequests,
  "userCanManageCategory"
);
const ProtectedDoctorPerRoster = withGuard(
  DoctorPerRoster,
  "userCanManageCategory"
);

// Department Management (Requires userCanManageDepartments permission)
const ProtectedDepartment = withGuard(Department, "userCanManageDepartments");
const ProtectedCreateDepartment = withGuard(
  CreateDepartment,
  "userCanManageDepartments"
);
const ProtectedEditDepartment = withGuard(EditDepartment, [
  "userCanManageCategory",
  "userCanManageDepartments",
]);
const ProtectedSpecificDepartment = withGuard(SpecificDepartment, [
  "userCanManageCategory",
  "userCanManageDepartments",
]);
const ProtectedEditManagerPermission = withGuard(
  EditManagerPermission,
  "userCanManageDepartments"
);
const ProtectedAssignDepartmentManager = withGuard(AssignDepartmentManager, [
  "userCanManageCategory",
  "userCanManageDepartments",
]);
const ProtectedCreateDepartmentSpecificCategory = withGuard(
  CreateDepartmentSpecificCategory,
  "userCanManageDepartments"
);

// Sub-Department Management (Requires userCanManageSubDepartments permission)
const ProtectedSubDepartment = withGuard(
  SubDepartment,
  "userCanManageSubDepartments"
);
const ProtectedCreateSubDepartment = withGuard(
  CreateSubDepartment,
  "userCanManageSubDepartments"
);
const ProtectedEditSubDepartment = withGuard(
  EditSubDepartment,
  "userCanManageSubDepartments"
);
const ProtectedSpecificSubDepartment = withGuard(
  SpecificSubDepartment,
  "userCanManageSubDepartments"
);
const ProtectedCreateSubDepartmentSpecificDepartment = withGuard(
  CreateSubDepartmentSpecificDepartment,
  "userCanManageSubDepartments"
);

// Contracting Types Management (Requires userCanContractingType permission)
const ProtectedContractingTypes = withGuard(
  ContractingTypes,
  "userCanContractingType"
);
const ProtectedCreateContractingType = withGuard(
  CreateContractingType,
  "userCanContractingType"
);
const ProtectedEditContractingType = withGuard(
  EditContractingType,
  "userCanContractingType"
);
const ProtectedSpecificContractingType = withGuard(
  SpecificContractingType,
  "userCanContractingType"
);

// Scientific Degrees Management (Requires userCanScientificDegree permission)
const ProtectedScientificDegrees = withGuard(
  ScientificDegrees,
  "userCanScientificDegree"
);
const ProtectedCreateScientificDegree = withGuard(
  CreateScientificDegree,
  "userCanScientificDegree"
);
const ProtectedEditScientificDegree = withGuard(
  EditScientificDegree,
  "userCanScientificDegree"
);
const ProtectedSpecificScientificDegree = withGuard(
  SpecificScientificDegree,
  "userCanScientificDegree"
);

// Shift Hours Management (Requires userCanShiftHoursType permission)
const ProtectedShiftHours = withGuard(ShiftHours, "userCanShiftHoursType");
const ProtectedCreateShiftHourType = withGuard(
  CreateShiftHourType,
  "userCanShiftHoursType"
);
const ProtectedSpecificShiftHoursType = withGuard(
  SpecificShiftHoursType,
  "userCanShiftHoursType"
);
const ProtectedEditShiftHourType = withGuard(
  EditShiftHourType,
  "userCanShiftHoursType"
);

// Management Roles (Requires userCanManageRole permission)
const ProtectedManagementRoles = withGuard(
  ManagementRoles,
  "userCanManageRole"
);
const ProtectedSpecifiedManagementRole = withGuard(
  SpecifiedManagementRole,
  "userCanManageRole"
);
const ProtectedUserHistory = withGuard(UserRoleHistory, "userCanManageRole");
const ProtectedCreateManagementRole = withGuard(
  CreateManagementRole,
  "userCanManageRole"
);
const ProtectedEditManagementRole = withGuard(
  EditManagementRole,
  "userCanManageRole"
);
const ProtectedAssignUserToRole = withGuard(
  AssignUserToRole,
  "userCanManageRole"
);
const ProtectedEditAssignUserToRole = withGuard(
  EditAssignUserToRole,
  "userCanManageRole"
);

// Roster Management (Requires userCanManageRostors permission)
const ProtectedRoster = withGuard(roster, "userCanManageRostors");
const ProtectedCreateRoster = withGuard(CreateRoster, "userCanManageRostors");
const ProtectedRosterDetails = withGuard(RosterDetails, "userCanManageRostors");
const ProtectedEditRoster = withGuard(EditRoster, "userCanManageRostors");
const ProtectedRosterDepartments = withGuard(
  RosterDepartments,
  "userCanManageRostors"
);
const ProtectedAddRosterDepartment = withGuard(
  AddRosterDepartment,
  "userCanManageRostors"
);
const ProtectedGenerateWorkingHours = withGuard(
  GenerateWorkingHours,
  "userCanManageRostors"
);
const ProtectedWorkingHours = withGuard(WorkingHours, "userCanManageRostors");
const ProtectedEditWorkingHour = withGuard(
  EditWorkingHour,
  "userCanManageRostors"
);
const ProtectedWorkingHour = withGuard(WorkingHour, "userCanManageRostors");
const ProtectedAssignDoctor = withGuard(AssignDoctor, "userCanManageRostors");
const ProtectedDoctorSchedule = withGuard(
  DoctorSchedule,
  "userCanManageCategory"
);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Wrapper for Suspense with loading fallback
const withSuspense = (Comp) => (
  <Suspense fallback={<Loader />}>
    <Comp />
  </Suspense>
);

// =============================================================================
// ROUTER CONFIGURATION
// =============================================================================

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(RootLayout),
    errorElement: withSuspense(ErrorPage),
    children: [
      // ========== PUBLIC ROUTES ==========
      { index: true, element: withSuspense(Home) },
      { path: "login", element: withSuspense(Login) },
      { path: "role-select", element: withSuspense(LoginSelection) },
      { path: "signup", element: withSuspense(SignUp) },
      { path: "forget-password", element: withSuspense(ForgetPassword) },
      { path: "reset-password", element: withSuspense(ResetPassword) },

      { path: "specify-role", element: withSuspense(SpecifyRole) },
      // ========== PROTECTED ADMIN PANEL ==========
      {
        path: "admin-panel",
        element: withSuspense(ProtectedAdminPanel), // Authentication required for entire admin panel
        children: [
          // Default route - Shows categories by default
          { index: true, element: withSuspense(AdminPanelIndex) },

          // ========== CATEGORY MANAGEMENT ==========
          // Permission Required: userCanManageCategory
          { path: "categories", element: withSuspense(ProtectedCategory) },
          {
            path: "doctors/:id",
            element: withSuspense(ProtectedDocotrDetails),
          },
          {
            path: "category/create",
            element: withSuspense(ProtectedCreateCategory),
          },
          {
            path: "category/:catId",
            element: withSuspense(ProtectedSpecificCategory),
          },
          {
            path: "category/edit/:catId",
            element: withSuspense(ProtectedEditCategory),
          },
          {
            path: "category/doctors/pendig-doctors",
            element: withSuspense(ProtectedPendingDoctorRequests),
          },

          // ========== DEPARTMENT MANAGEMENT ==========
          // Permission Required: userCanManageDepartments
          { path: "departments", element: withSuspense(ProtectedDepartment) },
          {
            path: "department/create",
            element: withSuspense(ProtectedCreateDepartment),
          },
          {
            path: "department/edit/:depId",
            element: withSuspense(ProtectedEditDepartment),
          },
          {
            path: "department/:depId",
            element: withSuspense(ProtectedSpecificDepartment),
          },
          {
            path: "department/edit-manager-permissions/:depId",
            element: withSuspense(ProtectedEditManagerPermission),
          },
          {
            path: "department/assign-manager/:depId",
            element: withSuspense(ProtectedAssignDepartmentManager),
          },
          {
            path: "department/create-specific",
            element: withSuspense(ProtectedCreateDepartmentSpecificCategory),
          },

          // ========== SUB-DEPARTMENT MANAGEMENT ==========
          // Permission Required: userCanManageSubDepartments
          {
            path: "sub-department/create-specific",
            element: withSuspense(
              ProtectedCreateSubDepartmentSpecificDepartment
            ),
          },
          {
            path: "sub-departments",
            element: withSuspense(ProtectedSubDepartment),
          },
          {
            path: "sub-departments/create",
            element: withSuspense(ProtectedCreateSubDepartment),
          },
          {
            path: "sub-departments/edit/:id",
            element: withSuspense(ProtectedEditSubDepartment),
          },
          {
            path: "sub-departments/:id",
            element: withSuspense(ProtectedSpecificSubDepartment),
          },

          // ========== CONTRACTING TYPES MANAGEMENT ==========
          // Permission Required: userCanContractingType
          {
            path: "contracting-types",
            element: withSuspense(ProtectedContractingTypes),
          },
          {
            path: "contracting-types/create",
            element: withSuspense(ProtectedCreateContractingType),
          },
          {
            path: "contracting-types/edit/:id",
            element: withSuspense(ProtectedEditContractingType),
          },
          {
            path: "contracting-types/:id",
            element: withSuspense(ProtectedSpecificContractingType),
          },

          // ========== SCIENTIFIC DEGREES MANAGEMENT ==========
          // Permission Required: userCanScientificDegree
          {
            path: "scientific-degrees",
            element: withSuspense(ProtectedScientificDegrees),
          },
          {
            path: "scientific-degrees/create",
            element: withSuspense(ProtectedCreateScientificDegree),
          },
          {
            path: "scientific-degrees/edit/:id",
            element: withSuspense(ProtectedEditScientificDegree),
          },
          {
            path: "scientific-degrees/:id",
            element: withSuspense(ProtectedSpecificScientificDegree),
          },

          // ========== SHIFT HOURS MANAGEMENT ==========
          // Permission Required: userCanShiftHoursType
          {
            path: "shift-hours-types",
            element: withSuspense(ProtectedShiftHours),
          },
          {
            path: "shift-hours-types/create",
            element: withSuspense(ProtectedCreateShiftHourType),
          },
          {
            path: "shift-hours-types/:id",
            element: withSuspense(ProtectedSpecificShiftHoursType),
          },
          {
            path: "shift-hours-types/edit/:id",
            element: withSuspense(ProtectedEditShiftHourType),
          },

          // ========== MANAGEMENT ROLES ==========
          // Permission Required: userCanManageRole
          {
            path: "management-roles",
            element: withSuspense(ProtectedManagementRoles),
          },
          {
            path: "management-roles/role/:id",
            element: withSuspense(ProtectedSpecifiedManagementRole),
          },
          {
            path: "management-roles/role/user-history/:id",
            element: withSuspense(ProtectedUserHistory),
          },
          {
            path: "management-roles/create",
            element: withSuspense(ProtectedCreateManagementRole),
          },
          {
            path: "management-roles/edit/:id",
            element: withSuspense(ProtectedEditManagementRole),
          },
          {
            path: "management-roles/assign-user-to-role",
            element: withSuspense(ProtectedAssignUserToRole),
          },
          {
            path: "management-roles/edit-assign-user-to-role/:id",
            element: withSuspense(ProtectedEditAssignUserToRole),
          },

          // ========== ROSTER MANAGEMENT ==========
          // Permission Required: userCanManageRostors
          { path: "rosters", element: withSuspense(ProtectedRoster) },
          {
            path: "rosters/create",
            element: withSuspense(ProtectedCreateRoster),
          },
          {
            path: "rosters/:rosterId",
            element: withSuspense(ProtectedRosterDetails),
          },
          {
            path: "rosters/:rosterId/edit",
            element: withSuspense(ProtectedEditRoster),
          },

          // ========== ROSTER WORKFLOW - PHASE-BASED ==========
          // All roster workflow routes require userCanManageRostors permission
          {
            path: "rosters/departments",
            element: withSuspense(ProtectedRosterDepartments),
          },
          {
            path: "rosters/departments/create",
            element: withSuspense(ProtectedAddRosterDepartment),
          },
          {
            path: "rosters/working-hours/generate",
            element: withSuspense(ProtectedGenerateWorkingHours),
          },
          {
            path: "rosters/:rosterId/working-hours",
            element: withSuspense(ProtectedWorkingHours),
          },
          {
            path: "rosters/working-hours/:workingHourId/edit",
            element: withSuspense(ProtectedEditWorkingHour),
          },
          {
            path: "rosters/working-hours/:workingHourId",
            element: withSuspense(ProtectedWorkingHour),
          },
          {
            path: "rosters/working-hours/:workingHourId/assign-doctors",
            element: withSuspense(ProtectedAssignDoctor),
          },
          {
            path: "rosters/doctors/:doctorId",
            element: withSuspense(ProtectedDoctorSchedule),
          },
          {
            path: "rosters/:id/doctors",
            element: withSuspense(ProtectedDoctorPerRoster),
          },

          // ========== FUTURE ROUTES (COMMENTED FOR REFERENCE) ==========
          // Uncomment and add protection when implementing these features
          // {
          //   path: "rosters/:rosterId/working-hours/:workingHoursId",
          //   element: withSuspense(WorkingHourDetails),
          // },
          // {
          //   path: "rosters/:rosterId/doctor-assignment",
          //   element: withSuspense(DoctorAssignment),
          // },
          // {
          //   path: "rosters/:rosterId/doctors/:doctorId/schedule",
          //   element: withSuspense(DoctorSchedule),
          // },
        ],
      },
    ],
  },
]);

// =============================================================================
// APP ROUTER COMPONENT
// =============================================================================

const AppRouter = () => (
  <Suspense fallback={<Loader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
