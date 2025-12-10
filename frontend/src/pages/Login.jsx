// pages/Login.jsx - LIGHT DESIGN
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-md">
            <span className="text-2xl text-white font-bold">ITM</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ITM Connect</h1>
          <p className="text-gray-600">Student Social Network</p>
        </div>

        {/* Loading Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center">
            {/* Animated Spinner */}
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Logging you in...</h2>
              <p className="text-gray-600">Completing your authentication</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-6 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full animate-pulse"></div>
            </div>

            {/* Tips */}
            <div className="mt-8 pt-6 border-t border-gray-100 w-full">
              <p className="text-sm text-gray-500 text-center">
                <span className="font-medium">Note:</span> You'll be redirected automatically
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble?{" "}
            <button 
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;