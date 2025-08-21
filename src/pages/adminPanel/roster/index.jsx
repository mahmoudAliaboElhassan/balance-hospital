// src/pages/adminPanel/roster/index.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Plus,
  Calendar,
  Users,
  Clock,
  FileText,
  Download,
  Edit,
  Eye,
  Trash2,
  Filter,
  Search,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getRosters,
  updateRosterStatus,
  exportRoster,
} from "../../../state/act/actRosterManagement";
import { clearError, clearSuccess } from "../../../state/slices/roster";
import { getCategories } from "../../../state/act/actCategory";

const RosterManagement = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [filters, setFilters] = useState({
    searchTerm: "",
    categoryId: "",
    status: "",
    month: "",
    year: new Date().getFullYear(),
    page: 1,
    pageSize: 10,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusReason, setStatusReason] = useState("");

  // Redux state
  const { rosters, loading, success, error, pagination } = useSelector(
    (state) => state.rosterManagement
  );

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  // Configuration data
  const { categories } = useSelector((state) => state.category);

  // Load initial data
  useEffect(() => {
    dispatch(getRosters(filters));
    dispatch(getCategories());
  }, [dispatch]);

  // Handle success/error notifications
  useEffect(() => {
    if (success.update) {
      toast.success(t("roster.success.statusUpdated"));
      setShowStatusModal(false);
      setSelectedRoster(null);
      setStatusReason("");
      dispatch(clearSuccess());
      dispatch(getRosters(filters)); // Refresh list
    }
  }, [success.update, dispatch, t, filters]);

  useEffect(() => {
    if (error) {
      toast.error(
        error.messageAr || error.message || t("roster.error.fetchFailed")
      );
      dispatch(clearError());
    }
  }, [error, dispatch, t]);

  const handleSearch = () => {
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    dispatch(getRosters(newFilters));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    dispatch(getRosters(newFilters));
  };

  const handleStatusChange = async (roster, newStatus) => {
    setSelectedRoster(roster);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedRoster || !statusReason.trim()) {
      toast.error(
        t("roster.validation.reasonRequired") || "Reason is required"
      );
      return;
    }

    try {
      await dispatch(
        updateRosterStatus({
          id: selectedRoster.id,
          status: selectedRoster.newStatus,
          reason: statusReason,
        })
      ).unwrap();
    } catch (error) {
      toast.error(
        error.messageAr || error.message || t("roster.error.statusUpdateFailed")
      );
    }
  };

  const handleExport = async (rosterId, format = "excel") => {
    try {
      const response = await dispatch(
        exportRoster({ rosterId, format })
      ).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Roster_${rosterId}_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(t("roster.success.exported"));
    } catch (error) {
      toast.error(
        error.messageAr || error.message || t("roster.error.exportFailed")
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Published":
        return "bg-green-100 text-green-800 border-green-200";
      case "Closed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Draft":
        return <AlertCircle size={14} />;
      case "Published":
        return <CheckCircle size={14} />;
      case "Closed":
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const monthNames = isRTL
    ? [
        "",
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
      ]
    : [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

  const canEdit = (roster) => roster.status === "Draft";
  const canPublish = (roster) => roster.status === "Draft";
  const canClose = (roster) => roster.status === "Published";
  const canArchive = (roster) => roster.status === "Closed";

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.title")}
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              } mt-1`}
            >
              {t("roster.subtitle")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/admin-panel/rosters/create?type=basic")}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
              {t("roster.actions.createBasic")}
            </button>
            <button
              onClick={() =>
                navigate("/admin-panel/rosters/create?type=complete")
              }
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
              {t("roster.actions.createComplete")}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow border ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-lg font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.filters.search")}
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <Filter
                  size={20}
                  className={isDark ? "text-gray-400" : "text-gray-600"}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={t("roster.filters.searchPlaceholder")}
                />
              </div>

              {/* Category */}
              <div>
                <select
                  value={filters.categoryId}
                  onChange={(e) =>
                    handleFilterChange("categoryId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">{t("roster.filters.allCategories")}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {isRTL ? category.nameArabic : category.nameEnglish}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">{t("roster.filters.allStatuses")}</option>
                  <option value="Draft">{t("roster.status.draft")}</option>
                  <option value="Published">
                    {t("roster.status.published")}
                  </option>
                  <option value="Closed">{t("roster.status.closed")}</option>
                  <option value="Archived">
                    {t("roster.status.archived")}
                  </option>
                </select>
              </div>

              {/* Month */}
              <div>
                <select
                  value={filters.month}
                  onChange={(e) => handleFilterChange("month", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">{t("roster.filters.allMonths")}</option>
                  {monthNames.slice(1).map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div>
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Search size={16} className={isRTL ? "ml-2" : "mr-2"} />
                  {t("roster.filters.search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rosters Grid/Table */}
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow border ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {loading.fetch ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {t("common.loading")}...
              </p>
            </div>
          </div>
        ) : rosters.length === 0 ? (
          <div className="text-center p-12">
            <div
              className={`w-16 h-16 ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              } rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <FileText
                size={32}
                className={`${isDark ? "text-gray-600" : "text-gray-400"}`}
              />
            </div>
            <h3
              className={`text-lg font-medium ${
                isDark ? "text-white" : "text-gray-900"
              } mb-2`}
            >
              {t("roster.noRosters")}
            </h3>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-6`}>
              {t("roster.createFirstRoster")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() =>
                  navigate("/admin-panel/rosters/create?type=basic")
                }
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
                {t("roster.actions.createBasic")}
              </button>
              <button
                onClick={() =>
                  navigate("/admin-panel/rosters/create?type=complete")
                }
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
                {t("roster.actions.createComplete")}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
                  <tr>
                    <th
                      className={`px-6 py-3 text-${
                        isRTL ? "right" : "left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("roster.table.title")}
                    </th>
                    <th
                      className={`px-6 py-3 text-${
                        isRTL ? "right" : "left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("roster.table.category")}
                    </th>
                    <th
                      className={`px-6 py-3 text-${
                        isRTL ? "right" : "left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("roster.table.period")}
                    </th>
                    <th
                      className={`px-6 py-3 text-${
                        isRTL ? "right" : "left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("roster.table.status")}
                    </th>
                    <th
                      className={`px-6 py-3 text-${
                        isRTL ? "right" : "left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("roster.table.deadline")}
                    </th>
                    <th
                      className={`px-6 py-3 text-${
                        isRTL ? "right" : "left"
                      } text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("roster.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${isDark ? "bg-gray-800" : "bg-white"} divide-y ${
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  {rosters.map((roster) => (
                    <tr
                      key={roster.id}
                      className={`${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 ${
                              isDark ? "bg-gray-700" : "bg-gray-100"
                            } rounded-lg flex items-center justify-center ${
                              isRTL ? "ml-4" : "mr-4"
                            }`}
                          >
                            <Calendar
                              size={20}
                              className={`${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div>
                            <div
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {roster.title}
                            </div>
                            {roster.description && (
                              <div
                                className={`text-sm ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                } truncate max-w-xs`}
                              >
                                {roster.description.length > 50
                                  ? `${roster.description.substring(0, 50)}...`
                                  : roster.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {isRTL
                            ? roster.categoryNameArabic
                            : roster.categoryNameEnglish}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {monthNames[roster.month]} {roster.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            roster.status
                          )}`}
                        >
                          {getStatusIcon(roster.status)}
                          <span className={isRTL ? "mr-1" : "ml-1"}>
                            {t(`roster.status.${roster.status.toLowerCase()}`)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {formatDate(roster.submissionDeadline)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin-panel/rosters/${roster.id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title={t("roster.actions.view")}
                          >
                            <Eye size={16} />
                          </button>
                          {canEdit(roster) && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin-panel/rosters/edit/${roster.id}`
                                )
                              }
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title={t("roster.actions.edit")}
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleExport(roster.id)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title={t("roster.actions.export")}
                          >
                            <Download size={16} />
                          </button>
                          <div className="relative">
                            <button
                              className="text-gray-400 hover:text-gray-600 p-1 rounded"
                              title="More actions"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {rosters.map((roster) => (
                <div
                  key={roster.id}
                  className={`p-4 border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } last:border-b-0`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        } rounded-lg flex items-center justify-center ${
                          isRTL ? "ml-3" : "mr-3"
                        }`}
                      >
                        <Calendar
                          size={20}
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {roster.title}
                        </h3>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {isRTL
                            ? roster.categoryNameArabic
                            : roster.categoryNameEnglish}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        roster.status
                      )}`}
                    >
                      {getStatusIcon(roster.status)}
                      <span className={isRTL ? "mr-1" : "ml-1"}>
                        {t(`roster.status.${roster.status.toLowerCase()}`)}
                      </span>
                    </span>
                  </div>

                  <div className="mb-3">
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span className="font-medium">
                        {t("roster.table.period")}:
                      </span>{" "}
                      {monthNames[roster.month]} {roster.year}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span className="font-medium">
                        {t("roster.table.deadline")}:
                      </span>{" "}
                      {formatDate(roster.submissionDeadline)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/admin-panel/rosters/${roster.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title={t("roster.actions.view")}
                      >
                        <Eye size={16} />
                      </button>
                      {canEdit(roster) && (
                        <button
                          onClick={() =>
                            navigate(`/admin-panel/rosters/edit/${roster.id}`)
                          }
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title={t("roster.actions.edit")}
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleExport(roster.id)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title={t("roster.actions.export")}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div
                className={`${
                  isDark ? "bg-gray-800" : "bg-white"
                } px-4 py-3 flex items-center justify-between border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                      pagination.currentPage === 1
                        ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t("common.previous")}
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t("common.next")}
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {t("common.showing")}{" "}
                      <span className="font-medium">
                        {(pagination.currentPage - 1) * pagination.pageSize + 1}
                      </span>{" "}
                      {t("common.to")}{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.currentPage * pagination.pageSize,
                          pagination.totalItems
                        )}
                      </span>{" "}
                      {t("common.of")}{" "}
                      <span className="font-medium">
                        {pagination.totalItems}
                      </span>{" "}
                      {t("common.results")}
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                          pagination.currentPage === 1
                            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                            : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">{t("common.previous")}</span>
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Page numbers would go here */}

                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                          pagination.currentPage === pagination.totalPages
                            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                            : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">{t("common.next")}</span>
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedRoster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-xl max-w-md w-full`}
          >
            <div className="p-6">
              <h3
                className={`text-lg font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                {t("roster.actions.changeStatus")}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mb-4`}
              >
                {t("roster.form.statusChangeReason")}
              </p>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder={t("roster.form.statusChangeReasonPlaceholder")}
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedRoster(null);
                    setStatusReason("");
                  }}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={confirmStatusChange}
                  disabled={!statusReason.trim() || loading.update}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading.update ? t("common.updating") : t("common.confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterManagement;
