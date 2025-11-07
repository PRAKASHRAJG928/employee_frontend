import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {login, user, loading: authLoading} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post("https://employee-api-backend.vercel.app/api/auth/login", { 
        email, 
        password 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Login response:", response.data);
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        if (response.data.user?.role === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        const errorMessage = error.response.data?.error || 'Authentication failed';
        setError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Could not reach the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-700 via-blue-500 to-cyan-500 text-white p-4 space-y-8 relative overflow-hidden"
    >

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl animate-float-slow opacity-80"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-r from-cyan-400/8 to-blue-500/8 rounded-full blur-3xl animate-float-reverse opacity-70"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-teal-400/6 to-emerald-500/6 rounded-full blur-3xl animate-float-medium opacity-60"></div>

        {/* Medium floating orbs */}
        <div className="absolute top-32 right-1/3 w-48 h-48 bg-gradient-to-r from-indigo-400/8 to-purple-500/8 rounded-full blur-2xl animate-float-slow delay-2000 opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-emerald-400/7 to-teal-500/7 rounded-full blur-2xl animate-float-reverse delay-3000 opacity-45"></div>

        {/* Smaller accent orbs */}
        <div className="absolute top-40 right-32 w-32 h-32 bg-gradient-to-r from-emerald-400/15 to-teal-500/15 rounded-full blur-2xl animate-pulse opacity-90"></div>
        <div className="absolute bottom-40 left-32 w-24 h-24 bg-gradient-to-r from-blue-400/12 to-cyan-500/12 rounded-full blur-xl animate-bounce opacity-85"></div>
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000 opacity-80"></div>
        <div className="absolute top-1/4 right-1/6 w-28 h-28 bg-gradient-to-r from-violet-400/12 to-indigo-500/12 rounded-full blur-xl animate-float-slow delay-4000 opacity-55"></div>
        <div className="absolute bottom-1/3 right-1/2 w-36 h-36 bg-gradient-to-r from-cyan-400/9 to-blue-500/9 rounded-full blur-2xl animate-float-reverse delay-5000 opacity-50"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/6 w-1 h-1 bg-white/35 rounded-full animate-ping delay-1500"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/28 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-1/2 left-1/4 w-1 h-1 bg-white/32 rounded-full animate-ping delay-2500"></div>
        <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-white/22 rounded-full animate-ping delay-3000"></div>
        <div className="absolute bottom-1/6 right-1/3 w-1.5 h-1.5 bg-white/26 rounded-full animate-ping delay-3500"></div>
      </div>

      {/* Main Title */}
      <div className="z-10 text-center">
        <h1 className="font-great-vibes text-6xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 drop-shadow-2xl animate-pulse">
          Employee
        </h1>
        <h2 className="font-pacifico text-4xl text-white mt-2 drop-shadow-lg">
          Management System
        </h2>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg p-8 rounded-3xl shadow-[0_0_25px_rgba(59,130,246,0.2)] border border-gray-700 z-10">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <h2 className="text-3xl font-bold text-center mb-8 text-white font-pacifico">
          Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300 backdrop-blur-sm"
                required
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300 backdrop-blur-sm"
                required
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 w-5 h-5 text-white/70 hover:text-white transition-colors duration-200"
              >
                {showPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/80">
              <input type="checkbox" className="accent-cyan-400/80" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => alert("Forgot password functionality not implemented yet. Please contact admin.")}
              className="text-white/80 hover:text-white hover:underline transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white font-semibold rounded-xl overflow-hidden shadow-md hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">{loading ? "Logging in..." : "Login"}</span>
            <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes shineSweep {
            0% { left: -75%; }
            100% { left: 125%; }
          }

          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }

          @keyframes float-reverse {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(20px) rotate(-5deg); }
          }

          @keyframes float-medium {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }


        `}
      </style>
    </div>
  );
};

export default Login;
