import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "../components/Loader";
import RosterDepartments from "../pages/adminPanel/roster/rosterDepartments";

// Lazy pages/layouts
const RootLayout = lazy(() => import("../pages/rootLayout"));
const ErrorPage = lazy(() => import("../pages/error"));

const Home = lazy(() => import("../pages/home"));
const Login = lazy(() => import("../pages/auth/login"));
const SignUp = lazy(() => import("../pages/auth/signup"));
const ForgetPassword = lazy(() => import("../pages/auth/forgetPassword"));
const ResetPassword = lazy(() => import("../pages/auth/resetPassword"));
const LoginSelection = lazy(() => import("../pages/auth/loginRoleSelection"));

const AdminPanel = lazy(() => import("../pages/adminPanel"));
const Category = lazy(() => import("../pages/adminPanel/category"));
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
// If you really need both names pointing to the same file, keep this line as well:
// const CreateSpecificSubDepartment = lazy(() => import("../pages/adminPanel/subDepartment/createSpecificSubDepartment"));

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

const ManagementRoles = lazy(() =>
  import("../pages/adminPanel/managementRoles")
);
const SpecifiedManagementRole = lazy(() =>
  import("../pages/adminPanel/managementRoles/specifiedManagementRole")
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

const roster = lazy(() => import("../pages/adminPanel/roster"));
const CreateRoster = lazy(() =>
  import("../pages/adminPanel/roster/createRoster")
);
const RosterDetails = lazy(() =>
  import("../pages/adminPanel/roster/rosterDetails")
);
const EditRoster = lazy(() => import("../pages/adminPanel/roster/editRoster"));

// Phase-specific components
const RosterPhase1 = lazy(() =>
  import("../pages/adminPanel/roster/phases/phase1")
);
const RosterPhase2 = lazy(() =>
  import("../pages/adminPanel/roster/phases/phase2")
);
const RosterPhase3 = lazy(() =>
  import("../pages/adminPanel/roster/phases/phase3")
);
const RosterPhase4 = lazy(() =>
  import("../pages/adminPanel/roster/phases/phase4")
);
const RosterPhase5 = lazy(() =>
  import("../pages/adminPanel/roster/phases/phase5")
);
const RosterPhase6 = lazy(() =>
  import("../pages/adminPanel/roster/phases/phase6")
);
const RosterPhase7 = lazy(() =>
  import("../pages/adminPanel/roster/phases/phase7")
);

// Department Shifts Management
// const DepartmentShifts = lazy(() =>
//   import("../pages/adminPanel/roster/departmentShifts")
// );
// const CreateDepartmentShift = lazy(() =>
//   import("../pages/adminPanel/roster/departmentShifts/create")
// );
// const EditDepartmentShift = lazy(() =>
//   import("../pages/adminPanel/roster/departmentShifts/edit")
// );

// // Contracting Management
// const ContractingRequirements = lazy(() =>
//   import("../pages/adminPanel/roster/contracting")
// );
// const CreateContractingRequirement = lazy(() =>
//   import("../pages/adminPanel/roster/contracting/create")
// );
// const EditContractingRequirement = lazy(() =>
//   import("../pages/adminPanel/roster/contracting/edit")
// );

// // Working Hours Management
// const WorkingHoursManagement = lazy(() =>
//   import("../pages/adminPanel/roster/workingHours")
// );
// const CreateWorkingHours = lazy(() =>
//   import("../pages/adminPanel/roster/workingHours/create")
// );
// const EditWorkingHours = lazy(() =>
//   import("../pages/adminPanel/roster/workingHours/edit")
// );

// // Analytics and Reports
// const RosterAnalytics = lazy(() =>
//   import("../pages/adminPanel/roster/analytics")
// );
// const DoctorWorkloads = lazy(() =>
//   import("../pages/adminPanel/roster/analytics/workloads")
// );
// const DepartmentCoverage = lazy(() =>
//   import("../pages/adminPanel/roster/analytics/coverage")
// );
// const ContractingAnalytics = lazy(() =>
//   import("../pages/adminPanel/roster/analytics/contracting")
// );

// // Doctor Assignment
// const DoctorAssignment = lazy(() =>
//   import("../pages/adminPanel/roster/doctorAssignment")
// );
// const SearchColleagues = lazy(() =>
//   import("../pages/adminPanel/roster/searchColleagues")
// );

// // Schedule Views
// const DepartmentSchedule = lazy(() =>
//   import("../pages/adminPanel/roster/schedule/department")
// );
// const FullRosterSchedule = lazy(() =>
//   import("../pages/adminPanel/roster/schedule/full")
// );

// Helper to wrap lazies with a shared fallback
const withSuspense = (Comp) => (
  <Suspense fallback={<Loader />}>
    <Comp />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(RootLayout),
    errorElement: withSuspense(ErrorPage),
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "login", element: withSuspense(Login) },
      { path: "role-select", element: withSuspense(LoginSelection) },
      { path: "signup", element: withSuspense(SignUp) },
      { path: "forget-password", element: withSuspense(ForgetPassword) },
      { path: "reset-password", element: withSuspense(ResetPassword) },

      {
        path: "admin-panel",
        element: withSuspense(AdminPanel),
        children: [
          { index: true, element: withSuspense(Category) },
          { path: "categories", element: withSuspense(Category) },

          { path: "category/create", element: withSuspense(CreateCategory) },
          { path: "category/:catId", element: withSuspense(SpecificCategory) },
          { path: "category/edit/:catId", element: withSuspense(EditCategory) },
          {
            path: "category/doctors/pendig-doctors",
            element: withSuspense(PendingDoctorRequests),
          },

          { path: "departments", element: withSuspense(Department) },
          {
            path: "department/create",
            element: withSuspense(CreateDepartment),
          },
          {
            path: "department/edit/:depId",
            element: withSuspense(EditDepartment),
          },
          {
            path: "department/:depId",
            element: withSuspense(SpecificDepartment),
          },
          {
            path: "department/create-specific",
            element: withSuspense(CreateDepartmentSpecificCategory),
          },

          {
            path: "sub-department/create-specific",
            element: withSuspense(CreateSubDepartmentSpecificDepartment),
          },
          { path: "sub-departments", element: withSuspense(SubDepartment) },
          {
            path: "sub-departments/create",
            element: withSuspense(CreateSubDepartment),
          },
          {
            path: "sub-departments/edit/:id",
            element: withSuspense(EditSubDepartment),
          },
          {
            path: "sub-departments/:id",
            element: withSuspense(SpecificSubDepartment),
          },

          {
            path: "contracting-types",
            element: withSuspense(ContractingTypes),
          },
          {
            path: "contracting-types/create",
            element: withSuspense(CreateContractingType),
          },
          {
            path: "contracting-types/edit/:id",
            element: withSuspense(EditContractingType),
          },
          {
            path: "contracting-types/:id",
            element: withSuspense(SpecificContractingType),
          },

          {
            path: "scientific-degrees",
            element: withSuspense(ScientificDegrees),
          },
          {
            path: "scientific-degrees/create",
            element: withSuspense(CreateScientificDegree),
          },
          {
            path: "scientific-degrees/edit/:id",
            element: withSuspense(EditScientificDegree),
          },
          {
            path: "scientific-degrees/:id",
            element: withSuspense(SpecificScientificDegree),
          },

          { path: "shift-hours-types", element: withSuspense(ShiftHours) },
          {
            path: "shift-hours-types/create",
            element: withSuspense(CreateShiftHourType),
          },
          {
            path: "shift-hours-types/:id",
            element: withSuspense(SpecificShiftHoursType),
          },
          {
            path: "shift-hours-types/edit/:id",
            element: withSuspense(EditShiftHourType),
          },

          { path: "management-roles", element: withSuspense(ManagementRoles) },
          {
            path: "management-roles/role/:id",
            element: withSuspense(SpecifiedManagementRole),
          },
          {
            path: "management-roles/create",
            element: withSuspense(CreateManagementRole),
          },
          {
            path: "management-roles/edit/:id",
            element: withSuspense(EditManagementRole),
          },
          {
            path: "management-roles/assign-user-to-role",
            element: withSuspense(AssignUserToRole),
          },
          {
            path: "management-roles/edit-assign-user-to-role/:id",
            element: withSuspense(EditAssignUserToRole),
          },
          { path: "rosters", element: withSuspense(roster) },
          { path: "rosters/create", element: withSuspense(CreateRoster) },
          { path: "rosters/:rosterId", element: withSuspense(RosterDetails) },
          { path: "rosters/:rosterId/edit", element: withSuspense(EditRoster) },

          // Phase-based roster workflow
          {
            path: "rosters/departments",
            element: withSuspense(RosterDepartments),
          },
          {
            path: "rosters/:rosterId/phase1",
            element: withSuspense(RosterPhase1),
          },
          {
            path: "rosters/:rosterId/phase2",
            element: withSuspense(RosterPhase2),
          },
          {
            path: "rosters/:rosterId/phase3",
            element: withSuspense(RosterPhase3),
          },
          {
            path: "rosters/:rosterId/phase4",
            element: withSuspense(RosterPhase4),
          },
          {
            path: "rosters/:rosterId/phase5",
            element: withSuspense(RosterPhase5),
          },
          {
            path: "rosters/:rosterId/phase6",
            element: withSuspense(RosterPhase6),
          },
          {
            path: "rosters/:rosterId/phase7",
            element: withSuspense(RosterPhase7),
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => (
  <Suspense fallback={<Loader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
