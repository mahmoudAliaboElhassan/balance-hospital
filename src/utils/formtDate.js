import i18next from "i18next";

export const formatDate = (dateString) => {
  if (!dateString) return t("common.notAvailable");
  return new Intl.DateTimeFormat(i18next.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};
