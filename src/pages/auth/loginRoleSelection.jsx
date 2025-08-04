import React from "react";
import { Shield, Users, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const LoginSelection = () => {
  const { t, i18n } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);

  const isDark = mymode === "dark";
  const language = i18n.language;
  const isRTL = language === "ar";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-300 ${
            isDark
              ? "bg-gray-800/90 border border-gray-700"
              : "bg-white/90 border border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? "bg-blue-900/50" : "bg-blue-100"
              }`}
            >
              <Shield
                className={`h-8 w-8 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <h1
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("loginSelection.welcomeBack")}
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("loginSelection.selectType")}
            </p>
          </div>

          {/* Login Options */}
          <div className="space-y-4">
            {/* Admin Login */}
            <Link
              to="/login"
              className={`group block w-full p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                isDark
                  ? "bg-gray-700/50 border-gray-600 hover:border-blue-500 hover:bg-gray-700"
                  : "bg-gray-50 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      isDark
                        ? "bg-red-900/30 group-hover:bg-red-900/50"
                        : "bg-red-100 group-hover:bg-red-200"
                    }`}
                  >
                    <Shield
                      className={`h-6 w-6 ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-lg ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("loginSelection.admin.title")}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("loginSelection.admin.description")}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
            </Link>

            {/* Department Head Login */}
            <Link
              to="/login"
              className={`group block w-full p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                isDark
                  ? "bg-gray-700/50 border-gray-600 hover:border-green-500 hover:bg-gray-700"
                  : "bg-gray-50 border-gray-200 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      isDark
                        ? "bg-green-900/30 group-hover:bg-green-900/50"
                        : "bg-green-100 group-hover:bg-green-200"
                    }`}
                  >
                    <Users
                      className={`h-6 w-6 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-lg ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("loginSelection.departmentHead.title")}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("loginSelection.departmentHead.description")}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {t("loginSelection.footerHelp")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
