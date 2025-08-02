import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getContractingTypeById } from "../../../state/act/actContractingType";
import {
  clearSingleContractingType,
  clearSingleContractingTypeError,
} from "../../../state/slices/contractingType";
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

function SpecificContractingType() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedContractingType,
    loadingGetSingleContractingType,
    singleContractingTypeError,
  } = useSelector((state) => state.contractingType);

  const { mymode } = useSelector((state) => state.mode);
  const { t, i18n } = useTranslation();

  // Get current language direction
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "ar";
  const isDark = mymode === "dark";

  useEffect(() => {
    if (id) {
      dispatch(clearSingleContractingType());
      dispatch(getContractingTypeById(id));
    }

    return () => {
      dispatch(clearSingleContractingType());
      dispatch(clearSingleContractingTypeError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (singleContractingTypeError) {
      if (singleContractingTypeError.status === 404) {
        console.error("ContractingType not found");
      } else if (singleContractingTypeError.status === 403) {
        console.error("Access denied");
      }
    }
  }, [singleContractingTypeError, navigate]);

  // Get contracting type name based on current language
  const getContractingTypeName = () => {
    if (!selectedContractingType) return "";
    return currentLang === "en"
      ? selectedContractingType.nameEnglish
      : selectedContractingType.nameArabic;
  };

  // Get contracting type secondary name (opposite language)
  const getContractingTypeSecondaryName = () => {
    if (!selectedContractingType) return "";
    return currentLang === "en"
      ? selectedContractingType.nameArabic
      : selectedContractingType.nameEnglish;
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
    return date.toLocaleDateString(currentLang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loadingGetSingleContractingType) return <LoadingGetData />;

  if (singleContractingTypeError) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">
                {singleContractingTypeError?.message ||
                  t("contractingTypes.fetchError")}
              </div>
              <Link
                to="/admin-panel/contracting-types"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("contractingTypes.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedContractingType) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">
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
                {t("contractingTypes.notFound")}
              </div>
              <Link
                to="/admin-panel/contracting-type"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("contractingTypes.backToList")}
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
              to="/admin-panel/contracting-types"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("contractingTypes.backToList")}
              </span>
            </Link>

            <Link
              to={`/admin-panel/contracting-types/edit/${selectedContractingType.id}`}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center">
                <Edit size={16} className={`${isRTL ? "ml-2" : "mr-2"}`} />
                {t("contractingTypes.actions.edit")}
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
                {getContractingTypeName()}
              </h1>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {getContractingTypeSecondaryName()}
              </p>
              {selectedContractingType.code && (
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
                    {selectedContractingType.code}
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
                {t("contractingTypes.details.basicInfo")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("contractingTypes.form.nameArabic")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                    dir="rtl"
                  >
                    {selectedContractingType.nameArabic}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("contractingTypes.form.nameEnglish")}
                  </label>
                  <p
                    className={`text-base ${
                      isDark ? "text-white" : "text-gray-900"
                    } font-medium`}
                    dir="ltr"
                  >
                    {selectedContractingType.nameEnglish}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("contractingTypes.form.maxHoursPerWeek")}
                  </label>
                  <div className="flex items-center">
                    <Clock
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                      size={18}
                    />
                    <span
                      className={`text-base ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {selectedContractingType.maxHoursPerWeek}{" "}
                      {t("contractingTypes.hoursPerWeek")}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("contractingTypes.form.allowOvertimeHours")}
                  </label>
                  <div className="flex items-center">
                    {selectedContractingType.allowOvertimeHours ? (
                      <CheckCircle
                        className={`text-green-500 ${isRTL ? "ml-2" : "mr-2"}`}
                        size={18}
                      />
                    ) : (
                      <XCircle
                        className={`text-red-500 ${isRTL ? "ml-2" : "mr-2"}`}
                        size={18}
                      />
                    )}
                    <span
                      className={`text-base ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {selectedContractingType.allowOvertimeHours
                        ? t("contractingTypes.overtime.allowed")
                        : t("contractingTypes.overtime.notAllowed")}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-2`}
                  >
                    {t("contractingTypes.table.status")}
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedContractingType.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {selectedContractingType.isActive ? (
                      <CheckCircle
                        size={14}
                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                      />
                    ) : (
                      <XCircle
                        size={14}
                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                      />
                    )}
                    {selectedContractingType.isActive
                      ? t("contractingTypes.status.active")
                      : t("contractingTypes.status.inactive")}
                  </span>
                </div>
              </div>
            </div>

            {/* Associated Users */}
            {selectedContractingType.users &&
              selectedContractingType.users.length > 0 && (
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
                    {t("contractingTypes.details.associatedUsers")}
                    <span
                      className={`${
                        isRTL ? "mr-2" : "ml-2"
                      } text-sm font-normal px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedContractingType.usersCount}
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedContractingType.users.slice(0, 6).map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center p-4 ${
                          isDark ? "bg-gray-700" : "bg-gray-50"
                        } rounded-lg border ${
                          isDark ? "border-gray-600" : "border-gray-200"
                        }`}
                      >
                        <div
                          className={`p-2 ${
                            isDark ? "bg-gray-600" : "bg-blue-100"
                          } rounded-full ${isRTL ? "ml-3" : "mr-3"}`}
                        >
                          <User
                            className={`h-4 w-4 ${
                              isDark ? "text-blue-400" : "text-blue-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            } truncate`}
                          >
                            {getUserName(user)}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center truncate">
                              <Mail
                                className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`}
                              />
                              {user.email}
                            </span>
                            <span className="flex items-center">
                              <Phone
                                className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`}
                              />
                              {user.mobile}
                            </span>
                          </div>
                          <span
                            className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                              isDark
                                ? "bg-gray-600 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            <Shield
                              className={`h-3 w-3 inline ${
                                isRTL ? "ml-1" : "mr-1"
                              }`}
                            />
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedContractingType.users.length > 6 && (
                    <div className="mt-4 text-center">
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {t("contractingTypes.details.andMoreUsers", {
                          count: selectedContractingType.users.length - 6,
                        })}
                      </p>
                    </div>
                  )}
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
                {t("contractingTypes.details.statistics")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="flex items-center">
                    <Users
                      className={`h-5 w-5 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      } ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.table.users")}
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-bold ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {selectedContractingType.usersCount}
                  </span>
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
                <Calendar
                  className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"} ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {t("contractingTypes.details.auditInfo")}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("contractingTypes.details.createdAt")}
                  </label>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {formatDate(selectedContractingType.createdAt)}
                  </p>
                </div>

                {selectedContractingType.createdByUser && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("contractingTypes.details.createdBy")}
                    </label>
                    <div className="flex items-center">
                      <User
                        className={`h-4 w-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {getUserName(selectedContractingType.createdByUser)}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {selectedContractingType.createdByUser.role} •{" "}
                      {selectedContractingType.createdByUser.email}
                    </p>
                  </div>
                )}
                {selectedContractingType.updatedAt && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("contractingTypes.details.updatedAt")}
                    </label>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatDate(selectedContractingType.updatedAt)}
                    </p>
                  </div>
                )}
                {selectedContractingType.updatedByUser && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("contractingTypes.details.updatedBy")}
                    </label>
                    <div className="flex items-center">
                      <User
                        className={`h-4 w-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {getUserName(selectedContractingType.updatedByUser)}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {selectedContractingType.updatedByUser.role} •{" "}
                      {selectedContractingType.updatedByUser.email}
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

export default SpecificContractingType;
