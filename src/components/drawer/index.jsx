// Updated DrawerComponent.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UseDirection from "../../hooks/use-direction";
import TabsViewFancy from "../tabs";

export default function DrawerComponent({
  width = "w-60",
  isExpanded = false,
  onExpandChange,
}) {
  const { direction } = UseDirection();
  const { i18n } = useTranslation();
  const [, forceRender] = useState({});

  useEffect(() => {
    forceRender({});
  }, [direction.direction]);

  useEffect(() => {
    const handleLanguageChange = () => {
      console.log("Language changed, re-rendering drawer");
      forceRender({});
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const handleMouseEnter = () => {
    onExpandChange?.(true);
  };

  const handleMouseLeave = () => {
    onExpandChange?.(false);
  };

  return (
    <div
      className={`
        fixed top-0 h-full bg-white dark:bg-black 
        border-gray-200 dark:border-gray-800 shadow-lg z-40
        transition-all duration-300 ease-in-out
        ${direction.left === "left" ? "left-0 border-r" : "right-0 border-l"}
        ${isExpanded ? width : "w-16"}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        [direction.left]: 0,
      }}
    >
      <div className="p-2 h-full overflow-hidden flex items-center justify-center">
        <TabsViewFancy isExpanded={isExpanded} click={handleMouseLeave} />
      </div>
    </div>
  );
}
