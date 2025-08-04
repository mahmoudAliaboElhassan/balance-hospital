import React from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

function UseFormValidation() {
  const { t } = useTranslation();

  // Login Validation Schema
  const VALIDATION_SCHEMA_LOGIN = Yup.object().shape({
    email: Yup.string()
      .email(t("validationAuth.email.invalid"))
      .required(t("validationAuth.email.required")),
    password: Yup.string()
      .min(8, t("validationAuth.password.minLength"))
      .required(t("validationAuth.password.required")),
    rememberMe: Yup.boolean(),
  });

  // Reset Password Validation Schema
  const VALIDATION_SCHEMA_RESET_PASSWORD = Yup.object().shape({
    token: Yup.string().required(t("validationAuth.tokenRequired")),
    newPassword: Yup.string()
      .min(8, t("validationAuth.password.minLength"))
      .required(t("validationAuth.password.required")),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("validationAuth.password.match"))
      .required(t("validationAuth.password.confirmRequired")),
  });

  // Category Add Validation Schema
  const VALIDATION_SCHEMA_ADD_CATEGORY = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("category.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("category.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    code: Yup.string()
      .required(t("category.form.validation.codeRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(10, t("validation.maxLength", { count: 10 }))
      .matches(/^[A-Z0-9_]+$/, t("category.form.validation.codeFormat")),
    description: Yup.string().max(
      500,
      t("validation.maxLength", { count: 500 })
    ),
    isActive: Yup.boolean(),
  });

  // Category Edit Validation Schema
  const VALIDATION_SCHEMA_EDIT_CATEGORY = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("category.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),
    nameEnglish: Yup.string()
      .required(t("category.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    code: Yup.string()
      .required(t("category.form.validation.codeRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(10, t("validation.maxLength", { count: 10 }))
      .matches(/^[A-Z0-9_]+$/, t("category.form.validation.codeFormat")),
    description: Yup.string().max(
      500,
      t("validation.maxLength", { count: 500 })
    ),
    isActive: Yup.boolean(),
  });

  // Department Add Validation Schema
  const VALIDATION_SCHEMA_ADD_DEPARTMENT = Yup.object().shape({
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
    categoryId: Yup.number()
      .required(t("department.form.validation.categoryRequired"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly")),
    location: Yup.string()
      .required(t("department.form.validation.locationRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(200, t("validation.maxLength", { count: 200 })),
    description: Yup.string().max(
      500,
      t("validation.maxLength", { count: 500 })
    ),
    isActive: Yup.boolean(),
  });

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
    categoryId: Yup.number()
      .required(t("department.form.validation.categoryRequired"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly")),
    location: Yup.string()
      .required(t("department.form.validation.locationRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(200, t("validation.maxLength", { count: 200 })),
    description: Yup.string().max(
      500,
      t("validation.maxLength", { count: 500 })
    ),
    isActive: Yup.boolean(),
  });

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
          return schema.min(createdFrom, t("validation.endDateAfterStart"));
        }
        return schema;
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
  });

  // Delete Department Validation Schema
  const deleteDepartmentValidationSchema = Yup.object().shape({
    reason: Yup.string()
      .required(t("department.delete.reasonRequired"))
      .min(3, t("validation.minLength", { count: 3 }))
      .max(500, t("validation.maxLength", { count: 500 })),
  });

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
  });

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
  });

  // ContractingType Add Validation Schema

  const arabicPattern =
    /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u060C\u061B\u061F\u066A-\u066D\u06D4\u2000-\u206F\u200B-\u200D\u2060-\u2064\s0-9_\-\(\)\.,؟!،؛]+$/;
  const englishPattern = /^[A-Za-z\u00C0-\u017F0-9\s_\-\(\)\.\'",!?:;]+$/;

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
  });

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
  });

  // Delete ContractingType Validation Schema
  const deleteContractingTypeValidationSchema = Yup.object().shape({
    reason: Yup.string()
      .required(t("contractingTypes.delete.reasonRequired"))
      .min(3, t("validation.minLength", { count: 3 }))
      .max(500, t("validation.maxLength", { count: 500 })),
  });

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
  });

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
  });
  const VALIDATION_SCHEMA_ADD_SHIFT_HOUR_TYPE = Yup.object().shape({
    nameArabic: Yup.string()
      .trim()
      .required(t("shiftHourTypeForm.fields.nameArabic") + " is required")
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Arabic script, digits, whitespace, and punctuation
        /^[\p{Script=Arabic}0-9\s\p{P}]+$/u,
        t("validation.arabicOnly") // you may want to update this message to "Arabic letters, numbers & punctuation only"
      ),

    nameEnglish: Yup.string()
      .trim()
      .required(t("shiftHourTypeForm.fields.nameEnglish") + " is required")
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        // Latin letters, digits, whitespace, and punctuation
        /^[A-Za-z0-9\s\p{P}]+$/u,
        t("validation.englishOnly") // you may want to update this message to "English letters, numbers & punctuation only"
      ),
    code: Yup.string()
      .trim()
      .required(t("shiftHourTypeForm.fields.code") + " is required")
      .matches(/^[A-Z0-9]+$/, t("shiftHourTypeForm.hints.code")),

    period: Yup.string().required(
      t("shiftHourTypeForm.fields.period") + " is required"
    ),

    hours: Yup.number()
      .required(t("shiftHourTypeForm.fields.hoursCount") + " is required")
      .integer(t("validation.integerOnly"))
      .min(1, t("shiftHourTypeForm.hints.hoursCount"))
      .max(24, t("shiftHourTypeForm.hints.hoursCount")),

    startTime: Yup.string().required(
      t("shiftHourTypeForm.fields.startTime") + " is required"
    ),

    endTime: Yup.string().required(
      t("shiftHourTypeForm.fields.endTime") + " is required"
    ),

    isActive: Yup.boolean().required(),
  });
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
  };
}

export default UseFormValidation;
