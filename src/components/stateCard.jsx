export const StatCard = ({ icon: Icon, label, value, color, isDark }) => {
  const colorClasses = {
    blue: isDark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600",
    green: isDark
      ? "bg-green-900/20 text-green-400"
      : "bg-green-50 text-green-600",
    purple: isDark
      ? "bg-purple-900/20 text-purple-400"
      : "bg-purple-50 text-purple-600",
    orange: isDark
      ? "bg-orange-900/20 text-orange-400"
      : "bg-orange-50 text-orange-600",
    red: isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600",
    yellow: isDark
      ? "bg-yellow-900/20 text-yellow-400"
      : "bg-yellow-50 text-yellow-600",
  }

  return (
    <div
      className={`p-4 rounded-xl transition-all duration-200 hover:shadow-lg ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p
        className={`text-sm font-medium ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </p>
    </div>
  )
}
