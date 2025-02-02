import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultTeacherIcon from "./assets/TeacherIcon.png"; 

function TeacherView() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tutors/getSession/${teacherId}`);
        if (!response.ok) throw new Error("Failed to fetch teacher data");
        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTeacher(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tutors/getReviews/${teacherId}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.warn("Failed to fetch reviews, defaulting to empty array:", err);
        setReviews([]); // Instead of setting an error, just set an empty array
      } finally {
        setLoadingReviews(false);
      }
    };
    

    fetchTeacher();
    fetchReviews();
  }, [teacherId]);

  if (loadingTeacher || loadingReviews) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Teacher Details</h2>
      {teacher ? (
        <div className="bg-white p-4 rounded shadow flex gap-4 items-center">
          {/* Teacher Image */}
          <img 
            src={teacher.teacherIcon || defaultTeacherIcon}
            alt={teacher.name}
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
          
          {/* Teacher Details */}
          <div>
            <h3 className="text-lg font-semibold">{teacher.name}</h3>
            <p className="text-gray-600">Subject: {teacher.subject}</p>
            <p className="text-gray-600">Price: ${teacher.price}/hour</p>
            <p className="text-gray-600">Rating: {teacher.rating} ⭐</p>
            <p className="text-gray-600">Description: {teacher.description}</p>
            <p className="text-gray-600">Availability: {teacher.availableTime[0]} till {teacher.availableTime[1]}</p>

            {/* Display Available Days */}
            <p className="text-gray-600">
              <strong>Available Days:</strong> {teacher.availableDays && teacher.availableDays.length > 0 
                ? teacher.availableDays.join(", ") 
                : "Not specified"}
            </p>
          </div>
        </div>
      ) : (
        <p>No teacher found</p>
      )}

      {/* Reviews Section */}
      {reviews && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Reviews</h3>
          <ul>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <li key={index} className="bg-gray-100 p-4 my-2 rounded">
                  <div className="flex items-center mb-2">
                    <p className="font-semibold"> Student name {review.studentName}</p>
                    <p className="ml-2 text-yellow-500">{'⭐'.repeat(review.stars)}</p> {/* Display stars */}
                  </div>
                  <p className="font-semibold">{review.teacherName}</p>
                  <p>{review.review}</p>
                  <p className="text-gray-600">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                </li>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TeacherView;
