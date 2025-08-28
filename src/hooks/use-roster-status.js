import { useTranslation } from "react-i18next";

function UseRosterStatus() {
  const { t } = useTranslation();
  const rosterStatus = [
    { value: "DRAFT_BASIC", label: t("roster.status.draftBasic") },
    { value: "DRAFT_PARTIAL", label: t("roster.status.draftPartial") },
    { value: "DRAFT", label: t("roster.status.draft") },
    { value: "DRAFT_READY", label: t("roster.status.draftReady") },
    { value: "PUBLISHED", label: t("roster.status.published") },
    { value: "CLOSED", label: t("roster.status.closed") },
    { value: "ARCHIVED", label: t("roster.status.archived") },
  ];
  return { rosterStatus };
}

export default UseRosterStatus;
