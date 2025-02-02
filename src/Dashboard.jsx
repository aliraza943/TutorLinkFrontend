import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Search from "./Search";
import ManageSessions from "./ManageSessions";
import Reviews from "./Reviews";
import TeacherSchedule from "./StudentView";
import Unauthorized from "./UnAuthorized";
import TeacherView from "./TeacherView"; // Import the TeacherView component

function Dashboard({ handleLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 w-64 bg-blue-700 text-white transform transition-transform duration-300 md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <nav className="flex flex-col space-y-4">
            <Link
              to="/student-dashboard/search"
              className="p-2 bg-blue-800 rounded hover:bg-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/student-dashboard/manage-sessions"
              className="p-2 bg-blue-800 rounded hover:bg-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              Manage Sessions
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button
            className="md:hidden p-2 bg-blue-700 text-white rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            Menu
          </button>
          <h2 className="text-xl font-semibold"> Student Dashboard</h2>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Routes>
            <Route path="/search" element={<Search />} />
            <Route path="/manage-sessions" element={<ManageSessions />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/student-schedule/:teacherId" element={<TeacherSchedule />} />
            <Route path="/teacher-profile/:teacherId" element={<TeacherView />} />
            <Route path="/" element={
  <p className="text-lg mb-4">
    Welcome to the Student Dashboard! This is your hub for managing your learning experience. You can view your schedule, access your sessions, and keep track of important updates. Use the navigation menu to explore different sections and make the most of your educational journey.
  </p>
} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
