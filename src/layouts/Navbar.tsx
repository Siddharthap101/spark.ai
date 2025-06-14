import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import ailogo from "../assets/ailogo.png";

interface NavItem {
  title: string;
  path: string; 
}

interface NavbarProps {
  showAuthButtons?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showAuthButtons = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Track dark mode state
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  
  // Ensure theme consistency by reading from localStorage
  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);

    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.isDark);
      localStorage.setItem("theme", e.detail.isDark ? "dark" : "light");
    };

    window.addEventListener("themeChanged", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("themeChanged", handleThemeChange as EventListener);
    };
  }, []);
  
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.isDark);
    };

    window.addEventListener("themeChanged", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("themeChanged", handleThemeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    // Update dark mode state on route change
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, [location]);

  const translations = {
    en: {
      features: "Features",
      documentation: "Documentation",
      about: "About",
      login: "Login",
    },
    hi: {
      features: "विशेषताएँ",
      documentation: "दस्तावेज़ीकरण",
      about: "परिचय",
      login: "लॉगिन",
    },
    mr: {
      features: "वैशिष्ट्ये",
      documentation: "दस्तऐवजीकरण",
      about: "बद्दल",
      login: "लॉगिन",
    },
  };

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return (localStorage.getItem("selectedLanguage") as keyof typeof translations) || "en";
  });

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setSelectedLanguage(event.detail);
      localStorage.setItem("selectedLanguage", event.detail);
    };
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    // On mount, set from localStorage if available
    const storedLang = localStorage.getItem("selectedLanguage") as keyof typeof translations;
    if (storedLang && storedLang !== selectedLanguage) {
      setSelectedLanguage(storedLang);
    }
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
    };
  }, [selectedLanguage]);
  
  const navItems: NavItem[] = [
    { title: translations[selectedLanguage].features, path: "/features" },
    { title: translations[selectedLanguage].documentation, path: "/documentation" },
    { title: translations[selectedLanguage].about, path: "/about" },
  ];

  return (
    <nav className={`fixed top-0 w-full px-4 sm:px-8 py-2 md:py-4 backdrop-blur-sm z-50 flex flex-col md:flex-row justify-between items-center shadow-lg
      ${isDark 
        ? "bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-b border-gray-700 text-gray-300" 
        : "bg-gradient-to-r from-white/90 to-gray-100/90 border-b border-gray-200 text-gray-700"}`} 
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
      <style>{`
        nav::-webkit-scrollbar {
          display: none;
        }
        nav button {
          text-align: center;
        }
      `}</style>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-auto flex justify-between items-center">
            {/* logo with subtle animation */}
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                className="h-12 w-32 sm:h-10 sm:w-36 md:h-12 md:w-48 object-contain object-center"
                src={ailogo}
                alt="logo"
              />
            </div>

            {/* mobile menu */}
            <div className="flex items-center gap-4 md:hidden">
              <DarkModeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg
                  ${isDark 
                    ? "text-gray-300 hover:text-white bg-gray-800/80" 
                    : "text-gray-600 hover:text-gray-900 bg-gray-200/80"}`}
              >
                {isMobileMenuOpen ? (
                  <span className="text-xl">✕</span>
                ) : (
                  <span className="text-xl">☰</span>
                )}
              </button>
            </div>
          </div>

          <div
            className={`${isMobileMenuOpen ? "flex" : "hidden md:flex"} flex-col md:flex-row items-center w-full md:w-auto gap-4 mt-4 md:mt-0 pb-4 md:pb-0 px-4 sm:px-0`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveNav(item.title);
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  onMouseEnter={() => setActiveNav(item.title)}
                  onMouseLeave={() => setActiveNav(null)}
                  className={`relative text-sm sm:text-base w-full md:w-auto text-center
                    ${activeNav === item.title 
                      ? isDark ? "text-white font-medium" : "text-blue-700 font-medium"
                      : isDark ? "text-gray-300" : "text-gray-600"}
                    hover:${isDark ? "text-white" : "text-blue-700"} transition-colors duration-200 px-3 py-2 md:py-0`}
                >
                  {item.title}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 ${activeNav === item.title ? 'w-full' : 'w-0'} 
                      ${isDark ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gradient-to-r from-blue-600 to-blue-400"} 
                      rounded-full transition-all duration-200`}
                  />
                </button>
              ))} 
            </div>

            {/* Auth Buttons and Dark Mode Toggle */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0 md:ml-6">
              {showAuthButtons && (
                <button
                  onClick={() => navigate("/Login")}
                  className={`w-full md:w-auto px-5 py-2 rounded-lg transition-all duration-200 font-medium shadow-md
                    ${isDark 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700" 
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"}`}
                >
                  {translations[selectedLanguage].login}
                </button>
              )}
              <div className="hidden md:block">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;