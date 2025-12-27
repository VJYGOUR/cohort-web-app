import { useEffect, useState } from "react";
import axios from "../axios/axios";

const Home = () => {
  const [status, setStatus] = useState("Checking backend...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get("/health"); // ES6 async/await
        setStatus(res.data.message);
      } catch {
        setStatus("Backend not reachable");
        setError(true);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Home</h2>
      <p className={`text-sm ${error ? "text-red-600" : "text-green-600"}`}>
        {status || "No status received"}
      </p>
    </div>
  );
};

export default Home;
