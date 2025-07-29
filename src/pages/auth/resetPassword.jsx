import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [token, setToken] = useState(new Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [identifier] = useState("user@example.com"); // Simulating localStorage
  const inputRefs = useRef([]);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateToken = (tokenString) => {
    if (!tokenString) return t("code_required");
    if (tokenString.length !== 6 || !/^\d{6}$/.test(tokenString))
      return t("code_invalid");
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return t("password_required");
    if (password.length < 8) return t("password_min");
    if (!/(?=.*[a-z])/.test(password)) return t("password_lower");
    if (!/(?=.*[A-Z])/.test(password)) return t("password_upper");
    if (!/(?=.*\d)/.test(password)) return t("password_number");
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return t("confirm_required");
    if (confirmPassword !== password) return t("password_match");
    return "";
  };

  const validateForm = () => {
    const tokenString = token.join("");
    const newErrors = {
      token: validateToken(tokenString),
      newPassword: validatePassword(formData.newPassword),
      confirmNewPassword: validateConfirmPassword(
        formData.confirmNewPassword,
        formData.newPassword
      ),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleTokenChange = (element, index) => {
    if (isNaN(Number(element.value)) || element.value === " ") {
      element.value = "";
      return;
    }
    const newToken = [...token];
    newToken[index] = element.value;
    setToken(newToken);

    if (errors.token) {
      setErrors((prev) => ({ ...prev, token: "" }));
    }

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

    if (errors.token) {
      setErrors((prev) => ({ ...prev, token: "" }));
    }

    const lastFullInput = Math.min(pasteData.length - 1, 5);
    if (lastFullInput >= 0) {
      const targetInput = inputRefs.current[lastFullInput];
      if (targetInput) {
        targetInput.focus();
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInputBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let error = "";
    if (name === "newPassword") {
      error = validatePassword(formData.newPassword);
    } else if (name === "confirmNewPassword") {
      error = validateConfirmPassword(
        formData.confirmNewPassword,
        formData.newPassword
      );
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleTokenBlur = () => {
    setTouched((prev) => ({ ...prev, token: true }));
    const tokenString = token.join("");
    const error = validateToken(tokenString);
    setErrors((prev) => ({ ...prev, token: error }));
  };

  const handleSubmit = () => {
    setTouched({ token: true, newPassword: true, confirmNewPassword: true });

    if (validateForm()) {
      const tokenString = token.join("");
      console.log("Form submitted with values:", {
        token: tokenString,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
        identifier,
      });
      alert(t("success_message"));
    }
  };

  const isFormValid = () => {
    const tokenString = token.join("");
    return (
      tokenString.length === 6 &&
      formData.newPassword &&
      formData.confirmNewPassword &&
      !validateToken(tokenString) &&
      !validatePassword(formData.newPassword) &&
      !validateConfirmPassword(
        formData.confirmNewPassword,
        formData.newPassword
      )
    );
  };

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

        <div className="space-y-6">
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
                        : touched.token && errors.token
                        ? "border-2 border-red-500"
                        : "border border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
                />
              ))}
            </div>
            {touched.token && errors.token && (
              <p className="text-red-500 text-sm mt-1">{errors.token}</p>
            )}
          </div>

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
              value={formData.newPassword}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={t("new_password_placeholder")}
              className={`w-full px-3 py-3 border rounded-lg bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched.newPassword && errors.newPassword
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {touched.newPassword && errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

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
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={t("confirm_password_placeholder")}
              className={`w-full px-3 py-3 border rounded-lg bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched.confirmNewPassword && errors.confirmNewPassword
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {touched.confirmNewPassword && errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          <button
            type="button"
            // disabled={!isFormValid()}
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {t("submit-reset")}
          </button>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              {t("resend_info")}{" "}
              <button
                type="button"
                onClick={() => {
                  setToken(new Array(6).fill(""));
                  setErrors((prev) => ({ ...prev, token: "" }));
                  alert("Code resent");
                }}
                className="text-blue-600 dark:text-blue-500 hover:underline font-semibold"
              >
                {t("resend_code")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
