import React from "react"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"

function UseFormValidation() {
  const { t } = useTranslation()

  // Login Validation Schema
  const VALIDATION_SCHEMA_LOGIN = Yup.object().shape({
    email: Yup.string()
      .email(t("validationAuth.email.invalid"))
      .required(t("validationAuth.email.required")),
    password: Yup.string()
      .min(8, t("validationAuth.password.minLength"))
      .required(t("validationAuth.password.required")),
    rememberMe: Yup.boolean(),
  })

  // Reset Password Validation Schema
  const VALIDATION_SCHEMA_RESET_PASSWORD = Yup.object().shape({
    token: Yup.string().required(t("validationAuth.tokenRequired")),
    newPassword: Yup.string()
      .min(8, t("validationAuth.password.minLength"))
      .required(t("validationAuth.password.required")),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("validationAuth.password.match"))
      .required(t("validationAuth.password.confirmRequired")),
  })

  // Category Add Validation Schema
  const VALIDATION_SCHEMA_ADD_CATEGORY = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("categoryForm.validation.nameArabic.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("categoryForm.validation.nameEnglish.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    code: Yup.string()
      .required(t("categoryForm.validation.code.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(10, t("validation.maxLength", { count: 10 }))
      .matches(/^[A-Z0-9_]+$/, t("categoryForm.form.validation.code.pattern")),
    description: Yup.string().max(
      500,
      t("validation.maxLength", { count: 500 })
    ),
    isActive: Yup.boolean(),
  })

  // Category Edit Validation Schema
  const VALIDATION_SCHEMA_EDIT_CATEGORY = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("categoryForm.validation.nameArabic.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("categoryForm.validation.nameEnglish.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    code: Yup.string()
      .required(t("categoryForm.validation.code.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(10, t("validation.maxLength", { count: 10 }))
      .matches(/^[A-Z0-9_]+$/, t("categoryForm.validation.code.pattern")),
    description: Yup.string().max(
      500,
      t("validation.maxLength", { count: 500 })
    ),
    isActive: Yup.boolean(),
  })

  // Department Add Validation Schema
  const VALIDATION_SCHEMA_ADD_DEPARTMENT = Yup.object().shape({
    code: Yup.string()
      .required(t("department.form.validation.codeRequired"))
      .length(4, t("department.form.validation.codeLength")),
    // .matches(
    //   // Latin letters, digits, whitespace, and punctuation
    //   /^[A-Za-z]/,
    //   t("validation.englishOnly")
    // )
    nameArabic: Yup.string()
      .required(t("department.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("department.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    // categoryId: Yup.number()
    //   .required(t("roster.validation.categoryRequired"))
    //   .positive(t("validation.positiveNumber"))
    //   .integer(t("validation.integerOnly")),
    location: Yup.string().optional(),
    // .min(2, t("validation.minLength", { count: 2 }))
    // .max(200, t("validation.maxLength", { count: 200 }))
    description: Yup.string().max(
      500,
      t("validation.maxLength", { count: 500 })
    ),
    isActive: Yup.boolean(),
    // manager: Yup.object().shape({
    //   userId: Yup.number()
    //     .required("assignUserRole.validation.")
    //     .positive()
    //     .integer(),
    //   canViewDepartment: Yup.boolean(),
    //   canEditDepartment: Yup.boolean(),
    //   canViewDepartmentReports: Yup.boolean(),
    //   canManageSchedules: Yup.boolean(),
    //   canManageStaff: Yup.boolean(),
    //   startDate: Yup.date().required(),
    //   notes: Yup.string().max(500),
    // }),
  })

  // Department Edit Validation Schema
  const VALIDATION_SCHEMA_EDIT_DEPARTMENT = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("department.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("department.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    // categoryId: Yup.number()
    //   .required(t("roster.validation.categoryRequired"))
    //   .positive(t("validation.positiveNumber"))
    //   .integer(t("validation.integerOnly")),
    location: Yup.string()
      .required(t("department.form.validation.locationRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(200, t("validation.maxLength", { count: 200 })),
    description: Yup.string().max(
      500,
      t("validation.maxLength", { count: 500 })
    ),
    isActive: Yup.boolean(),
  })

  // Department Filters Validation Schema
  const departmentFiltersValidationSchema = Yup.object().shape({
    search: Yup.string().max(100, t("validation.maxLength", { count: 100 })),
    categoryId: Yup.number()
      .nullable()
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly")),
    isActive: Yup.boolean().nullable(),
    createdFrom: Yup.date().nullable(),
    createdTo: Yup.date()
      .nullable()
      .when("createdFrom", (createdFrom, schema) => {
        if (createdFrom) {
          return schema.min(createdFrom, t("validation.endDateAfterStart"))
        }
        return schema
      }),
    includeSubDepartments: Yup.boolean(),
    includeStatistics: Yup.boolean(),
    includeCategory: Yup.boolean(),
    orderBy: Yup.string().oneOf(
      ["nameArabic", "nameEnglish", "createdAt", "location"],
      t("validation.invalidOrderBy")
    ),
    orderDesc: Yup.boolean(),
    page: Yup.number()
      .min(1, t("validation.minPage"))
      .integer(t("validation.integerOnly")),
    pageSize: Yup.number()
      .min(1, t("validation.minPageSize"))
      .max(100, t("validation.maxPageSize"))
      .integer(t("validation.integerOnly")),
  })

  // Delete Department Validation Schema
  const deleteDepartmentValidationSchema = Yup.object().shape({
    reason: Yup.string()
      .required(t("department.delete.reasonRequired"))
      .min(3, t("validation.minLength", { count: 3 }))
      .max(500, t("validation.maxLength", { count: 500 })),
  })

  // SubDepartment Add Validation Schema
  const VALIDATION_SCHEMA_ADD_SUBDEPARTMENT = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("subDepartment.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("subDepartment.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    departmentId: Yup.number()
      .required(t("subDepartment.form.validation.departmentRequired"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly")),
    location: Yup.string()
      .required(t("subDepartment.form.validation.locationRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(200, t("validation.maxLength", { count: 200 })),
    isActive: Yup.boolean(),
  })

  // SubDepartment Edit Validation Schema
  const VALIDATION_SCHEMA_EDIT_SUBDEPARTMENT = Yup.object().shape({
    id: Yup.number()
      .required(t("validation.required"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly")),
    nameArabic: Yup.string()
      .required(t("subDepartment.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("subDepartment.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    departmentId: Yup.number()
      .required(t("subDepartment.form.validation.departmentRequired"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly")),
    location: Yup.string()
      .required(t("subDepartment.form.validation.locationRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(200, t("validation.maxLength", { count: 200 })),
    isActive: Yup.boolean(),
  })

  // ContractingType Add Validation Schema

  const arabicPattern =
    /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u060C\u061B\u061F\u066A-\u066D\u06D4\u2000-\u206F\u200B-\u200D\u2060-\u2064\s0-9_\-\(\)\.,؟!،؛]+$/
  const englishPattern = /^[A-Za-z\u00C0-\u017F0-9\s_\-\(\)\.\'",!?:;]+$/

  const VALIDATION_SCHEMA_ADD_CONTRACTINGTYPE = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("contractingTypes.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("contractingTypes.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    allowOvertimeHours: Yup.boolean(),
    maxHoursPerWeek: Yup.number()
      .min(1, t("contractingTypes.form.validation.maxHoursMin"))
      .max(168, t("contractingTypes.form.validation.maxHoursMax"))
      .integer(t("validation.integerOnly"))
      .required(t("contractingTypes.form.validation.maxHoursRequired")),
    isActive: Yup.boolean(),
  })

  const VALIDATION_SCHEMA_EDIT_CONTRACTINGTYPE = Yup.object().shape({
    id: Yup.number()
      .required(t("validation.required"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly")),

    nameArabic: Yup.string()
      .trim()
      .required(t("contractingTypes.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .trim()
      .required(t("contractingTypes.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    allowOvertimeHours: Yup.boolean().required(t("validation.required")),

    maxHoursPerWeek: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .min(1, t("contractingTypes.form.validation.maxHoursMin"))
      .max(168, t("contractingTypes.form.validation.maxHoursMax"))
      .integer(t("validation.integerOnly"))
      .required(t("contractingTypes.form.validation.maxHoursRequired")),

    isActive: Yup.boolean().required(t("validation.required")),
  })

  // Delete ContractingType Validation Schema
  const deleteContractingTypeValidationSchema = Yup.object().shape({
    reason: Yup.string()
      .required(t("contractingTypes.delete.reasonRequired"))
      .min(3, t("validation.minLength", { count: 3 }))
      .max(500, t("validation.maxLength", { count: 500 })),
  })

  const VALIDATION_SCHEMA_ADD_SCIENTIFIC_DEGREE = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("scientificDegrees.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("scientificDegrees.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    code: Yup.string()
      .required(t("scientificDegrees.form.validation.codeRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(20, t("validation.maxLength", { count: 20 }))
      .matches(
        /^[a-zA-Z0-9_]+$/,
        t("scientificDegrees.form.validation.codeFormat")
      ),
    isActive: Yup.boolean(),
  })

  const VALIDATION_SCHEMA_EDIT_SCIENTIFIC_DEGREE = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("scientificDegrees.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("scientificDegrees.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    code: Yup.string()
      .required(t("scientificDegrees.form.validation.codeRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(20, t("validation.maxLength", { count: 20 }))
      .matches(
        /^[a-zA-Z0-9_]+$/,
        t("scientificDegrees.form.validation.codeFormat")
      ),
    isActive: Yup.boolean(),
  })
  const VALIDATION_SCHEMA_ADD_SHIFT_HOUR_TYPE = Yup.object().shape({
    nameArabic: Yup.string()
      .trim()
      .required(t("shiftHourTypeForm.form.validation.nameArabic"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(/^[\p{Script=Arabic}0-9\s\p{P}]+$/u, t("validation.arabicOnly")),

    nameEnglish: Yup.string()
      .trim()
      .required(t("shiftHourTypeForm.form.validation.nameEnglish"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(/^[A-Za-z0-9\s\p{P}]+$/u, t("validation.englishOnly")),

    code: Yup.string()
      .trim()
      .required(t("shiftHourTypeForm.form.validation.code"))
      .matches(
        /^[A-Z0-9]+$/,
        t("shiftHourTypeForm.form.validation.hints.code")
      ),

    period: Yup.string().required(
      t("shiftHourTypeForm.form.validation.period")
    ),

    hours: Yup.number()
      .required(t("shiftHourTypeForm.form.validation.hoursCount"))
      .integer(t("validation.integerOnly"))
      .min(1, t("shiftHourTypeForm.form.validation.hints.hoursCount"))
      .max(24, t("shiftHourTypeForm.form.validation.hints.hoursCount"))
      .test(
        "hours-match-time-difference",
        t("shiftHourTypeForm.form.validation.hoursMustMatchTimeDifference"), // Add appropriate translation
        function (value) {
          const { startTime, endTime } = this.parent

          if (!startTime || !endTime || value === undefined) {
            return true // Skip validation if times are not set
          }

          // Calculate the difference in hours
          const calculatedHours = calculateHoursDifference(startTime, endTime)

          return value === calculatedHours
        }
      ),

    startTime: Yup.string().required(
      t("shiftHourTypeForm.form.validation.startTime")
    ),

    endTime: Yup.string()
      .required(t("shiftHourTypeForm.form.validation.endTime"))
      .test(
        "end-time-after-start",
        t("shiftHourTypeForm.form.validation.endTimeAfterStart"), // Add appropriate translation
        function (value) {
          const { startTime } = this.parent

          if (!startTime || !value) {
            return true // Skip validation if either time is not set
          }

          // Validate that endTime is after startTime (considering overnight shifts)
          return true // Implement your logic here
        }
      ),

    isActive: Yup.boolean().required(),
  })

  function calculateHoursDifference(startTime, endTime) {
    // Assuming time format is "HH:mm" (24-hour format)
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)

    // Convert to minutes since midnight
    let startTotalMinutes = startHours * 60 + startMinutes
    let endTotalMinutes = endHours * 60 + endMinutes

    // Handle overnight shifts (when end time is less than start time)
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60 // Add 24 hours worth of minutes
    }

    // Calculate difference in minutes and convert to hours
    const diffMinutes = endTotalMinutes - startTotalMinutes
    const diffHours = Math.round(diffMinutes / 60) // Round to nearest hour

    return diffHours
  }

  const VALIDATION_SCHEMA_ADD_ROLE = Yup.object({
    roleNameAr: Yup.string()
      .min(
        2,
        t("managementRoleForm.validation.roleNameArMin") ||
          "Arabic name must be at least 2 characters"
      )
      .max(
        255,
        t("managementRoleForm.validation.roleNameArMax") ||
          "Arabic name must be less than 255 characters"
      )
      .required(
        t("managementRoleForm.validation.roleNameArRequired") ||
          "Arabic name is required"
      )
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    roleNameEn: Yup.string()
      .min(
        2,
        t("managementRoleForm.validation.roleNameEnMin") ||
          "English name must be at least 2 characters"
      )
      .max(
        255,
        t("managementRoleForm.validation.roleNameEnMax") ||
          "English name must be less than 255 characters"
      )
      .required(
        t("managementRoleForm.validation.roleNameEnRequired") ||
          "English name is required"
      )
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    description: Yup.string().max(
      500,
      t("managementRoleForm.validation.descriptionMax") ||
        "Description must be less than 500 characters"
    ),
    // Add validation to the first permission field
    userCanManageCategory: Yup.boolean().test(
      "at-least-one-permission",
      t("managementRoleForm.validation.atLeastOnePermission") ||
        "At least one permission must be selected",
      function (value) {
        const { parent } = this
        const permissionFields = [
          "userCanManageCategory",
          "userCanManageRole",
          "userCanManageRostors",
          "userCanManageUsers",
          "userCanContractingType",
          "userCanShiftHoursType",
          "userCanScientificDegree",
          "userCanManageDepartments",
          "userCanManageSubDepartments",
          "userCanViewReports",
          "userCanManageSchedules",
          "userCanManageRequests",
        ]

        return permissionFields.some((field) => parent[field] === true)
      }
    ),
    // Define other boolean fields (optional, but good practice)
    userCanManageRole: Yup.boolean(),
    userCanManageRostors: Yup.boolean(),
    userCanManageUsers: Yup.boolean(),
    userCanContractingType: Yup.boolean(),
    userCanShiftHoursType: Yup.boolean(),
    userCanScientificDegree: Yup.boolean(),
    userCanManageDepartments: Yup.boolean(),
    userCanManageSubDepartments: Yup.boolean(),
    userCanViewReports: Yup.boolean(),
    userCanManageSchedules: Yup.boolean(),
    userCanManageRequests: Yup.boolean(),
  })

  const VALIDATION_SCHEMA_ASSIGN_USER_TO_ROLE = Yup.object({
    userId: Yup.string().required(
      t("assignUserRole.validation.userRequired") || "Please select a user"
    ),
    roleId: Yup.string().required(
      t("assignUserRole.validation.roleRequired") || "Please select a role"
    ),
    changeReason: Yup.string()
      .required(
        t("assignUserRole.validation.changeReasonRequired") ||
          "Change reason is required"
      )
      .min(
        3,
        t("assignUserRole.validation.changeReasonMin") ||
          "Change reason must be at least 3 characters"
      )
      .max(
        200,
        t("assignUserRole.validation.changeReasonMax") ||
          "Change reason must not exceed 200 characters"
      ),
    notes: Yup.string().max(
      500,
      t("assignUserRole.validation.notesMax") ||
        "Notes must not exceed 500 characters"
    ),
  })
  const currentYear = new Date().getFullYear()

  const VALIDATION_SCHEMA_UPDATE_BASIC_ROASTER = Yup.object().shape({
    categoryId: Yup.number().required(t("roster.validation.categoryRequired")),
    title: Yup.string()
      .required(t("roster.validation.titleRequired"))
      .min(3, t("roster.validation.titleMinLength"))
      .max(255, t("roster.validation.titleMaxLength")),
    description: Yup.string().max(
      1000,
      t("roster.validation.descriptionMaxLength")
    ),
    startDay: Yup.number()
      .min(1, t("roster.validation.dayMin"))
      .max(30, t("roster.validation.dayMax"))
      .required(t("roster.validation.required")),
    endDay: Yup.number()
      .min(1, t("roster.validation.dayMin"))
      .max(30, t("roster.validation.dayMax"))
      .required(t("roster.validation.required"))
      .test(
        "endAfterStart",
        t("roster.validation.endDayAfterStartDay"),
        function (value) {
          return value >= this.parent.startDay
        }
      ),
    month: Yup.number()
      .min(1, t("roster.validation.monthInvalid"))
      .max(12, t("roster.validation.monthInvalid"))
      .required(t("roster.validation.monthRequired")),
    year: Yup.number()
      .min(currentYear, t("roster.validation.yearInvalid"))
      .max(currentYear + 6, t("roster.validation.yearInvalid"))
      .required(t("roster.validation.yearRequired")),
    submissionDeadline: Yup.date()
      .required(t("roster.validation.deadlineRequired"))
      .min(new Date(), t("roster.validation.deadlineFuture")),
  })

  const VALIDATION_SCHEMA_CREATE_BASIC_ROASTER = Yup.object().shape({
    // categoryId: Yup.number().required(t("roster.validation.categoryRequired")),
    title: Yup.string()
      .required(t("roster.validation.titleRequired"))
      .min(3, t("roster.validation.titleMinLength"))
      .max(255, t("roster.validation.titleMaxLength")),
    description: Yup.string().max(
      1000,
      t("roster.validation.descriptionMaxLength")
    ),
    startDay: Yup.number()
      .min(1, t("roster.validation.dayMin"))
      .max(30, t("roster.validation.dayMax"))
      .required(t("roster.validation.required")),
    endDay: Yup.number()
      .min(1, t("roster.validation.dayMin"))
      .max(30, t("roster.validation.dayMax"))
      .required(t("roster.validation.required"))
      .test(
        "endAfterStart",
        t("roster.validation.endDayAfterStartDay"),
        function (value) {
          return value >= this.parent.startDay
        }
      ),
    month: Yup.number()
      .min(1, t("roster.validation.monthInvalid"))
      .max(12, t("roster.validation.monthInvalid"))
      .required(t("roster.validation.monthRequired")),
    year: Yup.number()
      .min(currentYear, t("roster.validation.yearInvalid"))
      .max(currentYear + 6, t("roster.validation.yearInvalid"))
      .required(t("roster.validation.yearRequired")),
    submissionDeadline: Yup.date()
      .required(t("roster.validation.deadlineRequired"))
      .min(new Date(), t("roster.validation.deadlineFuture")),
    departments: Yup.array()
      .min(1, t("roster.validation.departmentsRequired"))
      .of(
        Yup.object().shape({
          departmentId: Yup.number().required(
            t("roster.validation.departmentRequired")
          ),
          notes: Yup.string().max(500, t("roster.validation.notesMaxLength")),
        })
      ),
    // maxConsecutiveDays: Yup.number()
    //   .min(1, t("roster.validation.maxConsecutiveDaysMin"))
    //   .max(14, t("roster.validation.maxConsecutiveDaysMax"))
    //   .required(),
    // minRestDaysBetween: Yup.number()
    //   .min(0, t("roster.validation.minRestDaysMin"))
    //   .max(7, t("roster.validation.minRestDaysMax"))
    //   .required(),
  })

  const VALIDATION_SCHEMA_ADD_SHIFTS_DEPARTMENT = Yup.object().shape({
    shifts: Yup.array()
      .of(
        Yup.object().shape({
          shiftHoursTypeId: Yup.number().required(
            t("roster.phaseOne.validation.shiftTypeRequired")
          ),
          notes: Yup.string().max(
            500,
            t("roster.phaseOne.validation.notesMaxLength")
          ),
        })
      )
      .min(1, t("roster.phaseOne.validation.atLeastOneShift")),
    overwriteExisting: Yup.boolean(),
  })

  const VALIDATION_SCHEMA_ADD_ROSTER_CONTRACTING_TYPES = Yup.object().shape({
    contractingTypes: Yup.array()
      .min(1, t("roster.contractingTypes.validation.atLeastOneRequired"))
      .of(
        Yup.object().shape({
          contractingTypeId: Yup.string().required(
            t("roster.contractingTypes.validation.contractingTypeRequired")
          ),
          defaultRequiredDoctors: Yup.number()
            .min(1, t("roster.contractingTypes.validation.minRequired"))
            .max(50, t("roster.contractingTypes.validation.maxRequired"))
            .required(
              t("roster.contractingTypes.validation.requiredDoctorsRequired")
            ),
          defaultMaxDoctors: Yup.number()
            .min(1, t("roster.contractingTypes.validation.minMax"))
            .max(50, t("roster.contractingTypes.validation.maxMax"))
            .test(
              "max-greater-than-required",
              t("roster.contractingTypes.validation.maxGreaterThanRequired"),
              function (value) {
                const { defaultRequiredDoctors } = this.parent
                return (
                  !defaultRequiredDoctors ||
                  !value ||
                  value >= defaultRequiredDoctors
                )
              }
            )
            .required(
              t("roster.contractingTypes.validation.maxDoctorsRequired")
            ),
          notes: Yup.string()
            .max(500, t("roster.contractingTypes.validation.notesMaxLength"))
            .nullable(),
        })
      ),
    overwriteExisting: Yup.boolean(),
  })

  const VALIDATION_SCHEMA_EDIT_ROSTER_CONTRAFCTING_TYPES = Yup.object({
    defaultRequiredDoctors: Yup.number()
      .required(t("roster.contractingTypes.validation.defaultRequiredRequired"))
      .min(1, t("roster.contractingTypes.validation.minValue")),
    defaultMaxDoctors: Yup.number()
      .required(t("roster.contractingTypes.validation.defaultMaxRequired"))
      .min(1, t("roster.contractingTypes.validation.minValue"))
      .when("defaultRequiredDoctors", (defaultRequired, schema) => {
        return schema.min(
          defaultRequired,
          t("roster.contractingTypes.validation.maxGreaterThanRequired")
        )
      }),
    notes: Yup.string().max(
      500,
      t("roster.contractingTypes.validation.notesMaxLength")
    ),
  })

  const VALIDATION_SCHEMA_EDIT_WORKING_HOUR = Yup.object({
    requiredDoctors: Yup.number()
      .required(t("roster.workingHours.validation.requiredDoctorsRequired"))
      .min(1, t("roster.workingHours.validation.requiredDoctorsMin"))
      .integer(t("roster.workingHours.validation.requiredDoctorsInteger")),
    maxDoctors: Yup.number()
      .required(t("roster.workingHours.validation.maxDoctorsRequired"))
      .min(1, t("roster.workingHours.validation.maxDoctorsMin"))
      .integer(t("roster.workingHours.validation.maxDoctorsInteger"))
      .test(
        "max-greater-than-required",
        t("roster.workingHours.validation.maxDoctorsGreater"),
        function (value) {
          const { requiredDoctors } = this.parent
          return !requiredDoctors || !value || value >= requiredDoctors
        }
      ),
    notes: Yup.string().max(500, t("roster.workingHours.validation.notesMax")),
    modificationReason: Yup.string()
      .required(t("roster.workingHours.validation.modificationReasonRequired"))
      .max(500, t("roster.workingHours.validation.modificationReasonMax")),
  })

  const VALIDATION_SCHEMA_ADD_DEPARTMENT_TO_ROSTER = Yup.object().shape({
    departmentId: Yup.string().required(t("validation.required")),
    notes: Yup.string().max(500, t("validation.maxLength", { max: 500 })),
  })

  const VALIDATION_SCHEMA_ASSIGN_DEPARTMENT_HEAD = Yup.object({
    UserId: Yup.string().required(
      t("validation.required") || "User is required"
    ),
  })

  const VALIDATION_SCHEMA_CREATE_GOEFENCE = Yup.object({
    name: Yup.string()
      .required(t("geoFenceForm.errors.nameRequired") || "Name is required")
      .min(
        3,
        t("geoFenceForm.errors.nameMin") || "Name must be at least 3 characters"
      ),
    latitude: Yup.number()
      .required(
        t("geoFenceForm.errors.latitudeRequired") || "Latitude is required"
      )
      .min(
        -90,
        t("geoFenceForm.errors.latitudeMin") ||
          "Latitude must be between -90 and 90"
      )
      .max(
        90,
        t("geoFenceForm.errors.latitudeMax") ||
          "Latitude must be between -90 and 90"
      ),
    longitude: Yup.number()
      .required(
        t("geoFenceForm.errors.longitudeRequired") || "Longitude is required"
      )
      .min(
        -180,
        t("geoFenceForm.errors.longitudeMin") ||
          "Longitude must be between -180 and 180"
      )
      .max(
        180,
        t("geoFenceForm.errors.longitudeMax") ||
          "Longitude must be between -180 and 180"
      ),
    radiusMeters: Yup.number()
      .required(t("geoFenceForm.errors.radiusRequired") || "Radius is required")
      .min(
        10,
        t("geoFenceForm.errors.radiusMin") ||
          "Radius must be at least 10 meters"
      )
      .max(
        10000,
        t("geoFenceForm.errors.radiusMax") ||
          "Radius must not exceed 10000 meters"
      ),
    priority: Yup.number()
      .required(
        t("geoFenceForm.errors.priorityRequired") || "Priority is required"
      )
      .min(
        0,
        t("geoFenceForm.errors.priorityMin") || "Priority must be at least 0"
      )
      .max(
        1000,
        t("geoFenceForm.errors.priorityMax") || "Priority must not exceed 1000"
      ),
    // activeFrom: Yup.date().required(
    //   t("geoFenceForm.errors.activeFromRequired") ||
    //     "Active from date is required"
    // ),
    // activeToUtc: Yup.date()
    //   .nullable()
    //   .min(
    //     Yup.ref("activeFrom"),
    //     t("geoFenceForm.errors.activeToMin") ||
    //       "Active to must be after active from"
    //   ),
    // wifiPolicy: Yup.number().required(
    //   t("geoFenceForm.errors.wifiPolicyRequired") || "WiFi policy is required"
    // ),
    // beaconPolicy: Yup.number().required(
    //   t("geoFenceForm.errors.beaconPolicyRequired") ||
    //     "Beacon policy is required"
    // ),
    // wifiSsid: Yup.string().nullable(),
    // beaconUuid: Yup.string()
    //   .nullable()
    //   .matches(
    //     /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    //     t("geoFenceForm.errors.beaconUuidFormat") ||
    //       "Beacon UUID must be in valid format"
    //   ),
  })

  return {
    VALIDATION_SCHEMA_LOGIN,
    VALIDATION_SCHEMA_RESET_PASSWORD,
    VALIDATION_SCHEMA_ADD_CATEGORY,
    VALIDATION_SCHEMA_EDIT_CATEGORY,
    VALIDATION_SCHEMA_ADD_DEPARTMENT,
    VALIDATION_SCHEMA_EDIT_DEPARTMENT,
    departmentFiltersValidationSchema,
    deleteDepartmentValidationSchema,
    VALIDATION_SCHEMA_ADD_SUBDEPARTMENT,
    VALIDATION_SCHEMA_EDIT_SUBDEPARTMENT,
    VALIDATION_SCHEMA_ADD_CONTRACTINGTYPE,
    deleteContractingTypeValidationSchema,
    VALIDATION_SCHEMA_EDIT_CONTRACTINGTYPE,
    VALIDATION_SCHEMA_EDIT_SCIENTIFIC_DEGREE,
    VALIDATION_SCHEMA_ADD_SCIENTIFIC_DEGREE,
    VALIDATION_SCHEMA_ADD_SHIFT_HOUR_TYPE,
    VALIDATION_SCHEMA_ADD_ROLE,
    VALIDATION_SCHEMA_ASSIGN_USER_TO_ROLE,
    VALIDATION_SCHEMA_CREATE_BASIC_ROASTER,
    VALIDATION_SCHEMA_UPDATE_BASIC_ROASTER,
    VALIDATION_SCHEMA_ADD_SHIFTS_DEPARTMENT,
    VALIDATION_SCHEMA_ADD_ROSTER_CONTRACTING_TYPES,
    VALIDATION_SCHEMA_EDIT_ROSTER_CONTRAFCTING_TYPES,
    VALIDATION_SCHEMA_EDIT_WORKING_HOUR,
    VALIDATION_SCHEMA_ADD_DEPARTMENT_TO_ROSTER,
    VALIDATION_SCHEMA_ASSIGN_DEPARTMENT_HEAD,
    VALIDATION_SCHEMA_CREATE_GOEFENCE,
  }
}

export default UseFormValidation
