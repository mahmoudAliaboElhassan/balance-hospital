import { useTranslation } from "react-i18next";

function LoadingGetData({ text }) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)`,
        padding: "24px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
        }}
      >
        <div
          className="card"
          style={{
            borderRadius: "16px",
            boxShadow: `0 25px 50px -12px var(--color-shadow)`,
            padding: "32px",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          {/* Bouncing dots animation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "var(--color-accent)",
                borderRadius: "50%",
                animation: "bounce 1s infinite",
              }}
            ></div>
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "var(--color-accent)",
                borderRadius: "50%",
                animation: "bounce 1s infinite",
                animationDelay: "0.1s",
              }}
            ></div>
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "var(--color-accent)",
                borderRadius: "50%",
                animation: "bounce 1s infinite",
                animationDelay: "0.2s",
              }}
            ></div>
          </div>

          {/* Loading text */}
          <p
            style={{
              textAlign: "center",
              marginTop: "16px",
              color: "var(--color-text-secondary)",
              fontSize: "18px",
              fontWeight: "500",
              letterSpacing: "0.025em",
            }}
          >
            {text ? text : t("loading")}
          </p>

          {/* Optional: Loading bar */}
          <div
            style={{
              width: "100%",
              height: "4px",
              backgroundColor: "var(--color-secondary)",
              borderRadius: "2px",
              marginTop: "24px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "var(--color-accent)",
                borderRadius: "2px",
                animation: "loading-bar 2s ease-in-out infinite",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add the necessary keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default LoadingGetData;
