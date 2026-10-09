import { useState } from "react";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Connect your backend authentication here
    console.log("Admin login submitted");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Faded Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/agro-bg.jpg')",
        }}
      />

      {/* Fade / Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-6">
          <Link to="/" className="flex justify-center mb-3">
            <img
              src="/images/NicemanAgroLogoGreen.png"
              alt="Niceman Agro & Farms"
              className="h-16 w-auto object-contain"
            />
          </Link>

          <h1 className="text-2xl font-extrabold text-green-900">
            Niceman Agro & Farms
          </h1>

          <p className="mt-1 text-sm text-gray-500">Admin Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-green-900/10 bg-white/95 p-7 shadow-2xl sm:p-9">
          {/* Heading */}
          <div className="mb-7">
            <span className="text-[11px] font-extrabold tracking-[1.5px] text-yellow-600">
              ADMIN ACCESS
            </span>

            <h2 className="mt-1 text-3xl font-bold text-green-950">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to access your admin dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@example.com"
                required
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3.5 pr-16 text-sm text-gray-800 outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-700 hover:text-green-900"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="mb-6 flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-gray-500">
                <input type="checkbox" className="h-4 w-4 accent-green-700" />
                Remember me
              </label>

              <Link
                to="/admin/forgot-password"
                className="font-semibold text-green-700 hover:text-green-900 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-green-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 hover:-translate-y-0.5"
            >
              Login to Dashboard
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 transition hover:text-green-700"
            >
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
