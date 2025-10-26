import React, { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import "../../../styles/general.css"

import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Plus,
  Menu,
  X,
  Users,
  Hash,
} from "lucide-react"
import { getScientificDegrees } from "../../../state/act/actScientificDegree"
import {
  clearError,
  setCurrentPage,
  setPageSize,
  setSearchFilter,
  setCodeFilter,
  setStatusFilter,
  setDateRangeFilter,
  setSortFilter,
  clearFilters,
} from "../../../state/slices/scientificDegree"
import { Link } from "react-router-dom"
import DeleteScientificDegreeModal from "../../../components/DeleteScientificDegreeModal"
import LoadingGetData from "../../../components/LoadingGetData"
import i18next from "i18next"

function ScientificDegrees() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const [toDelete, setToDelete] = useState({ id: null, name: "" })
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileTable, setShowMobileTable] = useState(false)

  // Filter input states
  const [searchInput, setSearchInput] = useState("")
  const [codeInput, setCodeInput] = useState("")
  const [fromDateInput, setFromDateInput] = useState("")
  const [toDateInput, setToDateInput] = useState("")

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null)

  const {
    scientificDegrees,
    pagination,
    filters,
    loadingGetScientificDegrees,
    error,
  } = useSelector((state) => state.scientificDegree)

  const { mymode } = useSelector((state) => state.mode)

  // Check if we're in dark mode
  const isDark = mymode === "dark"

  // Check if current language is RTL
  const language = i18n.language
  const isRTL = language === "ar"

  // Initialize filter inputs from current filters
  useEffect(() => {
    setSearchInput(filters.search || "")
    setCodeInput(filters.code || "")
    setFromDateInput(filters.createdFromDate || "")
    setToDateInput(filters.createdToDate || "")
  }, [filters])

  // Fetch scientific degrees when component mounts or filters change
  useEffect(() => {
    const params = {
      search: filters.search,
      code: filters.code,
      isActive: filters.isActive,
      createdFromDate: filters.createdFromDate,
      createdToDate: filters.createdToDate,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
      page: filters.page,
      pageSize: filters.pageSize,
    }

    dispatch(getScientificDegrees(params))
  }, [dispatch, filters])

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value) => {
      setSearchInput(value)

      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      const timeout = setTimeout(() => {
        dispatch(setSearchFilter(value))
      }, 500)

      setSearchTimeout(timeout)
    },
    [dispatch, searchTimeout]
  )

  // Handle code filter with debounce
  const handleCodeChange = useCallback(
    (value) => {
      setCodeInput(value)

      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      const timeout = setTimeout(() => {
        dispatch(setCodeFilter(value))
      }, 500)

      setSearchTimeout(timeout)
    },
    [dispatch, searchTimeout]
  )

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage))
  }

  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(parseInt(newPageSize)))
  }

  // Handle filter changes
  const handleStatusChange = (value) => {
    const statusValue = value === "" ? undefined : value === "true"
    dispatch(setStatusFilter(statusValue))
  }

  const handleDateRangeChange = () => {
    dispatch(
      setDateRangeFilter({
        fromDate: fromDateInput,
        toDate: toDateInput,
      })
    )
  }

  const handleSortChange = (sortBy, sortDirection) => {
    dispatch(setSortFilter({ sortBy, sortDirection }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchInput("")
    setCodeInput("")
    setFromDateInput("")
    setToDateInput("")
  }

  // Handle delete action
  const handleDeleteClick = (scientificDegree) => {
    const name =
      language === "ar"
        ? scientificDegree.nameArabic
        : scientificDegree.nameEnglish
    setToDelete({ id: scientificDegree.id, name })
    setModalOpen(true)
  }

  // Get scientific degree name based on current language
  const getScientificDegreeName = (scientificDegree) => {
    return language === "ar"
      ? scientificDegree.nameArabic
      : scientificDegree.nameEnglish
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const totalPages = pagination?.totalPages || 1
    const currentPage = pagination?.page || 1

    // Show up to 3 page numbers on mobile, 5 on desktop
    const maxPages = window.innerWidth < 768 ? 3 : 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    let endPage = Math.min(totalPages, startPage + maxPages - 1)

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

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
            {scientificDegree.usersCount || 0}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Link to={`/admin-panel/scientific-degrees/${scientificDegree.id}`}>
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
            title={t("scientificDegrees.actions.view")}
          >
            <Eye size={16} />
          </button>
        </Link>
        <Link
          to={`/admin-panel/scientific-degrees/edit/${scientificDegree.id}`}
        >
          <button
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors cursor-pointer"
            title={t("scientificDegrees.actions.edit")}
          >
            <Edit size={16} />
          </button>
        </Link>
        <button
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
          title={t("scientificDegrees.actions.delete")}
          onClick={() => handleDeleteClick(scientificDegree)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )

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
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                    <Plus size={20} />
                    <span className="hidden sm:inline">
                      {t("scientificDegrees.addNew")}
                    </span>
                    <span className="sm:hidden">
                      {t("scientificDegrees.add")}
                    </span>
                  </button>
                </Link>
                {/* Mobile table toggle */}
                <button
                  onClick={() => setShowMobileTable(!showMobileTable)}
                  className={`md:hidden px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
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
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div
            className={`rounded-lg shadow-sm border mb-6 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 flex items-center gap-2">
                  {/* Search Icon Container - Completely separate from input */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-gray-400"
                        : "border-gray-300 bg-white text-gray-500"
                    }`}
                  >
                    <Search size={20} />
                  </div>

                  {/* Input Container */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={t("scientificDegrees.search.placeholder")}
                      value={searchInput}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 justify-center sm:justify-start cursor-pointer ${
                    showFilters
                      ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300"
                      : `hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isDark
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-200 hover:border-gray-400"
                        }`
                  }`}
                >
                  <Filter size={20} />
                  {t("scientificDegrees.filters.title")}
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t ${
                    isDark ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  {/* Code Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("scientificDegrees.filters.code")}
                    </label>
                    <input
                      type="text"
                      placeholder={t(
                        "scientificDegrees.filters.codePlaceholder"
                      )}
                      value={codeInput}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("scientificDegrees.filters.status")}
                    </label>
                    <select
                      value={
                        filters.isActive === undefined
                          ? ""
                          : filters.isActive.toString()
                      }
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="">
                        {t("scientificDegrees.filters.allStatuses")}
                      </option>
                      <option value="true">
                        {t("scientificDegrees.status.active")}
                      </option>
                      <option value="false">
                        {t("scientificDegrees.status.inactive")}
                      </option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.sortBy")}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleSortChange(
                          parseInt(e.target.value),
                          filters.sortDirection
                        )
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value={1}>
                        {t("contractingTypes.filters.sortByOptions.nameArabic")}
                      </option>
                      <option value={2}>
                        {t(
                          "contractingTypes.filters.sortByOptions.nameEnglish"
                        )}
                      </option>
                      <option value={3}>
                        {t("contractingTypes.filters.sortByOptions.code")}
                      </option>

                      <option value={5}>
                        {t("contractingTypes.filters.sortByOptions.createdAt")}
                      </option>
                      <option value={6}>
                        {t("contractingTypes.filters.sortByOptions.updatedAt")}
                      </option>
                    </select>
                  </div>

                  {/* Sort Direction */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.sortDirection")}
                    </label>
                    <select
                      value={filters.sortDirection}
                      onChange={(e) =>
                        handleSortChange(
                          filters.sortBy,
                          parseInt(e.target.value)
                        )
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value={0}>
                        {t("scientificDegrees.filters.ascending")}
                      </option>
                      <option value={1}>
                        {t("scientificDegrees.filters.descending")}
                      </option>
                    </select>
                  </div>

                  {/* Date From */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.fromDate")}
                    </label>
                    <input
                      type="date"
                      value={fromDateInput}
                      onChange={(e) => setFromDateInput(e.target.value)}
                      onBlur={handleDateRangeChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.filters.toDate")}
                    </label>
                    <input
                      type="date"
                      value={toDateInput}
                      onChange={(e) => setToDateInput(e.target.value)}
                      onBlur={handleDateRangeChange}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Clear Filters Button */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <button
                      onClick={handleClearFilters}
                      className={`px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t("contractingTypes.filters.clear")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className={`md:hidden ${showMobileTable ? "hidden" : "block"}`}>
            {loadingGetScientificDegrees ? (
              <div className="text-center p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span
                    className={`${isRTL ? "mr-3" : "ml-3"} ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("gettingData.scientificDegrees")}
                  </span>
                </div>
              </div>
            ) : scientificDegrees && scientificDegrees.length === 0 ? (
              <div
                className={`text-center p-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("scientificDegrees.noData")}
              </div>
            ) : (
              scientificDegrees?.map((scientificDegree) => (
                <ScientificDegreeCard
                  key={scientificDegree.id}
                  scientificDegree={scientificDegree}
                />
              ))
            )}
          </div>

          {/* Desktop Table View / Mobile Table View */}
          <div
            className={`${showMobileTable ? "block" : "hidden md:block"} ${
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
                      {t("scientificDegrees.table.nameArabic")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("scientificDegrees.table.nameEnglish")}
                    </th>

                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("scientificDegrees.table.users")}
                    </th>
                    <th
                      className={`${
                        isRTL ? "text-right" : "text-left"
                      } p-4 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("scientificDegrees.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingGetScientificDegrees ? (
                    <tr>
                      <td colSpan="6" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-3" : "ml-3"} ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("gettingData.scientificDegrees")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : scientificDegrees && scientificDegrees.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-8">
                        <span
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("scientificDegrees.noData")}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    scientificDegrees?.map((scientificDegree) => (
                      <tr
                        key={scientificDegree.id}
                        className={`border-b ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        } hover:${
                          isDark ? "bg-gray-700" : "bg-gray-50"
                        } transition-colors`}
                      >
                        <td
                          className={`p-4 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {scientificDegree.nameArabic}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {scientificDegree.nameEnglish}
                        </td>

                        <td
                          className={`p-4 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            {scientificDegree.usersCount || 0}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/admin-panel/scientific-degrees/${scientificDegree.id}`}
                            >
                              <button
                                className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                title={t("scientificDegrees.actions.view")}
                              >
                                <Eye size={16} />
                              </button>
                            </Link>
                            <Link
                              to={`/admin-panel/scientific-degrees/edit/${scientificDegree.id}`}
                            >
                              <button
                                className="p-2 cursor-pointer text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                                title={t("scientificDegrees.actions.edit")}
                              >
                                <Edit size={16} />
                              </button>
                            </Link>
                            <button
                              className="p-2 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              className={`mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {/* Page Info */}
              <div className="text-sm">
                {t("scientificDegrees.pagination.showing")}{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.pageSize + 1}
                </span>{" "}
                {t("scientificDegrees.pagination.to")}{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.totalCount
                  )}
                </span>{" "}
                {t("scientificDegrees.pagination.of")}{" "}
                <span className="font-medium">{pagination.totalCount}</span>{" "}
                {t("scientificDegrees.pagination.results")}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2 text-sm">
                  <span>{t("scientificDegrees.pagination.perPage")}:</span>
                  <select
                    value={pagination.pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    className={`px-2 py-1 border rounded ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1">
                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                      pagination.hasPreviousPage
                        ? `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`
                        : `border-gray-200 dark:border-gray-700 cursor-not-allowed ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg cursor-pointer border transition-colors ${
                        pageNum === pagination.page
                          ? "bg-blue-600 border-blue-600 text-white"
                          : `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`p-2 rounded-lg cursor-pointer border transition-colors ${
                      pagination.hasNextPage
                        ? `border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`
                        : `border-gray-200 dark:border-gray-700 cursor-not-allowed ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScientificDegrees
