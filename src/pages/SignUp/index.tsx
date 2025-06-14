import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import DarkModeToggle from "../../components/DarkModeToggle";
import signupImage from "../../assets/Sign.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setErrorMessage(
        "Invalid email format. Please use a valid email address."
      );
      return;
    }
    if (!validatePassword(formData.password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
      );
      return;
    }
    localStorage.setItem("email", formData.email);
    localStorage.setItem("password", formData.password);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("/Login");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white-100 via-white-100 to-white-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8 pt-20">
      <nav className="fixed top-0 w-full px-4 sm:px-8 py-3 backdrop-blur-sm bg-white-700 dark:bg-gray-900/80 z-50 flex justify-end">
        <DarkModeToggle />
      </nav>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-300 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8"
      >
        {/* Left Side - Image (only visible on large screens) */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <img
            src={signupImage}
            alt="Sign Up"
            className="w-72 h-72 object-contain opacity-70"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 w-full shadow-lg p-[20px]">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-gray-200">
            CREATE ACCOUNT
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="w-full flex items-center justify-center bg-white text-gray-800 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <FcGoogle className="mr-2" /> Sign Up with Google
            </motion.button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="mx-4 text-gray-600 dark:text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                required
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {errorMessage && (
              <div className="text-center text-red-500">{errorMessage}</div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Sign Up
            </motion.button>

            <div className="text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/Login")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Login
              </span>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span
                onClick={() => navigate("/terms")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Terms of Use
              </span>{" "}
              |{" "}
              <span
                onClick={() => navigate("/privacy")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Privacy Policy
              </span>
            </div>
          </form>
        </div>
      </motion.div>

      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg"
        >
          Registration successful!
        </motion.div>
      )}
    </div>
  );
};

export default SignUp;
