import { useTranslation } from "react-i18next";
import * as Yup from "yup";

function UseFormValidation() {
  const { t } = useTranslation();

  const VALIDATION_SCHEMA_LOGIN = Yup.object({
    email: Yup.string()
      .email(t("validationLogin.email.invalid"))
      .required(t("validationLogin.email.required")),
    password: Yup.string()
      .min(6, t("validationLogin.password.minLength"))
      .required(t("validationLogin.password.required")),
  });
  const VALIDATION_SCHEMA_RESET_PASSWORD = Yup.object({
    token: Yup.string()
      .matches(/^\d{6}$/, t("code_invalid"))
      .required(t("code_required")),
    newPassword: Yup.string()
      .min(8, t("password_min"))
      .matches(/(?=.*[a-z])/, t("password_lower"))
      .matches(/(?=.*[A-Z])/, t("password_upper"))
      .matches(/(?=.*\d)/, t("password_number"))
      .required(t("password_required")),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("password_match"))
      .required(t("confirm_required")),
  });
  const VALIDATION_SCHEMA_ADD_CATEGORY = Yup.object({
    nameArabic: Yup.string()
      .required(t("categoryForm.validation.nameArabic.required"))
      .min(2, t("categoryForm.validation.nameArabic.min"))
      .max(100, t("categoryForm.validation.nameArabic.max")),

    nameEnglish: Yup.string()
      .required(t("categoryForm.validation.nameEnglish.required"))
      .min(2, t("categoryForm.validation.nameEnglish.min"))
      .max(100, t("categoryForm.validation.nameEnglish.max")),

    code: Yup.string()
      .required(t("categoryForm.validation.code.required"))
      .matches(/^[A-Z0-9_]+$/, t("categoryForm.validation.code.pattern"))
      .min(2, t("categoryForm.validation.code.min"))
      .max(50, t("categoryForm.validation.code.max")),

    description: Yup.string().max(
      500,
      t("categoryForm.validation.description.max")
    ),

    isActive: Yup.boolean(),
  });
  const VALIDATION_SCHEMA_EDIT_CATEGORY = Yup.object({
    nameArabic: Yup.string()
      .required(t("categoryForm.validation.nameArabic.required"))
      .min(2, t("categoryForm.validation.nameArabic.min"))
      .max(100, t("categoryForm.validation.nameArabic.max")),

    nameEnglish: Yup.string()
      .required(t("categoryForm.validation.nameEnglish.required"))
      .min(2, t("categoryForm.validation.nameEnglish.min"))
      .max(100, t("categoryForm.validation.nameEnglish.max")),

    code: Yup.string()
      .required(t("categoryForm.validation.code.required"))
      .matches(/^[A-Z0-9_]+$/, t("categoryForm.validation.code.pattern"))
      .min(2, t("categoryForm.validation.code.min"))
      .max(50, t("categoryForm.validation.code.max")),

    description: Yup.string().max(
      500,
      t("categoryForm.validation.description.max")
    ),

    isActive: Yup.boolean(),
  });

  const VALIDATION_SCHEMA_ADD_DEPARTMENT = Yup.object({
    nameArabic: Yup.string()
      .required(t("validation.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(/^[\u0600-\u06FF\s\u0660-\u0669]+$/, t("validation.arabicOnly")),

    nameEnglish: Yup.string()
      .required(t("validation.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(/^[A-Za-z\s]+$/, t("validation.englishOnly")),

    categoryId: Yup.number()
      .required(t("validation.required"))
      .positive(t("validation.selectCategory"))
      .integer(t("validation.invalidCategory")),

    location: Yup.string()
      .required(t("validation.required"))

      .max(200, t("validation.maxLength", { count: 200 }))
      .nullable(),

    isActive: Yup.boolean().required(t("validation.required")),
  });
  const VALIDATION_SCHEMA_EDIT_DEPARTMENT = Yup.object({
    nameArabic: Yup.string()
      .required(t("validation.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(/^[\u0600-\u06FF\s\u0660-\u0669]+$/, t("validation.arabicOnly")),

    nameEnglish: Yup.string()
      .required(t("validation.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(/^[A-Za-z\s]+$/, t("validation.englishOnly")),

    categoryId: Yup.number()
      .required(t("validation.required"))
      .positive(t("validation.selectCategory"))
      .integer(t("validation.invalidCategory")),

    location: Yup.string()
      .required(t("validation.required"))

      .max(200, t("validation.maxLength", { count: 200 }))
      .nullable(),

    isActive: Yup.boolean().required(t("validation.required")),
  });

  const deleteDepartmentValidationSchema = Yup.object({
    reason: Yup.string()
      .required(t("validation.required"))
      .min(10, t("validation.minLength", { count: 10 }))
      .max(500, t("validation.maxLength", { count: 500 })),
  });

  const departmentFiltersValidationSchema = Yup.object({
    search: Yup.string()
      .max(100, t("validation.maxLength", { count: 100 }))
      .nullable(),

    categoryId: Yup.number()
      .positive(t("validation.selectCategory"))
      .integer(t("validation.invalidCategory"))
      .nullable(),

    isActive: Yup.boolean().nullable(),

    createdFrom: Yup.date()
      .nullable()
      .max(new Date(), t("validation.dateNotFuture")),

    createdTo: Yup.date()
      .nullable()
      .max(new Date(), t("validation.dateNotFuture"))
      .when("createdFrom", (createdFrom, schema) => {
        return createdFrom
          ? schema.min(createdFrom, t("validation.endDateAfterStart"))
          : schema;
      }),

    page: Yup.number()
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly"))
      .min(1, t("validation.minValue", { count: 1 })),

    pageSize: Yup.number()
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly"))
      .min(1, t("validation.minValue", { count: 1 }))
      .max(100, t("validation.maxValue", { count: 100 })),

    orderBy: Yup.string().oneOf(
      ["nameArabic", "nameEnglish", "createdAt", "updatedAt", "categoryName"],
      t("validation.invalidOrderBy")
    ),

    orderDesc: Yup.boolean(),

    includeSubDepartments: Yup.boolean(),
    includeStatistics: Yup.boolean(),
    includeCategory: Yup.boolean(),
  });

  const VALIDATION_SCHEMA_ADD_SUBDEPARTMENT = Yup.object().shape({
    nameArabic: Yup.string()
      .required(t("subDepartment.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(
        /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/,
        t("validation.arabicOnly")
      ),
    nameEnglish: Yup.string()
      .required(t("subDepartment.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(/^[a-zA-Z\s]+$/, t("validation.englishOnly")),
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
        /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/,
        t("validation.arabicOnly")
      ),
    nameEnglish: Yup.string()
      .required(t("subDepartment.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(/^[a-zA-Z\s]+$/, t("validation.englishOnly")),
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

  return {
    VALIDATION_SCHEMA_LOGIN,
    VALIDATION_SCHEMA_RESET_PASSWORD,
    VALIDATION_SCHEMA_ADD_DEPARTMENT,
    VALIDATION_SCHEMA_EDIT_CATEGORY,
    VALIDATION_SCHEMA_ADD_CATEGORY,
    departmentFiltersValidationSchema,
    VALIDATION_SCHEMA_EDIT_DEPARTMENT,
    deleteDepartmentValidationSchema,
    VALIDATION_SCHEMA_ADD_SUBDEPARTMENT,
    VALIDATION_SCHEMA_EDIT_SUBDEPARTMENT,
  };
}

export default UseFormValidation;
