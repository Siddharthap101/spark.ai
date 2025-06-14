import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DarkModeToggle from "../../components/DarkModeToggle";

const TermsOfUse = () => {
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
            Mdm AI - Terms of Use
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Last Updated:</strong> March 6, 2025
          </p>
          
          <p className="text-gray-700 dark:text-gray-300">
            Welcome to Mdm AI! By using our AI chat service, you agree to these simple rules.
          </p>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              What You're Agreeing To:
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>You're using our "Mdm AI Chat GPT" service, which includes our website and any related apps (we'll call it "Mdm AI").</li>
              <li>You're making an agreement with [Your Company Name/Your Name], located in [Your Location/Jurisdiction].</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              How You Can Use Mdm AI:
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Feel free to chat and explore!</li>
              <li>Please don't use Mdm AI for anything illegal, harmful, or to spread misinformation.</li>
              <li>Be respectful of others.</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Your Content and Our AI:
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>The things you type into Mdm AI are yours.</li>
              <li>The AI's responses are for information and fun, but they might not always be perfect.</li>
              <li>You're responsible for what you say and share.</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Your Privacy:
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We care about your privacy. Our Privacy Policy tells you how we handle your information. 
              <span 
                className="ml-1 text-blue-500 cursor-pointer hover:underline"
                onClick={() => navigate("/privacy")}
              >
                Privacy Policy
              </span>
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Questions?
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions, please contact us at: admin@admin.com
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

export default TermsOfUse;