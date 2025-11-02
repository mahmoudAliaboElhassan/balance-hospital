import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import {
  updateManagerPermission,
  getDepartmentById,
} from "../../../state/act/actDepartment"
import { useNavigate, useParams } from "react-router-dom"
import LoadingGetData from "../../../components/LoadingGetData"
import { ArrowLeft, User, Building2, Calendar, Shield } from "lucide-react"

function EditManagerPermission() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { depId: id } = useParams()
  const currentLang = i18n.language
  const isRTL = currentLang === "ar"

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  // Redux selectors
  const {
    selectedDepartment,
    loadingGetSingleDepartment,
    singleDepartmentError,
    loadingUpdateManagerPermission,
  } = useSelector((state) => state.department)

  // Load department data
  useEffect(() => {
    if (id) {
      dispatch(getDepartmentById(id))
    }
  }, [dispatch, id])

  // Validation schema for manager permissions
  const validationSchema = Yup.object({
    canViewDepartment: Yup.boolean(),
    canEditDepartment: Yup.boolean(),
    canViewDepartmentReports: Yup.boolean(),
    canManageSchedules: Yup.boolean(),
    canManageStaff: Yup.boolean(),
  })

  // Initial values based on current manager permissions
  const getInitialValues = () => {
    if (!selectedDepartment?.manager) {
      return {
        canViewDepartment: false,
        canEditDepartment: false,
        canViewDepartmentReports: false,
        canManageSchedules: false,
        canManageStaff: false,
      }
    }

    return {
      canViewDepartment: selectedDepartment.manager.canViewDepartment || false,
      canEditDepartment: selectedDepartment.manager.canEditDepartment || false,
      canViewDepartmentReports:
        selectedDepartment.manager.canViewDepartmentReports || false,
      canManageSchedules:
        selectedDepartment.manager.canManageSchedules || false,
      canManageStaff: selectedDepartment.manager.canManageStaff || false,
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        updateManagerPermission({
          id: id,
          data: values,
        })
      ).unwrap()

      toast.success(
        t("managerPermissions.success.updated") ||
          "Manager permissions updated successfully",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )

      navigate(`/admin-panel/department/${id}`)
    } catch (error) {
      console.error("Manager permissions update error:", error)

      Swal.fire({
        title: t("managerPermissions.error.title") || "Error",
        text:
          currentLang === "en"
            ? error?.messageEn ||
              error?.message ||
              "Failed to update manager permissions"
            : error?.messageAr ||
              error?.message ||
              "فشل في تحديث صلاحيات المدير",
        icon: "error",
        confirmButtonText: t("common.ok") || "OK",
        confirmButtonColor: "#ef4444",
        background: isDark ? "#2d2d2d" : "#ffffff",
        color: isDark ? "#f0f0f0" : "#111827",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loadingGetSingleDepartment) {
    return (
      <LoadingGetData
        text={t("gettingData.departmentData") || "Loading department data..."}
      />
    )
  }

  // Error state
  if (singleDepartmentError) {
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
              {t("department.error.title") || "Error"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {singleDepartmentError.message}
            </p>
            <button
              onClick={() => navigate("/admin-panel/departments")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("department.details.backToDepartments") ||
                "Back to Departments"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No department found
  if (!selectedDepartment) {
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
              <Building2 className="w-10 h-10 text-gray-500" />
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("department.empty.title") || "Department Not Found"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {t("department.error.notFound") ||
                "The requested department was not found."}
            </p>
            <button
              onClick={() => navigate("/admin-panel/departments")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("department.details.backToDepartments") ||
                "Back to Departments"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No manager assigned
  if (!selectedDepartment.manager) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isDark ? "from-gray-900 to-gray-800" : "from-yellow-50 to-orange-100"
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
                isDark ? "bg-yellow-900/30" : "bg-yellow-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <User className="w-10 h-10 text-yellow-500" />
            </div>
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {t("managerPermissions.noManager.title") || "No Manager Assigned"}
            </h3>
            <p
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-8 text-lg`}
            >
              {t("managerPermissions.noManager.description") ||
                "This department doesn't have a manager assigned. Please assign a manager first."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/admin-panel/departments")}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                {t("department.details.backToDepartments") ||
                  "Back to Departments"}
              </button>
              <button
                onClick={() => navigate(`/admin-panel/departments/edit/${id}`)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                {t("managerPermissions.assignManager") || "Assign Manager"}
              </button>
            </div>
          </div>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate(`/admin-panel/department/${id}`)}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <ArrowLeft size={20} />
              </button>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } ${isRTL ? "font-arabic" : ""}`}
              >
                {t("managerPermissions.title") || "Update Manager Permissions"}
              </h1>
            </div>
          </div>

          {/* Department Info Card */}
          <div
            className={`rounded-lg shadow border mb-6 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Department Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-blue-900/30" : "bg-blue-100"
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("managerPermissions.department") || "Department"}
                    </p>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {currentLang === "ar"
                        ? selectedDepartment.nameArabic
                        : selectedDepartment.nameEnglish}
                    </p>
                  </div>
                </div>

                {/* Manager Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-green-900/30" : "bg-green-100"
                    }`}
                  >
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("managerPermissions.manager") || "Manager"}
                    </p>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {currentLang === "ar"
                        ? selectedDepartment.manager.userNameArabic
                        : selectedDepartment.manager.userNameEnglish}
                    </p>
                  </div>
                </div>

                {/* Start Date */}
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-purple-900/30" : "bg-purple-100"
                    }`}
                  >
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("managerPermissions.startDate") || "Start Date"}
                    </p>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedDepartment.manager.startDate
                        ? new Date(
                            selectedDepartment.manager.startDate
                          ).toLocaleDateString(
                            currentLang === "ar" ? "ar-EG" : "en-US"
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Form */}
          <div
            className={`rounded-lg shadow border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-orange-900/30" : "bg-orange-100"
                  }`}
                >
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("managerPermissions.permissions") || "Manager Permissions"}
                </h3>
              </div>

              <Formik
                initialValues={getInitialValues()}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values }) => (
                  <Form className="space-y-6">
                    {/* Permissions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Can View Department */}
                      <div
                        className={`flex items-center p-4 border rounded-lg transition-colors ${
                          values.canViewDepartment
                            ? isDark
                              ? "border-blue-500 bg-blue-900/20"
                              : "border-blue-500 bg-blue-50"
                            : isDark
                            ? "border-gray-600 bg-gray-700/50"
                            : "border-gray-300 bg-gray-50"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Field
                          type="checkbox"
                          id="canViewDepartment"
                          name="canViewDepartment"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="canViewDepartment"
                          className={`text-sm font-medium cursor-pointer ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } ${isRTL ? "mr-3" : "ml-3"}`}
                        >
                          {t("managerPermissions.canViewDepartment") ||
                            "Can View Department"}
                        </label>
                      </div>

                      {/* Can Edit Department */}
                      <div
                        className={`flex items-center p-4 border rounded-lg transition-colors ${
                          values.canEditDepartment
                            ? isDark
                              ? "border-green-500 bg-green-900/20"
                              : "border-green-500 bg-green-50"
                            : isDark
                            ? "border-gray-600 bg-gray-700/50"
                            : "border-gray-300 bg-gray-50"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Field
                          type="checkbox"
                          id="canEditDepartment"
                          name="canEditDepartment"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="canEditDepartment"
                          className={`text-sm font-medium cursor-pointer ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } ${isRTL ? "mr-3" : "ml-3"}`}
                        >
                          {t("managerPermissions.canEditDepartment") ||
                            "Can Edit Department"}
                        </label>
                      </div>

                      {/* Can View Department Reports */}
                      <div
                        className={`flex items-center p-4 border rounded-lg transition-colors ${
                          values.canViewDepartmentReports
                            ? isDark
                              ? "border-purple-500 bg-purple-900/20"
                              : "border-purple-500 bg-purple-50"
                            : isDark
                            ? "border-gray-600 bg-gray-700/50"
                            : "border-gray-300 bg-gray-50"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Field
                          type="checkbox"
                          id="canViewDepartmentReports"
                          name="canViewDepartmentReports"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="canViewDepartmentReports"
                          className={`text-sm font-medium cursor-pointer ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } ${isRTL ? "mr-3" : "ml-3"}`}
                        >
                          {t("managerPermissions.canViewDepartmentReports") ||
                            "Can View Department Reports"}
                        </label>
                      </div>

                      {/* Can Manage Schedules */}
                      <div
                        className={`flex items-center p-4 border rounded-lg transition-colors ${
                          values.canManageSchedules
                            ? isDark
                              ? "border-orange-500 bg-orange-900/20"
                              : "border-orange-500 bg-orange-50"
                            : isDark
                            ? "border-gray-600 bg-gray-700/50"
                            : "border-gray-300 bg-gray-50"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Field
                          type="checkbox"
                          id="canManageSchedules"
                          name="canManageSchedules"
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="canManageSchedules"
                          className={`text-sm font-medium cursor-pointer ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } ${isRTL ? "mr-3" : "ml-3"}`}
                        >
                          {t("managerPermissions.canManageSchedules") ||
                            "Can Manage Schedules"}
                        </label>
                      </div>

                      {/* Can Manage Staff */}
                      <div
                        className={`flex items-center p-4 border rounded-lg transition-colors md:col-span-2 ${
                          values.canManageStaff
                            ? isDark
                              ? "border-red-500 bg-red-900/20"
                              : "border-red-500 bg-red-50"
                            : isDark
                            ? "border-gray-600 bg-gray-700/50"
                            : "border-gray-300 bg-gray-50"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Field
                          type="checkbox"
                          id="canManageStaff"
                          name="canManageStaff"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="canManageStaff"
                          className={`text-sm font-medium cursor-pointer ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } ${isRTL ? "mr-3" : "ml-3"}`}
                        >
                          {t("managerPermissions.canManageStaff") ||
                            "Can Manage Staff"}
                        </label>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div
                      className={`flex justify-end space-x-3 pt-6 border-t ${
                        isDark ? "border-gray-600" : "border-gray-200"
                      } ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <button
                        type="button"
                        className={`px-6 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isDark
                            ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          navigate(`/admin-panel/department/${id}`)
                        }
                      >
                        {t("managerPermissions.buttons.cancel") || "Cancel"}
                      </button>

                      <button
                        type="submit"
                        disabled={
                          isSubmitting || loadingUpdateManagerPermission
                        }
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isSubmitting || loadingUpdateManagerPermission
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting || loadingUpdateManagerPermission ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {t("managerPermissions.buttons.updating") ||
                              "Updating..."}
                          </div>
                        ) : (
                          t("managerPermissions.buttons.update") ||
                          "Update Permissions"
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
    </div>
  )
}

export default EditManagerPermission
