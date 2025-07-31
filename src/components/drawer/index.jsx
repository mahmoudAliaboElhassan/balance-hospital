import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UseDirection from "../../hooks/use-direction";
import TabsViewFancy from "../tabs";

export default function DrawerComponent({
  width = "w-60",
  isOpen = true,
  onToggle,
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

  // Convert width class to actual pixel values for responsive calculations
  const getWidthValue = (widthClass) => {
    const widthMap = {
      "w-60": "240px",
      "w-64": "256px",
      "w-72": "288px",
      "w-80": "320px",
    };
    return widthMap[widthClass] || "240px";
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 h-full ${width} bg-white dark:bg-black 
          border-gray-200 dark:border-gray-800 shadow-lg z-40
          transition-transform duration-300 ease-in-out
          ${direction.left === "left" ? "left-0 border-r" : "right-0 border-l"}
          ${
            isOpen
              ? "translate-x-0"
              : direction.left === "left"
              ? "-translate-x-full"
              : "translate-x-full"
          }
          lg:translate-x-0
        `}
        style={{
          [direction.left]: 0,
        }}
      >
        <div className="p-4 h-full overflow-auto flex items-center justify-center">
          <TabsViewFancy />
        </div>
      </div>
    </>
  );
}
