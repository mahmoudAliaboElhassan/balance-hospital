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
  const { t } = useTranslation();
  const { loadingAuth } = useSelector((state) => state.auth);
  const { mymode } = useSelector((state) => state.mode);
  const curerentLanguage = i18next.language;
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

  const { INITIAL_VALUES_FORGET_PASSWORD } = UseInitialValues();
  const dispatch = useDispatch();
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
          // 2) navigate after toast (you can also delay if you like)
          localStorage.setItem("email", values.inputValue);
          navigate("/reset-password");
        })
        .catch((error) => {
          console.log("Reset error:", error); // show SweetAlert error
          Swal.fire({
            title: t("forgetPassword.error.title"),
            text:
              curerentLanguage === "ar"
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

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="signin-card bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
              <KeyIcon />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("reset_password")}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("choose_method")}
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("reset_method")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["email", "mobile", "nationalId"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handleMethodChange(method)}
                    className={`flex items-center justify-center p-2 text-xs font-medium rounded-md transition-all duration-200 ${
                      resetMethod === method
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                        : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    {method === "email" ? (
                      <MailIcon />
                    ) : method === "mobile" ? (
                      <PhoneIcon />
                    ) : (
                      <UserIcon />
                    )}
                    <span className="ml-1">{t(method)}</span>
                  </button>
                ))}
              </div>
            </div>

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
            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
              className="inline-flex items-center text-gray-900 dark:text-gray-100 font-medium hover:underline"
            >
              <ArrowLeftIcon />
              <span className="ml-2">{t("back_to_login")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
