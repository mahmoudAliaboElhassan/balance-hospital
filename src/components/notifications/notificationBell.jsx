import React, { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUnreadCount } from "../../state/act/actNotifications"
import i18next from "i18next"

const NotificationBell = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const unreadCount = useSelector((state) => state.notifications.unreadCount)
  const token = useSelector((state) => state.auth.token)
  const [animate, setAnimate] = useState(false)

  const isRTL = i18next.language === "ar"

  useEffect(() => {
    if (token) {
      // Fetch unread count initially
      dispatch(getUnreadCount())

      // Poll for updates every 30 seconds
    }
  }, [dispatch, token])

  useEffect(() => {
    if (unreadCount > 0) {
      setAnimate(true)
      const timeout = setTimeout(() => setAnimate(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [unreadCount])

  if (!token) return null

  const handleClick = () => {
    navigate("/admin-panel/notifications")
  }

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Notifications"
    >
      <Bell size={22} className={`${animate ? "animate-bell-ring" : ""}`} />
      {unreadCount > 0 && (
        <span
          className={`absolute -top-1 ${
            isRTL ? "-left-1" : "-right-1"
          } min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1 animate-badge-pop`}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  )
}

export default NotificationBell

// Add these animations to your global CSS file:
/*
@keyframes bell-ring {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-10deg); }
  20%, 40% { transform: rotate(10deg); }
  50% { transform: rotate(-5deg); }
  60% { transform: rotate(5deg); }
  70% { transform: rotate(0deg); }
}

@keyframes badge-pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-bell-ring {
  animation: bell-ring 0.6s ease-in-out;
}

.animate-badge-pop {
  animation: badge-pop 0.3s ease-out;
}
*/
