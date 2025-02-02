import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import TeacherIcon from "./assets/TeacherIcon.png";

const Search = () => {
  const [filters, setFilters] = useState({
    status: "",
    subject: "",
    rating: "",
    teacherName: "",
  });

  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const fetchTutors = async () => {
    try {
      // Create the query string from filters
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:3000/tutors?${queryParams}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  // Fetch tutors whenever filters change
  useEffect(() => {
    fetchTutors();
  }, [filters]);

  const handleChat = (userId) => {
    console.log(`Start chat with user: ${userId}`);
    // Implement chat functionality here, e.g., redirect to chat page
  };

  const handleBookNow = (userId) => {
    
    console.log(`Book now with user: ${userId}`);
    // Navigate to Teacher Schedule page with the userId as a URL parameter
    navigate(`/student-dashboard/student-schedule/${userId}`);  // Pass the userId in the URL
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Search</h1>

      {/* Search Bar */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          name="teacherName"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name"
          onChange={handleFilterChange}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-400"
          onClick={fetchTutors}
        >
          Search
        </button>
        <button
          onClick={toggleFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 hover:bg-gray-400"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {/* Status Filter */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Status:</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="online"
                  onChange={handleFilterChange}
                />
                <span>Online</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="offline"
                  onChange={handleFilterChange}
                />
                <span>Offline</span>
              </label>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Subject:</label>
            <select
              name="subject"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFilterChange}
            >
              <option value="">All Subjects</option>
              <option value="CS">CS</option>
              <option value="Maths">Maths</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Rating:</label>
            <select
              name="rating"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFilterChange}
            >
              <option value="">All Ratings</option>
              <option value="5">5 ★★★★★</option>
              <option value="4">4 ★★★★</option>
              <option value="3">3 ★★★</option>
              <option value="2">2 ★★</option>
              <option value="1">1 ★</option>
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((item) => (
              <li key={item._id} className="p-4 border rounded-lg bg-gray-50 flex items-center space-x-6">
                <img
                  src={TeacherIcon}
                  alt={`${item.name}'s profile`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1"
                  onClick={() => navigate(`/student-dashboard/teacher-profile/${item._id}`)}
>
                  <p className="text-lg font-medium"><strong>Name:</strong> {item.name}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Subject:</strong> {item.subject}</p>
                  <p><strong>Price:</strong> {item.price}</p>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Available Times:</strong> {item.availableTime[0]} till {item.availableTime[1]}</p>

                  {/* Available Days Display */}
                  <p><strong>Available Days:</strong></p>
                  <ul className="flex flex-wrap space-x-4">
                    {item.availableDays && item.availableDays.length > 0 ? (
                      item.availableDays.map((day, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg"
                        >
                          {day}
                        </li>
                      ))
                    ) : (
                      <p>No available days listed.</p>
                    )}
                  </ul>

               {/* Rating Display */}
{item.isRated ? (
  <div className="flex items-center space-x-2 mt-4">
    <span><strong>Rating:</strong> {item.rating.toFixed(1)}</span>
    <div className="flex">
      {Array.from({ length: Math.round(item.rating) }, (_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="gold"
          className="w-5 h-5"
        >
          <path d="M12 .587l3.668 7.431L24 9.588l-6 5.847 1.42 8.294L12 18.897l-7.42 3.832L6 15.435 0 9.588l8.332-1.57L12 .587z" />
        </svg>
      ))}
    </div>
  </div>
) : (
  <div className="mt-4">
    <span><strong>Rating:</strong> Unrated</span>
  </div>
)}

                  {/* Chat and Book Now buttons */}
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleChat(item._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400"
                    >
                      Chat
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation to the profile page
                        handleBookNow(item._id);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
