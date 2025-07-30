import React, {
  useEffect,
  createContext,
  useContext,
  HTMLAttributes,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import UseDirection from "../../hooks/use-direction";

const DrawerContext = createContext(undefined);

const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a DrawerProvider");
  }
  return context;
};

const Drawer = ({ children, open, onOpenChange, side = "right" }) => {
  const { direction } = UseDirection();
  // Automatically adjust side based on direction if using default sides
  const getAdjustedSide = (requestedSide) => {
    if (requestedSide === "right") {
      return direction.right; // Will be "right" in LTR, "left" in RTL
    }
    if (requestedSide === "left") {
      return direction.left; // Will be "left" in LTR, "right" in RTL
    }
    // For "top" and "bottom", return as-is
    return requestedSide;
  };

  const adjustedSide = getAdjustedSide(side);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  return (
    <DrawerContext.Provider
      value={{
        open,
        onOpenChange,
        side: adjustedSide,
        originalSide: side,
        direction: direction.direction,
      }}
    >
      <AnimatePresence>{open && <>{children}</>}</AnimatePresence>
    </DrawerContext.Provider>
  );
};

const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { onOpenChange } = useDrawerContext();
  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className={`fixed inset-0 z-50 bg-black/50 dark:bg-black/70 ${className}`}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { onOpenChange, side, direction } = useDrawerContext();

    const getSideClasses = () => {
      const baseClasses = "h-full w-60 max-w-[90vw] justify-center";

      switch (side) {
        case "left":
          return `inset-y-0 left-0 ${baseClasses} border-r border-gray-200 dark:border-gray-800`;
        case "right":
          return `inset-y-0 right-0 ${baseClasses} border-l border-gray-200 dark:border-gray-800`;
        case "top":
          return "inset-x-0 top-0 w-full h-60 max-h-[90vh] border-b border-gray-200 dark:border-gray-800";
        case "bottom":
          return "inset-x-0 bottom-0 w-full h-60 max-h-[90vh] border-t border-gray-200 dark:border-gray-800";
        default:
          return `inset-y-0 right-0 ${baseClasses} border-l border-gray-200 dark:border-gray-800`;
      }
    };

    const getMotionProps = () => {
      switch (side) {
        case "top":
          return {
            initial: { y: "-100%" },
            animate: { y: 0 },
            exit: { y: "-100%" },
          };
        case "bottom":
          return {
            initial: { y: "100%" },
            animate: { y: 0 },
            exit: { y: "100%" },
          };
        case "left":
          return {
            initial: { x: "-100%" },
            animate: { x: 0 },
            exit: { x: "-100%" },
          };
        case "right":
          return {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
          };
        default:
          return {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
          };
      }
    };

    // Close button position based on direction and side
    const getCloseButtonPosition = () => {
      if (side === "top" || side === "bottom") {
        // For top/bottom drawers, place close button on the appropriate side based on direction
        return direction === "rtl" ? "top-3 left-3" : "top-3 right-3";
      }
      // For left/right drawers, always place close button on the "inside" corner
      if (side === "left") {
        return "top-3 right-3";
      }
      return "top-3 left-3"; // right side
    };

    return (
      <motion.div
        ref={ref}
        className={`fixed z-50 bg-white dark:bg-black text-gray-900 dark:text-gray-50 shadow-lg flex flex-col ${getSideClasses()} ${className}`}
        {...getMotionProps()}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        {...props}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className={`absolute ${getCloseButtonPosition()} rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500`}
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </motion.div>
    );
  }
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }) => {
  const { direction } = useDrawerContext();

  return (
    <div
      className={`grid gap-1.5 p-6 text-center sm:text-${
        direction === "rtl" ? "right" : "left"
      } ${className}`}
      {...props}
    />
  );
};
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }) => {
  const { direction } = useDrawerContext();

  return (
    <div
      className={`mt-auto flex flex-col-reverse sm:flex-row ${
        direction === "rtl" ? "sm:justify-start" : "sm:justify-end"
      } sm:space-x-2 p-6 ${className}`}
      {...props}
    />
  );
};
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

const Button = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2
        ${
          variant === "outline"
            ? "border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
            : "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
        } 
        ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";

export {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  Button,
  UseDirection,
};
