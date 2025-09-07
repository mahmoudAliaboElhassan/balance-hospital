import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategoryById } from "../../../state/act/actCategory";
import {
  clearSingleCategory,
  clearSingleCategoryError,
  getCategoryPendingRequests,
  setCategoryPendingRequestsCurrentPage,
  setCategoryPendingRequestsPageSize,
  setCategoryPendingRequestsStatusFilter,
  clearCategoryPendingRequestsError,
  clearCategoryPendingRequests,
  approveDoctorRequest,
  clearApprovalSuccess,
  rejectDoctorRequest,
  clearApprovalError,
} from "../../../state/slices/category";
import { getDepartments } from "../../../state/act/actDepartment";
import LoadingGetData from "../../../components/LoadingGetData";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import {
  Building,
  Users,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  FileText,
  BarChart3,
  Clock,
  Mail,
  Phone,
  Award,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  Filter,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getRosterByCategory } from "../../../state/act/actRosterManagement";
import ModalUpdateRosterStatus from "../../../components/ModalUpdateRosterStatus";
import "../../../styles/general.css";
import { toast } from "react-toastify";

const SpecificCategory = () => {
  const { catId: id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState({
    id: null,
    title: "",
    currentStatus: "",
  });
  const [showMobileRosterTable, setShowMobileRosterTable] = useState(false);
  const [showPendingDoctors, setShowPendingDoctors] = useState(true);

  // Local filters for pending doctors
  const [localFilters, setLocalFilters] = useState({
    status: "",
  });

  const formatMonthYear = (month, year) => {
    const monthNames = {
      ar: [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
      en: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };

    const months = monthNames[currentLang] || monthNames.en;
    return `${months[month - 1]} ${year}`;
  };

  const { selectedCategory, loadingGetSingleCategory, singleCategoryError } =
    useSelector((state) => state.category);

  // Pending doctors selectors
  const {
    categoryPendingRequests,
    categoryPendingRequestsPagination: pagination,
    categoryPendingRequestsError: pendingError,
    loadingGetCategoryPendingRequests: loadingPending,
    categoryPendingRequestsFilters: filters,
    loadingApproveRequest,
    loadingRejectRequest,
    approvalError,
    approvalSuccess,
    approvalMessage,
  } = useSelector((state) => state.category);

  const { rosterList, loading } = useSelector(
    (state) => state.rosterManagement
  );

  // Get departments from the department slice
  const { departments, loadingGetDepartments } = useSelector(
    (state) => state.department
  );

  // Get mode and translation function
  const { mymode } = useSelector((state) => state.mode);
  const { t } = useTranslation();

  // Get current language direction and theme
  const isRTL = mymode === "ar";
  const currentLang = i18next.language;
  const isDark = mymode === "dark";

  const getStatusInfo = (status) => {
    const statusMap = {
      DRAFT_BASIC: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        name: t("roster.status.draftBasic"),
      },
      DRAFT_PARTIAL: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        name: t("roster.status.draftPartial"),
      },
      DRAFT: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        name: t("roster.status.draft"),
      },
      DRAFT_READY: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        name: t("roster.status.draftReady"),
      },
      PUBLISHED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        name: t("roster.status.published"),
      },
      CLOSED: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        name: t("roster.status.closed"),
      },
      ARCHIVED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        name: t("roster.status.archived"),
      },
    };

    return (
      statusMap[status] || {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        name: status,
      }
    );
  };

  // Get status configuration for pending doctors
  const getPendingStatusConfig = (status) => {
    const configs = {
      Pending: {
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: t("pendingDoctorRequests.status.pending"),
        icon: Clock,
      },
      Approved: {
        className: "bg-green-100 text-green-800 border-green-200",
        text: t("pendingDoctorRequests.status.approved"),
        icon: Check,
      },
    };

    return (
      configs[status] || {
        className: "bg-gray-100 text-gray-800 border-gray-200",
        text: status,
        icon: AlertCircle,
      }
    );
  };

  // Render status badge for pending doctors
  const renderPendingStatusBadge = (status) => {
    const config = getPendingStatusConfig(status);
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${config.className}`}
      >
        <IconComponent className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  // Format date for pending doctors
  const formatPendingDate = (dateString) => {
    if (!dateString) return t("pendingDoctorRequests.fields.notSpecified");

    try {
      const locale = currentLang === "ar" ? "ar-EG" : "en-US";
      return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return t("pendingDoctorRequests.fields.invalidDate");
    }
  };

  // Handle pending doctor actions
  const handleApproveRequest = (userId) => {
    dispatch(approveDoctorRequest({ userId }))
      .unwrap()
      .then(() => {
        toast.success(t("pendingDoctorRequests.messages.approvalSuccess"));
        setLocalFilters((prev) => ({ ...prev, status: "" }));
        dispatch(setCategoryPendingRequestsStatusFilter({ status: "" }));
      })
      .catch((error) => {
        toast.error(
          error.message || t("pendingDoctorRequests.errors.approvalError")
        );
      });
  };

  const handleRejectRequest = (userId) => {
    dispatch(rejectDoctorRequest({ userId }))
      .unwrap()
      .then(() => {
        toast.success(t("pendingDoctorRequests.messages.rejectionSuccess"));
        setLocalFilters((prev) => ({ ...prev, status: "" }));
        dispatch(setCategoryPendingRequestsStatusFilter({ status: "" }));
      })
      .catch((error) => {
        toast.error(
          error.message || t("pendingDoctorRequests.errors.rejectionError")
        );
      });
  };

  // Handle status filter change for pending doctors
  const handlePendingStatusChange = (status) => {
    setLocalFilters((prev) => ({ ...prev, status }));
    dispatch(setCategoryPendingRequestsStatusFilter(status));
  };

  // Handle pagination for pending doctors
  const handlePendingPageChange = (page) => {
    dispatch(setCategoryPendingRequestsCurrentPage(page));
  };

  const handlePendingPageSizeChange = (pageSize) => {
    dispatch(setCategoryPendingRequestsPageSize(pageSize));
  };

  // Handle refresh pending doctors
  const handleRefreshPendingDoctors = () => {
    if (id && !isNaN(id)) {
      dispatch(
        getCategoryPendingRequests({
          categoryId: id,
          filters,
        })
      );
    }
  };

  useEffect(() => {
    if (id) {
      // Clear previous data before fetching
      dispatch(clearSingleCategory());
      dispatch(getCategoryById({ categoryId: id }))
        .unwrap()
        .then((response) => {
          localStorage.setItem("categoryId", response.data.id);
          localStorage.setItem(
            "categoryEnglishName",
            response.data.nameEnglish
          );
          localStorage.setItem("categoryArabicName", response.data.nameArabic);
        });
      // Fetch departments for this specific category
      dispatch(getDepartments({ categoryId: id }));
      dispatch(getRosterByCategory({ categoryId: id }));

      // Fetch pending doctors for this category
      dispatch(
        getCategoryPendingRequests({ categoryId: id, filters: { status: "" } })
      );
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSingleCategory());
      dispatch(clearSingleCategoryError());
      dispatch(clearCategoryPendingRequests());
      dispatch(clearApprovalSuccess());
      dispatch(clearApprovalError());
    };
  }, [dispatch, id]);

  // Fetch pending doctors when filters change
  useEffect(() => {
    if (id && !isNaN(id)) {
      dispatch(
        getCategoryPendingRequests({
          categoryId: id,
          filters,
        })
      );
    }
  }, [dispatch, id, filters]);

  // Handle approval success
  useEffect(() => {
    if (approvalSuccess) {
      console.log(approvalMessage || "Request processed successfully");
      const timer = setTimeout(() => {
        dispatch(clearApprovalSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [approvalSuccess, approvalMessage, dispatch]);

  // Handle error cases
  useEffect(() => {
    if (singleCategoryError) {
      if (singleCategoryError.status === 404) {
        console.error("Category not found");
      } else if (singleCategoryError.status === 403) {
        console.error("Access denied");
      }
    }
  }, [singleCategoryError, navigate]);

  // Get category name based on current language
  const getCategoryName = () => {
    if (!selectedCategory) return "";
    return currentLang === "en"
      ? selectedCategory.nameEnglish
      : selectedCategory.nameArabic;
  };

  // Get category secondary name (opposite language)
  const getCategorySecondaryName = () => {
    if (!selectedCategory) return "";
    return currentLang === "en"
      ? selectedCategory.nameArabic
      : selectedCategory.nameEnglish;
  };

  // Format date based on language
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = currentLang === "en" ? "en-US" : "ar-EG";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString(locale, options);
  };

  // Handle create department for this category
  const handleCreateDepartment = () => {
    if (selectedCategory) {
      // Save category information to localStorage
      localStorage.setItem("categoryId", selectedCategory.id);
      localStorage.setItem("categoryEnglishName", selectedCategory.nameEnglish);
      localStorage.setItem("categoryArabicName", selectedCategory.nameArabic);

      // Navigate to create department page
      navigate("/admin-panel/department/create-specific");
    }
  };

  // Render action buttons for pending doctors
  const renderPendingActionButtons = (request) => {
    const isProcessing = loadingApproveRequest || loadingRejectRequest;

    return (
      <div className="flex gap-2">
        {/* Show Approve button for Pending and Rejected status */}
        {(request.status === "Pending" || request.status === "Rejected") && (
          <button
            onClick={() => handleApproveRequest(request.userId)}
            disabled={isProcessing}
            className="flex-1 inline-flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {t("pendingDoctorRequests.requestCard.actions.approve")}
          </button>
        )}

        {/* Show Reject button for Pending and Approved status */}
        {(request.status === "Pending" || request.status === "Approved") && (
          <button
            onClick={() => handleRejectRequest(request.userId)}
            disabled={isProcessing}
            className="flex-1 inline-flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            {t("pendingDoctorRequests.requestCard.actions.reject")}
          </button>
        )}
      </div>
    );
  };

  // Status filter options for pending doctors
  const statusFilterOptions = [
    {
      value: "",
      label: t("pendingDoctorRequests.filters.statusOptions.all"),
    },
    {
      value: "Pending",
      label: t("pendingDoctorRequests.filters.statusOptions.pending"),
    },
    {
      value: "Approved",
      label: t("pendingDoctorRequests.filters.statusOptions.approved"),
    },
  ];

  // Department Card Component
  const DepartmentCard = ({ department }) => (
    <div
      className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3
            className={`font-bold text-lg mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {currentLang === "en"
              ? department.nameEnglish
              : department.nameArabic}
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {currentLang === "en"
              ? department.nameArabic
              : department.nameEnglish}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            department.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {department.isActive
            ? t("department.status.active")
            : t("department.status.inactive")}
        </span>
      </div>

      {department.location && (
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-gray-500" />
          <span
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {department.location}
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Building size={16} className="text-blue-500" />
          </div>
          <div
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {department.subDepartmentsCount || 0}
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("department.table.subDepartments")}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="text-green-500" />
          </div>
          <div
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {department.doctorsCount || 0}
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("department.table.doctors")}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar size={16} className="text-purple-500" />
          </div>
          <div
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {department.pendingRequestsCount || 0}
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("department.table.pendingRequests")}
          </div>
        </div>
      </div>

      <div
        className={`flex items-center justify-between pt-4 border-t ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          {formatDate(department.createdAt)}
        </div>
        <div className="flex gap-2">
          <Link to={`/admin-panel/department/${department.id}`}>
            <button
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title={t("department.actions.view")}
            >
              <Eye size={16} />
            </button>
          </Link>
          <Link to={`/admin-panel/department/edit/${department.id}`}>
            <button
              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              title={t("department.actions.edit")}
            >
              <Edit size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  // Roster Card Component for Mobile
  const RosterCard = ({ roster }) => {
    const statusInfo = getStatusInfo(roster.status);

    return (
      <div
        className={`p-4 rounded-lg border mb-3 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3
              className={`font-semibold text-lg mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {roster.title}
            </h3>
            <p
              className={`text-sm mb-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {formatMonthYear(roster.month, roster.year)}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Users size={12} />
              <span>
                {roster.departmentsCount} {t("roster.departments")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>
                {roster.totalDays} {t("roster.dayss")}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setStatusToUpdate({
                id: roster.id,
                title: roster.title,
                currentStatus: roster.status,
              });
              setStatusModalOpen(true);
            }}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 cursor-pointer ${statusInfo.color}`}
            title={t("roster.actions.updateStatus")}
          >
            {statusInfo.name}
          </button>
        </div>

        <div className="flex gap-2 justify-end">
          <Link to={`/admin-panel/rosters/${roster.id}`}>
            <button
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
              title={t("roster.actions.view")}
            >
              <Eye size={16} />
            </button>
          </Link>

          <button
            className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900 rounded-lg transition-colors"
            title={t("roster.actions.updateStatus")}
            onClick={() => {
              setStatusToUpdate({
                id: roster.id,
                title: roster.title,
                currentStatus: roster.status,
              });
              setStatusModalOpen(true);
            }}
          >
            <BarChart3 size={16} />
          </button>
          <Link to={`/admin-panel/rosters/${roster.id}/edit`}>
            <button
              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
              title={t("roster.actions.edit")}
            >
              <Edit size={16} />
            </button>
          </Link>
        </div>
      </div>
    );
  };

  // Loading Component
  if (loadingGetSingleCategory) {
    return <LoadingGetData text={t("gettingData.categoryData")} />;
  }

  // Error Component
  if (singleCategoryError) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-red-50 to-pink-100"
        } p-6`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 text-center`}
          >
            <div
              className={`w-20 h-20 ${
                isDark ? "bg-red-900/30" : "bg-red-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("specificCategory.error.title")}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {singleCategoryError.message}
            </p>
            <button
              onClick={() => navigate("/admin-panel/categories")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("specificCategory.error.backToCategories")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found Component
  if (!selectedCategory) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-gray-50 to-gray-100"
        } p-6`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 text-center`}
          >
            <div
              className={`w-20 h-20 ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <svg
                className="w-10 h-10 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.664-2.226M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("specificCategory.notFound.title")}
            </h3>
            <button
              onClick={() => navigate("/admin-panel/categories")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("specificCategory.notFound.backToCategories")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Component
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isDark
          ? "from-gray-900 via-gray-800 to-gray-900"
          : "from-blue-50 via-indigo-50 to-purple-50"
      } p-6 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Approval Error Alert */}
        {approvalError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 ml-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-800 font-medium">
                  {t("pendingDoctorRequests.errors.approvalError")}
                </h4>
                <p className="text-red-700 text-sm mt-1">
                  {approvalError.message}
                </p>
              </div>
              <button
                onClick={() => dispatch(clearApprovalError())}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {approvalSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-600 ml-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-green-800 font-medium">
                  {t("pendingDoctorRequests.success.processed")}
                </h4>
                <p className="text-green-700 text-sm mt-1">
                  {approvalMessage ||
                    t("pendingDoctorRequests.success.default")}
                </p>
              </div>
              <button
                onClick={() => dispatch(clearApprovalSuccess())}
                className="text-green-600 hover:text-green-800 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin-panel/categories")}
            className={`inline-flex items-center ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            } transition-colors duration-200 mb-4 group`}
          >
            <svg
              className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"} transform ${
                isRTL
                  ? "group-hover:translate-x-1 rotate-180"
                  : "group-hover:-translate-x-1"
              } transition-transform duration-200`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("specificCategory.navigation.backToCategories")}
          </button>

          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-8 mb-8`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {getCategoryName()}
                </h1>
              </div>

              <div
                className={`flex items-center space-x-4 ${
                  isRTL ? "space-x-reverse" : ""
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory.isActive
                      ? `bg-green-100 text-green-800 ${
                          isDark
                            ? "dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }`
                      : `bg-red-100 text-red-800 ${
                          isDark ? "dark:bg-red-900/30 dark:text-red-400" : ""
                        }`
                  }`}
                >
                  {selectedCategory.isActive
                    ? t("specificCategory.status.active")
                    : t("specificCategory.status.inactive")}
                </div>

                <div
                  className={`${
                    isDark
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-blue-100 text-blue-800"
                  } px-4 py-2 rounded-full text-sm font-medium font-mono`}
                >
                  {selectedCategory.code}
                </div>
              </div>
            </div>

            {/* Create Department Button */}
            <div
              className={`
    mt-6 flex flex-col gap-3
    ${isRTL ? "items-start" : "items-end"}
    md:flex-row md:items-center
    ${isRTL ? "md:justify-start" : "md:justify-end"}
  `}
            >
              {/* Create Specific Department */}
              <button
                onClick={handleCreateDepartment}
                className="w-full md:w-auto inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg
                  className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {t("create-specific-department")}
              </button>

              {/* Add New Roster (Link button) */}
              <Link
                to="/admin-panel/rosters/create"
                className="w-full md:w-auto"
              >
                <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors justify-center">
                  <Plus size={20} />
                  <span className="hidden sm:inline">
                    {t("roster.actions.addNew")}
                  </span>
                  <span className="sm:hidden">{t("roster.actions.add")}</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Doctors Section */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6 mb-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } flex items-center`}
            >
              <div
                className={`w-8 h-8 ${
                  isDark ? "bg-orange-900/30" : "bg-orange-100"
                } rounded-lg flex items-center justify-center ${
                  isRTL ? "mr-3" : "ml-3"
                }`}
              >
                <UserCheck
                  className={`w-4 h-4 ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                />
              </div>
              {t("pendingDoctorRequests.title")}
            </h2>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDark
                    ? "bg-blue-900/30 text-blue-400"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {categoryPendingRequests?.length || 0}{" "}
                {t("pendingDoctorRequests.count")}
              </span>

              <button
                onClick={() => setShowPendingDoctors(!showPendingDoctors)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPendingDoctors ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <button
                onClick={handleRefreshPendingDoctors}
                disabled={loadingPending}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                } disabled:opacity-50`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loadingPending ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {showPendingDoctors && (
            <>
              {/* Filters */}
              <div
                className={`p-4 rounded-lg mb-6 ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("pendingDoctorRequests.filters.filterByStatus")}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {statusFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handlePendingStatusChange(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          localFilters.status === option.value
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Error Display */}
              {pendingError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 ml-2 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-red-800 font-medium">
                        {t("pendingDoctorRequests.errors.dataLoadError")}
                      </h4>
                      <p className="text-red-700 text-sm mt-1">
                        {pendingError.message}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        dispatch(clearCategoryPendingRequestsError())
                      }
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Content */}
              {loadingPending ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {t("pendingDoctorRequests.loading.requests")}
                  </p>
                </div>
              ) : !categoryPendingRequests ||
                categoryPendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className={`w-16 h-16 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <UserCheck
                      className={`w-8 h-8 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-lg font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    } mb-2`}
                  >
                    {t("pendingDoctorRequests.emptyStates.noRequests")}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {filters.status
                      ? t(
                          "pendingDoctorRequests.emptyStates.noRequestsWithFilter"
                        )
                      : t(
                          "pendingDoctorRequests.emptyStates.noRequestsDefault"
                        )}
                  </p>
                  {filters.status && (
                    <button
                      onClick={() => handlePendingStatusChange("")}
                      className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors mt-4"
                    >
                      <X className="w-4 h-4" />
                      {t("pendingDoctorRequests.emptyStates.showAllRequests")}
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Results Summary */}
                  {pagination && (
                    <div className="mb-6 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {t("pendingDoctorRequests.pagination.showing", {
                          start: pagination.startIndex || 1,
                          end:
                            pagination.endIndex ||
                            categoryPendingRequests.length,
                          total: pagination.totalCount,
                        })}
                      </div>
                    </div>
                  )}

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr
                          className={`border-b ${
                            isDark
                              ? "border-gray-700 bg-gray-750"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t("pendingDoctorRequests.table.doctorName")}
                          </th>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t("pendingDoctorRequests.table.contact")}
                          </th>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t("pendingDoctorRequests.table.degree")}
                          </th>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t("pendingDoctorRequests.table.status")}
                          </th>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t("pendingDoctorRequests.table.requestedAt")}
                          </th>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t("pendingDoctorRequests.table.actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryPendingRequests.map((request) => (
                          <tr
                            key={`${request.userId}-${request.categoryId}`}
                            className={`border-b transition-colors ${
                              isDark
                                ? "border-gray-700 hover:bg-gray-750"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <td className="p-4">
                              <div
                                className={`font-semibold ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {request.doctorNameArabic ||
                                  t(
                                    "pendingDoctorRequests.requestCard.nameNotSpecified"
                                  )}
                              </div>
                              {request.doctorNameEnglish && (
                                <div
                                  className={`text-sm ${
                                    isDark ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {request.doctorNameEnglish}
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {request.email && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
                                    <span
                                      className="truncate"
                                      title={request.email}
                                    >
                                      {request.email}
                                    </span>
                                  </div>
                                )}
                                {request.mobile && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
                                    <span>{request.mobile}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div
                                className={`text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {request.scientificDegree ||
                                  t(
                                    "pendingDoctorRequests.fields.notSpecified"
                                  )}
                              </div>
                            </td>
                            <td className="p-4">
                              {renderPendingStatusBadge(request.status)}
                            </td>
                            <td className="p-4">
                              <div
                                className={`text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {formatPendingDate(request.requestedAt)}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                {renderPendingActionButtons(request)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden">
                    <div className="grid gap-4">
                      {categoryPendingRequests.map((request) => (
                        <div
                          key={`${request.userId}-${request.categoryId}`}
                          className={`p-4 rounded-lg border ${
                            isDark
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`text-lg font-semibold mb-1 truncate ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {request.doctorNameArabic ||
                                  t(
                                    "pendingDoctorRequests.requestCard.nameNotSpecified"
                                  )}
                              </h3>
                              {request.doctorNameEnglish && (
                                <p
                                  className={`text-sm truncate ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {request.doctorNameEnglish}
                                </p>
                              )}
                            </div>
                            <div className="mr-3 flex-shrink-0">
                              {renderPendingStatusBadge(request.status)}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-3">
                            {request.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
                                <span
                                  className="truncate"
                                  title={request.email}
                                >
                                  {request.email}
                                </span>
                              </div>
                            )}

                            {request.mobile && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
                                <span>{request.mobile}</span>
                              </div>
                            )}

                            {request.scientificDegree && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Award className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
                                <span
                                  className="truncate"
                                  title={request.scientificDegree}
                                >
                                  {request.scientificDegree}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
                              <span>
                                {formatPendingDate(request.requestedAt)}
                              </span>
                            </div>

                            {request.notes && (
                              <div className="flex items-start text-sm text-gray-600">
                                <FileText className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0 text-gray-400" />
                                <span
                                  className="line-clamp-2 leading-relaxed"
                                  title={request.notes}
                                >
                                  {request.notes}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            {renderPendingActionButtons(request)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {t(
                              "pendingDoctorRequests.pagination.resultsCount",
                              {
                                start: pagination.startIndex || 1,
                                end:
                                  pagination.endIndex ||
                                  categoryPendingRequests.length,
                                total: pagination.totalCount,
                              }
                            )}
                          </span>

                          <select
                            value={filters.pageSize}
                            onChange={(e) =>
                              handlePendingPageSizeChange(
                                Number(e.target.value)
                              )
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value={10}>
                              10 {t("pendingDoctorRequests.pagination.perPage")}
                            </option>
                            <option value={20}>
                              20 {t("pendingDoctorRequests.pagination.perPage")}
                            </option>
                            <option value={50}>
                              50 {t("pendingDoctorRequests.pagination.perPage")}
                            </option>
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handlePendingPageChange(pagination.page - 1)
                            }
                            disabled={!pagination.hasPrevious}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {t("pendingDoctorRequests.pagination.previous")}
                          </button>

                          <div className="flex gap-1">
                            {Array.from(
                              { length: Math.min(pagination.totalPages, 5) },
                              (_, i) => {
                                const startPage = Math.max(
                                  1,
                                  pagination.page - 2
                                );
                                const pageNumber = Math.min(
                                  startPage + i,
                                  pagination.totalPages
                                );

                                if (pageNumber > pagination.totalPages)
                                  return null;

                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() =>
                                      handlePendingPageChange(pageNumber)
                                    }
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                      pageNumber === pagination.page
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                );
                              }
                            )}
                          </div>

                          <button
                            onClick={() =>
                              handlePendingPageChange(pagination.page + 1)
                            }
                            disabled={!pagination.hasNext}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {t("pendingDoctorRequests.pagination.next")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6`}
          >
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4 flex items-center`}
            >
              <div
                className={`w-8 h-8 ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }                     rounded-lg flex items-center justify-center ${
                  isRTL ? "mr-3" : "ml-3"
                }`}
              >
                <FileText
                  className={`w-4 h-4 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
              {t("roster.title")}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDark
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {rosterList?.length || 0} {t("roster.count")}
            </span>
          </div>

          {/* Mobile Cards View for Rosters */}
          <div className="md:hidden">
            {loading.fetch ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {t("gettingData.rosters")}
                </p>
              </div>
            ) : rosterList && rosterList.length > 0 ? (
              rosterList.map((roster) => (
                <RosterCard key={roster.id} roster={roster} />
              ))
            ) : (
              <div className="text-center py-8">
                <div
                  className={`w-16 h-16 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <FileText
                    className={`w-8 h-8 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <p
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } mb-2`}
                >
                  {t("roster.noRosters")}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t("roster.createFirstRoster")}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Table View for Rosters */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    isDark
                      ? "border-gray-700 bg-gray-750"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("roster.table.title")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("roster.table.period")}
                  </th>
                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("roster.table.status")}
                  </th>

                  <th
                    className={`${
                      isRTL ? "text-right" : "text-left"
                    } p-4 font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("roster.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading.fetch ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span
                          className={`${isRTL ? "mr-3" : "ml-3"} ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {t("gettingData.rosters")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : rosterList && rosterList.length > 0 ? (
                  rosterList.map((roster) => {
                    const statusInfo = getStatusInfo(roster.status);
                    return (
                      <tr
                        key={roster.id}
                        className={`border-b transition-colors ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-4">
                          <div
                            className={`font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {roster.title}
                          </div>
                        </td>
                        <td className="p-4">
                          <div
                            className={`${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {formatMonthYear(roster.month, roster.year)}
                          </div>
                          <div
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {roster.totalDays} {t("roster.dayss")}
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setStatusToUpdate({
                                id: roster.id,
                                title: roster.title,
                                currentStatus: roster.status,
                              });
                              setStatusModalOpen(true);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 cursor-pointer ${statusInfo.color}`}
                            title={t("roster.actions.updateStatus")}
                          >
                            {statusInfo.name}
                          </button>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-1">
                            <Link to={`/admin-panel/rosters/${roster.id}`}>
                              <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors">
                                <Eye size={16} />
                              </button>
                            </Link>
                            <button
                              className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900 rounded-lg transition-colors"
                              title={t("roster.actions.updateStatus")}
                              onClick={() => {
                                setStatusToUpdate({
                                  id: roster.id,
                                  title: roster.title,
                                  currentStatus: roster.status,
                                });
                                setStatusModalOpen(true);
                              }}
                            >
                              <BarChart3 size={16} />
                            </button>
                            <Link to={`/admin-panel/rosters/${roster.id}/edit`}>
                              <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors">
                                <Edit size={16} />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-12">
                      <div
                        className={`w-16 h-16 ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        } rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <FileText
                          size={32}
                          className={`${
                            isDark ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <h3
                        className={`text-lg font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        } mb-2`}
                      >
                        {t("roster.noRosters")}
                      </h3>
                      <p
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } mb-6`}
                      >
                        {t("roster.createFirstRoster")}
                      </p>
                      <Link to="/admin-panel/rosters/create">
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
                          {t("roster.actions.createBasic")}
                        </button>
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Departments Section */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } flex items-center`}
            >
              <div
                className={`w-8 h-8 ${
                  isDark ? "bg-green-900/30" : "bg-green-100"
                } rounded-lg flex items-center justify-center ${
                  isRTL ? "mr-3" : "ml-3"
                }`}
              >
                <Building
                  className={`w-4 h-4 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
              {t("specificCategory.sections.departments.title")}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDark
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {departments?.length || 0}{" "}
              {t("specificCategory.sections.departments.count")}
            </span>
          </div>

          {loadingGetDepartments ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {t("department.loading")}
              </p>
            </div>
          ) : departments && departments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div
                className={`w-16 h-16 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Building
                  className={`w-8 h-8 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <p
                className={`text-lg font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-2`}
              >
                {t("specificCategory.sections.departments.noDepartments")}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("specificCategory.sections.departments.createFirst")}
              </p>
            </div>
          )}
        </div>

        {/* Chief Card - if exists */}
        {selectedCategory.chief && (
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6`}
          >
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4 flex items-center`}
            >
              <div
                className={`w-8 h-8 ${
                  isDark ? "bg-purple-900/30" : "bg-purple-100"
                } rounded-lg flex items-center justify-center ${
                  isRTL ? "mr-3" : "ml-3"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              {t("specificCategory.sections.chief.title")}
            </h2>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } text-lg`}
            >
              {selectedCategory.chief.name}
            </p>
          </div>
        )}

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6`}
          >
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-6`}
            >
              {t("specificCategory.sections.statistics.title")}
            </h2>

            <div className="space-y-4">
              <div
                className={`flex items-center justify-between p-4 ${
                  isDark ? "bg-blue-900/20" : "bg-blue-50"
                } rounded-xl`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 ${
                      isDark ? "bg-blue-900/30" : "bg-blue-100"
                    } rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span
                    className={`${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } font-medium`}
                  >
                    {t("specificCategory.sections.statistics.departmentsCount")}
                  </span>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {selectedCategory.departmentsCount}
                </span>
              </div>

              <div
                className={`flex items-center justify-between p-4 ${
                  isDark ? "bg-green-900/20" : "bg-green-50"
                } rounded-xl`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 ${
                      isDark ? "bg-green-900/30" : "bg-green-100"
                    } rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } font-medium`}
                  >
                    {t("specificCategory.sections.statistics.usersCount")}
                  </span>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {selectedCategory.usersCount}
                </span>
              </div>

              {/* Rosters Count */}
              <div
                className={`flex items-center justify-between p-4 ${
                  isDark ? "bg-purple-900/20" : "bg-purple-50"
                } rounded-xl`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 ${
                      isDark ? "bg-purple-900/30" : "bg-purple-100"
                    } rounded-lg flex items-center justify-center ${
                      isRTL ? "mr-3" : "ml-3"
                    }`}
                  >
                    <FileText
                      className={`w-5 h-5 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                  </div>
                  <span
                    className={`${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } font-medium`}
                  >
                    {t("specificCategory.sections.statistics.rostersCount")}
                  </span>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    isDark ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  {rosterList?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6`}
          >
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-6`}
            >
              {t("specificCategory.sections.metadata.title")}
            </h2>

            <div className="space-y-4 text-sm">
              <div
                className={`border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                } pb-3`}
              >
                <div
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } mb-1`}
                >
                  {t("specificCategory.sections.metadata.createdBy")}
                </div>
                <div
                  className={`${
                    isDark ? "text-white" : "text-gray-900"
                  } font-medium`}
                >
                  {selectedCategory.createdByName}
                </div>
              </div>

              {selectedCategory.updatedAt && (
                <>
                  <div
                    className={`border-b ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    } pb-3`}
                  >
                    <div
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mb-1`}
                    >
                      {t("specificCategory.sections.metadata.updatedAt")}
                    </div>
                    <div
                      className={`${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {formatDate(selectedCategory.updatedAt)}
                    </div>
                  </div>

                  {selectedCategory.updatedByName && (
                    <div>
                      <div
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } mb-1`}
                      >
                        {t("specificCategory.sections.metadata.updatedBy")}
                      </div>
                      <div
                        className={`${
                          isDark ? "text-white" : "text-gray-900"
                        } font-medium`}
                      >
                        {selectedCategory.updatedByName}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {statusModalOpen && (
        <ModalUpdateRosterStatus
          setStatusModalOpen={setStatusModalOpen}
          statusToUpdate={statusToUpdate}
          setStatusToUpdate={setStatusToUpdate}
        />
      )}
    </div>
  );
};

export default SpecificCategory;
