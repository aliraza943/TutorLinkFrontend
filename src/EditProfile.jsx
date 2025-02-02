import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    availableDays: [],
    availableTime: ["8 AM", "8 PM"],
    pricePerHour: 0,
    status: "offline"
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [
    "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
    "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
    "6 PM", "7 PM", "8 PM"
  ];

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        if (!userId) throw new Error("User ID not found in localStorage");

        const response = await fetch(`http://localhost:3000/tutors/getSession/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch tutor data");

        const tutorData = await response.json();

        setFormData({
          name: tutorData.name || "",
          email: tutorData.email || "",
          description: tutorData.description || "",
          availableDays: tutorData.availableDays || [],
          availableTime: tutorData.availableTime || ["8 AM", "8 PM"],
          price: tutorData.price || 0,
          status: tutorData.status || "offline"
        });
      } catch (error) {
        toast.error("Error fetching tutor data!");
        console.error("Error fetching tutor:", error);
      }
    };

    fetchTutor();
  }, [userId]);

  const handleChange = (e) => {
    const value = e.target.name === "pricePerHour" 
      ? parseFloat(e.target.value) || 0 
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleDayToggle = (day) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      availableDays: prevFormData.availableDays.includes(day)
        ? prevFormData.availableDays.filter((d) => d !== day)
        : [...prevFormData.availableDays, day],
    }));
  };

  const getTimeIndex = (time) => {
    return timeSlots.indexOf(time);
  };

  const handleTimeChange = (index, value) => {
    const updatedTime = [...formData.availableTime];
    const startIndex = index === 0 ? getTimeIndex(value) : getTimeIndex(updatedTime[0]);
    const endIndex = index === 1 ? getTimeIndex(value) : getTimeIndex(updatedTime[1]);

    if (index === 0 && startIndex >= endIndex) {
      // If start time is changed to be after end time, adjust end time
      updatedTime[0] = value;
      updatedTime[1] = timeSlots[Math.min(startIndex + 1, timeSlots.length - 1)];
    } else if (index === 1 && endIndex <= startIndex) {
      // If end time is changed to be before start time, adjust start time
      updatedTime[1] = value;
      updatedTime[0] = timeSlots[Math.max(endIndex - 1, 0)];
    } else {
      updatedTime[index] = value;
    }

    setFormData({ ...formData, availableTime: updatedTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/tutors/updateTutor/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile!");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter your name"
          />
        </div>

        {/* Email (Read-only) */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Price per Hour */}
        <div className="mb-4">
          <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700">
            Price per Hour ($)
          </label>
          <input
            type="number"
            id="pricePerHour"
            name="pricePerHour"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter your hourly rate"
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter a description"
            rows="3"
          ></textarea>
        </div>

        {/* Available Days */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Available Days</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.availableDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Available Time (Dropdown) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Available Time</label>
          <div className="flex gap-4">
            <select
              value={formData.availableTime[0]}
              onChange={(e) => handleTimeChange(0, e.target.value)}
              className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {timeSlots.map((time) => (
                <option 
                  key={time} 
                  value={time}
                  disabled={getTimeIndex(time) >= getTimeIndex(formData.availableTime[1])}
                >
                  {time}
                </option>
              ))}
            </select>
            <span className="self-center">to</span>
            <select
              value={formData.availableTime[1]}
              onChange={(e) => handleTimeChange(1, e.target.value)}
              className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {timeSlots.map((time) => (
                <option 
                  key={time} 
                  value={time}
                  disabled={getTimeIndex(time) <= getTimeIndex(formData.availableTime[0])}
                >
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Save Changes Button */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;