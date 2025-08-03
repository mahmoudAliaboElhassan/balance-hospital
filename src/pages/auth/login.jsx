"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { logIn } from "../../state/act/actAuth";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import i18next from "i18next";
import UseInitialValues from "../../hooks/use-initial-values";
import UseFormValidation from "../../hooks/use-form-validation";
import UseDirection from "../../hooks/use-direction";
import { useNavigate } from "react-router-dom";
import withGuard from "../../utils/withGuard";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const { loadingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Initial form values
  const { INITIAL_VALUES_LOGIN } = UseInitialValues();
  const currentLang = i18next.language;

  const { direction } = UseDirection();
  // Yup validation schema
  const { VALIDATION_SCHEMA_LOGIN } = UseFormValidation();
  const { mymode } = useSelector((state) => state.mode);
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(
      logIn({
        emailOrMobile: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(t("login.success"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/admin-panel");
      })
      .catch((error) => {
        console.log("error", error);
        // Error handling with SweetAlert
        Swal.fire({
          title: t("login.error.title"),
          text:
            currentLang === "en"
              ? error?.response?.data?.messageEn
              : error?.response?.data?.messageAr || t("login.error.message"),
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: mymode === "light" ? "#1f2937" : "#ffffff",
          color: mymode === "light" ? "#f9fafb" : "#111827",
        });
      });
  };
  const [, side] = direction.marginLeft.split("-"); // "left" or "right"
  const twGapClass = `m${side.charAt(0)}-2`;
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="signin-card bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
              <UserIcon />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("login.title")}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("login.subtitle")}
            </p>
          </div>

          <Formik
            initialValues={INITIAL_VALUES_LOGIN}
            validationSchema={VALIDATION_SCHEMA_LOGIN}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("login.email")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
                      <MailIcon />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      placeholder={t("login.emailPlaceholder")}
                      className={`signin-input w-full pl-9 pr-3 py-2 bg-white dark:bg-black border rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors.email && touched.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-100"
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("login.password")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
                      <LockIcon />
                    </div>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={t("login.passwordPlaceholder")}
                      className={`signin-input w-full pl-9 pr-10 py-2 bg-white dark:bg-black border rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="rememberMe"
                    className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${twGapClass}`}
                  >
                    {t("login.rememberMe")}
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loadingAuth || isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {loadingAuth || isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("login.loading")}
                    </div>
                  ) : (
                    t("login.button")
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <Link
              to="/forget-password"
              className="text-gray-900 dark:text-gray-100 font-medium hover:underline"
            >
              {t("login.forgetPassword")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withGuard(Login);
