import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate , Link} from "react-router-dom";


const timeSlots = [
  "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
  "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
  "6 PM", "7 PM", "8 PM"
];

const availableDaysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const subjectsList = ["Maths", "CS", "Computer", "Biology"];

const StudentSignUp = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    subject: "",
    description: "",
    price: "",
    availableDays: [],
    startTime: "",
    endTime: "",
  });

  const [availableEndTimes, setAvailableEndTimes] = useState([]);

  useEffect(() => {
    if (formData.startTime) {
      const startIdx = timeSlots.indexOf(formData.startTime);
      const newEndTimes = timeSlots.slice(startIdx + 1);
      setAvailableEndTimes(newEndTimes);
      
      if (formData.endTime && timeSlots.indexOf(formData.endTime) <= startIdx) {
        setFormData(prev => ({ ...prev, endTime: "" }));
      }
    } else {
      setAvailableEndTimes([]);
      setFormData(prev => ({ ...prev, endTime: "" }));
    }
  }, [formData.startTime]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      availableDays: checked
        ? [...prev.availableDays, value]
        : prev.availableDays.filter((day) => day !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    if (formData.role === "teacher") {
      if (!formData.subject || !formData.price || !formData.availableDays.length || !formData.startTime || !formData.endTime) {
        toast.error("Please fill all teacher fields!");
        return;
      }

      if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        toast.error("Please enter a valid price!");
        return;
      }
    }
    console.log(formData)

    try {
      const response = await fetch("http://localhost:3000/tutors/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    
      if (!response.ok) throw new Error("Failed to sign up");
      

      toast.success("Sign-up successful!");
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "student",
        subject: "",
        description: "",
        price: "",
        availableDays: [],
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      toast.error("This email already exists");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
 <nav className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">Tutor Next</h1>
        <Link to="/login" className=" text-white-600 px-4 py-2 rounded-md shadow-md hover:bg-gray-200">
          Login
        </Link></nav>

      <main className="flex-grow flex justify-center items-center">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
          <ToastContainer position="top-right" autoClose={3000} />
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter username"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter email"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter password"
              />
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Register as:</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className={`px-4 py-2 rounded-md ${formData.role === "student" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                    Student
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={formData.role === "teacher"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className={`px-4 py-2 rounded-md ${formData.role === "teacher" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                    Teacher
                  </span>
                </label>
              </div>
            </div>

            {/* Teacher Fields */}
            {formData.role === "teacher" && (
              <div className="bg-gray-100 p-4 rounded-md space-y-4">
                {/* Subject Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">Select a subject</option>
                    {subjectsList.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Price per Hour ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Enter your hourly rate"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Available Days */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Available Days</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableDaysList.map((day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={day}
                          checked={formData.availableDays.includes(day)}
                          onChange={handleCheckboxChange}
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Briefly describe your expertise"
                    rows="3"
                  />
                </div>

                {/* Available Time Slots */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Available Time</label>
                  <div className="flex gap-4">
                    <select 
                      name="startTime" 
                      value={formData.startTime} 
                      onChange={handleChange} 
                      className="border rounded-md px-4 py-2"
                    >
                      <option value="">Start Time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>

                    <select 
                      name="endTime" 
                      value={formData.endTime} 
                      onChange={handleChange} 
                      className="border rounded-md px-4 py-2"
                      disabled={!formData.startTime}
                    >
                      <option value="">End Time</option>
                      {availableEndTimes.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  {!formData.startTime && (
                    <p className="text-sm text-gray-500 mt-1">Please select a start time first</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="w-full bg-blue-700 text-white p-2 rounded-md hover:bg-blue-600 mt-4">
              Sign Up
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        © 2025 My Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default StudentSignUp;