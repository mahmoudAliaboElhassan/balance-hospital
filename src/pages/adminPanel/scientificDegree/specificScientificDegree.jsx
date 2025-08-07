import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getScientificDegreeById } from "../../../state/act/actScientificDegree";
import {
  clearSingleScientificDegree,
  clearSingleScientificDegreeError,
} from "../../../state/slices/scientificDegree";
import LoadingGetData from "../../../components/LoadingGetData";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  User,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Mail,
  Phone,
  Shield,
  Hash,
  Info,
} from "lucide-react";

function SpecificScientificDegree() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedScientificDegree,
    loadingGetSingleScientificDegree,
    singleScientificDegreeError,
  } = useSelector((state) => state.scientificDegree);

  const { mymode } = useSelector((state) => state.mode);
  const { t, i18n } = useTranslation();

  // Get current language direction
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (id) {
      dispatch(clearSingleScientificDegree());
      dispatch(getScientificDegreeById(id));
    }

    return () => {
      dispatch(clearSingleScientificDegree());
      dispatch(clearSingleScientificDegreeError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (singleScientificDegreeError) {
      if (singleScientificDegreeError.status === 404) {
        console.error("Scientific Degree not found");
      } else if (singleScientificDegreeError.status === 403) {
        console.error("Access denied");
      }
    }
  }, [singleScientificDegreeError, navigate]);

  // Get scientific degree name based on current language
  const getScientificDegreeName = () => {
    if (!selectedScientificDegree) return "";
    return currentLang === "en"
      ? selectedScientificDegree.nameEnglish
      : selectedScientificDegree.nameArabic;
  };

  // Get scientific degree secondary name (opposite language)
  const getScientificDegreeSecondaryName = () => {
    if (!selectedScientificDegree) return "";
    return currentLang === "en"
      ? selectedScientificDegree.nameArabic
      : selectedScientificDegree.nameEnglish;
  };

  // Get user name based on current language
  const getUserName = (user) => {
    if (!user) return "";
    return currentLang === "en" ? user.nameEnglish : user.nameArabic;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loadingGetSingleScientificDegree) {
    return <LoadingGetData text={t("gettingData.scientificDegreeData")} />;
  }

  if (singleScientificDegreeError) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <div
                className={`text-lg mb-4 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                {currentLang === "en"
                  ? singleScientificDegreeError?.messageEn ||
                    "Error loading scientific degree data"
                  : singleScientificDegreeError?.messageAr ||
                    "حدث خطأ أثناء تحميل بيانات الدرجة العلمية"}
              </div>
              <Link
                to="/admin-panel/scientific-degrees"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("scientificDegrees.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedScientificDegree) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <div
                className={`text-lg mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("scientificDegrees.notFound")}
              </div>
              <Link
                to="/admin-panel/scientific-degrees"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("scientificDegrees.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/admin-panel/scientific-degrees"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("scientificDegrees.backToList")}
              </span>
            </Link>

            <Link
              to={`/admin-panel/scientific-degrees/edit/${selectedScientificDegree.id}`}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center">
                <Edit size={16} className={`${isRTL ? "ml-2" : "mr-2"}`} />
                {t("scientificDegrees.actions.edit")}
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-blue-100"
              } rounded-lg`}
            >
              <FileText
                className={`h-8 w-8 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {getScientificDegreeName()}
              </h1>
              {/* <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {getScientificDegreeSecondaryName()}
              </p> */}
              {selectedScientificDegree.code && (
                <div className="flex items-center mt-2">
                  <Hash
                    className={`h-4 w-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } ${isRTL ? "ml-1" : "mr-1"}`}
                  />
                  <span
                    className={`text-sm font-mono px-2 py-1 rounded ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedScientificDegree.code}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6 flex items-center`}
              >
                <Info
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("scientificDegrees.details.basicInfo")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("scientificDegrees.form.nameArabic")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                    dir="rtl"
                  >
                    {selectedScientificDegree.nameArabic}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("scientificDegrees.form.nameEnglish")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                    dir="ltr"
                  >
                    {selectedScientificDegree.nameEnglish}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("scientificDegrees.details.code")}
                  </label>
                  <p
                    className={`text-base font-mono ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedScientificDegree.code || "-"}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("scientificDegrees.table.status")}
                  </label>
                  <div className="flex items-center">
                    {selectedScientificDegree.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded-full ${
                        selectedScientificDegree.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {selectedScientificDegree.isActive
                        ? t("scientificDegrees.status.active")
                        : t("scientificDegrees.status.inactive")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Associated Users */}
            {selectedScientificDegree.users &&
              selectedScientificDegree.users.length > 0 && (
                <div
                  className={`${
                    isDark ? "bg-gray-800" : "bg-white"
                  } rounded-lg shadow-sm border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } p-6`}
                >
                  <h2
                    className={`text-xl font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    } mb-6 flex items-center`}
                  >
                    <Users
                      className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    {t("scientificDegrees.details.associatedUsers")}
                  </h2>

                  <div className="space-y-4">
                    {selectedScientificDegree.users.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className={`p-4 border rounded-lg ${
                          isDark
                            ? "border-gray-600 bg-gray-700"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <User
                              className={`h-5 w-5 ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              } ${isRTL ? "ml-3" : "mr-3"}`}
                            />
                            <div>
                              <h4
                                className={`font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {getUserName(user)}
                              </h4>
                              <div className="flex items-center mt-1 space-x-4">
                                {user.email && (
                                  <div className="flex items-center">
                                    <Mail
                                      className={`h-4 w-4 ${
                                        isDark
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      } ${isRTL ? "ml-1" : "mr-1"}`}
                                    />
                                    <span
                                      className={`text-sm ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {user.email}
                                    </span>
                                  </div>
                                )}
                                {user.mobile && (
                                  <div className="flex items-center">
                                    <Phone
                                      className={`h-4 w-4 ${
                                        isDark
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      } ${isRTL ? "ml-1" : "mr-1"}`}
                                    />
                                    <span
                                      className={`text-sm ${
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {user.mobile}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {user.role && (
                            <div className="flex items-center">
                              <Shield
                                className={`h-4 w-4 ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                } ${isRTL ? "ml-1" : "mr-1"}`}
                              />
                              <span
                                className={`text-sm px-2 py-1 rounded ${
                                  isDark
                                    ? "bg-gray-600 text-gray-300"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {user.role}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {selectedScientificDegree.usersCount > 5 && (
                      <div
                        className={`text-center py-3 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("scientificDegrees.details.andMoreUsers", {
                          count: selectedScientificDegree.usersCount - 5,
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4 flex items-center`}
              >
                <Users
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("scientificDegrees.details.statistics")}
              </h3>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-blue-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {t("scientificDegrees.table.users")}
                    </span>
                    <span
                      className={`text-2xl font-bold ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {selectedScientificDegree.usersCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4 flex items-center`}
              >
                <Clock
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("scientificDegrees.details.auditInfo")}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("scientificDegrees.details.createdAt")}
                  </label>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {formatDate(selectedScientificDegree.createdAt)}
                  </p>
                </div>

                {selectedScientificDegree.createdByUser && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("scientificDegrees.details.createdBy")}
                    </label>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {getUserName(selectedScientificDegree.createdByUser)}
                    </p>
                  </div>
                )}

                {selectedScientificDegree.updatedAt && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("scientificDegrees.details.updatedAt")}
                    </label>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {formatDate(selectedScientificDegree.updatedAt)}
                    </p>
                  </div>
                )}

                {selectedScientificDegree.updatedByUser && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("scientificDegrees.details.updatedBy")}
                    </label>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {getUserName(selectedScientificDegree.updatedByUser)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecificScientificDegree;
