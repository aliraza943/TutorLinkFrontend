import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import EditProfile from "./EditProfile";  // Add/Edit Profile component
import MySchedule from "./MySchedule";  // My Schedule component
import Sessions from "./Sessions";  // Sessions component
import Unauthorized from "./Unauthorized"; // Unauthorized component

function TeacherDashboard({ handleLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 w-64 bg-blue-700 text-white transform transition-transform duration-300 md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
          <nav className="flex flex-col space-y-4">
            <Link
              to="/teacher-dashboard/edit-profile"
              className="p-2 bg-blue-800 rounded hover:bg-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              Edit Profile
            </Link>
            <Link
              to="/teacher-dashboard/my-schedule"
              className="p-2 bg-blue-800 rounded hover:bg-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              My Schedule
            </Link>
            <Link
              to="/teacher-dashboard/sessions"
              className="p-2 bg-blue-800 rounded hover:bg-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              Sessions
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 bg-blue-800 rounded hover:bg-blue-600"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center fixed w-full md:relative md:w-auto z-10">
          <button
            className="md:hidden p-2 bg-blue-700 text-white rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            Menu
          </button>
          <h2 className="text-xl font-semibold">Teacher Dashboard</h2>
        </header>

        {/* Content Area with Scrollable Section */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 mt-16 md:mt-0">
          {location.pathname === "/teacher-dashboard" && (
            <p className="text-lg mb-4">Welcome to the Teacher Dashboard! Here, you can efficiently manage your profile, schedule, and sessions with ease. Stay organized, keep track of your commitments, and ensure seamless interaction with students. Use the navigation menu to access different sections and streamline your teaching experience.</p>
          )}
          <Routes>
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/my-schedule" element={<MySchedule />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/" element={
  <p className="text-lg mb-4">
    Welcome to the Teacher Dashboard! Here, you can efficiently manage your profile, schedule, and sessions with ease.
    Stay organized, keep track of your commitments, and ensure seamless interaction with students. Use the navigation 
    menu to access different sections and streamline your teaching experience.
  </p>
} />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default TeacherDashboard;
