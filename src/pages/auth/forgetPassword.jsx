import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "../../state/act/actAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import i18next from "i18next";
import UseInitialValues from "../../hooks/use-initial-values";

const MailIcon = ({ className = "" }) => (
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
    className={className}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon = ({ className = "" }) => (
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
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const UserIcon = ({ className = "" }) => (
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
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const KeyIcon = ({ className = "" }) => (
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
    className={className}
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);

const ArrowLeftIcon = ({ className = "" }) => (
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
    className={className}
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12,19 5,12 12,5"></polyline>
  </svg>
);

const ForgetPassword = () => {
  const [resetMethod, setResetMethod] = useState("email");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loadingAuth } = useSelector((state) => state.auth);
  const { mymode } = useSelector((state) => state.mode);
  const currentLanguage = i18next.language;

  // Validation schema
  const getValidationSchema = () => {
    switch (resetMethod) {
      case "email":
        return Yup.object({
          inputValue: Yup.string()
            .email(t("errors.email_format"))
            .matches(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              t("errors.email_format")
            )
            .required(t("errors.email_required")),
        });
      case "mobile":
        return Yup.object({
          inputValue: Yup.string()
            .matches(/^\d{11}$/, t("errors.phone_format"))
            .required(t("errors.phone_required")),
        });
      case "nationalId":
        return Yup.object({
          inputValue: Yup.string()
            .matches(/^\d{14}$/, t("errors.id_format"))
            .required(t("errors.id_required")),
        });
      default:
        return Yup.object({
          inputValue: Yup.string().required(t("errors.email_required")),
        });
    }
  };

  // Initial values
  const { INITIAL_VALUES_FORGET_PASSWORD } = UseInitialValues();
  const dispatch = useDispatch();

  // Form handler
  const formik = useFormik({
    initialValues: INITIAL_VALUES_FORGET_PASSWORD,
    validationSchema: getValidationSchema(),
    enableReinitialize: true,
    onSubmit: async (values) => {
      localStorage.setItem("identifier", values.inputValue);
      dispatch(forgetPassword({ [resetMethod]: values.inputValue }))
        .unwrap()
        .then(() => {
          toast.success(t("forgetPassword.success"), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          localStorage.setItem("resetMethod", resetMethod);
          localStorage.setItem("valueReset", values.inputValue);
          navigate("/reset-password");
        })
        .catch((error) => {
          console.log("Reset error:", error);
          Swal.fire({
            title: t("forgetPassword.error.title"),
            text:
              currentLanguage === "ar"
                ? error?.response?.data?.messageAr ||
                  t("forgetPassword.error.message")
                : error?.response?.data?.messageEn ||
                  t("forgetPassword.error.message"),
            icon: "error",
            confirmButtonText: t("common.ok"),
            confirmButtonColor: "#ef4444",
            background: mymode === "dark" ? "#1f2937" : "#ffffff",
            color: mymode === "dark" ? "#f9fafb" : "#111827",
          });
        });
    },
  });

  const getIcon = () =>
    resetMethod === "email" ? (
      <MailIcon />
    ) : resetMethod === "mobile" ? (
      <PhoneIcon />
    ) : resetMethod === "nationalId" ? (
      <UserIcon />
    ) : (
      <MailIcon />
    );

  const getPlaceholder = () => t(`${resetMethod}_placeholder`);
  const getLabel = () => t(`${resetMethod}_label`);
  const getInputType = () =>
    resetMethod === "email"
      ? "email"
      : resetMethod === "mobile"
      ? "tel"
      : "text";

  const handleMethodChange = (method) => {
    setResetMethod(method);
    formik.setFieldValue("inputValue", "");
    formik.setFieldError("inputValue", "");
    formik.setFieldTouched("inputValue", false);
  };

  // Theme-based classes
  const getThemeClasses = () => {
    const isDark = mymode === "dark";
    return {
      container: isDark
        ? "bg-gray-900 text-gray-100"
        : "bg-gray-50 text-gray-900",
      card: isDark
        ? "bg-gray-800 border-gray-700 shadow-xl"
        : "bg-white border-gray-200 shadow-lg",
      iconContainer: isDark
        ? "bg-gray-700 text-gray-300"
        : "bg-gray-100 text-gray-600",
      title: isDark ? "text-gray-100" : "text-gray-900",
      subtitle: isDark ? "text-gray-400" : "text-gray-600",
      label: isDark ? "text-gray-200" : "text-gray-700",
      input: isDark
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500",
      inputError: isDark
        ? "border-red-500 focus:ring-red-500"
        : "border-red-500 focus:ring-red-500",
      icon: isDark ? "text-gray-400" : "text-gray-500",
      methodButton: {
        active: isDark
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-blue-600 text-white border-blue-600",
        inactive: isDark
          ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400",
      },
      button: isDark
        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      link: isDark
        ? "text-blue-400 hover:text-blue-300"
        : "text-blue-600 hover:text-blue-700",
      errorText: isDark ? "text-red-400" : "text-red-500",
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${themeClasses.container}`}
    >
      <div className="w-full max-w-sm">
        <div
          className={`signin-card rounded-lg p-6 transition-all duration-200 ${themeClasses.card}`}
        >
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors duration-200 ${themeClasses.iconContainer}`}
            >
              <KeyIcon />
            </div>
            <h1
              className={`text-2xl font-semibold mb-2 transition-colors duration-200 ${themeClasses.title}`}
            >
              {t("reset_password")}
            </h1>
            <p
              className={`text-sm transition-colors duration-200 ${themeClasses.subtitle}`}
            >
              {t("choose_method")}
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                className={`text-sm font-medium transition-colors duration-200 ${themeClasses.label}`}
              >
                {t("reset_method")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["email", "mobile", "nationalId"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handleMethodChange(method)}
                    className={`flex flex-col items-center justify-center p-3 text-xs font-medium rounded-md border transition-all duration-200 ${
                      resetMethod === method
                        ? themeClasses.methodButton.active
                        : themeClasses.methodButton.inactive
                    }`}
                  >
                    <div className="mb-1">
                      {method === "email" ? (
                        <MailIcon />
                      ) : method === "mobile" ? (
                        <PhoneIcon />
                      ) : (
                        <UserIcon />
                      )}
                    </div>
                    <span className="text-xs">{t(method)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label
                className={`text-sm font-medium transition-colors duration-200 ${themeClasses.label}`}
              >
                {getLabel()}
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200 ${
                    formik.values.inputValue
                      ? "translate-x-0 opacity-60"
                      : "translate-x-0 opacity-100"
                  } ${themeClasses.icon}`}
                >
                  {getIcon()}
                </div>
                <input
                  type={getInputType()}
                  name="inputValue"
                  value={formik.values.inputValue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={getPlaceholder()}
                  className={`signin-input w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formik.touched.inputValue && formik.errors.inputValue
                      ? themeClasses.inputError
                      : `${themeClasses.input}`
                  }`}
                />
              </div>
              {formik.touched.inputValue && formik.errors.inputValue && (
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${themeClasses.errorText}`}
                >
                  {formik.errors.inputValue}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className={`w-full disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${themeClasses.button}`}
            >
              {loadingAuth ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("forgetPassword.loading")}
                </div>
              ) : (
                t("forgetPassword.button")
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`inline-flex items-center font-medium hover:underline transition-colors duration-200 ${themeClasses.link}`}
            >
              <ArrowLeftIcon className="mr-2" />
              <span>{t("back_to_login")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
