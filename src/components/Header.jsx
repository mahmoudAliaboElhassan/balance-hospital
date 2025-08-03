import LanguageToggle from "./lang";
import { Link } from "react-router-dom";

import logo from "../assets/logo.jpg";
import Mode from "./mode";
import { useTranslation } from "react-i18next";
import { AnimatedLogo } from "./AnimatedLogo";
import { logOut } from "../state/slices/auth";
import { useDispatch, useSelector } from "react-redux";

// Animated Logo Component

const Header = () => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logOut());
    // optionally redirect or clear other state…
  };

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

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center gap-6">
            {HeaderElements?.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav> */}

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {token ? (
              <button
                onClick={handleLogOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center cursor-pointer"
              >
                {t("logOut")}
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                  {t("get-started")}
                </button>
              </Link>
            )}

            {/* 🌐 LANGUAGE TOGGLE - Place it here between Get Started and Theme Toggle */}
            <LanguageToggle variant="icon" />
            <Mode />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
