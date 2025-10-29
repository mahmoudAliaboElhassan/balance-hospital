import i18next from "i18next"
import { useTranslation } from "react-i18next"

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  date.setHours(date.getHours() + 3)
  if (dateString) {
    return new Intl.DateTimeFormat(i18next.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }
  return null
}
