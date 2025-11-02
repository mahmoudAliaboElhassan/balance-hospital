import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Formik, Form } from "formik"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import i18next from "i18next"
import * as Yup from "yup"
import {
  ArrowLeft,
  RefreshCw,
  Info,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Building2,
  Clock,
  GraduationCap,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import {
  addWorkingHours,
  getRosterById,
  getRosterTree,
} from "../../../state/act/actRosterManagement"
import LoadingGetData from "../../../components/LoadingGetData"

function GenerateWorkingHours() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const currentLang = i18next.language
  const isRTL = currentLang === "ar"

  const [rosterId, setRosterId] = useState(null)
  const [expandedDepartments, setExpandedDepartments] = useState(new Set())
  const [expandedShifts, setExpandedShifts] = useState(new Set())

  // Track selections hierarchically
  const [selectedDepartments, setSelectedDepartments] = useState(new Set())
  const [selectedShifts, setSelectedShifts] = useState(new Set())
  const [selectedDegrees, setSelectedDegrees] = useState(new Set())

  const { selectedRoster, rosterTree, loading } = useSelector(
    (state) => state.rosterManagement
  )

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  // Get roster ID and fetch data
  useEffect(() => {
    const storedRosterId = localStorage.getItem("rosterId")
    if (storedRosterId) {
      setRosterId(storedRosterId)
      dispatch(getRosterById({ rosterId: storedRosterId }))
      dispatch(getRosterTree({ rosterId: storedRosterId }))
    }
  }, [dispatch])

  // Validation schema
  const validationSchema = Yup.object({
    overwriteExisting: Yup.boolean(),
  })

  // Initial values
  const initialValues = {
    overwriteExisting: false,
  }

  // Toggle functions
  const toggleDepartment = (deptId) => {
    const newExpanded = new Set(expandedDepartments)
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId)
    } else {
      newExpanded.add(deptId)
    }
    setExpandedDepartments(newExpanded)
  }

  const toggleShift = (shiftId) => {
    const newExpanded = new Set(expandedShifts)
    if (newExpanded.has(shiftId)) {
      newExpanded.delete(shiftId)
    } else {
      newExpanded.add(shiftId)
    }
    setExpandedShifts(newExpanded)
  }

  // Selection handlers
  const handleDepartmentToggle = (departmentId) => {
    const newSelected = new Set(selectedDepartments)
    if (newSelected.has(departmentId)) {
      newSelected.delete(departmentId)
      // Clear shifts and degrees for this department
      const dept = rosterTree?.departments?.find(
        (d) => d.departmentId === departmentId
      )
      if (dept) {
        dept.shifts?.forEach((shift) => {
          selectedShifts.delete(shift.shiftHoursTypeId)
          shift.scientificDegrees?.forEach((degree) => {
            selectedDegrees.delete(degree.scientificDegreeId)
          })
        })
      }
    } else {
      newSelected.add(departmentId)
    }
    setSelectedDepartments(newSelected)
    setSelectedShifts(new Set(selectedShifts))
    setSelectedDegrees(new Set(selectedDegrees))
  }

  const handleShiftToggle = (shiftHoursTypeId, departmentId) => {
    const newSelected = new Set(selectedShifts)
    if (newSelected.has(shiftHoursTypeId)) {
      newSelected.delete(shiftHoursTypeId)
      // Clear degrees for this shift
      const dept = rosterTree?.departments?.find(
        (d) => d.departmentId === departmentId
      )
      const shift = dept?.shifts?.find(
        (s) => s.shiftHoursTypeId === shiftHoursTypeId
      )
      shift?.scientificDegrees?.forEach((degree) => {
        selectedDegrees.delete(degree.scientificDegreeId)
      })
    } else {
      newSelected.add(shiftHoursTypeId)
      // Auto-select parent department
      selectedDepartments.add(departmentId)
    }
    setSelectedShifts(newSelected)
    setSelectedDepartments(new Set(selectedDepartments))
    setSelectedDegrees(new Set(selectedDegrees))
  }

  const handleDegreeToggle = (
    scientificDegreeId,
    shiftHoursTypeId,
    departmentId
  ) => {
    const newSelected = new Set(selectedDegrees)
    if (newSelected.has(scientificDegreeId)) {
      newSelected.delete(scientificDegreeId)
    } else {
      newSelected.add(scientificDegreeId)
      // Auto-select parent shift and department
      selectedShifts.add(shiftHoursTypeId)
      selectedDepartments.add(departmentId)
    }
    setSelectedDegrees(newSelected)
    setSelectedShifts(new Set(selectedShifts))
    setSelectedDepartments(new Set(selectedDepartments))
  }

  // Check if department is fully selected (all children selected)
  const isDepartmentFullySelected = (dept) => {
    if (!selectedDepartments.has(dept.departmentId)) return false
    return dept.shifts?.every((shift) =>
      selectedShifts.has(shift.shiftHoursTypeId)
    )
  }

  // Check if shift is fully selected (all children selected)
  const isShiftFullySelected = (shift) => {
    if (!selectedShifts.has(shift.shiftHoursTypeId)) return false
    return shift.scientificDegrees?.every((degree) =>
      selectedDegrees.has(degree.scientificDegreeId)
    )
  }

  // Calculate totals
  const calculateTotals = () => {
    if (!rosterTree?.departments)
      return { generated: 0, expected: 0, percent: 0 }

    const totals = rosterTree.departments.reduce(
      (acc, dept) => ({
        generated: acc.generated + dept.generatedCells,
        expected: acc.expected + dept.expectedCells,
      }),
      { generated: 0, expected: 0 }
    )

    return {
      ...totals,
      percent:
        totals.expected > 0 ? (totals.generated / totals.expected) * 100 : 0,
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!rosterId) {
        throw new Error(t("roster.workingHourss.error.noRosterId"))
      }

      // Build the request based on selections
      const generateData = {
        rosterId: parseInt(rosterId),
        departmentIds:
          selectedDepartments.size > 0 ? Array.from(selectedDepartments) : null,
        shiftHoursTypeIds:
          selectedShifts.size > 0 ? Array.from(selectedShifts) : null,
        scientificDegreeIds:
          selectedDegrees.size > 0 ? Array.from(selectedDegrees) : null,
        overwriteExisting: values.overwriteExisting,
      }

      console.log("Generating working hours with data:", generateData)

      const result = await dispatch(addWorkingHours(generateData)).unwrap()

      // Refresh tree data
      await dispatch(getRosterTree({ rosterId }))

      toast.success(
        currentLang === "en"
          ? result.messageEn
          : result.message || t("roster.workingHourss.success.generated"),
        {
          position: "top-right",
          autoClose: 3000,
        }
      )

      // Show generation summary
      if (result.data) {
        Swal.fire({
          title:
            t("roster.workingHourss.success.summaryTitle") ||
            "Generation Complete",
          html: `
            <div class="text-left">
              <p><strong>${
                t("roster.workingHourss.summary.added") || "Added"
              }:</strong> ${result.data.addedCount}</p>
              <p><strong>${
                t("roster.workingHourss.summary.updated") || "Updated"
              }:</strong> ${result.data.updatedCount}</p>
              <p><strong>${
                t("roster.workingHourss.summary.skipped") || "Skipped"
              }:</strong> ${result.data.skippedCount}</p>
              <p><strong>${
                t("roster.workingHourss.summary.completion") || "Completion"
              }:</strong> ${result.data.completionPercentage.toFixed(1)}%</p>
            </div>
          `,
          icon: "success",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#10b981",
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        })
      }

      navigate(`/admin-panel/rosters/${rosterId}`)
    } catch (error) {
      console.error("Working hours generation error:", error)

      Swal.fire({
        title: t("roster.workingHourss.error.title"),
        text:
          currentLang === "en"
            ? error?.messageEn ||
              error?.message ||
              t("roster.workingHourss.error.message")
            : error?.message || t("roster.workingHourss.error.message"),
        icon: "error",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#ef4444",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const navigateBack = () => {
    if (rosterId) {
      navigate(`/admin-panel/rosters/departments`)
    } else {
      navigate(`/admin-panel/rosters`)
    }
  }

  if (loading.fetch || loading.getRosterTree) {
    return <LoadingGetData text={t("gettingData.roster")} />
  }

  const totals = calculateTotals()
  const hasExistingData = totals.generated > 0

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={navigateBack}
              className={`p-2 rounded-lg ${isRTL ? "ml-4" : "mr-4"} ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } transition-colors`}
            >
              {currentLang === "en" ? (
                <ArrowLeft size={20} />
              ) : (
                <ArrowRight size={20} />
              )}
            </button>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.workingHourss.generateTitle") ||
                  "Generate Working Hours"}
              </h1>
              {selectedRoster && (
                <div className="mt-2">
                  <p
                    className={`text-lg ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {selectedRoster.title}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {selectedRoster.categoryName} • {selectedRoster.month}/
                    {selectedRoster.year}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {hasExistingData && (
          <div
            className={`mb-6 p-6 rounded-lg border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.workingHourss.overallProgress") ||
                  "Overall Progress"}
              </h3>
              <span
                className={`text-2xl font-bold ${
                  totals.percent === 100
                    ? "text-green-500"
                    : totals.percent > 50
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {totals.percent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div
                className={`h-4 rounded-full transition-all ${
                  totals.percent === 100
                    ? "bg-green-500"
                    : totals.percent > 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${totals.percent}%` }}
              ></div>
            </div>
            <p
              className={`text-sm mt-2 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {totals.generated} / {totals.expected}{" "}
              {t("roster.workingHourss.cellsGenerated") || "cells generated"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Tree Structure with Selection */}
          <div
            className={`rounded-lg border p-6 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.workingHourss.selectStructure") ||
                "Select Structure to Generate"}
            </h2>

            {/* Info */}
            <div
              className={`mb-4 p-3 rounded-lg border-l-4 border-blue-500 ${
                isDark ? "bg-blue-900/20" : "bg-blue-50"
              }`}
            >
              <div className="flex items-start gap-2">
                <Info className="text-blue-500 mt-0.5" size={14} />
                <p
                  className={`text-xs ${
                    isDark ? "text-blue-200" : "text-blue-700"
                  }`}
                >
                  {t("roster.workingHourss.hierarchyInfo") ||
                    "Select departments, then shifts, then scientific degrees. Leave empty to generate for all."}
                </p>
              </div>
            </div>

            {rosterTree?.departments?.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Info size={48} className="mx-auto mb-4 opacity-50" />
                <p>
                  {t("roster.workingHourss.noStructure") ||
                    "No roster structure found"}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {rosterTree?.departments?.map((dept) => (
                  <div key={dept.departmentId}>
                    {/* Department */}
                    <div
                      className={`p-3 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedDepartments.has(dept.departmentId)}
                            onChange={() =>
                              handleDepartmentToggle(dept.departmentId)
                            }
                            className="rounded"
                          />
                          <button
                            onClick={() => toggleDepartment(dept.departmentId)}
                            className="flex items-center gap-2 flex-1 text-left"
                          >
                            {expandedDepartments.has(dept.departmentId) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                            <Building2 size={16} />
                            <span className="font-medium">
                              {currentLang === "ar"
                                ? dept.nameArabic
                                : dept.nameEnglish}
                            </span>
                          </button>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            dept.completionPercent === 100
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : dept.completionPercent > 0
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {dept.completionPercent.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Shifts */}
                    {expandedDepartments.has(dept.departmentId) && (
                      <div
                        className={`${isRTL ? "mr-6" : "ml-6"} mt-2 space-y-2`}
                      >
                        {dept.shifts?.map((shift) => (
                          <div key={shift.shiftHoursTypeId}>
                            <div
                              className={`p-2 rounded border ${
                                isDark
                                  ? "bg-gray-750 border-gray-600"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedShifts.has(
                                      shift.shiftHoursTypeId
                                    )}
                                    onChange={() =>
                                      handleShiftToggle(
                                        shift.shiftHoursTypeId,
                                        dept.departmentId
                                      )
                                    }
                                    className="rounded"
                                  />
                                  <button
                                    onClick={() =>
                                      toggleShift(shift.shiftHoursTypeId)
                                    }
                                    className="flex items-center gap-2 flex-1 text-left"
                                  >
                                    {expandedShifts.has(
                                      shift.shiftHoursTypeId
                                    ) ? (
                                      <ChevronDown size={14} />
                                    ) : (
                                      <ChevronRight size={14} />
                                    )}
                                    <Clock size={14} />
                                    <span className="text-sm">
                                      {currentLang === "ar"
                                        ? shift.nameArabic
                                        : shift.nameEnglish}
                                    </span>
                                  </button>
                                </div>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    shift.completionPercent === 100
                                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                      : shift.completionPercent > 0
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {shift.completionPercent.toFixed(0)}%
                                </span>
                              </div>
                            </div>

                            {/* Scientific Degrees */}
                            {expandedShifts.has(shift.shiftHoursTypeId) && (
                              <div
                                className={`${
                                  isRTL ? "mr-6" : "ml-6"
                                } mt-1 space-y-1`}
                              >
                                {shift.scientificDegrees?.map((degree) => (
                                  <div
                                    key={degree.scientificDegreeId}
                                    className={`p-2 rounded text-sm ${
                                      isDark
                                        ? "bg-gray-800 text-gray-300"
                                        : "bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 flex-1">
                                        <input
                                          type="checkbox"
                                          checked={selectedDegrees.has(
                                            degree.scientificDegreeId
                                          )}
                                          onChange={() =>
                                            handleDegreeToggle(
                                              degree.scientificDegreeId,
                                              shift.shiftHoursTypeId,
                                              dept.departmentId
                                            )
                                          }
                                          className="rounded text-xs"
                                        />
                                        <GraduationCap size={12} />
                                        <span className="text-xs">
                                          {currentLang === "ar"
                                            ? degree.nameArabic
                                            : degree.nameEnglish}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                        {degree.hasWorkingHours ? (
                                          <CheckCircle
                                            size={12}
                                            className="text-green-500"
                                          />
                                        ) : (
                                          <AlertCircle
                                            size={12}
                                            className="text-gray-400"
                                          />
                                        )}
                                        <span>
                                          {degree.generatedDays}/
                                          {degree.totalDays}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Generation Form */}
          <div
            className={`rounded-lg border p-6 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("roster.workingHourss.generateSettings") ||
                "Generation Settings"}
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-6">
                  {/* Selection Summary */}
                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <h3 className="text-sm font-medium mb-3">
                      {t("roster.workingHourss.selectionSummary") ||
                        "Selection Summary"}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>
                          {t("roster.workingHourss.departments") ||
                            "Departments"}
                          :
                        </span>
                        <span className="font-medium">
                          {selectedDepartments.size === 0
                            ? t("common.all") || "All"
                            : selectedDepartments.size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {t("roster.workingHourss.shifts") || "Shifts"}:
                        </span>
                        <span className="font-medium">
                          {selectedShifts.size === 0
                            ? t("common.all") || "All"
                            : selectedShifts.size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {t("roster.workingHourss.degrees") ||
                            "Scientific Degrees"}
                          :
                        </span>
                        <span className="font-medium">
                          {selectedDegrees.size === 0
                            ? t("common.all") || "All"
                            : selectedDegrees.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overwrite Checkbox */}
                  <div
                    className={`p-4 border rounded-lg ${
                      isDark
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <label
                          htmlFor="overwriteExisting"
                          className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("roster.workingHourss.overwriteExisting") ||
                            "Overwrite Existing"}
                        </label>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("roster.workingHourss.overwriteHelp") ||
                            "Replace existing working hours with defaults"}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id="overwriteExisting"
                        name="overwriteExisting"
                        checked={values.overwriteExisting}
                        onChange={(e) => {
                          values.overwriteExisting = e.target.checked
                        }}
                        className="w-4 h-4 rounded"
                      />
                    </div>
                  </div>

                  {/* Warning */}
                  {values.overwriteExisting && (
                    <div
                      className={`p-4 rounded-lg border-l-4 border-red-500 ${
                        isDark ? "bg-red-900/20" : "bg-red-50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          className="text-red-500 mt-0.5"
                          size={16}
                        />
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isDark ? "text-red-300" : "text-red-800"
                            }`}
                          >
                            {t("roster.workingHourss.warningTitle") ||
                              "Warning"}
                          </p>
                          <p
                            className={`text-sm mt-1 ${
                              isDark ? "text-red-200" : "text-red-700"
                            }`}
                          >
                            {t("roster.workingHourss.overwriteWarning") ||
                              "This will remove all doctor assignments!"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={navigateBack}
                      className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {currentLang === "en" ? (
                        <ArrowLeft size={16} className="mr-2" />
                      ) : (
                        <ArrowRight size={16} className="ml-2" />
                      )}
                      {t("common.back") || "Back"}
                    </button>

                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        loading.addWorkingHours ||
                        rosterTree?.departments?.length === 0
                      }
                      className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || loading.addWorkingHours ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t("common.generating") || "Generating..."}
                        </>
                      ) : (
                        <>
                          <RefreshCw
                            size={16}
                            className={isRTL ? "ml-2" : "mr-2"}
                          />
                          {t("roster.workingHourss.buttons.generate") ||
                            "Generate Working Hours"}
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateWorkingHours
