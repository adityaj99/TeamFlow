import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AudioWaveform } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      await api.post("/api/auth/register", form);

      // 👉 After register → go to login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center px-4 bg-gray-100">
      <div className="flex gap-2 items-center h-9">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
          <AudioWaveform className="size-4" />
        </div>
        <p className="text-[16px] font-semibold">Team Flow.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <h2 className="text-2xl font-bold">Welcome, create account</h2>
          <p className="text-gray-400">Register with your Email</p>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm mb-1 block font-semibold">Name</label>
            <input
              type="text"
              name="name"
              placeholder="your name"
              className="w-full p-2 rounded-md border border-gray-200 outline-none focus:ring-1 focus:ring-black"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm mb-1 block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="yourname@email.com"
              className="w-full p-2 rounded-md border border-gray-200 outline-none focus:ring-1 focus:ring-black"
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
              className="w-full p-2 rounded-md border border-gray-200 outline-none focus:ring-1 focus:ring-black"
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
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4 opacity-70">
          Already have an account?{" "}
          <Link className="underline underline-offset-4" to="/login">
            sign In
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

export default Register;
