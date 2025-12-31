import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import PersonalIllustration from "../assets/personal.svg";

const Home = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Checking backend...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get("/health");
        setStatus(res.data.message);
      } catch {
        setStatus("Backend not reachable");
        setError(true);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col md:flex-row items-center gap-8">
        {/* Left side: Illustration */}
        <div className="w-full md:w-1/2">
          <img
            src={PersonalIllustration}
            alt="Person Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right side: Info + buttons */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-900">MERN Cohort App</h1>

          <p className="text-gray-700">
            Learn real-world MERN skills through structured courses and live
            cohorts.
          </p>

          {/* Backend status */}
          <div className="p-4 rounded border border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">Backend Status</h2>
            <p
              className={`text-sm font-medium ${
                error ? "text-red-600" : "text-green-600"
              }`}
            >
              {status || "No status received"}
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <button
              onClick={() => navigate("/courses")}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded shadow transition"
            >
              Browse Courses
            </button>

            <button
              onClick={() => navigate("/login")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow transition"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
