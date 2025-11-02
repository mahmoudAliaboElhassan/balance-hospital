import { useState } from "react"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { getUnreadCount } from "../../state/act/actNotifications"

function ConnectionStatusBadge({ isConnected, connectionState, onReconnect }) {
  const { t } = useTranslation()
  const [reconnecting, setReconnecting] = useState(false)

  const handleReconnect = async () => {
    setReconnecting(true)
    await onReconnect()
    setReconnecting(false)
  }

  if (isConnected) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg">
        <Wifi size={16} />
        araewrre
        <span className="text-sm font-medium">
          {t("signalr.connected") || "متصل"}
        </span>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg">
      <WifiOff size={16} />
      aerea
      <span className="text-sm font-medium">
        {t("signalr.disconnected") || "غير متصل"}
      </span>
      <button
        onClick={handleReconnect}
        disabled={reconnecting}
        className="ml-2 p-1 hover:bg-red-600 rounded transition-colors disabled:opacity-50"
      >
        <RefreshCw size={14} className={reconnecting ? "animate-spin" : ""} />
      </button>
    </div>
  )
}

export default ConnectionStatusBadge
