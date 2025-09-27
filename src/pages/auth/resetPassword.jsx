import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import {
  resendForgetPasswordCode,
  resetPassword,
} from "../../state/act/actAuth"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import i18next from "i18next"
import { useNavigate } from "react-router-dom"
import UseInitialValues from "../../hooks/use-initial-values"
import UseFormValidation from "../../hooks/use-form-validation"

// Icon Components
const LockIcon = ({ className = "" }) => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

const ShieldCheckIcon = ({ className = "" }) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
)

const EyeIcon = ({ className = "" }) => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
)

const EyeOffIcon = ({ className = "" }) => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
)

export default function ResetPassword() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentLang = i18next.language
  const { loadingAuth } = useSelector((state) => state.auth)
  const { mymode } = useSelector((state) => state.mode)

  const [token, setToken] = useState(new Array(6).fill(""))
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [focusedField, setFocusedField] = useState(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [identifier] = useState(
    localStorage.getItem("identifier") || "user@example.com"
  )
  const inputRefs = useRef([])

  // Yup validation schema
  const { VALIDATION_SCHEMA_RESET_PASSWORD } = UseFormValidation()
  const { INITIAL_VALUES_RESET_PASSWORD } = UseInitialValues()
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
          })

          // Navigate to login after success
          setTimeout(() => {
            navigate("/login")
          }, 1500)
        })

        .catch((error) => {
          console.log("Reset error:", error)

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
          })
        })
    },
  })

  // Enhanced icon state logic
  const getIconState = (fieldName, hasValue, hasFocus, hasError) => {
    if (hasError) {
      return "error"
    }
    if (hasFocus) {
      return "focused"
    }
    if (hasValue) {
      return "filled"
    }
    return "default"
  }

  // Comprehensive theme-based classes
  const getThemeClasses = () => {
    const isDark = mymode === "dark"
    return {
      // Container and layout
      container: isDark
        ? "bg-gray-900 text-gray-100"
        : "bg-gray-50 text-gray-900",
      card: isDark
        ? "bg-gray-800 border-gray-700 shadow-2xl"
        : "bg-white border-gray-200 shadow-xl",

      // Header elements
      iconContainer: isDark
        ? "bg-blue-900/30 text-blue-400"
        : "bg-blue-100 text-blue-600",
      title: isDark ? "text-gray-100" : "text-gray-900",
      subtitle: isDark ? "text-gray-400" : "text-gray-600",

      // Form elements
      label: isDark ? "text-gray-300" : "text-gray-700",
      input: isDark
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
        : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500",
      inputError: isDark
        ? "border-red-500 focus:ring-red-500"
        : "border-red-500 focus:ring-red-500",

      // Token input states
      tokenDefault: isDark
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-500"
        : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400",
      tokenFocused: isDark
        ? "border-blue-500 shadow-blue-500/20"
        : "border-blue-500 shadow-blue-500/20",
      tokenFilled: isDark
        ? "border-green-500 bg-green-900/20 text-green-100"
        : "border-green-500 bg-green-50 text-green-900",
      tokenError: isDark
        ? "border-red-500 bg-red-900/20"
        : "border-red-500 bg-red-50",
      tokenHover: isDark ? "hover:border-gray-500" : "hover:border-gray-400",

      // Enhanced icon states
      iconDefault: isDark ? "text-gray-500" : "text-gray-400",
      iconFocused: isDark ? "text-blue-400" : "text-blue-500",
      iconFilled: isDark ? "text-gray-300" : "text-gray-600",
      iconError: isDark ? "text-red-400" : "text-red-500",
      iconHover: isDark ? "hover:text-gray-300" : "hover:text-gray-600",

      // Interactive elements
      button: isDark
        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-700"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400",
      link: isDark
        ? "text-blue-400 hover:text-blue-300"
        : "text-blue-600 hover:text-blue-700",

      // Success states
      success: isDark ? "text-green-400" : "text-green-500",
      warning: isDark ? "text-yellow-400" : "text-yellow-500",
      error: isDark ? "text-red-400" : "text-red-500",
    }
  }

  const themeClasses = getThemeClasses()

  // Get icon classes based on state
  const getIconClasses = (iconState) => {
    const baseClasses = "transition-all duration-300 ease-in-out transform"

    switch (iconState) {
      case "focused":
        return `${baseClasses} ${themeClasses.iconFocused} scale-105 drop-shadow-sm`
      case "filled":
        return `${baseClasses} ${themeClasses.iconFilled} scale-100`
      case "error":
        return `${baseClasses} ${themeClasses.iconError} scale-105 animate-pulse`
      default:
        return `${baseClasses} ${themeClasses.iconDefault} scale-95`
    }
  }

  // Enhanced token input classes
  const getTokenClasses = (index, data) => {
    const baseClasses =
      "w-10 h-12 text-center text-xl font-semibold rounded-lg outline-none transition-all duration-300 hover:shadow-sm"

    if (focusedIndex === index) {
      return `${baseClasses} ${themeClasses.tokenFocused} border-2 scale-105 shadow-lg`
    }
    if (formik.touched.token && formik.errors.token) {
      return `${baseClasses} ${themeClasses.tokenError} border-2 animate-pulse`
    }
    if (data) {
      return `${baseClasses} ${themeClasses.tokenFilled} border-2`
    }
    return `${baseClasses} ${themeClasses.tokenDefault} border border-dashed ${themeClasses.tokenHover}`
  }

  // Token handling functions
  const handleTokenChange = (element, index) => {
    if (isNaN(Number(element.value)) || element.value === " ") {
      element.value = ""
      return
    }

    const newToken = [...token]
    newToken[index] = element.value
    setToken(newToken)

    // Update formik token value
    const tokenString = newToken.join("")
    formik.setFieldValue("token", tokenString)

    // Clear token error if exists
    if (formik.errors.token) {
      formik.setFieldError("token", "")
    }

    // Move to next input
    if (element.value && index < 5) {
      const nextInput = inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleTokenKeyDown = (e, index) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1]
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handleTokenPaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pasteData)) return

    const newToken = new Array(6).fill("")
    for (let i = 0; i < pasteData.length; i++) {
      newToken[i] = pasteData[i]
    }
    setToken(newToken)

    // Update formik token value
    const tokenString = newToken.join("")
    formik.setFieldValue("token", tokenString)

    // Clear token error if exists
    if (formik.errors.token) {
      formik.setFieldError("token", "")
    }

    const lastFullInput = Math.min(pasteData.length - 1, 5)
    if (lastFullInput >= 0) {
      const targetInput = inputRefs.current[lastFullInput]
      if (targetInput) {
        targetInput.focus()
      }
    }
  }

  const handleTokenBlur = () => {
    formik.setFieldTouched("token", true)
    const tokenString = token.join("")
    formik.setFieldValue("token", tokenString)
  }

  const handleResendCode = async () => {
    // Reset token
    setToken(new Array(6).fill(""))
    formik.setFieldValue("token", "")
    formik.setFieldError("token", "")

    const resetMethod = localStorage.getItem("resetMethod")
    const valueReset = localStorage.getItem("valueReset")
    const curerentLanguage = i18next.language

    dispatch(resendForgetPasswordCode({ [resetMethod]: valueReset }))
      .unwrap()
      .then(() => {
        toast.success(t("resetPassword.resend_success"), {
          position: "top-right",
          autoClose: 3000,
        })
      })
      .catch((error) => {
        console.log("Reset error:", error)
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
        })
      })
  }

  // Focus first input on mount
  useEffect(() => {
    const firstInput = inputRefs.current[0]
    if (firstInput) {
      firstInput.focus()
    }
  }, [])

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-4 px-4 transition-colors duration-200 ${themeClasses.container}`}
    >
      <div
        className={`p-6 sm:p-8 rounded-2xl max-w-md w-full transition-all duration-200 ${themeClasses.card}`}
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${themeClasses.iconContainer}`}
            >
              <svg
                className="w-10 h-10 transition-colors duration-300"
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
          <h1
            className={`text-2xl font-bold mb-2 transition-colors duration-200 ${themeClasses.title}`}
          >
            {t("reset_title")}
          </h1>
          <p
            className={`text-sm transition-colors duration-200 ${themeClasses.subtitle}`}
          >
            {t("reset_description", {
              identifier: identifier.replace(/(.{3}).*(@.*)/, "$1***$2"),
            })}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Enhanced Token Input */}
          <div className="group">
            <label
              className={`block text-sm font-medium mb-3 transition-colors duration-200 ${themeClasses.label}`}
            >
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
                    inputRefs.current[index] = el
                  }}
                  type="tel"
                  maxLength={1}
                  value={data}
                  placeholder="•"
                  onChange={(e) => handleTokenChange(e.target, index)}
                  onKeyDown={(e) => handleTokenKeyDown(e, index)}
                  onFocus={(e) => {
                    e.target.select()
                    setFocusedIndex(index)
                  }}
                  onBlur={() => {
                    setFocusedIndex(-1)
                    handleTokenBlur()
                  }}
                  className={getTokenClasses(index, data)}
                />
              ))}
            </div>
            {formik.touched.token && formik.errors.token && (
              <p
                className={`text-sm mt-1 animate-in slide-in-from-top-1 duration-200 ${themeClasses.error}`}
              >
                {formik.errors.token}
              </p>
            )}

            {/* Token completion indicator */}
            {token.join("").length === 6 && !formik.errors.token && (
              <div className="flex justify-center items-center mt-2">
                <div
                  className={`flex items-center text-sm animate-in slide-in-from-bottom-1 duration-300 ${themeClasses.success}`}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Code complete
                </div>
              </div>
            )}
          </div>

          {/* Enhanced New Password */}
          {/* Enhanced New Password */}
          <div className="space-y-2 group">
            <label
              htmlFor="newPassword"
              className={`block text-sm font-medium transition-colors duration-200 ${themeClasses.label}`}
            >
              {t("new_password")}
            </label>

            <div className="flex items-center space-x-2">
              {/* Lock Icon Container - Completely separate from input */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${getIconClasses(
                  getIconState(
                    "newPassword",
                    formik.values.newPassword,
                    focusedField === "newPassword",
                    formik.errors.newPassword && formik.touched.newPassword
                  )
                )} ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? `${themeClasses.input} ${themeClasses.inputError}`
                    : themeClasses.input
                }`}
              >
                <LockIcon />
              </div>

              {/* Input Container */}
              <div className="relative flex-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onFocus={() => setFocusedField("newPassword")}
                  onBlur={() => {
                    setFocusedField(null)
                    formik.handleBlur
                  }}
                  placeholder={t("new_password_placeholder")}
                  className={`w-[95%] pl-4 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 group-focus-within:shadow-sm ${
                    formik.touched.newPassword && formik.errors.newPassword
                      ? `${themeClasses.input} ${themeClasses.inputError}`
                      : themeClasses.input
                  }`}
                />

                {/* Eye toggle button - stays inside input */}
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute inset-y-0 left-[100%] pr-3 flex items-center transition-all duration-200 z-10 ${
                    focusedField === "newPassword"
                      ? themeClasses.iconFocused
                      : themeClasses.iconDefault
                  } ${
                    themeClasses.iconHover
                  } hover:scale-110 focus:outline-none focus:scale-110`}
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>

                {/* Field state indicator */}
                {formik.values.newPassword && !formik.errors.newPassword && (
                  <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                    <div
                      className={`w-1.5 h-1.5 rounded-full animate-pulse ${themeClasses.iconFocused}`}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {formik.touched.newPassword && formik.errors.newPassword && (
              <p
                className={`text-sm mt-1 animate-in slide-in-from-top-1 duration-200 ${themeClasses.error}`}
              >
                {formik.errors.newPassword}
              </p>
            )}
          </div>

          {/* Enhanced Confirm Password */}
          <div className="space-y-2 group">
            <label
              htmlFor="confirmNewPassword"
              className={`block text-sm font-medium transition-colors duration-200 ${themeClasses.label}`}
            >
              {t("confirm_password")}
            </label>

            <div className="flex items-center space-x-2">
              {/* Shield Icon Container - Completely separate from input */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${getIconClasses(
                  getIconState(
                    "confirmNewPassword",
                    formik.values.confirmNewPassword,
                    focusedField === "confirmNewPassword",
                    formik.errors.confirmNewPassword &&
                      formik.touched.confirmNewPassword
                  )
                )} ${
                  formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword
                    ? `${themeClasses.input} ${themeClasses.inputError}`
                    : themeClasses.input
                }`}
              >
                <ShieldCheckIcon />
              </div>

              {/* Input Container */}
              <div className="relative flex-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={formik.values.confirmNewPassword}
                  onChange={formik.handleChange}
                  onFocus={() => setFocusedField("confirmNewPassword")}
                  onBlur={() => {
                    setFocusedField(null)
                    formik.handleBlur
                  }}
                  placeholder={t("confirm_password_placeholder")}
                  className={`w-[95%] pl-4 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 group-focus-within:shadow-sm ${
                    formik.touched.confirmNewPassword &&
                    formik.errors.confirmNewPassword
                      ? `${themeClasses.input} ${themeClasses.inputError}`
                      : themeClasses.input
                  }`}
                />

                {/* Eye toggle button - stays inside input */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 left-[100%] pr-3 flex items-center transition-all duration-200 z-10 ${
                    focusedField === "confirmNewPassword"
                      ? themeClasses.iconFocused
                      : themeClasses.iconDefault
                  } ${
                    themeClasses.iconHover
                  } hover:scale-110 focus:outline-none focus:scale-110`}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>

                {/* Password match indicator */}
                {formik.values.confirmNewPassword &&
                  formik.values.newPassword && (
                    <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                      {formik.values.confirmNewPassword ===
                      formik.values.newPassword ? (
                        <div
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${themeClasses.success}`}
                        ></div>
                      ) : (
                        <div
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${themeClasses.warning}`}
                        ></div>
                      )}
                    </div>
                  )}
              </div>
            </div>

            {formik.touched.confirmNewPassword &&
              formik.errors.confirmNewPassword && (
                <p
                  className={`text-sm mt-1 animate-in slide-in-from-top-1 duration-200 ${themeClasses.error}`}
                >
                  {formik.errors.confirmNewPassword}
                </p>
              )}
          </div>

          {/* Enhanced Submit Button */}
          <button
            type="submit"
            disabled={loadingAuth || formik.isSubmitting}
            className={`w-full disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${themeClasses.button}`}
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

          {/* Enhanced Resend Code */}
          <div className="text-center">
            <p
              className={`text-sm transition-colors duration-200 ${themeClasses.subtitle}`}
            >
              {t("resend_info")}{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loadingAuth}
                className={`font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 hover:scale-105 inline-block hover:underline ${themeClasses.link}`}
              >
                {t("resend_code")}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
