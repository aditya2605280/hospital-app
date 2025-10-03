import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/Slices/authSlice";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // clear old errors

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      const userRole = result.payload.user?.roles?.name?.toLowerCase();

      toast.success("Login successful! 🎉");

      if (userRole === "admin" || userRole === "sub-admin") {
        // Navigate to Admin Dashboard after successful login
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } else {
      // 🔹 If backend sends field-specific errors
      if (result.payload?.errors) {
        setErrors(result.payload.errors); // { email: "...", password: "..." }
      } else {
        // 🔹 Show global error toast
        toast.error(result.payload?.message || "Login failed ❌");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40">
            <img
              src="/assets/images/logo.jpg"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-black font-poppins text-center mb-8">
          Log In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black">
              {/* Email Icon */}
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="4" width="20" height="16" rx="4" />
                <path d="M2 6l10 7 10-7" />
              </svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-12 py-4 bg-gray-50 border rounded-xl text-black placeholder-black font-semibold font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black">
              {/* Password Icon */}
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="5" y="11" width="14" height="8" rx="2" />
                <path d="M12 15v2" />
                <path d="M8 11V7a4 4 0 1 1 8 0v4" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-12 py-4 bg-gray-50 border rounded-xl text-gray-900 placeholder-black font-semibold font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                // Stethoscope (password visible)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4v6a6 6 0 0 0 12 0V4" />
                  <path d="M18 20a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM2 20h12" />
                </svg>
              ) : (
                // Heartbeat line (password hidden)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 12h4l2-5 4 10 2-5h4" />
                </svg>
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#246afd] hover:bg-blue-600 text-white font-bold font-poppins py-4 px-6 rounded-3xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
