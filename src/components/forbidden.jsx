import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Forbidden() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white border border-red-200 rounded-lg shadow-lg max-w-md">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          {t("messages.error.accessDenied") || "Access Denied"}
        </h2>
        <p className="text-red-600 mb-4">
          {t("messages.error.insufficientPermissions") ||
            "You do not have permission to access this page."}
        </p>
        <button
          onClick={() => navigate("/admin-panel", { replace: true })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t("common.backToHome") || "Back to Home"}
        </button>
      </div>
    </div>
  );
}

export default Forbidden;
