import i18next from "i18next";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// Language Toggle Icon - Globe with text indicator
const LanguageIcon = ({ className, language }) => (
  <div className={`relative ${className}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded text-[10px] font-bold min-w-[16px] text-center transition-all duration-300">
      {language === "ar" ? "ع" : "EN"}
    </span>
  </div>
);

// Alternative: Text-based language toggle for mobile
const LanguageTextIcon = ({ className, language }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300"
    >
      <path d="M5 8l6 6" />
      <path d="M4 14l6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="M22 22l-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
    <span className="text-xs font-semibold transition-all duration-300">
      {language === "ar" ? "العربية" : "English"}
    </span>
  </div>
);

const LanguageToggle = ({
  variant = "icon", // 'icon' or 'text'
  className = "",
  onLanguageChange = null, // Optional callback for parent components
  transitionDuration = 400, // Customizable transition duration in ms
}) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(() => {
    // Get initial language from localStorage or default to 'en'
    return localStorage.getItem("language") || "en";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced transition styles with better animations
  const injectTransitionStyles = useCallback(() => {
    const styleId = "enhanced-rtl-transition-styles";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      /* Root level transitions for direction change */
      html {
        transition: direction ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Body transition wrapper */
      body {
        transition: transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Enhanced transition class for smooth direction changes */
      .rtl-transition-active {
        transition: all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      .rtl-transition-active * {
        transition: 
          margin ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          padding ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          text-align ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          left ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          right ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          border-radius ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Specific transitions for common layout elements */
      .rtl-transition-active .flex,
      .rtl-transition-active .grid,
      .rtl-transition-active [class*="justify-"],
      .rtl-transition-active [class*="items-"] {
        transition: 
          justify-content ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          align-items ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Text and typography transitions */
      .rtl-transition-active p,
      .rtl-transition-active h1,
      .rtl-transition-active h2,
      .rtl-transition-active h3,
      .rtl-transition-active h4,
      .rtl-transition-active h5,
      .rtl-transition-active h6,
      .rtl-transition-active div,
      .rtl-transition-active span,
      .rtl-transition-active a,
      .rtl-transition-active button {
        transition: text-align ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Border radius transitions for RTL (important for buttons, cards, etc.) */
      .rtl-transition-active [class*="rounded"] {
        transition: border-radius ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Icon and image transitions */
      .rtl-transition-active svg,
      .rtl-transition-active img,
      .rtl-transition-active .transform,
      .rtl-transition-active [class*="rotate-"],
      .rtl-transition-active [class*="scale-"] {
        transition: transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Position-based transitions for absolute/relative positioned elements */
      .rtl-transition-active [class*="absolute"],
      .rtl-transition-active [class*="relative"],
      .rtl-transition-active [class*="fixed"] {
        transition: 
          left ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          right ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Margin and padding transitions for spacing */
      .rtl-transition-active [class*="m-"],
      .rtl-transition-active [class*="mx-"],
      .rtl-transition-active [class*="ml-"],
      .rtl-transition-active [class*="mr-"],
      .rtl-transition-active [class*="p-"],
      .rtl-transition-active [class*="px-"],
      .rtl-transition-active [class*="pl-"],
      .rtl-transition-active [class*="pr-"] {
        transition: 
          margin ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
          padding ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Fade transition for smooth content changes */
      .rtl-fade-transition {
        opacity: 0;
        transition: opacity ${transitionDuration / 2}ms ease-in-out;
      }
      
      .rtl-fade-transition-active {
        opacity: 1;
      }
    `;

    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [transitionDuration]);

  // Apply transition styles on mount
  useEffect(() => {
    const cleanup = injectTransitionStyles();
    return cleanup;
  }, [injectTransitionStyles]);

  // Enhanced language application with smoother transitions
  const applyLanguageChanges = useCallback(
    async (newLanguage) => {
      setIsTransitioning(true);

      // Add transition classes to enable smooth animations
      const htmlElement = document.documentElement;
      const bodyElement = document.body;

      // Add transition classes
      htmlElement.classList.add("rtl-transition-active");
      bodyElement.classList.add("rtl-transition-active");

      // Determine if the new language is RTL
      const isRTL = newLanguage === "ar";
      const currentDir = htmlElement.getAttribute("dir");
      const isDirectionChanging = (currentDir === "rtl") !== isRTL;

      // If direction is changing, add a subtle fade effect for content
      if (isDirectionChanging) {
        bodyElement.classList.add("rtl-fade-transition");

        // Brief fade out
        setTimeout(() => {
          // Apply the direction change during the fade
          htmlElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
          htmlElement.setAttribute("lang", newLanguage);

          // Start fade back in
          bodyElement.classList.add("rtl-fade-transition-active");
        }, transitionDuration / 4);
      } else {
        // If no direction change, apply immediately
        htmlElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
        htmlElement.setAttribute("lang", newLanguage);
      }

      // Store language preference
      localStorage.setItem("language", newLanguage);

      // Change language with i18next
      await i18next.changeLanguage(newLanguage);

      // Clean up after transition completes
      setTimeout(() => {
        setIsTransitioning(false);

        // Remove transition classes to prevent performance issues
        htmlElement.classList.remove("rtl-transition-active");
        bodyElement.classList.remove(
          "rtl-transition-active",
          "rtl-fade-transition",
          "rtl-fade-transition-active"
        );

        // Call parent callback if provided
        if (onLanguageChange) {
          onLanguageChange(newLanguage);
        }

        console.log(
          `Language smoothly switched to: ${
            newLanguage === "ar" ? "Arabic (RTL)" : "English (LTR)"
          }`
        );
      }, transitionDuration);
    },
    [transitionDuration, onLanguageChange]
  );

  // Apply language settings on mount and when language changes
  useEffect(() => {
    applyLanguageChanges(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language, applyLanguageChanges]);

  const handleLanguageToggle = useCallback(() => {
    if (isTransitioning) return; // Prevent multiple rapid clicks

    const newLanguage = language === "en" ? "ar" : "en";
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    setLanguage(newLanguage);
  }, [language, isTransitioning]);

  // Keyboard support for accessibility
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleLanguageToggle();
      }
    },
    [handleLanguageToggle]
  );

  if (variant === "text") {
    // Text version for mobile menus
    return (
      <button
        onClick={handleLanguageToggle}
        onKeyDown={handleKeyDown}
        disabled={isTransitioning}
        className={`w-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400 ${
          isTransitioning ? "opacity-75 cursor-wait" : "cursor-pointer"
        } ${className}`}
        aria-label={t("switchTo", {
          lang: language === "en" ? "العربية" : "English",
        })}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-2 transition-all duration-300">
          <LanguageTextIcon
            className={`h-5 w-5 ${isTransitioning ? "animate-pulse" : ""}`}
            language={language}
          />
          <span className="transition-opacity duration-300">
            {isTransitioning
              ? "Switching..."
              : t("switchTo", {
                  lang: language === "en" ? "العربية" : "English",
                })}
          </span>
        </div>
      </button>
    );
  }

  // Icon version for desktop header
  return (
    <button
      onClick={handleLanguageToggle}
      onKeyDown={handleKeyDown}
      disabled={isTransitioning}
      className={`relative p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 ${
        isTransitioning
          ? "opacity-75 cursor-wait scale-95"
          : "hover:scale-105 cursor-pointer"
      } ${className}`}
      aria-label={
        t?.ariaLabel || `Switch to ${language === "en" ? "Arabic" : "English"}`
      }
      title={
        t?.switchTo || `Switch to ${language === "en" ? "العربية" : "English"}`
      }
      role="button"
      tabIndex={0}
    >
      <LanguageIcon
        className={`h-5 w-5 ${isTransitioning ? "animate-pulse" : ""}`}
        language={language}
      />
      {isTransitioning && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
};

export default LanguageToggle;
