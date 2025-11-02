import { Link, useNavigate } from "react-router-dom"

import LanguageToggle from "./lang"
import logo from "../../assets/logo.jpg"
import Mode from "./mode"
import { useTranslation } from "react-i18next"
import { AnimatedLogo } from "./AnimatedLogo"
import { logOut } from "../../state/slices/auth"
import { useDispatch, useSelector } from "react-redux"
import { LogOut } from "lucide-react"
import i18next from "i18next"
import NotificationBell from "../notifications/notificationBell"

const Header = () => {
  const { t } = useTranslation()
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = () => {
    dispatch(logOut())
    navigate("/login")
  }

  const language = i18next.language
  const isRTL = language === "ar"

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Animated Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-xl transition-all duration-200"
            >
              <AnimatedLogo
                showText={true}
                text="Balance"
                size="medium"
                logoSrc={logo}
                alt="Your Brand Logo"
                useImage={true}
                className="py-1 px-2 -mx-2 rounded-xl"
              />
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {token ? (
              <>
                {/* Notification Bell - Only show when logged in */}
                <NotificationBell />

                <button
                  onClick={handleLogOut}
                  className="group relative overflow-hidden bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out px-6 py-3 flex items-center justify-center gap-3 min-w-[120px] sm:min-w-[140px] active:scale-95"
                >
                  {/* Animated background overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                  {/* Ripple effect */}
                  <div className="absolute inset-0 opacity-0 group-active:opacity-30 bg-white rounded-xl transition-opacity duration-150"></div>

                  <LogOut
                    size={18}
                    className={`relative z-10 group-hover:rotate-12 transition-transform duration-300 ${
                      isRTL ? "ml-1" : "mr-1"
                    }`}
                  />
                  <span className="relative z-10 text-sm sm:text-base font-semibold tracking-wide">
                    {t("logOut")}
                  </span>
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                  {t("get-started")}
                </button>
              </Link>
            )}

            {/* Language Toggle */}
            <LanguageToggle variant="icon" />
            <Mode />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
