import { useState } from "react";
import type { FormEvent } from "react";
import { signupUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface ApiError {
  message: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signupUser(formData);
      navigate("/login");
    } catch (err) {
      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // If Axios error: check structure
        const axiosError = err as { response?: { data?: ApiError } };
        setError(axiosError.response?.data?.message || "Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          placeholder="Name"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
          placeholder="Password"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Sign Up
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
