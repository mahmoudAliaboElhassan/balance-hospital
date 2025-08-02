import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Eye, Edit, Trash2, Plus, Menu, X, Users } from "lucide-react";
import {
  getContractingTypes,
  getActiveContractingTypes,
} from "../../../state/act/actContractingType";
import { clearError } from "../../../state/slices/contractingType";
import { Link } from "react-router-dom";
import DeleteContractingTypeModal from "../../../components/DeleteContractingType";
import DeleteCategoryModal from "../../../components/DeleteCategoryModal";

function ContractingTypes() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });
  const [statusFilter, setStatusFilter] = useState("all"); // "all" or "active"
  const [showMobileTable, setShowMobileTable] = useState(false);

  const {
    contractingTypes,
    activeContractingTypes,
    loadingGetContractingTypes,
    loadingGetActiveContractingTypes,
    error,
  } = useSelector((state) => state.contractingType);

  const { mymode } = useSelector((state) => state.mode);

  // Check if we're in dark mode
  const isDark = mymode === "dark";

  // Check if current language is RTL
  const language = i18n.language;
  const isRTL = language === "ar";

  // Get current data based on status filter
  const currentData =
    statusFilter === "active" ? activeContractingTypes : contractingTypes;
  const isLoading =
    statusFilter === "active"
      ? loadingGetActiveContractingTypes
      : loadingGetContractingTypes;

  // Fetch contracting types based on status filter
  useEffect(() => {
    if (statusFilter === "active") {
      dispatch(getActiveContractingTypes());
    } else {
      dispatch(getContractingTypes());
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
  const handleDeleteClick = (contractingType) => {
    const name =
      language === "ar"
        ? contractingType.nameArabic
        : contractingType.nameEnglish;
    setToDelete({ id: contractingType.id, name });
    setModalOpen(true);
  };

  // Get contracting type name based on current language
  const getContractingTypeName = (contractingType) => {
    return language === "ar"
      ? contractingType.nameArabic
      : contractingType.nameEnglish;
  };

  // Mobile card component for each contracting type
  const ContractingTypeCard = ({ contractingType }) => (
    <div
      className={`p-4 rounded-lg border mb-3 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3
            className={`font-semibold text-lg ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {contractingType.nameArabic}
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {contractingType.nameEnglish}
          </p>
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
            {t("contractingTypes.table.users")}:
          </span>
          <span
            className={`${isRTL ? "mr-2" : "ml-2"} ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {contractingType.usersCount}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to={`/admin-panel/contracting-types/${contractingType.id}`}>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title={t("contractingTypes.actions.view")}
          >
            <Eye size={16} />
          </button>
        </Link>
        <Link to={`/admin-panel/contracting-types/edit/${contractingType.id}`}>
          <button
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
            title={t("contractingTypes.actions.edit")}
          >
            <Edit size={16} />
          </button>
        </Link>
        <button
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
          title={t("contractingTypes.actions.delete")}
          onClick={() => handleDeleteClick(contractingType)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <DeleteContractingTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contractingTypeId={toDelete.id}
        info={toDelete}
        contractingTypeName={toDelete.name}
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
                {t("contractingTypes.title")}
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link to="/admin-panel/contracting-types/create">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center">
                    <Plus size={20} />
                    <span className="hidden sm:inline">
                      {t("contractingTypes.addNew")}
                    </span>
                    <span className="sm:hidden">
                      {t("contractingTypes.add")}
                    </span>
                  </button>
                </Link>
                {/* Mobile table toggle */}
                <button
                  onClick={() => setShowMobileTable(!showMobileTable)}
                  className={`md:hidden px-3 py-2 rounded-lg border transition-colors ${
                    showMobileTable
                      ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300"
                      : `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`
                  }`}
                >
                  {showMobileTable ? <X size={20} /> : <Menu size={20} />}
                </button>
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`w-full p-2 border rounded-lg ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="all">
                      {t("contractingTypes.filters.allStatuses")}
                    </option>
                    <option value="active">
                      {t("contractingTypes.status.active")}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className={`md:hidden ${showMobileTable ? "hidden" : "block"}`}>
            {isLoading ? (
              <div className="text-center p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span
                    className={`${isRTL ? "mr-3" : "ml-3"} ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("contractingTypes.loading")}
                  </span>
                </div>
              </div>
            ) : currentData && currentData.length === 0 ? (
              <div
                className={`text-center p-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("contractingTypes.noData")}
              </div>
            ) : (
              currentData?.map((contractingType) => (
                <ContractingTypeCard
                  key={contractingType.id}
                  contractingType={contractingType}
                />
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div
            className={`hidden md:block ${showMobileTable ? "md:hidden" : ""} ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-lg shadow-sm border`}
          >
            <div className="overflow-x-auto">
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
                      {t("contractingTypes.table.nameArabic")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.nameEnglish")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.users")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-3" : "ml-3"} ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("contractingTypes.loading")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : currentData && currentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className={`text-center p-8 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("contractingTypes.noData")}
                      </td>
                    </tr>
                  ) : (
                    currentData?.map((contractingType) => (
                      <tr
                        key={contractingType.id}
                        className={`border-b transition-colors ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {contractingType.nameArabic}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {contractingType.nameEnglish}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <Users
                              className={`${isRTL ? "ml-2" : "mr-2"} ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                              size={16}
                            />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {contractingType.usersCount}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/admin-panel/contracting-types/${contractingType.id}`}
                            >
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                                title={t("contractingTypes.actions.view")}
                              >
                                <Eye size={16} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/contracting-types/edit/${contractingType.id}`}
                            >
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors cursor-pointer"
                                title={t("contractingTypes.actions.edit")}
                              >
                                <Edit size={16} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(contractingType)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                              title={t("contractingTypes.actions.delete")}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Table View (when toggled) */}
          <div
            className={`md:hidden ${showMobileTable ? "block" : "hidden"} ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-lg shadow-sm border overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
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
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.name")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.users")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("contractingTypes.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="3" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-2" : "ml-2"} text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("contractingTypes.loading")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : currentData && currentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className={`text-center p-8 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {t("contractingTypes.noData")}
                      </td>
                    </tr>
                  ) : (
                    currentData?.map((contractingType) => (
                      <tr
                        key={contractingType.id}
                        className={`border-b transition-colors ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-750"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-2">
                          <div>
                            <div
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {contractingType.nameArabic}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {contractingType.nameEnglish}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {contractingType.usersCount}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Link
                              to={`/admin-panel/contracting-types/${contractingType.id}`}
                            >
                              <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors">
                                <Eye size={14} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/contracting-types/edit/${contractingType.id}`}
                            >
                              <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors">
                                <Edit size={14} />
                              </button>
                            </Link>
                            <button
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                              onClick={() => handleDeleteClick(contractingType)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractingTypes;
