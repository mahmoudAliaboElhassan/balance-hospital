// Updated DrawerComponent.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import UseDirection from "../../hooks/use-direction";
import TabsViewFancy from "../tabs";

export default function DrawerComponent({
  width = "w-60",
  isExpanded = false,
  onExpandChange,
}) {
  const { direction } = UseDirection();
  const { i18n } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
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

  // Force re-render when mode changes
  useEffect(() => {
    forceRender({});
  }, [mymode]);

  const handleMouseEnter = () => {
    onExpandChange?.(true);
  };

  const handleMouseLeave = () => {
    onExpandChange?.(false);
  };

  // Define color schemes matching RootLayout
  const colorSchemes = {
    light: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      accent: "#3b82f6",
      accentHover: "#2563eb",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      shadow: "rgba(0, 0, 0, 0.1)",
      cardBg: "#ffffff",
      headerBg: "#ffffff",
      footerBg: "#f1f5f9",
    },
    dark: {
      primary: "#0f172a",
      secondary: "#1e293b",
      accent: "#60a5fa",
      accentHover: "#3b82f6",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      border: "#334155",
      shadow: "rgba(0, 0, 0, 0.3)",
      cardBg: "#1e293b",
      headerBg: "#0f172a",
      footerBg: "#020617",
    },
  };

  const currentTheme = colorSchemes[mymode] || colorSchemes.light;

  // Calculate expanded width in pixels (assuming w-60 = 240px)
  const getExpandedWidth = () => {
    const widthMap = {
      "w-48": "192px",
      "w-52": "208px",
      "w-56": "224px",
      "w-60": "240px",
      "w-64": "256px",
      "w-72": "288px",
      "w-80": "320px",
    };
    return widthMap[width] || "240px";
  };

  const drawerStyles = {
    backgroundColor: currentTheme.cardBg,
    borderColor: currentTheme.border,
    color: currentTheme.text,
    boxShadow: `0 4px 12px ${currentTheme.shadow}`,
    transition: "all 0.3s ease-in-out",
    width: isExpanded ? getExpandedWidth() : "64px",
  };

  const positionStyles = {
    [direction.left]: 0,
  };

  return (
    <>
      {/* Drawer component with theme-aware styling */}
      <div
        className={`fixed top-0 h-full z-40 ${
          direction.left === "left" ? "border-r" : "border-l"
        }`}
        style={{
          ...drawerStyles,
          ...positionStyles,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="p-2 h-full overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor: "transparent",
          }}
        >
          <TabsViewFancy isExpanded={isExpanded} click={handleMouseLeave} />
        </div>
      </div>

      {/* Inject custom styles for drawer-specific elements */}
      <style jsx>{`
        /* Drawer-specific hover effects */
        .drawer-hover-item {
          background-color: transparent;
          color: ${currentTheme.textSecondary};
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .drawer-hover-item:hover {
          background-color: ${currentTheme.secondary};
          color: ${currentTheme.accent};
          transform: translateX(2px);
        }

        .drawer-hover-item.active {
          background-color: ${currentTheme.accent}20;
          color: ${currentTheme.accent};
          border-left: 3px solid ${currentTheme.accent};
        }

        /* Drawer icon styles */
        .drawer-icon {
          color: ${currentTheme.textSecondary};
          transition: all 0.3s ease;
        }

        .drawer-icon:hover,
        .drawer-icon.active {
          color: ${currentTheme.accent};
        }

        /* Drawer text styles */
        .drawer-text {
          color: ${currentTheme.text};
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .drawer-text-secondary {
          color: ${currentTheme.textSecondary};
          font-size: 0.75rem;
        }

        /* Drawer divider */
        .drawer-divider {
          border-top: 1px solid ${currentTheme.border};
          margin: 8px 0;
        }

        /* Drawer badge */
        .drawer-badge {
          background-color: ${currentTheme.accent};
          color: ${mymode === "dark" ? currentTheme.primary : "#ffffff"};
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.625rem;
          font-weight: 600;
          min-width: 18px;
          text-align: center;
        }

        /* Drawer collapse indicator */
        .drawer-collapse-indicator {
          color: ${currentTheme.textSecondary};
          transition: all 0.3s ease;
          transform: ${direction.left === "left"
            ? "rotate(0deg)"
            : "rotate(180deg)"};
        }

        .drawer-collapse-indicator:hover {
          color: ${currentTheme.accent};
        }

        /* Scrollbar for drawer content */
        .drawer-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .drawer-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .drawer-scrollbar::-webkit-scrollbar-thumb {
          background: ${currentTheme.border};
          border-radius: 2px;
        }

        .drawer-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${currentTheme.accent};
        }

        /* Drawer tooltip */
        .drawer-tooltip {
          background-color: ${currentTheme.cardBg};
          color: ${currentTheme.text};
          border: 1px solid ${currentTheme.border};
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.75rem;
          box-shadow: 0 2px 8px ${currentTheme.shadow};
          z-index: 1000;
        }

        /* Animation for drawer expansion */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .drawer-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        /* Drawer backdrop blur effect (optional) */
        .drawer-backdrop {
          backdrop-filter: blur(4px);
          background-color: ${mymode === "dark"
            ? "rgba(0, 0, 0, 0.3)"
            : "rgba(255, 255, 255, 0.1)"};
        }
      `}</style>
    </>
  );
}
