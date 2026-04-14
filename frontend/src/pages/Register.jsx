import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      {/* Card */}
      <div className="w-full max-w-md bg-white border rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm mb-1 block">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full p-2 rounded-md border outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded-md border outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 rounded-md border outline-none focus:ring-2 focus:ring-blue-500"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-blue-500 text-white font-medium hover:opacity-90"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
