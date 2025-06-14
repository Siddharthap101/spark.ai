import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import DarkModeToggle from "../../components/DarkModeToggle";
import Login from "../../assets/login.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setMessage("Invalid email format. Please use a valid email address.");
      return;
    }
    if (!validatePassword(formData.password)) {
      setMessage("Password must be at least 8 characters long and include at least one letter, one number, and one special character.");
      return;
    }
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (formData.email === storedEmail && formData.password === storedPassword) {
      setMessage("Login successful!");
      setTimeout(() => {
        navigate("/chat");
      }, 2000);
    } else {
      setMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <nav className="fixed top-0 w-full px-4 sm:px-8 py-2 md:py-4 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 z-50 flex justify-end items-center">
        <DarkModeToggle />
      </nav>

      <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden w-full max-w-md md:max-w-3xl border border-gray-300 dark:border-gray-700 mt-24 md:mt-32 p-4 md:p-6 mb-20">
        {/* Image section only visible on large screens */}
        <div className="hidden lg:flex items-center justify-center flex-1  w-1/2 p-6">
          <img
            src={Login}
            alt="Login"
            className="w-72 h-72 object-contain opacity-70"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 p-4 md:p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
            Welcome to Mdm Ai
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="w-full flex items-center justify-center bg-white text-gray-800 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <FcGoogle className="mr-2" /> Login with Google
            </motion.button>

            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="mx-3 text-gray-600 dark:text-gray-400">OR</span>
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

            <div className="text-left">
              <span
                onClick={() => navigate("/reset-password")}
                className="text-blue-500 cursor-pointer hover:underline text-sm"
              >
                Forgot Password?
              </span>
            </div>

            {message && (
              <div className={`text-center text-sm ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>
                {message}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Login
            </motion.button>

            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </div>

            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
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
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
