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

  return {
    VALIDATION_SCHEMA_LOGIN,
    VALIDATION_SCHEMA_RESET_PASSWORD,
    VALIDATION_SCHEMA_ADD_CATEGORY,
    VALIDATION_SCHEMA_EDIT_CATEGORY,
  };
}

export default UseFormValidation;
