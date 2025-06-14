import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const translations = {
  en: {
    title: "About",
    vision: "Our Vision",
    visionContent: "MDM AI Chat is at the forefront of AI-driven conversations, offering smart, real-time, and intuitive chat solutions powered by the latest advancements in artificial intelligence. We are committed to creating a seamless communication experience that is fast, secure, and human-like.",
    team: "Meet the Minds Behind MDM AI",
    contact: "Get in Touch",
    contactContent: "Have questions, feedback, or ideas? We’d love to hear from you!",
    chat: "Chat with Us",
    email: "Email Support",
  },
  hi: {
    title: "के बारे में",
    vision: "हमारा दृष्टिकोण",
    visionContent: "एमडीएम एआई चैट एआई-संचालित वार्तालापों में अग्रणी है, नवीनतम प्रगति द्वारा संचालित स्मार्ट, वास्तविक समय, और सहज चैट समाधान प्रदान करता है। हम एक निर्बाध संचार अनुभव बनाने के लिए प्रतिबद्ध हैं जो तेज, सुरक्षित और मानव-समान है।",
    team: "एमडीएम एआई के पीछे के दिमाग से मिलें",
    contact: "संपर्क करें",
    contactContent: "क्या आपके पास प्रश्न, प्रतिक्रिया, या विचार हैं? हम आपसे सुनना पसंद करेंगे!",
    chat: "हमसे चैट करें",
    email: "ईमेल समर्थन",
  },
  mr: {
    title: "बद्दल",
    vision: "आमची दृष्टी",
    visionContent: "एमडीएम एआय चॅट एआय-चालित संभाषणांमध्ये आघाडीवर आहे, नवीनतम प्रगतीद्वारे समर्थित स्मार्ट, वास्तविक-वेळ, आणि अंतर्ज्ञानी चॅट सोल्यूशन्स प्रदान करते. आम्ही एक अखंड संप्रेषण अनुभव तयार करण्यासाठी वचनबद्ध आहोत जो वेगवान, सुरक्षित आणि मानवी-समान आहे.",
    team: "एमडीएम एआय मागील विचारवंतांची भेट घ्या",
    contact: "संपर्क साधा",
    contactContent: "तुमच्याकडे प्रश्न, अभिप्राय किंवा कल्पना आहेत का? आम्हाला तुमच्याकडून ऐकायला आवडेल!",
    chat: "आमच्याशी गप्पा मारा",
    email: "ईमेल समर्थन",
  },
};

const About = () => {
  const [searchParams] = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return (localStorage.getItem("selectedLanguage") as keyof typeof translations) || (searchParams.get("lang") as keyof typeof translations) || "en";
  });

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setSelectedLanguage(event.detail);
      localStorage.setItem("selectedLanguage", event.detail);
    };
    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    const storedLang = localStorage.getItem("selectedLanguage") as keyof typeof translations;
    if (storedLang && storedLang !== selectedLanguage) {
      setSelectedLanguage(storedLang);
    }
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
    };
  }, [selectedLanguage]);

  const t = translations[selectedLanguage];

  const team = [
    {
      name: "Alex Johnson",
      role: "Lead AI Engineer",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Visionary",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Mike Brown",
      role: "Product Innovator",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          className="text-5xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t.title}
        </motion.h1>

        <motion.section
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">{t.vision}</h2>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
            {t.visionContent}
          </p>
        </motion.section>

        <motion.section
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">{t.team}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="text-center p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={member.image}
                  alt=""
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-500"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex justify-center items-center gap-2">
                  {member.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">{t.contact}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t.contactContent}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
              {t.chat}
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
              {t.email}
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;