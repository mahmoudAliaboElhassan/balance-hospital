"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

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

const PhoneIcon = () => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const KeyIcon = () => (
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
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);

const ArrowLeftIcon = () => (
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
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12,19 5,12 12,5"></polyline>
  </svg>
);

const ForgetPassword = () => {
  const [resetMethod, setResetMethod] = useState("email");
  const navigate = useNavigate();
  // Create validation schema based on reset method
  const getValidationSchema = () => {
    switch (resetMethod) {
      case "email":
        return Yup.object({
          inputValue: Yup.string()
            .email(
              "Please enter a valid email address (e.g., email@example.com)"
            )
            .matches(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              "Please enter a valid email format (email@example.com)"
            )
            .required("Email address is required"),
        });
      case "phone":
        return Yup.object({
          inputValue: Yup.string()
            .matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
            .required("Phone number is required"),
        });
      case "id":
        return Yup.object({
          inputValue: Yup.string()
            .matches(/^\d{14}$/, "User ID must be exactly 14 digits")
            .required("User ID is required"),
        });
      default:
        return Yup.object({
          inputValue: Yup.string().required("This field is required"),
        });
    }
  };

  const formik = useFormik({
    initialValues: {
      inputValue: "",
    },
    validationSchema: getValidationSchema(),
    enableReinitialize: true, // This allows the schema to update when resetMethod changes
    onSubmit: (values) => {
      console.log(`Reset password via ${resetMethod}:`, values.inputValue);
      localStorage.setItem("identifier", values.inputValue);
      navigate("/reset-password");
    },
  });

  const getIcon = () => {
    switch (resetMethod) {
      case "email":
        return <MailIcon />;
      case "phone":
        return <PhoneIcon />;
      case "id":
        return <UserIcon />;
      default:
        return <MailIcon />;
    }
  };

  const getPlaceholder = () => {
    switch (resetMethod) {
      case "email":
        return "email@example.com";
      case "phone":
        return "01234567890";
      case "id":
        return "12345678901234";
      default:
        return "email@example.com";
    }
  };

  const getLabel = () => {
    switch (resetMethod) {
      case "email":
        return "Email Address";
      case "phone":
        return "Phone Number (11 digits)";
      case "id":
        return "User ID (14 digits)";
      default:
        return "Email Address";
    }
  };

  const getInputType = () => {
    switch (resetMethod) {
      case "email":
        return "email";
      case "phone":
        return "tel";
      case "id":
        return "text";
      default:
        return "email";
    }
  };

  const handleMethodChange = (method) => {
    setResetMethod(method);
    formik.setFieldValue("inputValue", "");
    formik.setFieldError("inputValue", "");
    formik.setFieldTouched("inputValue", false);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="signin-card bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
              <KeyIcon />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Reset Password
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose how you'd like to reset your password
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Reset Method Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Reset Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleMethodChange("email")}
                  className={`flex items-center justify-center p-2 text-xs font-medium rounded-md transition-all duration-200 ${
                    resetMethod === "email"
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <MailIcon />
                  <span className="ml-1">Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMethodChange("phone")}
                  className={`flex items-center justify-center p-2 text-xs font-medium rounded-md transition-all duration-200 ${
                    resetMethod === "phone"
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <PhoneIcon />
                  <span className="ml-1">Phone</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMethodChange("id")}
                  className={`flex items-center justify-center p-2 text-xs font-medium rounded-md transition-all duration-200 ${
                    resetMethod === "id"
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <UserIcon />
                  <span className="ml-1">ID</span>
                </button>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {getLabel()}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  {getIcon()}
                </div>
                <input
                  type={getInputType()}
                  name="inputValue"
                  value={formik.values.inputValue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={getPlaceholder()}
                  className={`signin-input w-full pl-9 pr-3 py-2 bg-white dark:bg-black border rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formik.touched.inputValue && formik.errors.inputValue
                      ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-200 dark:border-gray-800 focus:ring-gray-900 dark:focus:ring-gray-100"
                  }`}
                />
              </div>
              {formik.touched.inputValue && formik.errors.inputValue && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  {formik.errors.inputValue}
                </p>
              )}
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              //   disabled={!formik.isValid || !formik.values.inputValue}
              className="signin-button w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Reset Instructions
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-900 dark:text-gray-100 font-medium hover:underline"
            >
              <ArrowLeftIcon />
              <span className="ml-2">Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

const styles = `
  .signin-input:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  .dark .signin-input:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  .signin-button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .signin-checkbox:checked + label .checkbox-icon {
    background-color: currentColor;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .signin-card {
    animation: fadeIn 0.3s ease-out;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
