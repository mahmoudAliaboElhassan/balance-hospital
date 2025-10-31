import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { useTranslation } from "react-i18next"
import {
  Clock,
  ArrowRight,
  Building2,
  Eye,
  Users,
  Plus,
  CheckCircle,
  AlertCircle,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  getRosterDepartments,
  getDepartmentShifts,
  deleteDepartmentShift,
  getShiftContractingTypes,
  deleteShiftContractingType,
} from "../../../state/act/actRosterManagement"
import LoadingGetData from "../../../components/LoadingGetData"
import ModalShiftsDepartment from "../../../components/ModalShiftsDepartment"
import ModalContractingTypesDepartment from "../../../components/ModalContractingTypeShift"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import ModalEditContractingTypeModal from "../../../components/ModalUpdateContractingTypeShift"
import { AddDepartmentButton } from "../../../components/AddDepartment"

function RosterDepartments() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language
  const isRTL = currentLang === "ar"
  const [deleteIdx, setDeleteIdx] = useState(false)
  const [deleteContractingIdx, setdDleteContractingIdx] = useState(false)

  // Redux state
  const {
    rosterDepartments,
    loading,
    selectedDepartmentShifts,
    shiftContractingTypes,
  } = useSelector((state) => state.rosterManagement)

  const [selectedContractingType, setSelectedContractingType] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [activeDepartment, setActiveDepartment] = useState(null) // Track which department is expanded
  const [selectedShift, setSelectedShift] = useState(null)
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
  const [isContractingModalOpen, setIsContractingModalOpen] = useState(false)
  const [loadingShifts, setLoadingShifts] = useState(false)
  const [loadingContractingTypes, setLoadingContractingTypes] = useState({})

  // Add state to track which contracting types sections are visible
  const [visibleContractingTypes, setVisibleContractingTypes] = useState({})

  const handleUpdateContractingType = (contractingType) => {
    setSelectedContractingType(contractingType)
    console.log("from function", contractingType)
    setEditModalOpen(true)
  }

  const goToRosterData = () => {
    const id = localStorage.getItem("rosterId")
    if (id) {
      navigate(`/admin-panel/rosters/${id}`)
    } else {
      navigate("/admin-panel/rosters")
    }
  }

  const handleDeleteContractingType = (contractingTypeId, index) => {
    dispatch(deleteShiftContractingType({ contractingId: contractingTypeId }))
      .unwrap()
      .then(() => {
        toast.success(t("roster.success.removeContracting"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        setdDleteContractingIdx(index)
      })

      .catch((error) => {
        Swal.fire({
          title: t("roster.contractingTypes.error.removeTitle"),
          text:
            currentLang === "en"
              ? error?.response?.data?.messageEn ||
                error?.message ||
                t("roster.contractingTypes.error.renoveMessage")
              : error?.response?.data?.messageAr ||
                error?.message ||
                t("roster.contractingTypes.error.renoveMessage"),
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        })
      })
  }

  useEffect(() => {
    const storedRosterId = localStorage.getItem("rosterId") || ""
    if (storedRosterId) {
      dispatch(getRosterDepartments({ rosterId: storedRosterId }))
        .unwrap()
        .then((response) => {
          console.log("Fetched roster departments:", response)
          dispatch(
            getDepartmentShifts({
              rosterDepartmentId: response.data[0]?.id,
            })
          )
          setActiveDepartment(response.data[0])
        })
        .catch((err) => {
          console.error("Failed to fetch roster departments:", err)
        })
    }
  }, [dispatch])

  const openShiftModal = (department) => {
    setSelectedDepartment(department)
    setIsShiftModalOpen(true)
  }

  const closeShiftModal = () => {
    setSelectedDepartment(null)
    setIsShiftModalOpen(false)
  }

  const openContractingModal = (shift) => {
    setSelectedShift(shift)
    setIsContractingModalOpen(true)
  }

  const closeContractingModal = () => {
    setSelectedShift(null)
    setIsContractingModalOpen(false)
  }
  const closeEditContractingModal = () => {
    setSelectedContractingType(null)
    setEditModalOpen(false)
  }

  // Updated function to handle department card click
  const handleDepartmentClick = async (department) => {
    // If clicking on the same department that's already active, collapse it
    if (activeDepartment && activeDepartment.id === department.id) {
      return
    }

    // Set the new active department and fetch its shifts
    setActiveDepartment(department)
    setLoadingShifts(true)

    try {
      await dispatch(
        getDepartmentShifts({ rosterDepartmentId: department.id })
      ).unwrap()
      console.log("Fetched department shifts successfully")
    } catch (error) {
      console.error("Failed to fetch department shifts:", error)
    } finally {
      setLoadingShifts(false)
    }
  }

  const handleViewContractingTypes = async (shift) => {
    localStorage.setItem("currentShiftId", shift.id)

    // Toggle visibility
    const isCurrentlyVisible = visibleContractingTypes[shift.id]

    if (isCurrentlyVisible) {
      // If currently visible, just hide it
      setVisibleContractingTypes((prev) => ({ ...prev, [shift.id]: false }))
    } else {
      // If not visible, fetch data and show
      setLoadingContractingTypes((prev) => ({ ...prev, [shift.id]: true }))
      try {
        await dispatch(
          getShiftContractingTypes({ departmentShiftId: shift.id })
        ).unwrap()
        console.log("Fetched shift contracting types successfully")
        setVisibleContractingTypes((prev) => ({ ...prev, [shift.id]: true }))
      } catch (error) {
        console.error("Failed to fetch shift contracting types:", error)
      } finally {
        setLoadingContractingTypes((prev) => ({ ...prev, [shift.id]: false }))
      }
    }
  }

  const handleDeleteShift = (shift, index) => {
    console.log("Delete shift:", shift)
    setDeleteIdx(index)
    dispatch(deleteDepartmentShift(shift.id))
  }

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  const navigateToNextPhase = () => {
    navigate(`/admin-panel/rosters/working-hours/generate`)
  }

  if (loading.fetch) {
    return <LoadingGetData text={t("gettingData.rosterDepartments")} />
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.departmentss.title")}
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                {t("roster.departmentss.subtitle")}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                isDark
                  ? "bg-green-900/20 border-green-700"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="flex items-start">
                <AlertCircle className="text-green-500 mr-3 mt-0.5" size={20} />
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-green-200" : "text-green-700"
                    } mt-1`}
                  >
                    {t("roster.changesInfo")}
                  </p>
                </div>
              </div>
            </div>
            <AddDepartmentButton />
          </div>
        </div>

        {/* Departments Grid - Updated to 4 cards per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rosterDepartments?.map((department) => (
            <div key={department.id} className="flex flex-col">
              <div
                onClick={() => handleDepartmentClick(department)}
                className={`${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } ${
                  activeDepartment && activeDepartment.id === department.id
                    ? isDark
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : "ring-2 ring-blue-500 border-blue-500"
                    : ""
                } rounded-lg shadow border transition-all duration-200 hover:shadow-lg cursor-pointer hover:scale-105`}
              >
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isDark ? "bg-blue-900/30" : "bg-blue-100"
                      }`}
                    >
                      <Building2
                        size={20}
                        className={isDark ? "text-blue-400" : "text-blue-600"}
                      />
                    </div>
                    <div className={isRTL ? "mr-3" : "ml-3"}>
                      <h3
                        className={`text-base font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {currentLang === "ar"
                          ? department.nameArabic || department.nameEnglish
                          : department.nameEnglish || department.nameArabic}
                      </h3>
                    </div>
                  </div>

                  {department.notes && (
                    <div className="mb-3">
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        } line-clamp-2`}
                      >
                        {department.notes}
                      </p>
                    </div>
                  )}

                  <div className="mb-3">
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("roster.departmentss.createdAt")}:{" "}
                      {new Date(department.createdAt).toLocaleDateString(
                        currentLang === "ar" ? "ar-EG" : "en-US"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <button
                  onClick={() => openShiftModal(department)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Clock size={16} className={isRTL ? "ml-2" : "mr-2"} />
                  {t("roster.departmentss.addShiftHours")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Shifts Display Section - Updated to show only when department is active */}
        {activeDepartment && (
          <div
            className={`mt-8 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-lg shadow border`}
          >
            <div className="p-6">
              <h2
                className={`text-xl font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.departmentss.shifts") || "Department Shifts"}
              </h2>
              <h3 className="mb-6">
                <span
                  className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {t("roster.departmentss.department") || "Department"}{" "}
                </span>
                <span
                  className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {currentLang === "ar"
                    ? activeDepartment.nameArabic ||
                      activeDepartment.nameEnglish
                    : activeDepartment.nameEnglish ||
                      activeDepartment.nameArabic}
                </span>
              </h3>

              {/* Loading State */}
              {loadingShifts && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span
                    className={`ml-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("roster.departmentss.loadingShifts") ||
                      "Loading shifts..."}
                  </span>
                </div>
              )}

              {/* No Shifts State */}
              {!loadingShifts &&
                (!selectedDepartmentShifts ||
                  selectedDepartmentShifts.length === 0) && (
                  <div
                    className={`text-center py-6 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Clock
                      size={32}
                      className={`mx-auto mb-2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <p className="text-sm">
                      {t("roster.departmentss.noShifts") ||
                        "No shifts found for this department"}
                    </p>
                  </div>
                )}

              {/* Shifts Grid */}
              {!loadingShifts &&
                selectedDepartmentShifts &&
                selectedDepartmentShifts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedDepartmentShifts.map((shift, index) => (
                      <div
                        key={shift.id || index}
                        className={`p-6 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3
                              className={`font-semibold text-lg ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {currentLang === "ar"
                                ? shift.shiftTypeNameAr || shift.shiftTypeName
                                : shift.shiftTypeNameEn || shift.shiftTypeName}
                            </h3>
                            <p
                              className={`text-sm ${
                                isDark ? "text-blue-400" : "text-blue-600"
                              }`}
                            >
                              {shift.shiftPeriod}
                            </p>
                          </div>
                          <span
                            className={`text-sm px-3 py-1 rounded-full font-medium ${
                              isDark
                                ? "bg-green-900/30 text-green-400"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {shift.shiftHours}h
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span
                              className={`${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("roster.departmentss.status") || "Status"}:
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                shift.isActive
                                  ? isDark
                                    ? "bg-green-900/30 text-green-400"
                                    : "bg-green-100 text-green-700"
                                  : isDark
                                  ? "bg-red-900/30 text-red-400"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {shift.isActive
                                ? t("roster.departmentss.active") || "Active"
                                : t("roster.departmentss.inactive") ||
                                  "Inactive"}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span
                              className={`${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("roster.departmentss.configured") ||
                                "Configured"}
                              :
                            </span>
                            <span
                              className={`${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {shift.hasCompleteConfiguration
                                ? t("roster.departmentss.yes") || "Yes"
                                : t("roster.departmentss.no") || "No"}
                            </span>
                          </div>
                        </div>

                        {/* Contracting Types Section - Now Collapsible */}
                        {shiftContractingTypes[shift.id] &&
                          visibleContractingTypes[shift.id] && (
                            <div
                              className={`mb-4 rounded-lg border shadow-sm transition-all duration-300 ${
                                isDark
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              {/* Card Header */}
                              <div
                                className={`px-4 py-3 border-b ${
                                  isDark
                                    ? "border-gray-700 bg-gray-750"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <h4
                                    className={`text-sm font-semibold ${
                                      isDark ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {t("roster.contractingTypes.title") ||
                                      "Contracting Types"}
                                  </h4>
                                  <ChevronUp
                                    title={
                                      t(
                                        "roster.contractingTypes.hideContractingTypes"
                                      ) || "Hide Contracting Types"
                                    }
                                    onClick={() =>
                                      handleViewContractingTypes(shift)
                                    }
                                    size={16}
                                    className={`cursor-pointer ${
                                      isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  />
                                </div>
                              </div>

                              {/* Card Content */}
                              <div className="p-4">
                                <div className="space-y-3">
                                  {shiftContractingTypes[shift.id].map(
                                    (contractingType, contractingIndex) => (
                                      <div
                                        key={contractingType.id}
                                        className={`p-3 rounded-md border transition-colors ${
                                          isDark
                                            ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          {/* Contracting Type Info */}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                              <h5
                                                className={`text-sm font-medium truncate ${
                                                  isDark
                                                    ? "text-white"
                                                    : "text-gray-900"
                                                }`}
                                              >
                                                {currentLang === "ar"
                                                  ? contractingType.contractingTypeNameAr ||
                                                    contractingType.contractingTypeName
                                                  : contractingType.contractingTypeNameEn ||
                                                    contractingType.contractingTypeName}
                                              </h5>
                                            </div>
                                            <p
                                              className={`text-xs ${
                                                isDark
                                                  ? "text-gray-400"
                                                  : "text-gray-600"
                                              }`}
                                            >
                                              <span>
                                                {
                                                  contractingType.defaultRequiredDoctors
                                                }
                                                -
                                                {
                                                  contractingType.defaultMaxDoctors
                                                }{" "}
                                                docs
                                              </span>
                                            </p>
                                          </div>

                                          {/* Action Buttons */}
                                          <div className="flex items-center space-x-2 ml-3">
                                            <button
                                              onClick={() =>
                                                handleUpdateContractingType(
                                                  contractingType
                                                )
                                              }
                                              className={`p-2 rounded-md transition-all duration-200 ${
                                                isDark
                                                  ? "text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                                                  : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                              }`}
                                              title="Update contracting type"
                                            >
                                              <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteContractingType(
                                                  contractingType.id,
                                                  contractingIndex
                                                )
                                              }
                                              disabled={
                                                loading.deleteShiftContractingType &&
                                                deleteContractingIdx ==
                                                  contractingIndex
                                              }
                                              className={`p-2 rounded-md transition-all duration-200 disabled:opacity-50 ${
                                                isDark
                                                  ? "text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
                                              }`}
                                              title="Delete contracting type"
                                            >
                                              <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => handleViewContractingTypes(shift)}
                            disabled={loadingContractingTypes[shift.id]}
                            className={`w-full inline-flex items-center justify-center px-3 py-2 text-white text-sm rounded transition-colors disabled:opacity-50 ${
                              visibleContractingTypes[shift.id]
                                ? "bg-gray-600 hover:bg-gray-700"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                          >
                            {loadingContractingTypes[shift.id] ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              <>
                                {visibleContractingTypes[shift.id] ? (
                                  <>
                                    <EyeOff
                                      size={14}
                                      className={isRTL ? "ml-1" : "mr-1"}
                                    />
                                    {t(
                                      "roster.contractingTypes.hideContractingTypes"
                                    ) || "Hide Contracting Types"}
                                  </>
                                ) : (
                                  <>
                                    <Eye
                                      size={14}
                                      className={isRTL ? "ml-1" : "mr-1"}
                                    />
                                    {t(
                                      "roster.contractingTypes.viewContractingTypes"
                                    ) || "View Contracting Types"}
                                  </>
                                )}
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => openContractingModal(shift)}
                            className="w-full inline-flex items-center justify-center px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                          >
                            <Users
                              size={14}
                              className={isRTL ? "ml-1" : "mr-1"}
                            />
                            {t("roster.contractingTypes.addContractingTypes") ||
                              "Add Contracting Types"}
                          </button>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-600">
                            <p
                              className={`text-xs ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {t("roster.departmentss.createdBy") ||
                                "Created by"}
                              : {shift.createdByName}
                            </p>
                            <button
                              onClick={() => handleDeleteShift(shift, index)}
                              className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                              disabled={loading.delete && deleteIdx == index}
                            >
                              {t("roster.departmentss.delete") || "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!rosterDepartments || rosterDepartments.length === 0 ? (
          <div
            className={`text-center py-12 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-lg shadow border`}
          >
            <Building2
              size={48}
              className={`mx-auto mb-4 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-lg font-medium mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.departmentss.noDepartments")}
            </h3>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              {t("roster.departmentss.noDepartmentsMessage")}
            </p>
          </div>
        ) : null}
      </div>

      {/* Shift Modal */}
      {isShiftModalOpen && (
        <ModalShiftsDepartment
          selectedDepartment={selectedDepartment}
          onClose={closeShiftModal}
        />
      )}

      {/* Contracting Types Modal */}
      {isContractingModalOpen && (
        <ModalContractingTypesDepartment
          selectedShift={selectedShift}
          onClose={closeContractingModal}
        />
      )}
      {/* Contracting Types Modal */}
      {editModalOpen && (
        <ModalEditContractingTypeModal
          selectedShift={selectedShift}
          selectedContractingType={selectedContractingType}
          onClose={closeEditContractingModal}
        />
      )}

      {/* Footer actions */}
      <div className="max-w-7xl mx-auto mt-10">
        <div
          className={`flex flex-col sm:flex-row ${
            isRTL
              ? "space-y-3 sm:space-y-0 sm:space-x-reverse sm:space-x-3"
              : "space-y-3 sm:space-y-0 sm:space-x-3"
          }`}
        >
          {/* Roster Data */}
          <button
            onClick={goToRosterData}
            className={`flex-1 inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium transition-colors
              ${
                isDark
                  ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            <Eye size={18} className={isRTL ? "ml-2" : "mr-2"} />
            {t("roster.actions.view") || "Roster Data"}
          </button>

          {/* Next Step */}
          <button
            onClick={navigateToNextPhase}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {t("roster.departmentss.nextPhase") || "Next Step"}
            <ArrowRight
              size={18}
              className={isRTL ? "mr-2 rotate-180" : "ml-2"}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RosterDepartments
