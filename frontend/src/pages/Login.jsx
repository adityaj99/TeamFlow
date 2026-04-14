import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { setUser } = useAuth();
  const { toggleTheme, theme } = useTheme();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/login", form);

      const res = await api.get("/api/auth/profile");
      setUser(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F2F2F3] text-var(--text)">
      {/* Card */}
      <div className="w-full max-w-md bg-var(--card) border border-var(--border) rounded-xl shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Login</h2>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-sm px-3 py-1 rounded bg-var(--primary) text-white cursor-pointer"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded-md border border-var(--border) bg-transparent outline-none focus:ring-2 focus:ring-var(--primary)"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-2 rounded-md border border-var(--border) bg-transparent outline-none focus:ring-2 focus:ring-var(--primary)"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-var(--primary) text-white font-medium hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4 opacity-70">
          Don’t have an account? Register
        </p>
      </div>
    </div>
  );
};

export default Login;
