import i18next from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  return (
    <div>
      Home <div>{t("home")}</div>
      <button onClick={() => i18next.changeLanguage("en")}>en</button>
      <button onClick={() => i18next.changeLanguage("ar")}>ar</button>
    </div>
  );
}

export default Home;
