import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourseList from "./pages/admin/AdminCourseList";
import CreateCourse from "./pages/admin/CreateCourse";
import EditCourse from "./pages/admin/EditCourse";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more protected pages here */}
          </Route>
        </Route>
        {/* Admin protected routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourseList />} />
            <Route path="/admin/courses/new" element={<CreateCourse />} />
            <Route path="/admin/courses/:id/edit" element={<EditCourse />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
