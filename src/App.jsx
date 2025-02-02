import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./Dashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentSignUp from "./SignUp";
import Login from "./LoginForm";

function App() {
  // Handle login: Save role and user data in localStorage
  const handleLogin = (role, user) => {
    if (!role || !user) {
      console.error("Login error: Role or user data is missing");
      return;
    }
  
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));
  
    window.location.href = `/${role}-dashboard`; // Redirect after login
  };
  

  // Handle logout: Clear user data from localStorage
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect to login page
  };

  // Retrieve stored role and user data
  const role = localStorage.getItem("role");
  const userData = localStorage.getItem("user");

  // ✅ FIX: Ensure JSON.parse() does not run on `null` or `"undefined"`
  let user = null;
  try {
    if (userData && userData !== "undefined") {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
   // Clear invalid data
  }

  return (
    <Router>
      <Routes>
        {/* ✅ If there is no role, always redirect to login */}
        <Route path="/" element={<Navigate to={role ? `/${role}-dashboard` : "/login"} />} />

        {/* Student Dashboard Route */}
        <Route
          path="/student-dashboard/*"
          element={
            role === "student" ? (
              <StudentDashboard user={user} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Teacher Dashboard Route */}
        <Route
  path="/teacher-dashboard/*"
  element={
    role === "teacher" ? (
      <TeacherDashboard user={user} handleLogout={handleLogout} />  // ✅ Ensure `handleLogout` is passed
    ) : (
      <Navigate to="/login" />
    )
  }
/>

          <Route path="/signup" element={<StudentSignUp />} />

        {/* Login Route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
