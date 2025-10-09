import { Outlet } from "react-router-dom"
import Header from "../../components/Header"
import { useDispatch, useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import { useEffect } from "react"
import { logOut } from "../../state/slices/auth"
import { useTranslation } from "react-i18next"
import ConnectionStatusBadge from "../../components/ConnectionStatus"
import { useSignalR } from "../../hooks/use-singalr"

function RootLayout() {
  const { mymode } = useSelector((state) => state.mode)
  const { expiresAt } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  console.log("Current mode:", mymode)
  const { t } = useTranslation()

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

  // CSS variables for dynamic theming
  const themeStyles = {
    "--color-primary": currentTheme.primary,
    "--color-secondary": currentTheme.secondary,
    "--color-accent": currentTheme.accent,
    "--color-accent-hover": currentTheme.accentHover,
    "--color-text": currentTheme.text,
    "--color-text-secondary": currentTheme.textSecondary,
    "--color-border": currentTheme.border,
    "--color-shadow": currentTheme.shadow,
    "--color-card-bg": currentTheme.cardBg,
    "--color-header-bg": currentTheme.headerBg,
    "--color-footer-bg": currentTheme.footerBg,
  }

  useEffect(() => {
    if (!expiresAt) {
      console.log("No expiration time found")
      return
    }

    const checkTokenExpiration = () => {
      const currentTime = new Date()
      const expirationTime = new Date(expiresAt)

      // Format times for logging
      const currentTimeFormatted = currentTime.toISOString()
      const expirationTimeFormatted = expirationTime.toISOString()

      console.log("🕒 Token Expiration Check:")
      console.log("  Current Time:    ", currentTimeFormatted)
      console.log("  Expiration Time: ", expirationTimeFormatted)
      console.log(
        "  Time Difference: ",
        Math.round((expirationTime - currentTime) / 1000),
        "seconds"
      )

      // Check if token has expired
      if (currentTime >= expirationTime) {
        console.log("❌ Token has expired, logging out user")

        // Show notification to user
        toast.error(t("session-expired"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        // Dispatch logout action
        dispatch(logOut())
      } else {
        const timeUntilExpiry = Math.round(
          (expirationTime - currentTime) / 1000
        )

        console.log("✅ Token is still valid for", timeUntilExpiry, "seconds")
      }
    }

    // Check immediately
    checkTokenExpiration()

    // Set up interval to check every minute
    const intervalId = setInterval(checkTokenExpiration, 6000) // Check every 60 seconds

    // Cleanup interval on component unmount or expiresAt change
    return () => {
      console.log("🧹 Cleaning up token expiration check interval")
      clearInterval(intervalId)
    }
  }, [expiresAt, dispatch])
  const { isConnected, connectionState, reconnect } = useSignalR()

  return (
    <div
      className={`root-layout ${mymode}`}
      style={{
        ...themeStyles,
        minHeight: "100vh",
        backgroundColor: currentTheme.primary,
        color: currentTheme.text,
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Global CSS injection for consistent theming */}
      <style jsx global>{`
        * {
          transition: background-color 0.3s ease, color 0.3s ease,
            border-color 0.3s ease;
        }

        body {
          background-color: ${currentTheme.primary};
          color: ${currentTheme.text};
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            sans-serif;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${currentTheme.secondary};
        }

        ::-webkit-scrollbar-thumb {
          background: ${currentTheme.accent};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${currentTheme.accentHover};
        }

        /* Selection styling */
        ::selection {
          background-color: ${currentTheme.accent};
          color: ${mymode === "dark"
            ? currentTheme.primary
            : currentTheme.text};
        }

        /* Focus styles */
        button:focus,
        input:focus,
        textarea:focus,
        select:focus {
          outline: 2px solid ${currentTheme.accent};
          outline-offset: 2px;
        }

        /* Link styles */
        a {
          color: ${currentTheme.accent};
          text-decoration: none;
          transition: color 0.3s ease;
        }

        a:hover {
          color: ${currentTheme.accentHover};
        }

        /* Button styles */
        .btn-primary {
          background-color: ${currentTheme.accent};
          color: ${mymode === "dark" ? currentTheme.primary : "#ffffff"};
          border: 1px solid ${currentTheme.accent};
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background-color: ${currentTheme.accentHover};
          border-color: ${currentTheme.accentHover};
        }

        .btn-secondary {
          background-color: transparent;
          color: ${currentTheme.text};
          border: 1px solid ${currentTheme.border};
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background-color: ${currentTheme.secondary};
          border-color: ${currentTheme.accent};
        }

        /* Card styles */
        .card {
          background-color: ${currentTheme.cardBg};
          border: 1px solid ${currentTheme.border};
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px ${currentTheme.shadow};
          transition: all 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 4px 8px ${currentTheme.shadow};
          transform: translateY(-2px);
        }

        /* Input styles */
        input,
        textarea,
        select {
          background-color: ${currentTheme.secondary};
          color: ${currentTheme.text};
          border: 1px solid ${currentTheme.border};
          border-radius: 6px;
          padding: 8px 12px;
          transition: all 0.3s ease;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: ${currentTheme.accent};
          box-shadow: 0 0 0 3px ${currentTheme.accent}20;
        }

        /* Modal/Dialog styles */
        .modal-overlay {
          background-color: ${mymode === "dark"
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(0, 0, 0, 0.5)"};
        }

        .modal-content {
          background-color: ${currentTheme.primary};
          border: 1px solid ${currentTheme.border};
          border-radius: 12px;
          box-shadow: 0 10px 25px ${currentTheme.shadow};
        }

        /* Navigation styles */
        .nav-item {
          color: ${currentTheme.textSecondary};
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .nav-item:hover,
        .nav-item.active {
          color: ${currentTheme.accent};
          background-color: ${currentTheme.secondary};
        }

        /* Dropdown styles */
        .dropdown-menu {
          background-color: ${currentTheme.cardBg};
          border: 1px solid ${currentTheme.border};
          border-radius: 8px;
          box-shadow: 0 4px 12px ${currentTheme.shadow};
        }

        .dropdown-item {
          color: ${currentTheme.text};
          padding: 8px 16px;
          transition: all 0.3s ease;
        }

        .dropdown-item:hover {
          background-color: ${currentTheme.secondary};
          color: ${currentTheme.accent};
        }

        /* Table styles */
        table {
          background-color: ${currentTheme.cardBg};
          border-collapse: collapse;
          width: 100%;
        }

        th,
        td {
          border: 1px solid ${currentTheme.border};
          padding: 12px;
          text-align: left;
        }

        th {
          background-color: ${currentTheme.secondary};
          color: ${currentTheme.text};
          font-weight: 600;
        }

        tbody tr:hover {
          background-color: ${currentTheme.secondary};
        }

        /* Code styles */
        code {
          background-color: ${currentTheme.secondary};
          color: ${currentTheme.accent};
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "Monaco", "Menlo", monospace;
        }

        pre {
          background-color: ${currentTheme.secondary};
          border: 1px solid ${currentTheme.border};
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
        }

        /* Toast/Alert styles */
        .alert {
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 16px;
          border-left: 4px solid ${currentTheme.accent};
        }

        .alert-info {
          background-color: ${mymode === "dark"
            ? currentTheme.secondary
            : "#eff6ff"};
          color: ${currentTheme.text};
        }

        .alert-success {
          background-color: ${mymode === "dark" ? "#064e3b" : "#f0fdf4"};
          border-left-color: #10b981;
        }

        .alert-warning {
          background-color: ${mymode === "dark" ? "#451a03" : "#fffbeb"};
          border-left-color: #f59e0b;
        }

        .alert-error {
          background-color: ${mymode === "dark" ? "#450a0a" : "#fef2f2"};
          border-left-color: #ef4444;
        }

        /* Loading spinner */
        .spinner {
          border: 2px solid ${currentTheme.border};
          border-top: 2px solid ${currentTheme.accent};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Divider */
        .divider {
          border-top: 1px solid ${currentTheme.border};
          margin: 20px 0;
        }

        /* Badge styles */
        .badge {
          background-color: ${currentTheme.accent};
          color: ${mymode === "dark" ? currentTheme.primary : "#ffffff"};
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .badge-secondary {
          background-color: ${currentTheme.secondary};
          color: ${currentTheme.textSecondary};
          border: 1px solid ${currentTheme.border};
        }
      `}</style>

      <div
        className="layout-container"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Header with theme-aware styling */}
        <header
          style={{
            backgroundColor: currentTheme.headerBg,
            borderBottom: `1px solid ${currentTheme.border}`,
            boxShadow: `0 2px 4px ${currentTheme.shadow}`,
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <Header />
        </header>

        <ConnectionStatusBadge
          isConnected={isConnected}
          connectionState={connectionState}
          onReconnect={reconnect}
        />

        <ToastContainer />

        {/* Main content area */}
        <main
          style={{
            flex: 1,
            backgroundColor: currentTheme.primary,
          }}
        >
          <Outlet />
        </main>

        {/* Footer with theme-aware styling */}
        {/* <footer
          style={{
            backgroundColor: currentTheme.footerBg,
            borderTop: `1px solid ${currentTheme.border}`,
            marginTop: "auto",
          }}
        >
          <Footer />
        </footer> */}
      </div>

      {/* Theme indicator (optional - can be removed) */}
      {/* <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "8px 12px",
          backgroundColor: currentTheme.cardBg,
          border: `1px solid ${currentTheme.border}`,
          borderRadius: "20px",
          fontSize: "12px",
          color: currentTheme.textSecondary,
          boxShadow: `0 2px 8px ${currentTheme.shadow}`,
          zIndex: 1000,
        }}
      >
        {mymode === "dark" ? "🌙" : "☀️"} {mymode} mode
      </div> */}
    </div>
  )
}

export default RootLayout
