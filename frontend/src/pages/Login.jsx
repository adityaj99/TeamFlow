import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { AudioWaveform } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

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
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center px-4 bg-[#FAFBFB]">
      <div className="flex gap-2 items-center h-9">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
          <AudioWaveform className="size-4" />
        </div>
        <p className="text-[16px] font-semibold">Team Flow.</p>
      </div>
      {/* Card */}
      <div className="w-full max-w-md p-6 bg-white shadow rounded-lg">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-6">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-gray-400">Login with your Email</p>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-sm mb-1 block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="yourname@email.com"
              className="w-full p-2 rounded-md border border-gray-200 bg-transparent outline-none focus:ring-1 focus:ring-black"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm mb-1 block font-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 rounded-md border border-gray-200 bg-transparent outline-none focus:ring-1 focus:ring-black"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-black text-white font-medium hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4 opacity-70">
          Don’t have an account?{" "}
          <Link className="underline underline-offset-4" to="/register">
            sign up
          </Link>
        </p>
      </div>

      <div className="flex flex-col items-center text-gray-400">
        <p>By clicking continue, you are agree to our</p>
        <p>
          <span className="underline underline-offset-4">Terms of Service</span>{" "}
          and{" "}
          <span className="underline underline-offset-4">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
