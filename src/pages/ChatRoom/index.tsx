import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiImage,
  FiCode,
  FiSearch,
  FiCommand,
  FiMenu,
  FiPaperclip,
  FiMic,
  FiRefreshCw,
  FiPlus,
  FiShare2,
  FiCopy,
  FiEdit,
} from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Navbar from "../../layouts/Navbar";
import Sidebar from "../../components/Sidebar";
import { sendPrompt } from "../../apis/ChatRoom.ts";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import chatroomlogo from "../../assets/Chatroomlogo.svg";

type TimeoutId = ReturnType<typeof setTimeout>;

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

// Add type definitions for global Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  type: "text" | "code" | "image";
  timestamp: Date;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface Command {
  icon: React.ReactNode;
  label: string;
  action: string;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: "1",
      title: "First Chat",
      timestamp: new Date(),
      preview: "This is the first chat preview...",
    },
  ]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<
    keyof typeof placeholders
  >(() => {
    const storedLang = localStorage.getItem("selectedLanguage");
    return storedLang && ["en", "hi", "mr"].includes(storedLang)
      ? (storedLang as keyof typeof placeholders)
      : "en";
  });
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<TimeoutId | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  // Add silence detection variables
  const SILENCE_THRESHOLD = 10;
  const SILENCE_DURATION = 1500;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        resetSilenceTimer();

        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setInputValue((prev) => {
            const newValue = prev + " " + finalTranscript.trim();
            // Auto-stop after final result
            setTimeout(() => {
              stopRecording();
              // Focus on the input field
              inputRef.current?.focus();
            }, 500);
            return newValue;
          });
        } else if (interimTranscript) {
          // Show interim results in a different way if needed
          console.log("Interim:", interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "no-speech") {
          // This is common, so don't show as error
          console.log("No speech detected");
        } else {
          setRecordingError("Error: " + event.error);
          stopRecording();
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        stopAudioVisualization();
        clearSilenceTimer();

        // Focus on the input field after recording stops
        inputRef.current?.focus();
      };
    }

    return () => {
      if (recognitionRef.current) {
        stopRecording();
      }
      stopAudioVisualization();
      clearSilenceTimer();
    };
  }, []);

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
      window.removeEventListener(
        "themeChanged",
        handleThemeChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setSelectedLanguage(event.detail);
      localStorage.setItem("selectedLanguage", event.detail);
    };

    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener
      );
    };
  }, []);

  const setupAudioVisualization = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;

      // Create audio context and analyzer
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      // Connect microphone to analyzer
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Configure analyzer
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Update visualization regularly and detect silence
      const updateVisualization = () => {
        if (!analyserRef.current || !isRecording) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume level
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

        // Check for silence
        if (average < SILENCE_THRESHOLD) {
          startSilenceTimer();
        } else {
          resetSilenceTimer();
        }

        if (isRecording) {
          requestAnimationFrame(updateVisualization);
        }
      };

      updateVisualization();
    } catch (error) {
      console.error("Audio visualization setup failed:", error);
      setRecordingError(
        "Microphone access denied. Please check your browser permissions."
      );
    }
  };

  // Add silence detection functions
  const startSilenceTimer = () => {
    if (!silenceTimerRef.current) {
      silenceTimerRef.current = setTimeout(() => {
        if (isRecording) {
          console.log("Silence detected, stopping recording");
          stopRecording();
        }
      }, SILENCE_DURATION);
    }
  };

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const clearSilenceTimer = () => {
    resetSilenceTimer();
  };

  const stopAudioVisualization = () => {
    // Stop microphone stream
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
      analyserRef.current = null;
    }
  };

  const startRecording = async () => {
    setRecordingError(null);

    if (!recognitionRef.current) {
      setRecordingError("Speech recognition not supported by your browser");
      return;
    }

    try {
      // Request microphone permission and setup audio visualization
      await setupAudioVisualization();

      // Start speech recognition
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setRecordingError("Failed to start recording: " + errorMessage);
      stopAudioVisualization();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    }

    setIsRecording(false);
    stopAudioVisualization();
    clearSilenceTimer();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (editingMessageId) {
      // Update the existing message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessageId ? { ...msg, content: inputValue } : msg
        )
      );

      // Notify AI about the updated message
      const userId = "your-user-id";
      try {
        const responseText = await sendPrompt(inputValue, userId);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Updated response for: "${inputValue}"\n\n${responseText}`,
          sender: "ai",
          type: "text",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);

        if (activeChat) {
          setChatHistory((prev) =>
            prev.map((chat) =>
              chat.id === activeChat
                ? { ...chat, preview: aiMessage.content, timestamp: new Date() }
                : chat
            )
          );
        } else {
          const newChatId = Date.now().toString();
          setChatHistory((prev) => [
            {
              id: newChatId,
              title: `Chat ${prev.length + 1}`,
              timestamp: new Date(),
              preview: aiMessage.content,
            },
            ...prev,
          ]);
          setActiveChat(newChatId);
        }
      } catch (error) {
        console.error("Error handling updated message:", error);
      }

      setEditingMessageId(null);
      setInputValue("");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      type: "text",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const userId = "your-user-id";

    try {
      const responseText = await sendPrompt(inputValue, userId);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: "ai",
        type: "text",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      if (activeChat) {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChat
              ? { ...chat, preview: aiMessage.content, timestamp: new Date() }
              : chat
          )
        );
      } else {
        const newChatId = Date.now().toString();
        setChatHistory((prev) => [
          {
            id: newChatId,
            title: `Chat ${prev.length + 1}`,
            timestamp: new Date(),
            preview: aiMessage.content,
          },
          ...prev,
        ]);
        setActiveChat(newChatId);
      }
    } catch (error) {
      console.error("Error handling chat:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const commands: Command[] = [
    { icon: <FiCode />, label: "Generate Code", action: "/code" },
    { icon: <FiImage />, label: "Generate Image", action: "/image" },
    { icon: <FiSearch />, label: "Search Knowledge Base", action: "/search" },
  ];

  const handleDeleteChat = (id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChat === id) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  const handleEditChatTitle = (id: string, newTitle: string) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title: newTitle } : chat))
    );
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    setMessages([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChat(null);
    setIsMobileMenuOpen(false);
  };

  // Handle mic button click - toggle recording or focus on input
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    // Focus on the input field after mic is toggled
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleShareMenu = () => {
    setIsShareMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node)
      ) {
        if (isShareMenuOpen) {
          setIsShareMenuOpen(false); // Close submenu first
          return;
        }
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isMenuOpen) {
          setIsMenuOpen(false); // Close main menu after submenu
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShareMenuOpen, isMenuOpen]);

  const placeholders = {
    en: "Type your message...",
    hi: "अपना संदेश लिखें...",
    mr: "आपला संदेश लिहा...",
  };

  // Updated light mode styles for better aesthetics
  const menuStyles = `${
    isDark
      ? "bg-gradient-to-b from-[#1A2333] to-[#232B3B]"
      : "bg-white border border-gray-300 shadow-lg rounded-lg"
  }`;
  const menuItemStyles = `${
    isDark ? "hover:bg-[#232B3B] text-white" : "hover:bg-gray-100 text-gray-800"
  }`;

  return (
    <div
      className={`min-h-dvh overflow-hidden fixed inset-0 transition-colors duration-300 ${
        isDark ? "bg-[#141B2A]" : "bg-gradient-to-b from-white to-gray-100"
      }`}
    >
      <Navbar />
      <div className="pt-20">
        <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
              fixed md:static inset-y-0 left-0 z-30
              transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
              ${isDark ? "bg-[#1A2333]" : "bg-white"} shadow-xl
            `}
          >
            <Sidebar
              chats={chatHistory}
              onSelectChat={handleSelectChat}
              activeChat={activeChat}
              onDeleteChat={handleDeleteChat}
              onEditChatTitle={handleEditChatTitle}
              onNewChat={handleNewChat}
            />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col w-full md:w-auto overflow-hidden">
            <div
              className={`px-6 py-4 flex items-center justify-between shadow-md ${
                isDark ? "bg-[#232B3B]" : "bg-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  className={`md:hidden transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <FiMenu className="w-6 h-6" />
                </button>
                <div
                  className={`p-2 rounded-full ${
                    isDark ? "bg-blue-500/10" : "bg-blue-100"
                  }`}
                >
                  <RiRobot2Line className="text-2xl text-blue-500" />
                </div>
                <div>
                  <h2
                    className={`${
                      isDark ? "text-white" : "text-gray-800"
                    } font-semibold`}
                  >
                    MDM AI
                  </h2>
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } text-xs`}
                  >
                    Always here to help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCommands(!showCommands)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? "hover:bg-[#2A344D]" : "hover:bg-gray-300"
                }`}
              >
                <FiCommand
                  className={`${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                />
              </button>
            </div>

            {/* Messages Area - Custom Scrollbar Styling */}
            <div
              className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 hide-scrollbar ${
                isDark
                  ? "bg-gradient-to-b from-[#141B2A] to-[#1A2333]"
                  : "bg-gradient-to-b from-gray-100 to-gray-200"
              }`}
              onMouseEnter={() =>
                document
                  .querySelector(".hide-scrollbar")
                  ?.classList.add("show-scrollbar")
              }
              onMouseLeave={() =>
                document
                  .querySelector(".hide-scrollbar")
                  ?.classList.remove("show-scrollbar")
              }
            >
              <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .hide-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .show-scrollbar::-webkit-scrollbar {
                  display: block;
                }
                .show-scrollbar {
                  -ms-overflow-style: auto;
                  scrollbar-width: auto;
                }
              `}</style>
              <AnimatePresence>
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    isDark={isDark}
                    onEdit={(id, content) => {
                      setEditingMessageId(id);
                      setInputValue(content);
                    }}
                  />
                ))}
                {isTyping && <TypingIndicator />}
              </AnimatePresence>

              {/* Background Image */}

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <img
                  src={chatroomlogo}
                  alt="Chatroom Logo"
                  className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 object-contain max-h-[70%] translate-y-10 sm:translate-y-16 md:translate-y-20 lg:translate-y-24"
                />
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className={`border-t p-3 md:p-4 shadow-inner ${
                isDark
                  ? "bg-[#1A2333] border-gray-700/30"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              {recordingError && (
                <div className="text-red-400 text-xs mb-2">
                  {recordingError}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    className={`p-2 ${
                      isDark
                        ? "hover:bg-gradient-to-r from-blue-500 to-purple-500"
                        : "hover:bg-gray-200"
                    } rounded-full transition-transform transform hover:scale-110`}
                    onClick={toggleMenu}
                  >
                    <FiPlus
                      className={`${
                        isDark ? "text-white" : "text-gray-800"
                      } w-6 h-6`}
                    />
                  </button>
                  {isMenuOpen && (
                    <div
                      className={`absolute bottom-12 left-0 rounded-xl p-4 space-y-4 ${menuStyles}`}
                    >
                      <label
                        className={`p-3 rounded-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center space-x-3 ${menuItemStyles}`}
                      >
                        <FiPaperclip className="w-6 h-6" />
                        <span className="text-sm font-medium">Attach File</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".txt,.pdf,.doc,.docx,.csv"
                        />
                      </label>
                      <label
                        className={`p-3 rounded-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center space-x-3 ${menuItemStyles}`}
                      >
                        <FiImage className="w-6 h-6" />
                        <span className="text-sm font-medium">
                          Attach Image
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                      </label>
                      <button
                        type="button"
                        className={`p-3 flex items-center space-x-3 ${
                          isRecording ? "bg-red-500" : menuItemStyles
                        } rounded-lg transition-transform transform hover:scale-105`}
                        onClick={handleMicClick}
                      >
                        <FiMic className="w-6 h-6" />
                        <span className="text-sm font-medium">Mic</span>
                      </button>
                      <div ref={submenuRef}>
                        <button
                          type="button"
                          className={`p-3 rounded-lg transition-transform transform hover:scale-105 flex items-center space-x-3 ${menuItemStyles}`}
                          onClick={toggleShareMenu}
                        >
                          <FiShare2 className="w-6 h-6" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                        {isShareMenuOpen && (
                          <div
                            className={`absolute bottom-12 left-0 rounded-xl shadow-lg p-4 space-y-4 ${menuStyles}`}
                            style={{ transform: "translateX(100%)" }}
                          >
                            <a
                              href="https://telegram.me/share/url?url=https://mdm-ai-498807929429.us-central1.run.app/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-3 rounded-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center space-x-3 ${menuItemStyles}`}
                            >
                              <FaTelegramPlane className="w-6 h-6" />
                              <span className="text-sm font-medium">
                                Telegram
                              </span>
                            </a>
                            <a
                              href="https://api.whatsapp.com/send?text=https://mdm-ai-498807929429.us-central1.run.app/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-3 rounded-lg cursor-pointer transition-transform transform hover:scale-105 flex items-center space-x-3 ${menuItemStyles}`}
                            >
                              <FaWhatsapp className="w-6 h-6" />
                              <span className="text-sm font-medium">
                                WhatsApp
                              </span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isRecording
                      ? "Listening..."
                      : placeholders[selectedLanguage]
                  }
                  className={`flex-1 rounded-lg p-3 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 resize-none text-sm hide-scrollbar ${
                             isDark
                               ? "bg-[#232B3B] text-white"
                               : "bg-gray-200 text-gray-800"
                           }`}
                  rows={1}
                />
                {inputValue.trim() ? (
                  <button
                    type="submit"
                    className="absolute right-5 top-8/2 -translate-y-8/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-all duration-300"
                  >
                    <FiSend className="text-white w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-transform transform hover:scale-110"
                    onClick={handleMicClick}
                  >
                    <FiMic className="text-white w-5 h-5" />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showCommands && (
          <CommandPalette
            commands={commands}
            onClose={() => setShowCommands(false)}
            onSelect={(command) => {
              setInputValue((prev) => prev + " " + command.action + " ");
              setShowCommands(false);
              inputRef.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced message formatting function with main point highlighting and line breaks
const formatMessageContent = (content: string, isDark: boolean) => {
  if (!content) return null;

  // Split the content into sentences
  const sentences = content.split(/(?<=[.!?])\s+/);

  return (
    <>
      {sentences.map((sentence, index) => {
        // Check if the sentence is a main point (starts with -*, •, or *)
        const isMainPoint = /^\s*(-|\*|•)\s/.test(sentence);

        // Process bold text marked with ** or __
        let formattedSentence = sentence.replace(
          /(\*\*|__)(.*?)(\*\*|__)/g,
          "<strong>$2</strong>"
        );

        // Process italic text marked with * or _
        formattedSentence = formattedSentence.replace(
          /(?<!\*)\*(?!\*)([^\*]+)(?<!\*)\*(?!\*)/g,
          "<em>$1</em>"
        );
        formattedSentence = formattedSentence.replace(
          /(?<!_)_(?!_)([^_]+)(?<!_)_(?!_)/g,
          "<em>$1</em>"
        );

        // Process inline code marked with `
        formattedSentence = formattedSentence.replace(
          /`([^`]+)`/g,
          '<code class="bg-gray-800 px-1 rounded text-gray-300">$1</code>'
        );

        return (
          <p
            key={index}
            className={`mb-2 ${isDark ? "text-white" : "text-gray-800"} ${
              isMainPoint ? "font-bold" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: formattedSentence }}
          />
        );
      })}
    </>
  );
};

// Enhanced Message component
const MessageActions: React.FC<{
  message: Message;
  isAi: boolean;
  isDark: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
}> = ({ message, isAi, isDark, showRetry = false, onRetry }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Copy handler
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  // Export handlers
  const handleExport = () => {
    setShowExportModal(true);
  };

  const exportAsTxt = () => {
    const blob = new Blob([message.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${message.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const exportAsPdf = async () => {
    const jsPDF = (await import('jspdf')).jsPDF;
    const doc = new jsPDF();
    doc.text(message.content, 10, 10);
    doc.save(`message-${message.id}.pdf`);
    setShowExportModal(false);
  };

  const exportAsDoc = async () => {
    const { Document, Packer, Paragraph, TextRun } = await import('docx');
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(message.content)],
            }),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${message.id}.docx`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  // Audio (read aloud) handler
  const handleAudio = () => {
    if (!isSpeaking) {
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance(message.content);
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
        setIsSpeaking(true);
      }
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Share modal Gemini-style
  const handleShare = () => {
    setShowShareModal(true);
  };

  const closeShareModal = () => setShowShareModal(false);

  return (
    <>
      <div className="absolute bottom-2 right-2 flex space-x-1 z-10">
        {/* Copy icon (separate) */}
        <button
          onClick={handleCopy}
          className={`p-1 ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"} rounded-full hover:bg-blue-500 hover:text-white`}
          title="Copy"
        >
          <FiCopy size={16} />
        </button>
        {/* Share icon (Gemini-style modal) */}
        <button
          onClick={handleShare}
          className={`p-1 ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"} rounded-full hover:bg-blue-500 hover:text-white`}
          title="Share"
        >
          <FiShare2 size={16} />
        </button>
        {/* Export icon */}
        <button
          onClick={handleExport}
          className={`p-1 ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"} rounded-full hover:bg-blue-500 hover:text-white`}
          title="Export"
        >
          <FiPaperclip size={16} />
        </button>
        {/* Redo icon (if AI and showRetry) */}
        {isAi && showRetry && (
          <button
            onClick={onRetry}
            className={`p-1 ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"} rounded-full hover:bg-blue-500 hover:text-white`}
            title="Regenerate response"
          >
            <FiRefreshCw size={16} />
          </button>
        )}
        {/* Audio icon (toggle) */}
        <button
          onClick={handleAudio}
          className={`p-1 ${isSpeaking ? "bg-green-500 text-white animate-pulse" : isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"} rounded-full hover:bg-blue-500 hover:text-white`}
          title={isSpeaking ? "Stop audio" : "Read aloud"}
        >
          <FiMic size={16} />
        </button>
      </div>
      {/* Export format modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`rounded-xl shadow-xl w-full max-w-xs p-6 flex flex-col items-center ${isDark ? "bg-[#232B3B] text-white" : "bg-white text-gray-800"}`}>
            <div className="mb-4 text-lg font-semibold">Export as...</div>
            <button
              onClick={exportAsTxt}
              className="w-full flex items-center px-4 py-2 mb-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <FiPaperclip className="mr-2" /> TXT
            </button>
            <button
              onClick={exportAsPdf}
              className="w-full flex items-center px-4 py-2 mb-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <FiPaperclip className="mr-2" /> PDF
            </button>
            <button
              onClick={exportAsDoc}
              className="w-full flex items-center px-4 py-2 mb-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <FiPaperclip className="mr-2" /> DOCX
            </button>
            <button
              onClick={() => setShowExportModal(false)}
              className="mt-2 px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Gemini-style share modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`rounded-xl shadow-xl w-full max-w-xs p-6 flex flex-col items-center ${isDark ? "bg-[#232B3B] text-white" : "bg-white text-gray-800"}`}>
            <div className="mb-4 text-lg font-semibold">Share this message</div>
            <button
              onClick={() => { handleCopy(); closeShareModal(); }}
              className="w-full flex items-center px-4 py-2 mb-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <FiCopy className="mr-2" /> Copy Text
            </button>
            <button
              onClick={() => { handleExport(); closeShareModal(); }}
              className="w-full flex items-center px-4 py-2 mb-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <FiPaperclip className="mr-2" /> Export as File
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message.content)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center px-4 py-2 mb-2 rounded hover:bg-green-100 dark:hover:bg-gray-700"
              onClick={closeShareModal}
            >
              <FaWhatsapp className="mr-2" /> Share to WhatsApp
            </a>
            <a
              href={`https://telegram.me/share/url?url=${encodeURIComponent(message.content)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center px-4 py-2 mb-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
              onClick={closeShareModal}
            >
              <FaTelegramPlane className="mr-2" /> Share to Telegram
            </a>
            <button
              onClick={closeShareModal}
              className="mt-2 px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Message: React.FC<{
  message: Message; 
  isDark: boolean;
  onRetry?: () => void;
  showRetry?: boolean;
  onEdit?: (id: string, content: string) => void;
}> = ({ message, isDark, onRetry, showRetry = false, onEdit }) => {
  const isAi = message.sender === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isAi ? "justify-start" : "justify-end"} group`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] relative ${
          isAi
            ? `${
                isDark
                  ? "bg-[#232B3B] border border-gray-700/30 text-white"
                  : "bg-gray-200 border border-gray-300 text-gray-800"
              }`
            : "bg-blue-500 text-white"
        } rounded-lg p-4 shadow-md`}
      >
        {message.type === "code" ? (
          <SyntaxHighlighter language="javascript" style={dark}>
            {message.content}
          </SyntaxHighlighter>
        ) : (
          formatMessageContent(message.content, isDark)
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400 block">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          {!isAi && (
            <button
              onClick={() => onEdit?.(message.id, message.content)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Edit message"
            >
              <FiEdit size={20} />
            </button>
          )}
        </div>
        {/* Message actions (share/export/redo/audio) for AI messages */}
        {isAi && (
          <MessageActions
            message={message}
            isAi={isAi}
            isDark={isDark}
            showRetry={showRetry}
            onRetry={onRetry}
          />
        )}
      </div>
    </motion.div>
  );
};

const TypingIndicator: React.FC = () => (
  <div
    className={`flex items-center space-x-2 ${
      dark ? "text-gray-400 bg-[#232B3B]" : "text-gray-600 bg-gray-200"
    } p-3 rounded-lg w-fit border ${
      dark ? "border-gray-700/30" : "border-gray-300"
    }`}
  >
    <RiRobot2Line />
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 ${
            dark ? "bg-gray-400" : "bg-gray-600"
          } rounded-full`}
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  </div>
);

const CommandPalette: React.FC<{
  commands: Command[];
  onClose: () => void;
  onSelect: (command: Command) => void;
}> = ({ commands, onClose, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50"
    onClick={onClose}
  >
    <div
      className={`rounded-xl shadow-xl w-full max-w-md overflow-hidden border p-4 ${
        dark ? "bg-[#1A2333] border-gray-700/30" : "bg-gray-100 border-gray-300"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`p-4 border-b flex justify-between items-center ${
          dark ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <h3
          className={`${dark ? "text-white" : "text-gray-800"} font-semibold`}
        >
          Commands
        </h3>
        <button
          onClick={onClose}
          className={`hover:${
            dark ? "bg-[#232B3B]" : "bg-gray-200"
          } p-1 rounded transition-colors`}
        >
          <IoMdClose
            className={`${
              dark
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          />
        </button>
      </div>
      <div className="p-2">
        {commands.map((command, index) => (
          <button
            key={index}
            onClick={() => onSelect(command)}
            className={`w-full p-3 flex items-center space-x-3 hover:${
              dark ? "bg-[#232B3B]" : "bg-gray-200"
            } rounded-lg transition-colors`}
          >
            <span className="text-blue-500">{command.icon}</span>
            <span className={`${dark ? "text-gray-200" : "text-gray-800"}`}>
              {command.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

export default ChatRoom;