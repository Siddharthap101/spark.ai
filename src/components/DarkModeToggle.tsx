import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check if dark mode preference exists in localStorage
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });
 
  useEffect(() => {
    // Update localStorage and document class when theme changes
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
    
    // Dispatch a custom event to notify other components about theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-blue-400/20 dark:bg-gray-800 shadow-lg flex items-center p-1"
      aria-label="Toggle dark mode"
    >
      <motion.div
        className="w-6 h-6 bg-blue-500 dark:bg-gray-600 rounded-full flex items-center justify-center"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        animate={{ x: isDark ? "100%" : "0%" }}
      >
        {isDark ? (
          <Moon className="text-white" size={14} />
        ) : (
          <Sun className="text-white" size={14} />
        )}
      </motion.div>
    </button>
  );
};

export default DarkModeToggle;