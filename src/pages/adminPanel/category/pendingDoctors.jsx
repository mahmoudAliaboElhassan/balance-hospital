import React, { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  Award,
  FileText,
  Clock,
  Eye,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Building2,
  Users,
  Grid,
  List,
} from "lucide-react"
import {
  getCategoryTypes,
  getCategoryPendingRequests,
  setCategoryPendingRequestsCurrentPage,
  setCategoryPendingRequestsPageSize,
  setCategoryPendingRequestsStatusFilter,
  clearCategoryPendingRequestsError,
  clearCategoryPendingRequests,
  setSelectedCategoryId,
  approveDoctorRequest,
  clearApprovalSuccess,
  clearApprovalError,
} from "../../../state/slices/category"
import { useTranslation } from "react-i18next"
import i18next from "i18next"
import { formatDate } from "../../../utils/formtDate"

const PendingDoctorRequests = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t, currentLanguage } = useTranslation()

  const {
    categoryTypes,
    loadingGetCategoryTypes,
    categoryTypesError,
    categoryPendingRequests,
    categoryPendingRequestsPagination: pagination,
    categoryPendingRequestsError: error,
    loadingGetCategoryPendingRequests: loading,
    categoryPendingRequestsFilters: filters,
    selectedCategoryId,
    // Add approval-related state
    loadingApproveRequest,
    approvalError,
    approvalSuccess,
    approvalMessage,
  } = useSelector((state) => state.category)

  const [localFilters, setLocalFilters] = useState({
    status: filters.status,
  })

  const [selectedCategory, setSelectedCategory] = useState(null)

  // Fetch category types on component mount
  useEffect(() => {
    dispatch(getCategoryTypes())
  }, [dispatch])

  // Set selected category when categoryTypes are loaded or selectedCategoryId changes
  useEffect(() => {
    if (categoryTypes.length > 0 && selectedCategoryId) {
      const category = categoryTypes.find(
        (cat) => cat.id === selectedCategoryId
      )
      setSelectedCategory(category)
    }
  }, [categoryTypes, selectedCategoryId])

  // Fetch category-specific pending requests when category is selected
  useEffect(() => {
    if (selectedCategoryId && !isNaN(selectedCategoryId)) {
      dispatch(
        getCategoryPendingRequests({
          categoryId: selectedCategoryId,
          filters,
        })
      )
    }
  }, [dispatch, selectedCategoryId, filters])

  // Handle approval success
  useEffect(() => {
    if (approvalSuccess) {
      // Optionally show a success message or toast
      console.log(approvalMessage || "Request processed successfully")

      // Clear the success state after a delay
      const timer = setTimeout(() => {
        dispatch(clearApprovalSuccess())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [approvalSuccess, approvalMessage, dispatch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearCategoryPendingRequests())
      dispatch(clearApprovalSuccess())
      dispatch(clearApprovalError())
    }
  }, [dispatch])

  // Handle category selection
  const handleCategorySelect = useCallback(
    (categoryId) => {
      dispatch(setSelectedCategoryId(categoryId))
    },
    [dispatch]
  )

  // Handle status filter change
  const handleStatusChange = useCallback(
    (status) => {
      setLocalFilters((prev) => ({ ...prev, status }))
      dispatch(setCategoryPendingRequestsStatusFilter(status))
    },
    [dispatch]
  )

  // Handle pagination
  const handlePageChange = useCallback(
    (page) => {
      dispatch(setCategoryPendingRequestsCurrentPage(page))
    },
    [dispatch]
  )

  const handlePageSizeChange = useCallback(
    (pageSize) => {
      dispatch(setCategoryPendingRequestsPageSize(pageSize))
    },
    [dispatch]
  )

  // Handle error dismissal
  const handleDismissError = useCallback(() => {
    dispatch(clearCategoryPendingRequestsError())
  }, [dispatch])

  // Handle approval error dismissal
  const handleDismissApprovalError = useCallback(() => {
    dispatch(clearApprovalError())
  }, [dispatch])

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (selectedCategoryId && !isNaN(selectedCategoryId)) {
      dispatch(
        getCategoryPendingRequests({
          categoryId: selectedCategoryId,
          filters,
        })
      )
    }
  }, [dispatch, selectedCategoryId, filters])

  // Handle navigation back
  const handleGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  // Updated request handlers
  const handleApproveRequest = useCallback(
    (userId) => {
      dispatch(approveDoctorRequest({ userId, isApproved: true }))
    },
    [dispatch]
  )

  const handleRejectRequest = useCallback(
    (userId) => {
      dispatch(approveDoctorRequest({ userId, isApproved: false }))
    },
    [dispatch]
  )

  const handleViewRequest = useCallback((requestId) => {
    console.log("View request:", requestId)
  }, [])

  // Get status configuration
  const getStatusConfig = (status) => {
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
      Rejected: {
        className: "bg-red-100 text-red-800 border-red-200",
        text: t("pendingDoctorRequests.status.rejected"),
        icon: X,
      },
    }

    return (
      configs[status] || {
        className: "bg-gray-100 text-gray-800 border-gray-200",
        text: status,
        icon: AlertCircle,
      }
    )
  }

  // Render status badge
  const renderStatusBadge = (status) => {
    const config = getStatusConfig(status)
    const IconComponent = config.icon

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${config.className}`}
      >
        <IconComponent className="w-3 h-3" />
        {config.text}
      </span>
    )
  }

  // Format date
 

  // Status filter options
  const statusFilterOptions = [
    {
      value: "",
      label: t("pendingDoctorRequests.filters.statusOptions.all"),
      count: null,
    },
    {
      value: "Pending",
      label: t("pendingDoctorRequests.filters.statusOptions.pending"),
      count: null,
    },
    {
      value: "Approved",
      label: t("pendingDoctorRequests.filters.statusOptions.approved"),
      count: null,
    },
    {
      value: "Rejected",
      label: t("pendingDoctorRequests.filters.statusOptions.rejected"),
      count: null,
    },
  ]

  // Render action buttons based on status
  const renderActionButtons = (request) => {
    const isProcessing = loadingApproveRequest

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
    )
  }

  // Loading category types
  if (loadingGetCategoryTypes) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <span className="text-gray-600 text-lg">
                {t("pendingDoctorRequests.loading.categories")}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Category types error
  if (categoryTypesError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 ml-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-lg mb-1">
                  {t("pendingDoctorRequests.errors.categoryTypesError")}
                </h3>
                <p className="text-red-700 mb-4">
                  {categoryTypesError.message}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => dispatch(getCategoryTypes())}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t("pendingDoctorRequests.errors.retryButton")}
                  </button>
                  <button
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("pendingDoctorRequests.backButton")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Requests error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with category selector */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("pendingDoctorRequests.backButton")}
            </button>

            {/* Category selector */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("pendingDoctorRequests.categorySelector.title")}
              </h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryTypes.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-4 rounded-lg border-2 text-start transition-all ${
                      selectedCategoryId === category.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2
                        className={`w-5 h-5 ${
                          selectedCategoryId === category.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium truncate ${
                            selectedCategoryId === category.id
                              ? "text-blue-900"
                              : "text-gray-900"
                          }`}
                        >
                          {category.nameArabic}
                        </h3>
                        <p
                          className={`text-sm truncate ${
                            selectedCategoryId === category.id
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {category.code}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 ml-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-lg mb-1">
                  {t("pendingDoctorRequests.errors.dataLoadError")}
                </h3>
                <p className="text-red-700 mb-4">{error.message}</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t("pendingDoctorRequests.errors.retryButton")}
                  </button>
                  <button
                    onClick={handleDismissError}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    {t("pendingDoctorRequests.errors.closeButton")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Approval Error Alert */}
        {approvalError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 ml-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-800 font-medium">
                  {t(
                    "pendingDoctorRequests.errors.approvalError",
                    "Processing Error"
                  )}
                </h4>
                <p className="text-red-700 text-sm mt-1">
                  {approvalError.message}
                </p>
              </div>
              <button
                onClick={handleDismissApprovalError}
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
                  {t(
                    "pendingDoctorRequests.success.processed",
                    "Request Processed"
                  )}
                </h4>
                <p className="text-green-700 text-sm mt-1">
                  {approvalMessage ||
                    t(
                      "pendingDoctorRequests.success.default",
                      "Request has been processed successfully"
                    )}
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
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("pendingDoctorRequests.backButton")}
          </button>

          {/* Category Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("pendingDoctorRequests.categorySelector.title")}
              </h2>
              <button
                onClick={() => dispatch(getCategoryTypes())}
                className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {t("pendingDoctorRequests.categorySelector.refreshCategories")}
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryTypes.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-4 rounded-lg border-2 text-start transition-all ${
                    selectedCategoryId === category.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2
                      className={`w-5 h-5 ${
                        selectedCategoryId === category.id
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium truncate ${
                          selectedCategoryId === category.id
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {category.nameArabic}
                      </h3>
                      <p
                        className={`text-sm truncate ${
                          selectedCategoryId === category.id
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {category.nameEnglish} • {category.code}
                      </p>
                    </div>
                    {selectedCategoryId === category.id && (
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Category Info */}
          {selectedCategory && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedCategory.nameArabic}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {selectedCategory.nameEnglish} • {selectedCategory.code}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("pendingDoctorRequests.subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  {t("pendingDoctorRequests.selectedCategory.refreshButton")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Show content only if category is selected */}
        {!selectedCategoryId ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("pendingDoctorRequests.categorySelector.selectPrompt")}
            </h3>
            <p className="text-gray-600">
              {t("pendingDoctorRequests.categorySelector.selectDescription")}
            </p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
                      onClick={() => handleStatusChange(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        localFilters.status === option.value
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                      {option.count && (
                        <span className="mr-1 text-xs opacity-75">
                          ({option.count})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                  <span className="text-gray-600 text-lg">
                    {t("pendingDoctorRequests.loading.requests")}
                  </span>
                  <span className="text-gray-500 text-sm mt-1">
                    {t("pendingDoctorRequests.loading.pleaseWait")}
                  </span>
                </div>
              </div>
            ) : !categoryPendingRequests ||
              categoryPendingRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("pendingDoctorRequests.emptyStates.noRequests")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filters.status
                    ? t(
                        "pendingDoctorRequests.emptyStates.noRequestsWithFilter",
                        {
                          status: statusFilterOptions.find(
                            (opt) => opt.value === filters.status
                          )?.label,
                        }
                      )
                    : t("pendingDoctorRequests.emptyStates.noRequestsDefault")}
                </p>
                {filters.status && (
                  <button
                    onClick={() => handleStatusChange("")}
                    className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
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
                          pagination.endIndex || categoryPendingRequests.length,
                        total: pagination.totalCount,
                      })}
                    </div>
                    {selectedCategory && (
                      <div className="text-sm text-gray-500">
                        {t("pendingDoctorRequests.pagination.category", {
                          categoryName: selectedCategory.nameArabic,
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Requests Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryPendingRequests.map((request) => (
                    <div
                      key={`${request.userId}-${request.categoryId}`}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                            {request.doctorNameArabic ||
                              t(
                                "pendingDoctorRequests.requestCard.nameNotSpecified"
                              )}
                          </h3>
                          {request.doctorNameEnglish && (
                            <p className="text-sm text-gray-600 truncate">
                              {request.doctorNameEnglish}
                            </p>
                          )}
                        </div>
                        <div className="mr-3 flex-shrink-0">
                          {renderStatusBadge(request.status)}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        {request.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
                            <span className="truncate" title={request.email}>
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
                          <span>{formatDate(request.requestedAt)}</span>
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

                        {/* Processed info for approved/rejected requests */}
                        {request.status !== "Pending" &&
                          request.processedAt && (
                            <div className="pt-2 border-t border-gray-100">
                              <div className="text-xs text-gray-500">
                                {t(
                                  "pendingDoctorRequests.requestCard.processedOn",
                                  {
                                    date: formatDate(request.processedAt),
                                  }
                                )}
                              </div>
                              {request.processedByName && (
                                <div className="text-xs text-gray-500">
                                  {t(
                                    "pendingDoctorRequests.requestCard.processedBy",
                                    {
                                      name: request.processedByName,
                                    }
                                  )}
                                </div>
                              )}
                              {request.processedNotes && (
                                <div className="text-xs text-gray-600 mt-1">
                                  {t("pendingDoctorRequests.requestCard.note", {
                                    note: request.processedNotes,
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                      </div>

                      {/* Actions - Updated with dynamic buttons */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        {renderActionButtons(request)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {t("pendingDoctorRequests.pagination.resultsCount", {
                            start: pagination.startIndex || 1,
                            end:
                              pagination.endIndex ||
                              categoryPendingRequests.length,
                            total: pagination.totalCount,
                          })}
                        </span>

                        <select
                          value={filters.pageSize}
                          onChange={(e) =>
                            handlePageSizeChange(Number(e.target.value))
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={10}>
                            10{" "}
                            {t("pendingDoctorRequests.pagination.perPage", {
                              count: "",
                            }).replace("{count} ", "")}
                          </option>
                          <option value={20}>
                            20{" "}
                            {t("pendingDoctorRequests.pagination.perPage", {
                              count: "",
                            }).replace("{count} ", "")}
                          </option>
                          <option value={50}>
                            50{" "}
                            {t("pendingDoctorRequests.pagination.perPage", {
                              count: "",
                            }).replace("{count} ", "")}
                          </option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.hasPrevious}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {t("pendingDoctorRequests.pagination.previous")}
                        </button>

                        <div className="flex gap-1">
                          {Array.from(
                            { length: Math.min(pagination.totalPages, 5) },
                            (_, i) => {
                              const startPage = Math.max(1, pagination.page - 2)
                              const pageNumber = Math.min(
                                startPage + i,
                                pagination.totalPages
                              )

                              if (pageNumber > pagination.totalPages)
                                return null

                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    pageNumber === pagination.page
                                      ? "bg-blue-600 text-white"
                                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              )
                            }
                          )}
                        </div>

                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
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
    </div>
  )
}

export default PendingDoctorRequests
