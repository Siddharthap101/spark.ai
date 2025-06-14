import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const translations = {
  en: {
    title: "Features",
    features: [
      { title: "Real-time Chat", description: "Experience seamless real-time messaging...", icon: "💬" },
      { title: "File Sharing", description: "Share files, images, and documents effortlessly...", icon: "📁" },
      { title: "End-to-End Encryption", description: "Secure communication with state-of-the-art end-to-end encryption.", icon: "🔒" },
      { title: "Custom Themes", description: "Personalize your chat experience with customizable themes and layouts.", icon: "🎨" },
      { title: "Multi-Platform Support", description: "Access your chats from any device with cross-platform compatibility.", icon: "📱" },
      { title: "Message Search", description: "Quickly find past conversations with powerful search functionality.", icon: "🔍" }
    ],
  }, 
  hi: {
    title: "विशेषताएँ",
    features: [
      { title: "रीयल-टाइम चैट", description: "निर्बाध रीयल-टाइम संदेश अनुभव करें...", icon: "💬" },
      { title: "फ़ाइल साझा करना", description: "फ़ाइलें, छवियां और दस्तावेज़ आसानी से साझा करें...", icon: "📁" },
      { title: "एंड-टू-एंड एन्क्रिप्शन", description: "स्टेट-ऑफ-द-आर्ट एंड-टू-एंड एन्क्रिप्शन के साथ सुरक्षित संचार।", icon: "🔒" },
      { title: "कस्टम थीम्स", description: "कस्टमाइज़ेबल थीम्स और लेआउट्स के साथ अपने चैट अनुभव को व्यक्तिगत बनाएं।", icon: "🎨" },
      { title: "मल्टी-प्लेटफार्म समर्थन", description: "क्रॉस-प्लेटफार्म संगतता के साथ किसी भी डिवाइस से अपनी चैट्स तक पहुंचें।", icon: "📱" },
      { title: "संदेश खोज", description: "शक्तिशाली खोज कार्यक्षमता के साथ पिछले वार्तालापों को जल्दी से खोजें।", icon: "🔍" }
    ],
  },
  mr: {
    title: "वैशिष्ट्ये",
    features: [
      { title: "रीयल-टाइम चॅट", description: "निर्बाध रीयल-टाइम संदेश अनुभव घ्या...", icon: "💬" },
      { title: "फाइल शेअरिंग", description: "फाइल्स, प्रतिमा आणि दस्तऐवज सहजपणे शेअर करा...", icon: "📁" },
      { title: "एंड-टू-एंड एन्क्रिप्शन", description: "स्टेट-ऑफ-द-आर्ट एंड-टू-एंड एन्क्रिप्शनसह सुरक्षित संप्रेषण.", icon: "🔒" },
      { title: "कस्टम थीम्स", description: "कस्टमाइज़ेबल थीम्स आणि लेआउट्ससह तुमचा चॅट अनुभव वैयक्तिकृत करा.", icon: "🎨" },
      { title: "मल्टी-प्लॅटफॉर्म समर्थन", description: "क्रॉस-प्लॅटफॉर्म सुसंगततेसह कोणत्याही डिव्हाइसवरून तुमच्या चॅट्समध्ये प्रवेश करा.", icon: "📱" },
      { title: "संदेश शोध", description: "शक्तिशाली शोध कार्यक्षमतेसह मागील संभाषणे पटकन शोधा.", icon: "🔍" }
    ],
  },
};

const Features = () => {
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
    // On mount, set from localStorage if available
    const storedLang = localStorage.getItem("selectedLanguage") as keyof typeof translations;
    if (storedLang && storedLang !== selectedLanguage) {
      setSelectedLanguage(storedLang);
    }
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
    };
  }, [selectedLanguage]);

  const t = translations[selectedLanguage];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-12">
          {t.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-8 hover:shadow-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-transform transform hover:-translate-y-1 duration-300"
            >
              <div className="text-5xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;