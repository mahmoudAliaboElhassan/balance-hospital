import { useRouteError } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { changeMode } from "../../state/slices/mode"
import Mode from "../../components/Header/mode"

// Theme Toggle Component (Mode)
const SunIcon = ({ className }) => (
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
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
)

const MoonIcon = ({ className }) => (
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
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)

const ModeToggle = ({ currentTheme }) => {
  const { mymode } = useSelector((state) => state.mode)
  const dispatch = useDispatch()

  return (
    <button
      onClick={() => dispatch(changeMode())}
      className="mode-toggle-btn"
      aria-label="Toggle theme"
      style={{
        padding: "8px",
        borderRadius: "8px",
        border: `1px solid ${currentTheme.border}`,
        background: currentTheme.secondary,
        color: currentTheme.text,
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {mymode === "light" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  )
}

const ErrorPage = () => {
  const error = useRouteError()
  const { mymode } = useSelector((state) => state.mode)
  const { t, i18n } = useTranslation()

  console.error("Error caught by ErrorPage:", error)
  console.error("Error type:", typeof error)
  console.error(
    "Error properties:",
    error ? Object.keys(error) : "No error object"
  )

  // Handle case where error might be null or undefined
  if (!error) {
    console.warn("No error object found, defaulting to 404")
  }

  // Get current language direction
  const isRTL = i18n.language === "ar"

  // Determine error type from the route error
  const getErrorType = () => {
    // Handle case where error is null or undefined
    // if (!error) {
    //   return "404";
    // }

    let status = null

    // Try to extract status from different possible error structures
    if (error?.status) {
      status = error.status
    } else if (error?.response?.status) {
      status = error.response.status
    } else if (error instanceof Response) {
      status = error.status
    } else if (error instanceof Error) {
      // Try to extract status from error message
      const statusMatch = error.message.match(/(\d{3})/)
      if (statusMatch) {
        status = parseInt(statusMatch[1])
      }
    }

    // Convert status to string and handle special cases
    if (status) {
      return status.toString()
    }

    // Check for specific error types in message
    if (error?.message) {
      const message = error.message.toLowerCase()
      if (
        message.includes("network") ||
        message.includes("connection") ||
        message.includes("fetch")
      ) {
        return "network"
      }
      if (
        message.includes("maintenance") ||
        message.includes("service unavailable")
      ) {
        return "maintenance"
      }
      if (
        message.includes("unauthorized") ||
        message.includes("not authorized")
      ) {
        return "401"
      }
      if (message.includes("forbidden") || message.includes("access denied")) {
        return "403"
      }
      if (message.includes("server error") || message.includes("internal")) {
        return "500"
      }
    }

    // Check for route-specific errors
    if (typeof error === "string" && error.includes("404")) {
      return "404"
    }

    // Default to 404 for unknown errors
  }

  const errorType = getErrorType()

  // Define color schemes for light and dark modes
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
  }

  const currentTheme = colorSchemes[mymode] || colorSchemes.light

  // Error configurations for different types
  const errorConfigs = {
    404: {
      title: t("error.404.title", "Patient Record Not Found"),
      message: t(
        "error.404.message",
        "The medical record or page you are looking for could not be located in our system."
      ),
      icon: "stethoscope",
      color: "#ef4444",
    },
    500: {
      title: t("error.500.title", "System Health Check Failed"),
      message: t(
        "error.500.message",
        "Our medical system is experiencing technical difficulties. Please try again in a few moments."
      ),
      icon: "heartMonitor",
      color: "#f59e0b",
    },
    403: {
      title: t("error.403.title", "Access Authorization Required"),
      message: t(
        "error.403.message",
        "You do not have the necessary medical clearance to access this section."
      ),
      icon: "shield",
      color: "#6366f1",
    },
    401: {
      title: t("error.401.title", "Authentication Required"),
      message: t(
        "error.401.message",
        "Please log in to access the medical system."
      ),
      icon: "shield",
      color: "#8b5cf6",
    },
    network: {
      title: t("error.network.title", "Connection to Medical Network Lost"),
      message: t(
        "error.network.message",
        "Unable to connect to the hospital database. Please check your connection."
      ),
      icon: "network",
      color: "#8b5cf6",
    },
    maintenance: {
      title: t("error.maintenance.title", "System Under Maintenance"),
      message: t(
        "error.maintenance.message",
        "Our medical systems are currently being updated to serve you better."
      ),
      icon: "maintenance",
      color: "#06b6d4",
    },
  }

  const currentError = errorConfigs[errorType] || errorConfigs["404"]

  // Extract title and message from error object with better fallbacks
  const getErrorTitle = () => {
    if (!error) {
      return currentError.title
    }
    if (error?.statusText && error.statusText !== "Unknown") {
      return error.statusText
    }
    if (error?.data?.title) {
      return error.data.title
    }
    if (error?.name && error.name !== "Error") {
      return error.name
    }
    return currentError.title
  }

  const getErrorMessage = () => {
    if (!error) {
      return currentError.message
    }
    if (error?.data?.message) {
      return error.data.message
    }
    if (
      error?.message &&
      !error.message.includes("Error:") &&
      error.message.length > 10
    ) {
      return error.message
    }
    if (error?.data?.error) {
      return error.data.error
    }
    return currentError.message
  }

  const title = getErrorTitle()
  const message = getErrorMessage()

  // SVG Icons
  const SvgIcons = {
    stethoscope: (
      <svg viewBox="0 0 200 200" className="error-icon">
        <defs>
          <linearGradient id="stethGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentError.color} />
            <stop offset="100%" stopColor={`${currentError.color}80`} />
          </linearGradient>
        </defs>

        {/* Stethoscope tubes */}
        <path
          d="M60 40 Q80 60 90 100 Q95 120 100 140"
          stroke="url(#stethGrad)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M140 40 Q120 60 110 100 Q105 120 100 140"
          stroke="url(#stethGrad)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Earpieces */}
        <ellipse cx="60" cy="35" rx="12" ry="8" fill={currentError.color} />
        <ellipse cx="140" cy="35" rx="12" ry="8" fill={currentError.color} />

        {/* Chest piece */}
        <circle cx="100" cy="150" r="25" fill={currentError.color} />
        <circle cx="100" cy="150" r="15" fill={currentTheme.primary} />
        <circle cx="100" cy="150" r="8" fill={currentError.color} />

        {/* Error symbol overlay */}
        <text
          x="100"
          y="110"
          textAnchor="middle"
          fill={currentError.color}
          fontSize="24"
          fontWeight="bold"
        >
          ⚠
        </text>
      </svg>
    ),

    heartMonitor: (
      <svg viewBox="0 0 200 200" className="error-icon">
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentError.color} />
            <stop offset="100%" stopColor={`${currentError.color}80`} />
          </linearGradient>
        </defs>

        {/* Monitor screen */}
        <rect
          x="20"
          y="30"
          width="160"
          height="100"
          rx="10"
          fill={currentTheme.cardBg}
          stroke={currentError.color}
          strokeWidth="3"
        />

        {/* Heartbeat line (error - flatline) */}
        <path
          d="M30 80 L50 80 L60 50 L70 110 L80 60 L90 90 L170 80"
          stroke={currentError.color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Error flatline */}
        <path
          d="M90 80 L170 80"
          stroke="#ff0000"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="5,5"
        />

        {/* Monitor base */}
        <rect
          x="40"
          y="130"
          width="120"
          height="40"
          rx="5"
          fill={currentError.color}
        />

        {/* Error text on screen */}
        <text
          x="100"
          y="115"
          textAnchor="middle"
          fill={currentError.color}
          fontSize="12"
          fontWeight="bold"
        >
          ERROR
        </text>
      </svg>
    ),

    shield: (
      <svg viewBox="0 0 200 200" className="error-icon">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentError.color} />
            <stop offset="100%" stopColor={`${currentError.color}80`} />
          </linearGradient>
        </defs>

        {/* Shield outline */}
        <path
          d="M100 20 L150 40 L150 100 Q150 140 100 170 Q50 140 50 100 L50 40 Z"
          fill="url(#shieldGrad)"
          stroke={currentError.color}
          strokeWidth="2"
        />

        {/* Medical cross */}
        <rect
          x="90"
          y="60"
          width="20"
          height="60"
          fill={currentTheme.primary}
          rx="2"
        />
        <rect
          x="70"
          y="80"
          width="60"
          height="20"
          fill={currentTheme.primary}
          rx="2"
        />

        {/* Lock symbol */}
        <circle
          cx="100"
          cy="130"
          r="15"
          fill="none"
          stroke={currentTheme.primary}
          strokeWidth="3"
        />
        <rect
          x="92"
          y="135"
          width="16"
          height="12"
          fill={currentTheme.primary}
          rx="2"
        />
      </svg>
    ),

    network: (
      <svg viewBox="0 0 200 200" className="error-icon">
        <defs>
          <linearGradient id="networkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentError.color} />
            <stop offset="100%" stopColor={`${currentError.color}80`} />
          </linearGradient>
        </defs>

        {/* Hospital building */}
        <rect x="70" y="80" width="60" height="80" fill={currentError.color} />
        <rect
          x="75"
          y="85"
          width="10"
          height="15"
          fill={currentTheme.primary}
        />
        <rect
          x="90"
          y="85"
          width="10"
          height="15"
          fill={currentTheme.primary}
        />
        <rect
          x="105"
          y="85"
          width="10"
          height="15"
          fill={currentTheme.primary}
        />
        <rect
          x="120"
          y="85"
          width="10"
          height="15"
          fill={currentTheme.primary}
        />

        {/* Medical cross on building */}
        <rect
          x="95"
          y="110"
          width="10"
          height="30"
          fill={currentTheme.primary}
        />
        <rect
          x="85"
          y="120"
          width="30"
          height="10"
          fill={currentTheme.primary}
        />

        {/* Broken connection lines */}
        <path
          d="M50 50 L70 60"
          stroke={currentError.color}
          strokeWidth="3"
          strokeDasharray="5,5"
        />
        <path
          d="M130 60 L150 50"
          stroke={currentError.color}
          strokeWidth="3"
          strokeDasharray="5,5"
        />

        {/* WiFi symbols (broken) */}
        <path
          d="M30 30 Q40 40 50 30"
          stroke="#ff0000"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M150 30 Q160 40 170 30"
          stroke="#ff0000"
          strokeWidth="3"
          fill="none"
        />

        {/* Error X */}
        <path
          d="M35 45 L45 35 M45 45 L35 35"
          stroke="#ff0000"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),

    maintenance: (
      <svg viewBox="0 0 200 200" className="error-icon">
        <defs>
          <linearGradient
            id="maintenanceGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={currentError.color} />
            <stop offset="100%" stopColor={`${currentError.color}80`} />
          </linearGradient>
        </defs>

        {/* Wrench */}
        <rect
          x="60"
          y="70"
          width="80"
          height="15"
          rx="7"
          fill={currentError.color}
          transform="rotate(45 100 77)"
        />
        <circle cx="70" cy="77" r="12" fill={currentError.color} />
        <circle cx="130" cy="77" r="8" fill={currentTheme.primary} />

        {/* Screwdriver */}
        <rect
          x="80"
          y="100"
          width="40"
          height="8"
          rx="4"
          fill={currentError.color}
          transform="rotate(-30 100 104)"
        />
        <rect
          x="115"
          y="95"
          width="25"
          height="18"
          rx="2"
          fill={currentError.color}
          transform="rotate(-30 127 104)"
        />

        {/* Medical cross in gear */}
        <circle
          cx="100"
          cy="140"
          r="25"
          fill="none"
          stroke={currentError.color}
          strokeWidth="4"
        />
        <rect x="95" y="125" width="10" height="30" fill={currentError.color} />
        <rect x="85" y="135" width="30" height="10" fill={currentError.color} />

        {/* Gear teeth */}
        <rect x="98" y="110" width="4" height="8" fill={currentError.color} />
        <rect x="98" y="162" width="4" height="8" fill={currentError.color} />
        <rect x="122" y="138" width="8" height="4" fill={currentError.color} />
        <rect x="70" y="138" width="8" height="4" fill={currentError.color} />
      </svg>
    ),
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  const handleGoBack = () => {
    window.history.back()
    // window.location.reload();
  }

  return (
    <div className="error-page">
      <style jsx>{`
        .error-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            ${currentTheme.primary} 0%,
            ${currentTheme.secondary} 100%
          );
          padding: 20px;
          direction: ${isRTL ? "rtl" : "ltr"};
        }

        .mode-toggle-container {
          position: fixed;
          top: 20px;
          ${isRTL ? "left: 20px" : "right: 20px"};
          z-index: 1001;
        }

        .mode-toggle-btn:hover {
          background: ${currentTheme.border} !important;
          transform: scale(1.05);
        }

        .error-container {
          max-width: 600px;
          width: 100%;
          text-align: center;
          background: ${currentTheme.cardBg};
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px ${currentTheme.shadow};
          border: 1px solid ${currentTheme.border};
          position: relative;
          overflow: hidden;
        }

        .error-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            ${currentError.color},
            ${currentError.color}80
          );
        }

        .error-icon {
          width: 120px;
          height: 120px;
          margin: 0 auto 30px;
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .error-code {
          font-size: 4rem;
          font-weight: 800;
          color: ${currentError.color};
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px ${currentTheme.shadow};
        }

        .error-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: ${currentTheme.text};
          margin-bottom: 15px;
          line-height: 1.3;
        }

        .error-message {
          font-size: 1.1rem;
          color: ${currentTheme.textSecondary};
          margin-bottom: 40px;
          line-height: 1.6;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .error-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .error-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .error-btn-primary {
          background: ${currentError.color};
          color: ${mymode === "dark" ? "#ffffff" : "#ffffff"};
        }

        .error-btn-primary:hover {
          background: ${currentError.color}dd;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px ${currentError.color}40;
        }

        .error-btn-secondary {
          background: ${currentTheme.secondary};
          color: ${currentTheme.text};
          border: 1px solid ${currentTheme.border};
        }

        .error-btn-secondary:hover {
          background: ${currentTheme.border};
          transform: translateY(-2px);
        }

        .medical-bg {
          position: absolute;
          opacity: 0.03;
          font-size: 8rem;
          color: ${currentError.color};
          top: 20%;
          right: -50px;
          transform: rotate(15deg);
          z-index: 0;
        }

        .error-container > * {
          position: relative;
          z-index: 1;
        }

        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${currentTheme.secondary};
          padding: 8px 16px;
          border-radius: 20px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          color: ${currentTheme.textSecondary};
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${currentError.color};
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0.3;
          }
        }

        .error-details {
          background: ${currentTheme.secondary};
          border: 1px solid ${currentTheme.border};
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          font-family: monospace;
          font-size: 0.9rem;
          color: ${currentTheme.textSecondary};
          max-height: 150px;
          overflow-y: auto;
        }

        @media (max-width: 640px) {
          .error-container {
            padding: 30px 20px;
            margin: 10px;
          }

          .error-code {
            font-size: 3rem;
          }

          .error-title {
            font-size: 1.5rem;
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .error-btn {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>

      <div className="mode-toggle-container">
        <Mode />{" "}
      </div>

      <div className="error-container">
        <div className="medical-bg">🏥</div>

        <div className="status-indicator">
          <div className="status-dot"></div>
          {t("error.status", "System Status")}:{" "}
          {errorType === "maintenance"
            ? t("error.status.maintenance", "Under Maintenance")
            : t("error.status.detected", "Error Detected")}
        </div>

        {SvgIcons[currentError.icon]}

        <div className="error-code">{errorType}</div>

        <h1 className="error-title">{title}</h1>

        <p className="error-message">{message}</p>

        {/* Show technical error details if available */}
        {error && (
          <details>
            <summary
              style={{
                color: currentTheme.textSecondary,
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              {t("error.technicalDetails", "Technical Details")}
            </summary>
            <div className="error-details">
              <strong>{t("error.details.errorType", "Error Type")}:</strong>{" "}
              {typeof error}
              <br />
              <strong>
                {t("error.details.errorStatus", "Error Status")}:
              </strong>{" "}
              {errorType}
              <br />
              {error.status === 404 && (
                <>
                  <strong>
                    {t("error.details.httpStatus", "HTTP Status")}:
                  </strong>{" "}
                  {error.status}
                  <br />
                </>
              )}
              {error.message && (
                <>
                  <strong>{t("error.details.message", "Message")}:</strong>{" "}
                  {error.message}
                  <br />
                </>
              )}
              {error.name && (
                <>
                  <strong>{t("error.details.name", "Name")}:</strong>{" "}
                  {error.name}
                  <br />
                </>
              )}
              {error.data && (
                <>
                  <strong>{t("error.details.data", "Data")}:</strong>{" "}
                  {JSON.stringify(error.data, null, 2)}
                  <br />
                </>
              )}
              {error.stack && (
                <>
                  <strong>
                    {t("error.details.stackTrace", "Stack Trace")}:
                  </strong>
                  <br />
                  <pre style={{ fontSize: "0.8rem", overflow: "auto" }}>
                    {error.stack}
                  </pre>
                </>
              )}
            </div>
          </details>
        )}

        <div className="error-actions">
          <button onClick={handleRetry} className="error-btn error-btn-primary">
            <span>🔄</span>
            {t("error.actions.retry", "Retry Connection")}
          </button>

          <button
            onClick={handleGoBack}
            className="error-btn error-btn-secondary"
          >
            <span>{isRTL ? "→" : "←"}</span>
            {t("error.actions.goBack", "Go Back")}
          </button>

          <button
            onClick={handleGoHome}
            className="error-btn error-btn-secondary"
          >
            <span>🏠</span>
            {t("error.actions.dashboard", "Dashboard")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
