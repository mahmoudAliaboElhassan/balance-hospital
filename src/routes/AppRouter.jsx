import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "../components/Loader";

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
            path: "rosters/departments/create",
            element: withSuspense(AddRosterDepartment),
          },
          {
            path: "rosters/working-hours/generate",
            element: withSuspense(GenerateWorkingHours),
          },

          {
            path: "rosters/:rosterId/working-hours",
            element: withSuspense(WorkingHours),
          },
          {
            path: "rosters/working-hours/:workingHourId/edit",
            element: withSuspense(EditWorkingHour),
          },
          {
            path: "rosters/working-hours/:workingHourId",
            element: withSuspense(WorkingHour),
          },
          {
            path: "rosters/working-hours/:workingHourId/assign-doctors",
            element: withSuspense(AssignDoctor),
          },
          {
            path: "rosters/doctors/:doctorId",
            element: withSuspense(DoctorSchedule),
          },
          // {
          //   path: "rosters/:rosterId/working-hours/:workingHoursId",
          //   element: withSuspense(WorkingHourDetails),
          // },

          // // Doctor Assignment
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

const AppRouter = () => (
  <Suspense fallback={<Loader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
