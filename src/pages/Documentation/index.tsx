import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const translations = {
  en: {
    title: "Documentation",
    gettingStarted: "Getting Started",
    installation: "Installation",
    basicUsage: "Basic Usage",
    apiReference: "API Reference",
  },
  hi: {
    title: "दस्तावेज़",
    gettingStarted: "शुरुआत करना",
    installation: "स्थापना",
    basicUsage: "मूल उपयोग",
    apiReference: "एपीआई संदर्भ",
  },
  mr: {
    title: "दस्तऐवज",
    gettingStarted: "सुरुवात करणे",
    installation: "स्थापना",
    basicUsage: "मूलभूत वापर",
    apiReference: "एपीआय संदर्भ",
  },
};

const Documentation = () => {
  const [searchParams] = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return (
      (localStorage.getItem("selectedLanguage") as keyof typeof translations) ||
      (searchParams.get("lang") as keyof typeof translations) ||
      "en"
    );
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 sm:p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
          {t.title}
        </h1>

        <div className="space-y-6 sm:space-y-8">
          {/* Getting Started Section */}
          <section className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              🚀 {t.gettingStarted}
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.installation}
              </h3>
              <pre className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-3 sm:p-4 rounded-lg text-sm sm:text-base overflow-auto">
                <code>npm install mdm-chat-studio</code>
              </pre>

              <h3 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300 mt-6 mb-2">
                {t.basicUsage}
              </h3>
              <pre className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-3 sm:p-4 rounded-lg text-sm sm:text-base overflow-auto">
                <code>{`import { MDMChat } from 'mdm-chat-studio';

const Chat = () => {
  return <MDMChat roomId="your-room-id" />;
};`}</code>
              </pre>
            </div>
          </section>

          {/* API Reference Section */}
          <section className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              📌 {t.apiReference}
            </h2>
            <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
              <table className="min-w-full bg-gray-100 dark:bg-gray-800 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">roomId</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">string</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      Unique identifier for the chat room
                    </td>
                  </tr>
                  <tr className="border-t dark:border-gray-700 bg-gray-200 dark:bg-gray-750 hover:bg-gray-300 dark:hover:bg-gray-600">
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">theme</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">string</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      Optional theme name (default: 'light')
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;