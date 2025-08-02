import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Eye, Edit, Trash2, Plus, Menu, X, Users } from "lucide-react";
import {
  getScientificDegrees,
  getActiveScientificDegrees,
} from "../../../state/act/actScientificDegree";
import { clearError } from "../../../state/slices/scientificDegree";
import { Link } from "react-router-dom";
import DeleteScientificDegreeModal from "../../../components/DeleteScientificDegreeModal";
import LoadingGetData from "../../../components/LoadingGetData";

function ScientificDegrees() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });
  const [statusFilter, setStatusFilter] = useState("all"); // "all" or "active"

  const {
    scientificDegrees,
    activeScientificDegrees,
    loadingGetScientificDegrees,
    loadingGetActiveScientificDegrees,
    error,
  } = useSelector((state) => state.scientificDegree);

  const { mymode } = useSelector((state) => state.mode);

  // Check if we're in dark mode
  const isDark = mymode === "dark";

  // Check if current language is RTL
  const language = i18n.language;
  const isRTL = language === "ar";

  // Get current data based on status filter
  const currentData =
    statusFilter === "active" ? activeScientificDegrees : scientificDegrees;
  const isLoading =
    statusFilter === "active"
      ? loadingGetActiveScientificDegrees
      : loadingGetScientificDegrees;

  // Fetch scientific degrees based on status filter
  useEffect(() => {
    console.log(scientificDegrees, activeScientificDegrees);
    console.log("currentData", currentData);
    if (statusFilter === "active") {
      dispatch(getActiveScientificDegrees());
    } else {
      dispatch(getScientificDegrees());
    }
  }, [dispatch, statusFilter]);

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle status filter change
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
  };

  // Handle delete action
  const handleDeleteClick = (scientificDegree) => {
    const name =
      language === "ar"
        ? scientificDegree.nameArabic
        : scientificDegree.nameEnglish;
    setToDelete({ id: scientificDegree.id, name });
    setModalOpen(true);
  };

  // Get scientific degree name based on current language
  const getScientificDegreeName = (scientificDegree) => {
    return language === "ar"
      ? scientificDegree.nameArabic
      : scientificDegree.nameEnglish;
  };

  // Mobile card component for each scientific degree
  const ScientificDegreeCard = ({ scientificDegree }) => (
    <div
      className={`p-4 rounded-lg border mb-3 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3
            className={`font-semibold text-lg ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {scientificDegree.nameArabic}
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {scientificDegree.nameEnglish}
          </p>
          {scientificDegree.code && (
            <div className="flex items-center mt-1">
              <Hash
                className={`h-3 w-3 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } ${isRTL ? "ml-1" : "mr-1"}`}
              />
              <span
                className={`text-xs font-mono px-1 py-0.5 rounded ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {scientificDegree.code}
              </span>
            </div>
          )}
        </div>
        <div
          className={`px-2 py-1 text-xs rounded-full ${
            scientificDegree.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {scientificDegree.isActive
            ? t("scientificDegrees.status.active")
            : t("scientificDegrees.status.inactive")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm mb-3">
        <div className="flex items-center">
          <Users
            className={`${isRTL ? "ml-2" : "mr-2"} ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
            size={16}
          />
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("scientificDegrees.table.users")}:
          </span>
          <span
            className={`${isRTL ? "mr-2" : "ml-2"} ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {scientificDegree.usersCount}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to={`/admin-panel/scientific-degrees/${scientificDegree.id}`}>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title={t("scientificDegrees.actions.view")}
          >
            <Eye size={16} />
          </button>
        </Link>
        <Link
          to={`/admin-panel/scientific-degrees/edit/${scientificDegree.id}`}
        >
          <button
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
            title={t("scientificDegrees.actions.edit")}
          >
            <Edit size={16} />
          </button>
        </Link>
        <button
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
          title={t("scientificDegrees.actions.delete")}
          onClick={() => handleDeleteClick(scientificDegree)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingGetData />;
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DeleteScientificDegreeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        scientificDegreeId={toDelete.id}
        info={toDelete}
        scientificDegreeName={toDelete.name}
      />
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("scientificDegrees.title")}
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/admin-panel/scientific-degrees/create">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center">
                    <Plus size={20} />
                    <span className="hidden sm:inline">
                      {t("scientificDegrees.addNew")}
                    </span>
                    <span className="sm:hidden">
                      {t("scientificDegrees.add")}
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex justify-between items-center">
                  <span>{error.message}</span>
                  <button
                    onClick={() => dispatch(clearError())}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div
            className={`rounded-lg shadow-sm border mb-6 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "all"
                      ? "bg-blue-600 text-white"
                      : `${
                          isDark
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`
                  }`}
                >
                  {t("scientificDegrees.filters.allStatuses")}
                </button>
                <button
                  onClick={() => handleStatusChange("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "active"
                      ? "bg-blue-600 text-white"
                      : `${
                          isDark
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`
                  }`}
                >
                  {t("scientificDegrees.status.active")}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {currentData && currentData.length > 0 ? (
            <>
              {/* Mobile View */}
              <div className="block md:hidden">
                {currentData.map((scientificDegree) => (
                  <ScientificDegreeCard
                    key={scientificDegree.id}
                    scientificDegree={scientificDegree}
                  />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <div
                  className={`rounded-lg shadow-sm border ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } overflow-hidden`}
                >
                  <table className="w-full">
                    <thead
                      className={`${
                        isDark ? "bg-gray-700" : "bg-gray-50"
                      } border-b ${
                        isDark ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <tr>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            isDark ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {t("scientificDegrees.table.nameArabic")}
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            isDark ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {t("scientificDegrees.table.nameEnglish")}
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            isDark ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {t("scientificDegrees.table.users")}
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            isDark ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {t("scientificDegrees.table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`${
                        isDark ? "bg-gray-800" : "bg-white"
                      } divide-y ${
                        isDark ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {currentData.map((scientificDegree) => (
                        <tr
                          key={scientificDegree.id}
                          className={`hover:${
                            isDark ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {scientificDegree.nameArabic}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-900"
                              }`}
                            >
                              {scientificDegree.nameEnglish}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users
                                className={`${isRTL ? "ml-1" : "mr-1"} ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                                size={16}
                              />
                              <span
                                className={`text-sm ${
                                  isDark ? "text-gray-300" : "text-gray-900"
                                }`}
                              >
                                {scientificDegree.usersCount}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex gap-2">
                              <Link
                                to={`/admin-panel/scientific-degrees/${scientificDegree.id}`}
                              >
                                <button
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                  title={t("scientificDegrees.actions.view")}
                                >
                                  <Eye size={16} />
                                </button>
                              </Link>
                              <Link
                                to={`/admin-panel/scientific-degrees/edit/${scientificDegree.id}`}
                              >
                                <button
                                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                                  title={t("scientificDegrees.actions.edit")}
                                >
                                  <Edit size={16} />
                                </button>
                              </Link>
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                title={t("scientificDegrees.actions.delete")}
                                onClick={() =>
                                  handleDeleteClick(scientificDegree)
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div
              className={`text-center py-12 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <p className="text-lg mb-2">{t("scientificDegrees.noData")}</p>
              <p className="text-sm">
                {t("scientificDegrees.noDataDescription")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScientificDegrees;
