import { useEffect, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { signalRService } from "../services/signalRService"
import { getUnreadCount } from "../state/act/actNotifications"

export const useSignalR = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState("Disconnected")
  const [connectionError, setConnectionError] = useState(null)

  // ✅ دالة معالجة الإشعار
  const handleNotification = useCallback(
    (payload) => {
      console.log("📨 استقبال إشعار:", payload)

      if (payload.kind === "diagnostic_ping") {
        toast.info(payload.message || "Ping received!", {
          position: "top-right",
          autoClose: 3000,
        })
        return
      }

      if (payload.kind === "notification" || payload.type) {
        const title =
          i18n.language === "ar"
            ? payload.titleAr || payload.title
            : payload.titleEn || payload.title
        const message =
          i18n.language === "ar"
            ? payload.messageAr || payload.message
            : payload.messageEn || payload.message

        switch (payload.priority) {
          case "Urgent":
            toast.error(`${title}: ${message}`, {
              autoClose: false,
              position: "top-center",
            })
            break
          case "High":
            toast.warning(`${title}: ${message}`, {
              autoClose: 8000,
              position: "top-right",
            })
            break
          case "Normal":
            toast.info(`${title}: ${message}`, {
              autoClose: 5000,
              position: "top-right",
            })
            break
          case "Low":
            toast.success(`${title}: ${message}`, {
              autoClose: 3000,
              position: "top-right",
            })
            break
          default:
            toast.info(`${title}: ${message}`, {
              position: "top-right",
            })
        }

        // تحديث عدد الإشعارات
        dispatch(getUnreadCount())
      }
    },
    [i18n.language, dispatch]
  )

  // ✅ دالة معالجة الأخطاء
  const handleError = useCallback(
    (error) => {
      console.error("🚨 [SignalR Error]:", error)
      setConnectionError(error)

      switch (error.code) {
        case "NO_TOKEN":
          // toast.error(
          //   t("signalr.errors.noToken") || "يرجى تسجيل الدخول أولاً",
          //   {
          //     position: "top-center",
          //     autoClose: 5000,
          //   }
          // )
          break
        case "UNAUTHORIZED":
          // toast.error(
          //   t("signalr.errors.unauthorized") ||
          //     "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى",
          //   {
          //     position: "top-center",
          //     autoClose: false,
          //   }
          // )
          // يمكنك هنا إضافة logout logic
          break
        case "NETWORK_ERROR":
          // toast.error(t("signalr.errors.network") || "خطأ في الاتصال بالشبكة", {
          //   position: "top-right",
          //   autoClose: 5000,
          // })
          break
        case "MAX_RETRIES":
          // toast.error(
          //   t("signalr.errors.maxRetries") || "فشل الاتصال بعد عدة محاولات",
          //   {
          //     position: "top-right",
          //     autoClose: 5000,
          //   }
          // )
          break
        default:
        // toast.error(error.message || "حدث خطأ في الاتصال", {
        //   position: "top-right",
        //   autoClose: 5000,
        // })
      }
    },
    [t]
  )

  useEffect(() => {
    let notificationUnsubscribe = null
    let errorUnsubscribe = null
    let mounted = true

    const initConnection = async () => {
      // تسجيل الـ handlers
      notificationUnsubscribe =
        signalRService.onNotification(handleNotification)
      errorUnsubscribe = signalRService.onError(handleError)

      // محاولة الاتصال
      const connected = await signalRService.start()

      if (mounted) {
        setIsConnected(connected)
        setConnectionState(signalRService.getConnectionState())

        if (!connected) {
          console.warn("⚠️ فشل الاتصال الأولي")
        }
      }
    }

    initConnection()

    // مراقبة حالة الاتصال
    const interval = setInterval(() => {
      if (!mounted) return

      const state = signalRService.getConnectionState()
      const connected = signalRService.isConnected()

      setIsConnected(connected)
      setConnectionState(state)

      // محاولة إعادة الاتصال فقط إذا كان منفصل تماماً
      if (!connected && state === "Disconnected") {
        console.log("🔄 محاولة إعادة الاتصال التلقائية...")
        signalRService.start()
      }
    }, 10000) // كل 10 ثواني

    return () => {
      mounted = false
      if (notificationUnsubscribe) notificationUnsubscribe()
      if (errorUnsubscribe) errorUnsubscribe()
      clearInterval(interval)
      // لا نوقف الاتصال عند unmount للحفاظ عليه
    }
  }, [handleNotification, handleError])

  // دالة إعادة الاتصال يدوياً
  const reconnect = useCallback(async () => {
    console.log("🔄 إعادة اتصال يدوية...")
    setConnectionError(null)
    const success = await signalRService.reconnect()
    setIsConnected(success)
    setConnectionState(signalRService.getConnectionState())

    if (success) {
      toast.success(t("signalr.reconnected") || "تم إعادة الاتصال بنجاح", {
        position: "top-right",
        autoClose: 3000,
      })
    }

    return success
  }, [t])

  return {
    isConnected,
    connectionState,
    connectionError,
    reconnect,
  }
}
