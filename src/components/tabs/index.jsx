import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import UseAdminPanel from "../../hooks/use-admin-panel"

export default function TabsViewFancy({ isExpanded = false, click }) {
  const [activeTab, setActiveTab] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { adminPanelRoutes } = UseAdminPanel()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname.split("/")[2]

  useEffect(() => {
    const currentRoute = adminPanelRoutes.find((route) => {
      const routePath = route.path.split("/")[2]
      return currentPath?.slice(0, 4) === routePath?.slice(0, 4)
    })

    if (currentRoute) {
      setActiveTab(currentRoute.id)
    }
  }, [location.pathname, adminPanelRoutes])

  const handleTabClick = (tab) => {
    setActiveTab(tab.id)
    click()
    setIsLoading(true)
    navigate(tab.path)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-2 rounded-xl overflow-hidden">
        <div className="flex flex-col rounded-xl bg-black/5 dark:bg-white/5 backdrop-filter backdrop-blur-lg">
          {adminPanelRoutes.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                relative group flex items-center w-full transition-all cursor-pointer
                ${isExpanded ? "px-4 py-3" : "px-2 py-3 justify-center"}
                ${
                  activeTab === tab.id
                    ? "text-white dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                }
              `}
              title={!isExpanded ? tab.name : undefined}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tabBackground"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <div
                className={`flex items-center z-10 w-full ${
                  isExpanded ? "gap-3" : "justify-center"
                }`}
              >
                <span className={`${isExpanded ? "text-xl" : "text-2xl"}`}>
                  {tab.icon}
                </span>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="flex flex-col items-start overflow-hidden"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <span className="font-medium text-md whitespace-nowrap">
                        {tab.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isExpanded && (
                <AnimatePresence>
                  {activeTab === tab.id ? (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute right-3 w-2 h-2 rounded-full bg-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  ) : (
                    <div className="absolute right-3 w-2 h-2 rounded-full bg-gray-400/0 group-hover:bg-gray-400/30 transition-colors" />
                  )}
                </AnimatePresence>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
