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

  return { VALIDATION_SCHEMA_LOGIN, VALIDATION_SCHEMA_RESET_PASSWORD };
}

export default UseFormValidation;
