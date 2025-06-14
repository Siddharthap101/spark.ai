import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaRegPaperPlane, FaShieldAlt, FaBolt, FaGlobe } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Navbar from "../../layouts/Navbar";
import footer from "../../assets/footer.png";
import { useNavigate } from "react-router-dom";

// Define a custom event type for TypeScript
interface ThemeChangeEvent extends Event {
  detail: {
    isDark: boolean;
  };
}
 
const HomePage = () => {
  const navigate = useNavigate();
  const translations = {
    en: {
      nextGen: "Next Generation AI Platform",
      title1: "MDM",
      title2: "AI",
      description: "Empowering India's digital revolution with advanced communication solutions, built by Indians for the world.",
      begin: "Begin Your Journey",
      doc: "View Documentation",
      madeInIndia: "Made in India",
    },
    hi: {
      nextGen: "अगली पीढ़ी का एआई प्लेटफॉर्म",
      title1: "एमडीएम",
      title2: "एआई",
      description: "भारत की डिजिटल क्रांति को उन्नत संचार समाधानों के साथ सशक्त बनाना, भारतीयों द्वारा दुनिया के लिए।",
      begin: "अपनी यात्रा शुरू करें",
      doc: "दस्तावेज़ देखें",
      madeInIndia: "भारत में निर्मित",
    },
    mr: {
      nextGen: "पुढील पिढीचे एआय प्लॅटफॉर्म",
      title1: "एमडीएम",
      title2: "एआय",
      description: "भारतातील डिजिटल क्रांतीला प्रगत संवाद उपायांसह सक्षम करणे, भारतीयांनी जगासाठी बनवलेले.",
      begin: "आपली यात्रा सुरू करा",
      doc: "दस्तऐवज पहा",
      madeInIndia: "भारतात बनवलेले",
    },
  };
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return (localStorage.getItem("selectedLanguage") as keyof typeof translations) || "en";
  });
  const [isDark, setIsDark] = useState(() => {
    // Initialize based on document class or localStorage
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark" || document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    // Listen for theme changes and update the state
    const handleThemeChange = (event: Event) => {
      const customEvent = event as ThemeChangeEvent;
      setIsDark(customEvent?.detail?.isDark);
    };

    window.addEventListener("themeChanged", handleThemeChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    // Listen for language changes and update the state
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

  // Update theme class on document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const floatingIcons = [
    { icon: <FaRegPaperPlane />, color: isDark ? "text-blue-400" : "text-blue-600" },
    { icon: <FaBolt />, color: isDark ? "text-yellow-400" : "text-yellow-500" },
    { icon: <FaShieldAlt />, color: isDark ? "text-green-400" : "text-green-600" },
    { icon: <FaGlobe />, color: isDark ? "text-purple-400" : "text-purple-600" },
  ];

  // Hide scrollbar when component mounts and restore when unmounts
  useEffect(() => {
    // Save original style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Disable scrolling completely
    document.body.style.overflow = "hidden";
    
    // Clean up function to restore original style
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      className={`min-h-screen overflow-hidden relative ${
        isDark
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-r from-white/90 to-gray-100/90"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2], 
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className={`absolute h-1 w-1 ${isDark ? "bg-blue-500" : "bg-blue-600"} rounded-full`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "blur(1px)",
            }}
          />
        ))}
        
        {/* Gradient circles in background */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDark ? "bg-blue-500/10" : "bg-blue-600/5"} rounded-full filter blur-3xl`}></div>
        <div className={`absolute bottom-1/3 right-1/4 w-64 h-64 ${isDark ? "bg-purple-500/10" : "bg-purple-600/5"} rounded-full filter blur-3xl`}></div>
      </div>

      {/* Fixed: Add proper spacing for navbar */}
      <div className="relative z-20">
        <Navbar showAuthButtons={true} />
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 flex flex-col items-center relative z-10">
        <div className="w-full lg:w-4/5 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left content section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left space-y-6 sm:space-y-8 w-full px-4 sm:px-6 lg:px-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-block px-5 py-2.5 rounded-full 
                ${isDark 
                  ? "bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 border border-blue-500/30" 
                  : "bg-gradient-to-r from-blue-500/10 to-blue-300/10 text-blue-600 border border-blue-400/30"} 
                text-sm font-medium backdrop-blur-sm`}
            >
              {translations[selectedLanguage].nextGen}
            </motion.div>

            <div className="space-y-8">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                <span className={`bg-clip-text text-transparent 
                  ${isDark 
                    ? "bg-gradient-to-r from-white to-gray-300" 
                    : "bg-gradient-to-r from-gray-800 to-gray-600"}`}>
                  {translations[selectedLanguage].title1} 
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">
                  {translations[selectedLanguage].title2}
                </span>
              </h1>

              <p className={`text-base sm:text-xl lg:text-2xl 
                ${isDark ? "text-gray-300" : "text-gray-700"} 
                leading-relaxed max-w-xl mx-auto lg:mx-0 font-light`}>
                {translations[selectedLanguage].description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start w-full sm:w-auto px-4 sm:px-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/chat")}
                  className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-300"
                >
                  {translations[selectedLanguage].begin}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${isDark 
                    ? "bg-white/10 border border-white/20 text-white hover:bg-white/15" 
                    : "bg-gray-800/10 border border-gray-800/20 text-gray-800 hover:bg-gray-800/15"} 
                    text-lg font-semibold px-8 py-4 rounded-xl backdrop-blur-md transition-all duration-300`}
                >
                  {translations[selectedLanguage].doc}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right animation section */}
          <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] mt-8 lg:mt-0">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Glow effect behind the chat bubble */}
              <div className={`absolute ${isDark ? "bg-blue-500/20" : "bg-blue-600/10"} rounded-full w-24 sm:w-32 md:w-40 lg:w-52 h-24 sm:h-32 md:h-40 lg:h-52 blur-2xl`} />

              {/* Main chat bubble icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1], 
                  rotate: [0, 3, -3, 0] 
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="relative z-10"
              >
                <IoChatbubbleEllipsesOutline 
                  className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl 
                    ${isDark ? "text-blue-500" : "text-blue-600"}`} 
                />
              </motion.div>

              {/* Rotating outer ring with icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {floatingIcons.map((item, index) => {
                  const angle = (index * 360) / floatingIcons.length;
                  const translateDistance = "-140px";

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.5 }}
                      className={`absolute text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${item.color} transition-all duration-300`}
                      style={{
                        transform: `rotate(${angle}deg) translateY(${translateDistance})`,
                      }}
                    >
                      {item.icon}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer "Made in India" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-6 sm:bottom-8 left-0 w-full flex justify-center items-center gap-3 px-4"
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`flex items-center gap-3 ${isDark 
            ? "bg-white/5 border border-white/10" 
            : "bg-gray-800/5 border border-gray-800/10"} backdrop-blur-md px-5 py-2.5 rounded-full`}
        >
          <span className={`text-sm sm:text-base font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {translations[selectedLanguage].madeInIndia}
          </span>
          <motion.img 
            src={footer}
            alt="Indian Flag"
            animate={{
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-6 h-4 object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;