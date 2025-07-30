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
            path: "departments",
            element: <Department />,
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
