// Updated AdminPanel
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DrawerComponent from "../../components/drawer";
import UseDirection from "../../hooks/use-direction";
import { useTranslation } from "react-i18next";

function AdminPanel() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Get margin class based on drawer width and direction
  const getMarginClass = () => {
    const widthMap = {
      "w-60": direction.left === "left" ? "lg:ml-60" : "lg:mr-60",
      "w-64": direction.left === "left" ? "lg:ml-64" : "lg:mr-64",
      "w-72": direction.left === "left" ? "lg:ml-72" : "lg:mr-72",
      "w-80": direction.left === "left" ? "lg:ml-80" : "lg:mr-80",
    };
    return (
      widthMap[drawerWidth] ||
      (direction.left === "left" ? "lg:ml-60" : "lg:mr-60")
    );
  };

  return (
    <div className="flex min-h-screen" dir={direction.direction}>
      {/* Mobile menu button */}
      <button
        onClick={toggleDrawer}
        className={`
          fixed top-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 
          shadow-lg border border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-700
          lg:hidden
          ${direction.left === "left" ? "left-4" : "right-4"}
        `}
        aria-label="Toggle menu"
      >
        <div>hello</div>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Drawer */}
      <DrawerComponent
        width={drawerWidth}
        isOpen={isDrawerOpen}
        onToggle={toggleDrawer}
      />

      {/* Main content */}
      <main
        className={`
          flex-1 min-w-0 transition-all duration-300 ease-in-out
          ${getMarginClass()}
          pt-16 lg:pt-0
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
