import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resendForgetPasswordCode,
  resetPassword,
} from "../../state/act/actAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import i18next from "i18next";
import { useNavigate } from "react-router-dom";
import UseInitialValues from "../../hooks/use-initial-values";
import UseFormValidation from "../../hooks/use-form-validation";

export default function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentLang = i18next.language;
  const { loadingAuth } = useSelector((state) => state.auth);
  const { mymode } = useSelector((state) => state.mode);

  const [token, setToken] = useState(new Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [identifier] = useState(
    localStorage.getItem("identifier") || "user@example.com"
  );
  const inputRefs = useRef([]);

  // Yup validation schema
  const { VALIDATION_SCHEMA_RESET_PASSWORD } = UseFormValidation();
  const { INITIAL_VALUES_RESET_PASSWORD } = UseInitialValues();
  const formik = useFormik({
    initialValues: INITIAL_VALUES_RESET_PASSWORD,
    validationSchema: VALIDATION_SCHEMA_RESET_PASSWORD,
    onSubmit: async (values) => {
      dispatch(
        resetPassword({
          token: values.token,
          newPassword: values.newPassword,
          confirmPassword: values.confirmNewPassword,
          identifier: localStorage.getItem("identifier"),
        })
      )
        .unwrap()
        .then(() => {
          toast.success(t("resetPassword.success"), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Navigate to login after success
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        })

        .catch((error) => {
          console.log("Reset error:", error);

          // Error handling with SweetAlert
          Swal.fire({
            title: t("resetPassword.error.title"),
            text:
              currentLang === "ar"
                ? error?.response?.data?.messageAr ||
                  t("resetPassword.error.message")
                : error?.response?.data?.messageEn ||
                  t("resetPassword.error.message"),
            icon: "error",
            confirmButtonText: t("common.ok"),
            confirmButtonColor: "#ef4444",
            background: mymode === "dark" ? "#1f2937" : "#ffffff",
            color: mymode === "dark" ? "#f9fafb" : "#111827",
          });
        });
    },
  });

  // Token handling functions
  const handleTokenChange = (element, index) => {
    if (isNaN(Number(element.value)) || element.value === " ") {
      element.value = "";
      return;
    }

    const newToken = [...token];
    newToken[index] = element.value;
    setToken(newToken);

    // Update formik token value
    const tokenString = newToken.join("");
    formik.setFieldValue("token", tokenString);

    // Clear token error if exists
    if (formik.errors.token) {
      formik.setFieldError("token", "");
    }

    // Move to next input
    if (element.value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleTokenKeyDown = (e, index) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleTokenPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newToken = new Array(6).fill("");
    for (let i = 0; i < pasteData.length; i++) {
      newToken[i] = pasteData[i];
    }
    setToken(newToken);

    // Update formik token value
    const tokenString = newToken.join("");
    formik.setFieldValue("token", tokenString);

    // Clear token error if exists
    if (formik.errors.token) {
      formik.setFieldError("token", "");
    }

    const lastFullInput = Math.min(pasteData.length - 1, 5);
    if (lastFullInput >= 0) {
      const targetInput = inputRefs.current[lastFullInput];
      if (targetInput) {
        targetInput.focus();
      }
    }
  };

  const handleTokenBlur = () => {
    formik.setFieldTouched("token", true);
    const tokenString = token.join("");
    formik.setFieldValue("token", tokenString);
  };

  const handleResendCode = async () => {
    // Reset token
    setToken(new Array(6).fill(""));
    formik.setFieldValue("token", "");
    formik.setFieldError("token", "");

    // You can dispatch a resend action here if available
    // await dispatch(resendResetCode({ identifier })).unwrap();
    const resetMethod = localStorage.getItem("resetMethod");
    const valueReset = localStorage.getItem("valueReset");
    const curerentLanguage = i18next.language;

    dispatch(resendForgetPasswordCode({ [resetMethod]: valueReset }))
      .unwrap()
      .then(() => {
        toast.success(t("resetPassword.resend_success"), {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log("Reset error:", error); // show SweetAlert error
        Swal.fire({
          title: t("resetPassword.resend_error"),
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
  };

  // Focus first input on mount
  useEffect(() => {
    const firstInput = inputRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  return (
    <div className="flex items-center justify-center py-4">
      <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-gray-900 dark:text-white">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("reset_title")}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t("reset_description", {
              identifier: identifier.replace(/(.{3}).*(@.*)/, "$1***$2"),
            })}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Token Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("reset_code_label")}
            </label>
            <div
              className="flex justify-center gap-2 mb-2"
              onPaste={handleTokenPaste}
            >
              {token.map((data, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="tel"
                  maxLength={1}
                  value={data}
                  placeholder="•"
                  onChange={(e) => handleTokenChange(e.target, index)}
                  onKeyDown={(e) => handleTokenKeyDown(e, index)}
                  onFocus={(e) => {
                    e.target.select();
                    setFocusedIndex(index);
                  }}
                  onBlur={() => {
                    setFocusedIndex(-1);
                    handleTokenBlur();
                  }}
                  className={`w-10 h-12 text-center text-xl font-semibold bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white rounded-lg outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600
                    ${
                      focusedIndex === index
                        ? "border-2 border-blue-500"
                        : formik.touched.token && formik.errors.token
                        ? "border-2 border-red-500"
                        : "border border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
                />
              ))}
            </div>
            {formik.touched.token && formik.errors.token && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.token}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t("new_password")}
            </label>
            <input
              type="password"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("new_password_placeholder")}
              className={`w-full px-3 py-3 border rounded-lg bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t("confirm_password")}
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={formik.values.confirmNewPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("confirm_password_placeholder")}
              className={`w-full px-3 py-3 border rounded-lg bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {formik.touched.confirmNewPassword &&
              formik.errors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmNewPassword}
                </p>
              )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loadingAuth || formik.isSubmitting || !formik.isValid}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {loadingAuth || formik.isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("resetPassword.loading")}
              </div>
            ) : (
              t("submit-reset")
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              {t("resend_info")}{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loadingAuth}
                className="text-blue-600 dark:text-blue-500 hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {t("resend_code")}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
