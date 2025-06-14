import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DarkModeToggle from "../../components/DarkModeToggle";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-16">
      <nav className="fixed top-0 w-full px-4 sm:px-8 py-2 md:py-4 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 z-50 flex justify-between items-center">
        <span 
          className="text-xl font-bold text-blue-500 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          Mdm AI
        </span>
        <DarkModeToggle />
      </nav>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl border border-gray-300 dark:border-gray-700 mx-4 sm:mx-0 mt-16"
      >
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
            Mdm AI - Privacy Policy
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Last Updated:</strong> March 6, 2025
          </p>
          
          <p className="text-gray-700 dark:text-gray-300">
            We at Mdm AI respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data and tell you about your privacy rights.
          </p>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Information We Collect:
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Your conversations with our AI assistant</li>
              <li>Account information (email and password) if you create an account</li>
              <li>Usage data to improve our service</li>
              <li>Device and browser information</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              How We Use Your Information:
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>To provide and improve our AI chat service</li>
              <li>To personalize your experience</li>
              <li>To analyze usage patterns and improve our AI models</li>
              <li>To protect our services from misuse or harmful activities</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Your Data Rights:
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing your data</li>
              <li>Data portability rights</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Data Security:
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </div>
          
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Contact Us:
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about this privacy policy or our privacy practices, please contact us at: admin@admin.com
            </p>
          </div>
          
          <div className="pt-4 text-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;