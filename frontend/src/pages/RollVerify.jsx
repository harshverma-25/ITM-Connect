// pages/RollVerify.jsx - LIGHT DESIGN
import { useState } from "react";
import API from "../services/authService";
import { ArrowRight, ShieldCheck, Info } from "lucide-react";

const RollVerify = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyRoll = async (e) => {
    e.preventDefault();

    const cleanRoll = rollNumber.trim().toUpperCase();

    if (!cleanRoll) {
      setMsg("Roll number is required");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await API.post("/auth/validate-roll", {
        rollNumber: cleanRoll,
      });

      if (res.data.success) {
        window.location.href =
          `${import.meta.env.VITE_API_URL}/auth/google?rollNumber=${cleanRoll}`;
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const formatExample = (text) => {
    return (
      <div className="flex justify-center gap-1 mt-2">
        {text.split('').map((char, index) => (
          <span 
            key={index}
            className={`
              inline-block w-5 h-7 flex items-center justify-center rounded-sm
              ${index < 4 ? 'bg-blue-100 text-blue-700' : 
                index < 6 ? 'bg-green-100 text-green-700' : 
                index < 8 ? 'bg-purple-100 text-purple-700' : 
                'bg-gray-100 text-gray-700'}
              font-mono font-medium text-sm
            `}
          >
            {char}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center border-b border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-4">
              <span className="text-xl text-white font-bold">ITM</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ITM Connect</h1>
            <p className="text-gray-600 text-sm">Student Social Network</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              Roll Verification Required
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <form onSubmit={verifyRoll} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Enter Your ITM Roll Number
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                             text-center font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0905IT231055"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    disabled={loading}
                    maxLength={12}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    )}
                  </div>
                </div>

                {/* Format Example */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Format Example:</p>
                  {formatExample("0905IT231055")}
                  <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                    <span>College</span>
                    <span>Branch</span>
                    <span>Year</span>
                    <span>Roll</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !rollNumber.trim()}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${loading || !rollNumber.trim()
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Error Message */}
              {msg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-red-700 text-sm">{msg}</p>
                  </div>
                </div>
              )}

              {/* Information Box */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-2">
                    <p className="text-sm text-gray-700">
                      Only ITM students can register. After verification, you'll be redirected to Google for authentication.
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollVerify;