import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { createDepartment } from "../../../state/act/actDepartment"
import { useNavigate } from "react-router-dom"
import UseInitialValues from "../../../hooks/use-initial-values"
import UseFormValidation from "../../../hooks/use-form-validation"
import { getCategoryTypes } from "../../../state/act/actCategory"
import { getUserSummaries } from "../../../state/slices/user"
import LoadingGetData from "../../../components/LoadingGetData"
import { Search, User, ArrowLeft, ArrowRight } from "lucide-react"

function CreateDepartment() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const currentLang = i18n.language
  const isRTL = currentLang === "ar"

  // State for user search and selection
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const { mymode } = useSelector((state) => state.mode)
  const isDark = mymode === "dark"

  const { VALIDATION_SCHEMA_ADD_DEPARTMENT } = UseFormValidation()

  // Initial form values (updated to include userId)
  const { INITIAL_VALUES_ADD_DEPARTMENT } = UseInitialValues()

  // Redux selectors
  const { loadingCreateDepartment, createError, createSuccess, createMessage } =
    useSelector((state) => state.department)
  const { loadingGetCategoryTypes, categoryTypes } = useSelector(
    (state) => state.category
  )
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.users)

  // Load initial data
  useEffect(() => {
    dispatch(getCategoryTypes())
    dispatch(getUserSummaries({ page: 1, pageSize: 50 }))
  }, [dispatch])

  const hasUsers = users && users.length > 0

  // Handle user search with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (userSearchTerm.length >= 2) {
        dispatch(
          getUserSummaries({
            page: 1,
            pageSize: 50,
            searchTerm: userSearchTerm,
          })
        )
      } else if (userSearchTerm.length === 0) {
        dispatch(getUserSummaries({ page: 1, pageSize: 50 }))
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [userSearchTerm, dispatch])

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Updated validation schema

  // Updated initial values

  // Handle user search input
  const handleUserSearchChange = (e, setFieldValue) => {
    const value = e.target.value
    setUserSearchTerm(value)
    setShowUserDropdown(true)

    if (!value) {
      setSelectedUser(null)
      setFieldValue("manager.userId", "")
    }
  }

  // Handle user selection
  const handleUserSelect = (user, setFieldValue) => {
    setSelectedUser(user)
    setUserSearchTerm(`${user.nameEnglish} (${user.mobile})`)
    setFieldValue("manager.userId", user.id)
    setShowUserDropdown(false)
  }

  // Filter users based on search
  const filteredUsers =
    users?.filter((user) => {
      if (!userSearchTerm) return true
      const searchLower = userSearchTerm.toLowerCase()
      return (
        user.nameEnglish.toLowerCase().includes(searchLower) ||
        user.nameArabic?.includes(userSearchTerm) ||
        user.mobile.includes(userSearchTerm) ||
        user.role.toLowerCase().includes(searchLower)
      )
    }) || []

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    // Transform the data to match the expected API format
    const { manager, ...otherData } = values
    console.log(otherData)
    const submissionData = {
      ...values,
      ...(values.manager.userId
        ? {
            manager: {
              ...values.manager,
              startDate: new Date(values.manager.startDate).toISOString(),
            },
          }
        : {}),
    }

    console.log(submissionData)

    const sndData = {
      ...otherData,
      ...(values.manager?.userId && { manager: values.manager }),
    }
    console.log("send data", sndData)
    dispatch(createDepartment(sndData))
      .unwrap()
      .then(() => {
        // Success handling
        resetForm()
        toast.success(t("departmentForm.success.created"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        navigate("/admin-panel/departments")
      })
      .catch((error) => {
        console.error("Department creation error:", error)

        Swal.fire({
          title: t("departmentForm.error.title"),
          text:
            currentLang === "en"
              ? error?.messageEn || error?.message
              : error?.messageAr ||
                error?.message ||
                t("department.error.message"),
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#ef4444",
          background: isDark ? "#2d2d2d" : "#ffffff",
          color: isDark ? "#f0f0f0" : "#111827",
        })
      })
  }

  if (loadingGetCategoryTypes) return <LoadingGetData />

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
                onClick={() => navigate("/admin-panel/departments")}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {currentLang == "en" ? (
                  <ArrowLeft size={20} />
                ) : (
                  <ArrowRight size={20} />
                )}
              </button>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                } ${isRTL ? "font-arabic" : ""}`}
              >
                {t("departmentForm.title") || "Create Department"}
              </h1>
            </div>
          </div>

          {/* Form */}
          <div
            className={`rounded-lg shadow border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6">
              <Formik
                initialValues={INITIAL_VALUES_ADD_DEPARTMENT}
                validationSchema={VALIDATION_SCHEMA_ADD_DEPARTMENT}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                      <h3
                        className={`text-lg font-semibold border-b pb-2 ${
                          isDark
                            ? "text-white border-gray-600"
                            : "text-gray-900 border-gray-200"
                        }`}
                      >
                        {t("departmentForm.sections.basicInfo") ||
                          "Basic Information"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Arabic Name */}
                        <div>
                          <label
                            htmlFor="nameArabic"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("departmentForm.fields.nameArabic") ||
                              "Arabic Name"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="nameArabic"
                            name="nameArabic"
                            dir="rtl"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.nameArabic && touched.nameArabic
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                            placeholder={
                              t("departmentForm.placeholders.nameArabic") ||
                              "Enter Arabic name"
                            }
                          />
                          <ErrorMessage
                            name="nameArabic"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        {/* English Name */}
                        <div>
                          <label
                            htmlFor="nameEnglish"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("departmentForm.fields.nameEnglish") ||
                              "English Name"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="nameEnglish"
                            name="nameEnglish"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.nameEnglish && touched.nameEnglish
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                            placeholder={
                              t("departmentForm.placeholders.nameEnglish") ||
                              "Enter English name"
                            }
                          />
                          <ErrorMessage
                            name="nameEnglish"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Selection */}
                        {/* <div>
                          <label
                            htmlFor="categoryId"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("departmentForm.fields.category") || "Category"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="select"
                            id="categoryId"
                            name="categoryId"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.categoryId && touched.categoryId
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                          >
                            <option value="">
                              {t("departmentForm.placeholders.category") ||
                                "Select category"}
                            </option>
                            {categoryTypes?.map((category) => (
                              <option key={category.id} value={category.id}>
                                {currentLang === "ar"
                                  ? category.nameArabic
                                  : category.nameEnglish}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="categoryId"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div> */}

                        {/* Code */}
                        <div>
                          <label
                            htmlFor="code"
                            className={`block text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {t("categoryForm.fields.code") || "Code"}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="code"
                            name="code"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900"
                            } ${
                              errors.code && touched.code
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                            placeholder={
                              t("categoryForm.placeholders.code") ||
                              "Enter code"
                            }
                            onChange={(e) => {
                              const upperValue = e.target.value.toUpperCase()
                              setFieldValue("code", upperValue)
                            }}
                          />
                          <ErrorMessage
                            name="code"
                            component="div"
                            className="mt-1 text-sm text-red-600"
                          />
                          <p
                            className={`mt-1 text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("categoryForm.hints.code") ||
                              "Code will be automatically converted to uppercase"}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label
                          htmlFor="location"
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("departmentForm.fields.location") || "Location"}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          id="location"
                          name="location"
                          dir={isRTL ? "rtl" : "ltr"}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900"
                          } ${
                            errors.location && touched.location
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                          }`}
                          placeholder={
                            t("departmentForm.placeholders.location") ||
                            "Enter location"
                          }
                        />
                        <ErrorMessage
                          name="location"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor="description"
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {t("departmentForm.fields.description") ||
                            "Description"}
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={3}
                          dir={isRTL ? "rtl" : "ltr"}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900"
                          } ${
                            errors.description && touched.description
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                          }`}
                          placeholder={
                            t("departmentForm.placeholders.description") ||
                            "Enter description"
                          }
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      {/* Is Active */}
                      <div
                        className={`flex items-center ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Field
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="isActive"
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          } ${isRTL ? "mr-2" : "ml-2"}`}
                        >
                          {t("departmentForm.fields.isActive") || "Active"}
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
                        onClick={() => navigate("/admin-panel/departments")}
                      >
                        {t("departmentForm.buttons.cancel") || "Cancel"}
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || loadingCreateDepartment}
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                          isSubmitting || loadingCreateDepartment
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting || loadingCreateDepartment ? (
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
                            {t("departmentForm.buttons.creating") ||
                              "Creating..."}
                          </div>
                        ) : (
                          t("departmentForm.buttons.create") ||
                          "Create Department"
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

export default CreateDepartment
