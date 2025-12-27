import { useContext, useState } from "react";
import { loginUser } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser({ email, password });
      console.log(response);
      const user = response.data;
      setUser(user);
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin"); // using react-router useNavigate
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      let message = "An error occurred";

      // Type guard for AxiosError
      if (err && (err as AxiosError).isAxiosError) {
        const axiosError = err as AxiosError<{ message: string }>;
        message = axiosError.response?.data?.message || axiosError.message;
      }

      setError(message);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
