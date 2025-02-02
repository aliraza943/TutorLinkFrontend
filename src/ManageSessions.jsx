import { useState, useEffect } from "react";

const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [sessionTitle, setSessionTitle] = useState(""); // Make sure this is set properly
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user || !user.id) {
        console.error("User not found in localStorage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/session/GetstudentSessions/${user.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }

        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [user]);

  const openReviewModal = (session) => {
    setSelectedSession(session);
    setShowModal(true);
    setSessionTitle(session.sessionTitle); // Set the sessionTitle when modal is opened
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSession(null);
    setRating(0);
    setReview("");
    setSessionTitle(""); // Reset sessionTitle when modal is closed
  };

  const handleSubmitReview = async () => {
    console.log("This button was hit");

    if (!selectedSession || !rating || !review.trim() || !sessionTitle.trim()) {
      console.log("Please fill in all fields");
      alert("Please fill in all fields");
      return;
    }

    console.log("Submitting review...");

    try {
      const response = await fetch("http://localhost:3000/tutors/submitReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: selectedSession._id,
          studentId: user.id,
          teacherId: selectedSession.teacherId,
          teacherName: selectedSession.teacherName,
          studentName: selectedSession.studentName,
          stars: rating,
          review,
          sessionTitle: selectedSession.sessionTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      alert("Review submitted successfully!");
      closeModal();

      // Refresh sessions list after submitting review
      const updatedResponse = await fetch(`http://localhost:3000/session/GetstudentSessions/${user.id}`);
      const updatedData = await updatedResponse.json();
      setSessions(updatedData);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Your Sessions</h1>

      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Session Title</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Teacher</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const isPastSession = session.date < currentDate;

              return (
                <tr key={session._id} className="border-t">
                  <td className="p-3">{session.sessionTitle}</td>
                  <td className="p-3">{session.date}</td>
                  <td className="p-3">
                    {session.startTime} - {session.endTime}
                  </td>
                  <td className="p-3">{session.teacherName}</td>
                  <td className="p-3">
                    {session.isReviewed ? (
                      <span className="text-green-600 font-semibold">Already Reviewed</span>
                    ) : isPastSession ? (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => openReviewModal(session)}
                      >
                        Write Review
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">Not Reviewable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Review Modal */}
      {showModal && selectedSession && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 z-50 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Write Your Review</h2>
            <p>
              <strong>Session Date:</strong> {selectedSession.date}
            </p>
            <p>
              <strong>Session Time:</strong> {selectedSession.startTime} - {selectedSession.endTime}
            </p>
            <p>
              <strong>Teacher:</strong> {selectedSession.teacherName}
            </p>
            <p>
              <strong>Session Title:</strong> {selectedSession.sessionTitle}
            </p>

            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>

            <div className="mt-4 flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                disabled={!rating || !review.trim() || !sessionTitle.trim()}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSessions;
