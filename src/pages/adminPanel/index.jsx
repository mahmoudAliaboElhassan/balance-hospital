// Updated AdminPanel.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DrawerComponent from "../../components/drawer";
import UseDirection from "../../hooks/use-direction";
import { useTranslation } from "react-i18next";

function AdminPanel() {
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState("w-60");
  const { direction } = UseDirection();
  const [, forceRender] = useState({});
  const { i18n } = useTranslation();

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

  // Get margin class based on drawer state and direction
  const getMarginClass = () => {
    // Icon-only width (w-16 = 64px) for collapsed state
    const iconWidth = direction.left === "left" ? "ml-16" : "mr-16";

    // Full width for expanded state
    const widthMap = {
      "w-60": direction.left === "left" ? "ml-60" : "mr-60",
      "w-64": direction.left === "left" ? "ml-64" : "mr-64",
      "w-72": direction.left === "left" ? "ml-72" : "mr-72",
      "w-80": direction.left === "left" ? "ml-80" : "mr-80",
    };

    const fullWidth =
      widthMap[drawerWidth] || (direction.left === "left" ? "ml-60" : "mr-60");

    // On large screens, use expanded width when hovered, otherwise icon width
    // On small screens, always use icon width
    return `lg:${isDrawerExpanded ? fullWidth : iconWidth} ${iconWidth}`;
  };

  return (
    <div className="flex min-h-screen" dir={direction.direction}>
      {/* Drawer */}
      <DrawerComponent
        width={drawerWidth}
        isExpanded={isDrawerExpanded}
        onExpandChange={setIsDrawerExpanded}
      />

      {/* Main content */}
      <main
        className={`
          flex-1 min-w-0 transition-all duration-300 ease-in-out
          ${getMarginClass()}
        `}
      >
        <div className="h-full p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
