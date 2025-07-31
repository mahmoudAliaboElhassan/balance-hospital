import { useTranslation } from "react-i18next";

function LoadingGetData() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-300 text-lg font-medium">
            {t("loading")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingGetData;
