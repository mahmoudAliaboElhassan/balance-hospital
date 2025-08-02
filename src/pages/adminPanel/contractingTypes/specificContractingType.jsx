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
  Building,
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
                {currentLang === "ar"
                  ? singleContractingTypeError?.messageAr ||
                    "حدث خطأ أثناء تحميل بيانات نوع التعاقد"
                  : singleContractingTypeError?.messageEn ||
                    "Error loading contracting type data"}
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

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-4xl mx-auto">
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
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} className={`${isRTL ? "ml-2" : "mr-2"}`} />
              {t("contractingTypes.actions.edit")}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
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
                } mb-4`}
              >
                {t("contractingTypes.details.basicInfo")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("contractingTypes.form.nameArabic")}
                  </label>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                    dir="rtl"
                  >
                    {selectedContractingType.nameArabic}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("contractingTypes.form.nameEnglish")}
                  </label>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                    dir="ltr"
                  >
                    {selectedContractingType.nameEnglish}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("contractingTypes.form.maxHoursPerWeek")}
                  </label>
                  <div className="flex items-center">
                    <Clock
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mr-2`}
                      size={16}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
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
                    } mb-1`}
                  >
                    {t("contractingTypes.form.allowOvertimeHours")}
                  </label>
                  <div className="flex items-center">
                    {selectedContractingType.allowOvertimeHours ? (
                      <CheckCircle className="text-green-500 mr-2" size={16} />
                    ) : (
                      <XCircle className="text-red-500 mr-2" size={16} />
                    )}
                    <span
                      className={`text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedContractingType.allowOvertimeHours
                        ? t("contractingTypes.overtime.allowed")
                        : t("contractingTypes.overtime.notAllowed")}
                    </span>
                  </div>
                </div>

                {selectedContractingType.code && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("contractingTypes.details.code")}
                    </label>
                    <p
                      className={`text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      } font-mono bg-gray-100 px-2 py-1 rounded`}
                    >
                      {selectedContractingType.code}
                    </p>
                  </div>
                )}

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    } mb-1`}
                  >
                    {t("contractingTypes.table.status")}
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedContractingType.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
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
                    } mb-4`}
                  >
                    {t("contractingTypes.details.associatedUsers")}
                  </h2>

                  <div className="space-y-3">
                    {selectedContractingType.users.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 ${
                          isDark ? "bg-gray-700" : "bg-gray-50"
                        } rounded-lg`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 ${
                              isDark ? "bg-gray-600" : "bg-blue-100"
                            } rounded-full`}
                          >
                            <User
                              className={`h-4 w-4 ${
                                isDark ? "text-blue-400" : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {getUserName(user)}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {user.mobile}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDark
                              ? "bg-gray-600 text-gray-300"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    ))}

                    {selectedContractingType.users.length > 5 && (
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        } text-center pt-2`}
                      >
                        {t("contractingTypes.details.andMoreUsers", {
                          count: selectedContractingType.users.length - 5,
                        })}
                      </p>
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
                } mb-4`}
              >
                {t("contractingTypes.details.statistics")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users
                      className={`h-5 w-5 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mr-2`}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {t("contractingTypes.table.users")}
                    </span>
                  </div>
                  <span
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
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
                } mb-4`}
              >
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
                    <p
                      className={`text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {getUserName(selectedContractingType.createdByUser)}
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
                    <p
                      className={`text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {getUserName(selectedContractingType.updatedByUser)}
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
