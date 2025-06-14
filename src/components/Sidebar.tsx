import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit2, FiLogOut, FiSettings, FiUser, FiGlobe, FiInfo, FiFileText, FiShield } from "react-icons/fi";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { LuMessagesSquare } from "react-icons/lu";

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
} 
 
interface SidebarProps {
  chats: ChatHistoryItem[];
  onSelectChat: (id: string) => void;
  activeChat: string | null;
  onDeleteChat: (id: string) => void;
  onEditChatTitle: (id: string, newTitle: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  onSelectChat,
  activeChat,
  onDeleteChat,
  onEditChatTitle,
  onNewChat,
}) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatHistoryItem | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isLearnMoreDropdownOpen, setIsLearnMoreDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof translations>(
    (localStorage.getItem("selectedLanguage") as keyof typeof translations) || "en"
  );
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    name: "User Name",
    email: "user@example.com",
  });

  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);

    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.isDark);
      localStorage.setItem("theme", e.detail.isDark ? "dark" : "light");
    };

    window.addEventListener("themeChanged", handleThemeChange as EventListener);
    
    // Close profile menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
        setIsProfileMenuOpen(false);
        setIsLanguageDropdownOpen(false);
        setIsLearnMoreDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener("themeChanged", handleThemeChange as EventListener);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const translations = {
    en: {
      chatHistory: "Chat History",
      newChat: "New Chat",
      settings: "Settings",
      logout: "Logout",
      language: "Language",
      feedback: "Feedback",
      profile: "Profile",
      close: "Close",
      save: "Save",
      learnMore: "Learn More",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
    },
    hi: {
      chatHistory: "चैट इतिहास",
      newChat: "नई चैट",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      language: "भाषा",
      feedback: "प्रतिक्रिया",
      profile: "प्रोफ़ाइल",
      close: "बंद करें",
      save: "सहेजें",
      learnMore: "और जानें",
      terms: "सेवा की शर्तें",
      privacy: "गोपनीयता नीति",
    },
    mr: {
      chatHistory: "चॅट इतिहास",
      newChat: "नवीन चॅट",
      settings: "सेटिंग्ज",
      logout: "लॉगआउट",
      language: "भाषा",
      feedback: "प्रतिक्रिया",
      profile: "प्रोफाइल",
      close: "बंद करा",
      save: "जतन करा",
      learnMore: "अधिक जाणून घ्या",
      terms: "सेवा अटी",
      privacy: "गोपनीयता धोरण",
    },
  };

  const handleRename = () => {
    if (selectedChat && newTitle.trim()) {
      onEditChatTitle(selectedChat.id, newTitle);
      setIsRenameModalOpen(false);
      setNewTitle("");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language as keyof typeof translations);
    localStorage.setItem("selectedLanguage", language); 
    // Notify all pages/components about the language change
    const event = new CustomEvent("languageChange", { detail: language });
    window.dispatchEvent(event);
    setIsLanguageDropdownOpen(false);
  };
  
  const handleLearnMoreOption = (option: string) => {
    console.log(`Opening ${option}`);
    // Here you would handle navigation to Terms or Privacy pages
    if (option === 'terms') {
      // Navigate to terms page or open in new tab
      window.open('/terms', '_blank');
    } else if (option === 'privacy') {
      // Navigate to privacy page or open in new tab
      window.open('/privacy', '_blank');
    }
    setIsLearnMoreDropdownOpen(false);
  };

  const handleProfileUpdate = (updatedDetails: { name: string; email: string }) => {
    setProfileDetails(updatedDetails);
    setIsProfileModalOpen(false);
  };

  const handleProfileIconClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    } else {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    }
  };

  return (
    <div
      className={`h-full border-r flex flex-col transition-width duration-300 ${
        isCollapsed ? "w-16" : "w-80"
      } ${
        isDark
          ? "bg-[#1A2333] border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {!isCollapsed && (
          <h2 className={`${isDark ? "text-white" : "text-gray-800"} font-semibold`}>
            {translations[selectedLanguage].chatHistory}
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg ${
            isDark ? "hover:bg-[#232B3B]" : "hover:bg-gray-100"
          }`}
        >
          {isCollapsed ? (
            <AiOutlineMenuUnfold
              className={`${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"} w-5 h-5`}
            />
          ) : (
            <AiOutlineMenuFold
              className={`${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"} w-5 h-5`}
            />
          )}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className={`w-full p-2 rounded-lg font-medium flex items-center ${
            isCollapsed ? "justify-center p-1" : "justify-center space-x-2"
          } transition-colors duration-200 ${
            isDark
              ? "bg-[#232B3B] hover:bg-[#2A344D] text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
        >
          <LuMessagesSquare className="w-5 h-5" />
          {!isCollapsed && <span>{translations[selectedLanguage].newChat}</span>}
        </button>
      </div>

      {/* Chat List */}
      <div
        className={`flex-1 overflow-y-auto hide-scrollbar ${
          isCollapsed ? "hidden" : "block"
        }`}
      >
        <div className="p-3 space-y-2">
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ scale: 1.02 }}
              className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                activeChat === chat.id
                  ? isDark
                    ? "bg-blue-500/20"
                    : "bg-blue-100"
                  : isDark
                  ? "hover:bg-[#232B3B]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium text-sm truncate pr-2 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {chat.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 truncate ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {chat.preview}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChat(chat);
                      setNewTitle(chat.title);
                      setIsRenameModalOpen(true);
                    }}
                    className={`p-1 rounded ${
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <FiEdit2
                      className={`${
                        isDark
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-800"
                      } w-4 h-4`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChat(chat);
                      onDeleteChat(chat.id);
                    }}
                    className={`p-1 rounded ${
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <FiTrash2
                      className={`${
                        isDark
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-800"
                      } w-4 h-4`}
                    />
                  </button>
                </div>
              </div>
              <span
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {new Date(chat.timestamp).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Profile Button with Menu */}
      <div className="mt-auto relative">
        <div className={`p-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={handleProfileIconClick}
            className={`profile-button w-full p-2 rounded-lg font-medium flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            } transition-colors duration-200 ${
              isDark
                ? "bg-[#232B3B] hover:bg-[#2A344D] text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center rounded-full w-8 h-8 ${
                isDark ? "bg-blue-500" : "bg-blue-100"
              }`}>
                <FiUser className={`w-4 h-4 ${isDark ? "text-white" : "text-blue-600"}`} />
              </div>
              {!isCollapsed && <span>{translations[selectedLanguage].profile}</span>}
            </div>
            {!isCollapsed && (
              <div className="w-4 h-4 flex items-center justify-center">
                <svg 
                  className={`w-3 h-3 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""} ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </button>
          
          {/* Profile Menu Dropdown */}
          {isProfileMenuOpen && !isCollapsed && (
            <motion.div 
              ref={profileMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`profile-menu absolute bottom-16 left-3 right-3 rounded-lg shadow-lg z-10 overflow-hidden ${
                isDark ? "bg-[#232B3B] border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <div className={`p-2 ${isDark ? "border-b border-gray-700" : "border-b border-gray-200"}`}>
                <div className={`flex items-center space-x-3 p-2 rounded-lg ${
                  isDark ? "hover:bg-[#2A344D]" : "hover:bg-gray-100"
                }`}>
                  <div className={`flex items-center justify-center rounded-full w-10 h-10 ${
                    isDark ? "bg-blue-500" : "bg-blue-100"
                  }`}>
                    <FiUser className={`w-5 h-5 ${isDark ? "text-white" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}>User Name</h3>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>user@example.com</p>
                  </div>
                </div>
              </div>
              
              <div className="p-1">
                {/* Settings Option */}
                <button 
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg ${
                    isDark ? "text-gray-300 hover:bg-[#2A344D]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FiSettings className="w-5 h-5" />
                    <span>{translations[selectedLanguage].settings}</span>
                  </div>
                </button>
                
                {/* Language Option */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                      setIsLearnMoreDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg ${
                      isDark ? "text-gray-300 hover:bg-[#2A344D]" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FiGlobe className="w-5 h-5" />
                      <span>{translations[selectedLanguage].language}</span>
                    </div>
                    <svg 
                      className={`w-3 h-3 transition-transform ${isLanguageDropdownOpen ? "rotate-180" : ""} ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Language Dropdown */}
                  {isLanguageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 top-0 w-48 rounded-lg shadow-lg z-20 overflow-hidden ${
                        isDark ? "bg-[#1A2333] border border-gray-700" : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="p-1">
                        <button
                          onClick={() => handleLanguageChange("en")}
                          className={`w-full text-left flex items-center space-x-2 p-2 rounded-lg ${
                            selectedLanguage === "en" ? (isDark ? "bg-blue-500/20 text-white" : "bg-blue-100 text-blue-800") : ""
                          } ${isDark ? "hover:bg-[#2A344D] text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
                        >
                          <span className="w-5 text-center">🇺🇸</span>
                          <span>English</span>
                        </button>
                        <button
                          onClick={() => handleLanguageChange("hi")}
                          className={`w-full text-left flex items-center space-x-2 p-2 rounded-lg ${
                            selectedLanguage === "hi" ? (isDark ? "bg-blue-500/20 text-white" : "bg-blue-100 text-blue-800") : ""
                          } ${isDark ? "hover:bg-[#2A344D] text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
                        >
                          <span className="w-5 text-center">🇮🇳</span>
                          <span>हिन्दी</span>
                        </button>
                        <button
                          onClick={() => handleLanguageChange("mr")}
                          className={`w-full text-left flex items-center space-x-2 p-2 rounded-lg ${
                            selectedLanguage === "mr" ? (isDark ? "bg-blue-500/20 text-white" : "bg-blue-100 text-blue-800") : ""
                          } ${isDark ? "hover:bg-[#2A344D] text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
                        >
                          <span className="w-5 text-center">🇮🇳</span>
                          <span>मराठी</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Learn More Option */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsLearnMoreDropdownOpen(!isLearnMoreDropdownOpen);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg ${
                      isDark ? "text-gray-300 hover:bg-[#2A344D]" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FiInfo className="w-5 h-5" />
                      <span>{translations[selectedLanguage].learnMore}</span>
                    </div>
                    <svg 
                      className={`w-3 h-3 transition-transform ${isLearnMoreDropdownOpen ? "rotate-180" : ""} ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Learn More Dropdown */}
                  {isLearnMoreDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 top-0 w-48 rounded-lg shadow-lg z-20 overflow-hidden ${
                        isDark ? "bg-[#1A2333] border border-gray-700" : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="p-1">
                        <button
                          onClick={() => handleLearnMoreOption('terms')}
                          className={`w-full text-left flex items-center space-x-2 p-2 rounded-lg ${
                            isDark ? "hover:bg-[#2A344D] text-gray-300" : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <FiFileText className="w-5 h-5" />
                          <span>{translations[selectedLanguage].terms}</span>
                        </button>
                        <button
                          onClick={() => handleLearnMoreOption('privacy')}
                          className={`w-full text-left flex items-center space-x-2 p-2 rounded-lg ${
                            isDark ? "hover:bg-[#2A344D] text-gray-300" : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <FiShield className="w-5 h-5" />
                          <span>{translations[selectedLanguage].privacy}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Logout Option */}
                <div className={`p-1 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}></div>
                <button 
                  onClick={handleLogout}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg ${
                    isDark ? "text-gray-300 hover:bg-[#2A344D]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>{translations[selectedLanguage].logout}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Rename Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Rename Chat"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-[#232B3B] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new title"
          />
          <div className="flex justify-end space-x-3">
            <button onClick={() => setIsRenameModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleRename} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Rename</button>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={profileDetails.name}
            onChange={(e) => setProfileDetails({ ...profileDetails, name: e.target.value })}
            className="w-full bg-[#232B3B] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
          <input
            type="email"
            value={profileDetails.email}
            onChange={(e) => setProfileDetails({ ...profileDetails, email: e.target.value })}
            className="w-full bg-[#232B3B] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          <div className="flex justify-end space-x-3">
            <button onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={() => handleProfileUpdate(profileDetails)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;