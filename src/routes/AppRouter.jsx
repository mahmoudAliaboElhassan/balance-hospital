import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../pages/rootLayout";
import ErrorPage from "../pages/error";
import Loader from "../components/Loader";
import Home from "../pages/home";
import Login from "../pages/auth/login";
import SignUp from "../pages/auth/signup";
import ForgetPassword from "../pages/auth/forgetPassword";
import ResetPassword from "../pages/auth/resetPassword";
import AdminPanel from "../pages/adminPanel";
import Category from "../pages/adminPanel/category";
import Department from "../pages/adminPanel/department";
import CreateCategory from "../pages/adminPanel/category/createCategory";
import SpecificCategory from "../pages/adminPanel/category/specificCategory";
import EditCategory from "../pages/adminPanel/category/editCategory";
import CreateDepartment from "../pages/adminPanel/department/createDepartment";
import EditDepartment from "../pages/adminPanel/department/editDepartment";
import SpecificDepartment from "../pages/adminPanel/department/specificDepartment";
import SubDepartment from "../pages/adminPanel/subDepartment";
import CreateSubDepartment from "../pages/adminPanel/subDepartment/createSubDepartment";
import EditSubDepartment from "../pages/adminPanel/subDepartment/editSubDepartment";
import SpecificSubDepartment from "../pages/adminPanel/subDepartment/specificSubDepartment";
import PendingDoctorRequests from "../pages/adminPanel/category/pendingDoctors";
import ContractingTypes from "../pages/adminPanel/contractingTypes";
import CreateContractingType from "../pages/adminPanel/contractingTypes/createContractingType";
import EditContractingType from "../pages/adminPanel/contractingTypes/editContractingType";
import SpecificContractingType from "../pages/adminPanel/contractingTypes/specificContractingType";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<Loader />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "/forget-password",
        element: (
          <Suspense fallback={<Loader />}>
            <ForgetPassword />
          </Suspense>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <Suspense fallback={<Loader />}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "/admin-panel",
        element: (
          <Suspense fallback={<Loader />}>
            <AdminPanel />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Category />,
          },
          {
            path: "categories",
            element: <Category />,
          },
          {
            path: "category/create",
            element: (
              <Suspense fallback={<Loader />}>
                <CreateCategory />
              </Suspense>
            ),
          },
          {
            path: "category/:catId",
            element: (
              <Suspense fallback={<Loader />}>
                <SpecificCategory />
              </Suspense>
            ),
          },
          {
            path: "category/edit/:catId",
            element: (
              <Suspense fallback={<Loader />}>
                <EditCategory />
              </Suspense>
            ),
          },
          {
            path: "category/doctors/pendig-doctors",
            element: (
              <Suspense fallback={<Loader />}>
                <PendingDoctorRequests />
              </Suspense>
            ),
          },
          {
            path: "departments",
            element: <Department />,
          },
          {
            path: "department/create",
            element: <CreateDepartment />,
          },
          {
            path: "department/edit/:depId",
            element: (
              <Suspense fallback={<Loader />}>
                <EditDepartment />
              </Suspense>
            ),
          },
          {
            path: "department/:depId",
            element: (
              <Suspense fallback={<Loader />}>
                <SpecificDepartment />
              </Suspense>
            ),
          },
          {
            path: "sub-departments",
            element: (
              <Suspense fallback={<Loader />}>
                <SubDepartment />
              </Suspense>
            ),
          },
          {
            path: "contracting-types",
            element: (
              <Suspense fallback={<Loader />}>
                <ContractingTypes />
              </Suspense>
            ),
          },
          {
            path: "contracting-types/create",
            element: (
              <Suspense fallback={<Loader />}>
                <CreateContractingType />
              </Suspense>
            ),
          },
          {
            path: "contracting-types/edit/:id",
            element: (
              <Suspense fallback={<Loader />}>
                <EditContractingType />
              </Suspense>
            ),
          },
          {
            path: "contracting-types/:id",
            element: (
              <Suspense fallback={<Loader />}>
                <SpecificContractingType />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
