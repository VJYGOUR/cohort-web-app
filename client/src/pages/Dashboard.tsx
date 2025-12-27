import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user?.name}</h1>
      <p className="mb-6 text-gray-700">You are logged in as a user.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6 rounded bg-white shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-medium mb-2">Your Enrolled Cohorts</h2>
          <p className="text-gray-600">
            Placeholder: Your enrolled cohorts will appear here.
          </p>
        </div>

        <div className="border p-6 rounded bg-white shadow hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-medium mb-2">Upcoming Events</h2>
          <p className="text-gray-600">
            Placeholder: Upcoming sessions or events will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
