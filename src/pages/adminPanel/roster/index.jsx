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
  Plus,
  Menu,
  X,
  FileText,
  Calendar,
  Users,
  Clock,
  BarChart3,
} from "lucide-react"
import {
  clearAllErrors,
  clearFilters,
  setCurrentPage,
  // setCurrentPage,
  setFilters,
  setPageSize,
  setPagination,
} from "../../../state/slices/roster"
import { Link, useNavigate } from "react-router-dom"
import { getRostersPaged } from "../../../state/act/actRosterManagement"
import ModalUpdateRosterStatus from "../../../components/modals/ModalUpdateRosterStatus"
import ModalDeleteRoster from "../../../components/modals/ModalDeleteRoster"
import { formatDate } from "../../../utils/formtDate"

function Roster() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState({ id: null, name: "" })
  const [statusToUpdate, setStatusToUpdate] = useState({
    id: null,
    title: "",
    currentStatus: "",
  })
  const [searchInput, setSearchInput] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileTable, setShowMobileTable] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)

  const { rosterList, pagination, loading, errors, ui } = useSelector(
    (state) => state.rosterManagement
  )
  const { mymode } = useSelector((state) => state.mode)

  // Check if we're in dark mode
  const isDark = mymode === "dark"
  // Check if current language is RTL
  const language = i18n.language
  const isRTL = language === "ar"

  // Initialize search input from filters
  useEffect(() => {
    setSearchInput(ui.filters.search || "")
  }, [ui.filters.search])

  // Fetch roster when filters change
  useEffect(() => {
    const params = {
      page: pagination.currentPage || 1,
      pageSize: pagination.pageSize || 10,
      ...ui.filters,
    }

    // Remove null/undefined values
    Object.keys(params).forEach((key) => {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === ""
      ) {
        delete params[key]
      }
    })

    dispatch(getRostersPaged(params))
  }, [dispatch, ui.filters, pagination.currentPage, pagination.pageSize])

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value) => {
      setSearchInput(value)

      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      const timeout = setTimeout(() => {
        dispatch(setFilters({ searchTerm: value }))
        dispatch(setCurrentPage(1))
      }, 500)

      setSearchTimeout(timeout)
    },
    [dispatch, searchTimeout]
  )

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
    dispatch(setCurrentPage(1))
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    console.log("pagination.currentPage", pagination.currentPage)
    console.log("newPage", newPage)
    dispatch(setCurrentPage(newPage))
  }

  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(parseInt(newPageSize)))
  }

  // Format date

  // Format month/year display
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
    }

    const months = monthNames[language] || monthNames.en
    return `${months[month - 1]} ${year}`
  }

  // Get status color and display name
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
    }

    return (
      statusMap[status] || {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        name: status,
      }
    )
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const totalPages = pagination?.totalPages || 1
    const currentPage = pagination?.currentPage || 1

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

  // Mobile card component for each roster
  const RosterCard = ({ roster }) => {
    const statusInfo = getStatusInfo(roster.status)

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
              })
              setStatusModalOpen(true)
            }}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 cursor-pointer ${statusInfo.color}`}
            title={t("roster.actions.updateStatus")}
          >
            {statusInfo.name}
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm">
            <span
              className={`font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {roster.categoryName}
            </span>
          </div>
        </div>

        <div className="text-sm mb-3">
          <span
            className={`font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("roster.table.createdAt")}:
          </span>
          <span
            className={`ml-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}
          >
            {formatDate(roster.createdAt)}
          </span>
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
              })
              setStatusModalOpen(true)
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
          {/* <button
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
            title={t("roster.actions.delete")}
            onClick={() => {
              setToDelete({
                id: roster.id,
                name: roster.title,
              });
              setOpenDeleteModal(true);
            }}
          >
            <Trash2 size={16} />
          </button> */}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
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
                {t("roster.title")}
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
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

            {errors?.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex justify-between items-center">
                  <span>{errors.general}</span>
                  <button
                    onClick={() => dispatch(clearAllErrors())}
                    className="text-red-500 hover:text-red-700"
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
                      placeholder={t("roster.filters.searchPlaceholder")}
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
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 justify-center sm:justify-start ${
                    showFilters
                      ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300"
                      : `hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isDark
                            ? "border-gray-600 text-gray-300"
                            : "border-gray-300 text-gray-700"
                        }`
                  }`}
                >
                  <Filter size={20} />
                  {t("roster.filters.title")}
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t ${
                    isDark ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.filters.status")}
                    </label>
                    <select
                      value={ui.filters.status || "all"}
                      onChange={(e) => {
                        const value =
                          e.target.value === "all" ? null : e.target.value
                        handleFilterChange("status", value)
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="all">{t("roster.filters.all")}</option>
                      <option value="DRAFT_BASIC">
                        {t("roster.status.draftBasic")}
                      </option>
                      <option value="DRAFT_PARTIAL">
                        {t("roster.status.draftPartial")}
                      </option>
                      <option value="DRAFT">{t("roster.status.draft")}</option>
                      <option value="DRAFT_READY">
                        {t("roster.status.draftReady")}
                      </option>
                      <option value="PUBLISHED">
                        {t("roster.status.published")}
                      </option>
                      <option value="CLOSED">
                        {t("roster.status.closed")}
                      </option>
                      <option value="ARCHIVED">
                        {t("roster.status.archived")}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.filters.year")}
                    </label>
                    <select
                      value={ui.filters.year || "all"}
                      onChange={(e) => {
                        const value =
                          e.target.value === "all"
                            ? null
                            : parseInt(e.target.value)
                        handleFilterChange("year", value)
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="all">
                        {t("roster.filters.allYears")}
                      </option>
                      {[2024, 2025, 2026].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.filters.month")}
                    </label>
                    <select
                      value={ui.filters.month || "all"}
                      onChange={(e) => {
                        const value =
                          e.target.value === "all"
                            ? null
                            : parseInt(e.target.value)
                        handleFilterChange("month", value)
                      }}
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="all">
                        {t("roster.filters.allMonths")}
                      </option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => (
                          <option key={month} value={month}>
                            {formatMonthYear(month, 2025).split(" ")[0]}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("roster.filters.orderBy")}
                    </label>
                    <select
                      value={ui.filters.orderBy || "createdAt"}
                      onChange={(e) =>
                        handleFilterChange("orderBy", e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="title">
                        {t("roster.filters.sortBy.title")}
                      </option>
                      <option value="createdAt">
                        {t("roster.filters.sortBy.createdAt")}
                      </option>
                      <option value="year">
                        {t("roster.filters.sortBy.year")}
                      </option>
                      <option value="month">
                        {t("roster.filters.sortBy.month")}
                      </option>
                      <option value="completionPercentage">
                        {t("roster.filters.sortBy.completion")}
                      </option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4">
                    <button
                      onClick={() => dispatch(clearFilters())}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t("roster.filters.clear")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className={`md:hidden ${showMobileTable ? "hidden" : "block"}`}>
            {loading?.fetch ? (
              <div className="text-center p-8">
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
              </div>
            ) : rosterList.length === 0 ? (
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
              </div>
            ) : (
              rosterList.map((roster) => (
                <RosterCard key={roster.id} roster={roster} />
              ))
            )}
          </div>

          {/* // Desktop Table View */}
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
                      {t("roster.table.category")}
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
                      {t("roster.table.created")}
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
                  {loading?.fetch ? (
                    <tr>
                      <td colSpan="7" className="text-center p-8">
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
                  ) : rosterList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-12">
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
                        {/* <button
                          onClick={() =>
                            navigate("/admin-panel/rosters/create")
                          }
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
                          {t("roster.actions.createBasic")}
                        </button> */}
                      </td>
                    </tr>
                  ) : (
                    rosterList.map((roster) => {
                      const statusInfo = getStatusInfo(roster.status)
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
                            <div
                              className={`${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {roster.categoryName}
                            </div>
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {roster.departmentsCount}{" "}
                              {t("roster.departments")}
                            </div>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setStatusToUpdate({
                                  id: roster.id,
                                  title: roster.title,
                                  currentStatus: roster.status,
                                })
                                setStatusModalOpen(true)
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 cursor-pointer ${statusInfo.color}`}
                              title={t("roster.actions.updateStatus")}
                            >
                              {statusInfo.name}
                            </button>
                          </td>

                          <td className="p-4">
                            <div
                              className={`${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {formatDate(roster.createdAt)}
                            </div>
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {roster.createdByName}
                            </div>
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
                                  })
                                  setStatusModalOpen(true)
                                }}
                              >
                                <BarChart3 size={16} />
                              </button>
                              <Link
                                to={`/admin-panel/rosters/${roster.id}/edit`}
                              >
                                <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors">
                                  <Edit size={16} />
                                </button>
                              </Link>
                              {/* <button
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                                title={t("roster.actions.delete")}
                                onClick={() => {
                                  setToDelete({
                                    id: roster.id,
                                    name: roster.title,
                                  });
                                  setOpenDeleteModal(true);
                                }}
                              >
                                <Trash2 size={16} />
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/*   Mobile Table View (when toggled) */}
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
                      className={`text-center p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("roster.table.title")}
                    </th>
                    <th
                      className={`text-center p-2 font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t("roster.table.status")}
                    </th>

                    <th
                      className={`text-center p-2 font-semibold ${
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
                      <td colSpan="4" className="text-center p-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span
                            className={`${isRTL ? "mr-2" : "ml-2"} text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {t("gettingData.rosters")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : rosterList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-8">
                        <div
                          className={`w-12 h-12 ${
                            isDark ? "bg-gray-700" : "bg-gray-100"
                          } rounded-full flex items-center justify-center mx-auto mb-3`}
                        >
                          <FileText
                            size={24}
                            className={`${
                              isDark ? "text-gray-600" : "text-gray-400"
                            }`}
                          />
                        </div>
                        <h3
                          className={`text-base font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          } mb-2`}
                        >
                          {t("roster.noRosters")}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          } mb-4`}
                        >
                          {t("roster.createFirstRoster")}
                        </p>
                        <button
                          onClick={() =>
                            navigate("/admin-panel/rosters/create")
                          }
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Plus size={14} className={isRTL ? "ml-1" : "mr-1"} />
                          {t("roster.actions.create")}
                        </button>
                      </td>
                    </tr>
                  ) : (
                    rosterList.map((roster) => {
                      const statusInfo = getStatusInfo(roster.status)
                      return (
                        <tr
                          key={roster.id}
                          className={`border-b transition-colors ${
                            isDark
                              ? "border-gray-700 hover:bg-gray-750"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <td className="p-2">
                            <div
                              className={`font-semibold text-xs ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {roster.title}
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {formatMonthYear(roster.month, roster.year)}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {roster.categoryName}
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => {
                                setStatusToUpdate({
                                  id: roster.id,
                                  title: roster.title,
                                  currentStatus: roster.status,
                                })
                                setStatusModalOpen(true)
                              }}
                              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 cursor-pointer ${statusInfo.color}`}
                              title={t("roster.actions.updateStatus")}
                            >
                              {statusInfo.name}
                            </button>
                          </td>

                          <td className="p-2">
                            <div className="flex gap-1 justify-center">
                              <Link to={`/admin-panel/rosters/${roster.id}`}>
                                <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors">
                                  <Eye size={14} />
                                </button>
                              </Link>
                              <button
                                className="p-1 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900 rounded transition-colors"
                                title={t("roster.actions.updateStatus")}
                                onClick={() => {
                                  setStatusToUpdate({
                                    id: roster.id,
                                    title: roster.title,
                                    currentStatus: roster.status,
                                  })
                                  setStatusModalOpen(true)
                                }}
                              >
                                <BarChart3 size={14} />
                              </button>
                              <Link
                                to={`/admin-panel/rosters/${roster.id}/edit`}
                              >
                                <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors">
                                  <Edit size={14} />
                                </button>
                              </Link>
                              {/* <button
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                                title={t("roster.actions.delete")}
                                onClick={() => {
                                  setToDelete({
                                    id: roster.id,
                                    name: roster.title,
                                  });
                                  setOpenDeleteModal(true);
                                }}
                              >
                                <Trash2 size={16} />
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              className={`border-t p-4 mt-6 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } rounded-lg`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
                  <span
                    className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {t("displayRange", {
                      start:
                        (pagination.currentPage - 1) * pagination.pageSize + 1,
                      end: Math.min(
                        pagination.currentPage * pagination.pageSize,
                        pagination.totalItems
                      ),
                      total: pagination.totalCount,
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={pagination.pageSize}
                      onChange={(e) => handlePageSizeChange(e.target.value)}
                      className={`p-1 border rounded text-sm ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                    <span
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("roster.pagination.itemsPerPage")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(ui.filters.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>

                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
                        pageNum == ui.filters.page
                          ? "bg-blue-600 text-white"
                          : isDark
                          ? "border border-gray-600 hover:bg-gray-700 text-gray-300"
                          : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(ui.filters.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Update Modal */}
          {statusModalOpen && (
            <ModalUpdateRosterStatus
              setStatusModalOpen={setStatusModalOpen}
              statusToUpdate={statusToUpdate}
              setStatusToUpdate={setStatusToUpdate}
            />
          )}
          {openDeleteModal && (
            <ModalDeleteRoster
              onClose={() => setOpenDeleteModal(false)}
              toDelete={toDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default Roster
