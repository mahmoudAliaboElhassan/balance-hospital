import { useState } from "react"
const MountainIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
)

export const AnimatedLogo = ({
  showText = true,
  text = "Brand",
  className = "",
  size = "medium",
  logoSrc = logo,
  alt = "Logo",
  useImage = true,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-10 w-10",
  }

  const iconSizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  }

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Logo Container */}
      <div className="relative">
        {/* Background glow effect */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md transition-all duration-500 ${
            isHovered ? "scale-150 opacity-100" : "scale-100 opacity-0"
          }`}
        />

        {/* Logo container with hover effects */}
        <div
          className={`relative p-1.5 rounded-xl transition-all duration-300 ease-in-out ${
            isHovered
              ? "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg scale-110 rotate-3"
              : "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }`}
        >
          {/* Logo Image or Fallback */}
          {useImage && !imageError ? (
            <div className="relative">
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div
                  className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse`}
                />
              )}
              <img
                src={logoSrc}
                alt={alt}
                className={`${
                  sizeClasses[size]
                } object-cover rounded-lg transition-all duration-300 ease-in-out ${
                  imageLoaded ? "opacity-100" : "opacity-0 absolute top-0"
                } ${
                  isHovered
                    ? "shadow-lg brightness-110 contrast-110"
                    : "shadow-sm"
                }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </div>
          ) : (
            // Fallback to MountainIcon
            <MountainIcon
              className={`${
                iconSizeClasses[size]
              } transition-all duration-300 ease-in-out ${
                isHovered
                  ? "text-blue-600 dark:text-blue-400 drop-shadow-sm"
                  : "text-gray-900 dark:text-white"
              }`}
            />
          )}
        </div>

        {/* Animated particles effect */}
        {isHovered && (
          <>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-75 animation-delay-150" />
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping opacity-75 animation-delay-300" />
          </>
        )}

        {/* Floating shine effect */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent transition-all duration-500 ${
            isHovered ? "opacity-100 scale-110" : "opacity-0 scale-100"
          }`}
        />
      </div>

      {/* Animated Brand Text */}
      {showText && (
        <div className="overflow-hidden">
          <span
            className={`font-bold transition-all duration-300 ease-in-out ${
              textSizeClasses[size]
            } ${
              isHovered
                ? "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text transform translate-x-1"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {text}
          </span>

          {/* Underline animation */}
          <div
            className={`h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-in-out ${
              isHovered ? "w-full" : "w-0"
            }`}
          />
        </div>
      )}
    </div>
  )
}
