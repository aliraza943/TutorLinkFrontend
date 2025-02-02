import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const allowedDays = ["Monday", "Friday"];

const ManageTeacherSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  const teacherId = JSON.parse(localStorage.getItem("user"))?.id;
  if (!teacherId) return <p>Error: Teacher ID not found!</p>;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/session/TutorSession/${teacherId}`);
        const data = await response.json();
        setSessions(Array.isArray(data) ? data : []); // Ensure sessions is always an array
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch sessions");
        setLoading(false);
      }

      try {
        const response = await fetch(`http://localhost:3000/tutors/getSession/${teacherId}`);
        const data = await response.json();
        if (data.availableTime && data.availableTime.length >= 2) {
          setAvailableTimes(generateTimeArray(data.availableTime[0], data.availableTime[1]));
        }
      } catch (err) {
        console.log("Error fetching time slots:", err);
      }
    };

    fetchSessions();
  }, [teacherId]);

  function generateTimeArray(startTime, endTime) {
    const times = [];
    const parseTime = (timeStr) => {
      const [hourPart, period] = timeStr.split(" ");
      let hour = parseInt(hourPart);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return hour;
    };

    const startHour = parseTime(startTime);
    const endHour = parseTime(endTime);
    for (let hour = startHour; hour < endHour; hour++) {
      const displayHour = hour % 12 || 12;
      const period = hour >= 12 ? "PM" : "AM";
      times.push(`${displayHour}:00 ${period}`);
    }

    return times;
  }

  const isAllowedDay = (date) => {
    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
    return allowedDays.includes(dayName);
  };

  const getNextHour = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let hour = parseInt(time.split(":"));

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const nextHour = (hour + 1) % 24;
    const nextPeriod = nextHour >= 12 ? "PM" : "AM";
    const displayHour = nextHour % 12 || 12;

    return `${displayHour}:00 ${nextPeriod}`;
  };

  const openModal = (session) => {
    setModalData(session);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const handleCancelSession = async (session) => {
    try {
      const response = await fetch(`http://localhost:3000/session/${session._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete session");

      setSessions((prevSessions) =>
        prevSessions.filter((s) => s._id !== session._id)
      );

      closeModal();
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };
  const saveSession = async () => {
    try {
      const response = await fetch(`http://localhost:3000/session/${modalData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modalData),
      });

      if (!response.ok) throw new Error("Failed to update session");

      const updatedSession = await response.json();
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session._id === updatedSession.session._id ? updatedSession.session : session
        )
      );

      closeModal();
    } catch (err) {
      console.error("Error updating session:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Manage Teacher Sessions</h1>

      <div className="mb-8">
        <Calendar
          localizer={localizer}
          events={sessions.map((session) => ({
            title: session.sessionTitle,
            start: new Date(`${session.date} ${session.startTime}`),
            end: new Date(`${session.date} ${session.endTime}`),
            allDay: false,
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>

      {sessions.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No sessions available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-semibold">
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Start</th>
              <th className="px-4 py-2 border-b">End</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{session.sessionTitle}</td>
                <td className="px-4 py-2 text-sm">{session.date}</td>
                <td className="px-4 py-2 text-sm">{session.startTime}</td>
                <td className="px-4 py-2 text-sm">{session.endTime}</td>
                <td className="px-4 py-2 text-sm text-center">
                  <button onClick={() => openModal(session)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Reschedule
                  </button>
                  <button onClick={() => handleCancelSession(session)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition ml-3">
                    Remove Session
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && modalData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 w-96">
            <h2 className="text-xl font-bold mb-4">Reschedule Session</h2>
            <label className="block font-semibold mb-1">Session Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 border mb-4 rounded"
              value={modalData.sessionTitle}
              onChange={(e) => setModalData({ ...modalData, sessionTitle: e.target.value })}
            />
            <DatePicker
              selected={new Date(modalData.date)}
              onChange={(date) => setModalData({ ...modalData, date: date.toISOString().split("T")[0] })}
              filterDate={isAllowedDay}
              className="w-full px-4 py-2 border mb-4 rounded"
            />
            <select className="w-full px-4 py-2 border mb-4 rounded" value={modalData.startTime} onChange={(e) => setModalData({ ...modalData, startTime: e.target.value, endTime: getNextHour(e.target.value) })}>
              {availableTimes.map((time) => (<option key={time} value={time}>{time}</option>))}
            </select>
            <input className="w-full px-4 py-2 border mb-4 rounded bg-gray-100" value={modalData.endTime} readOnly />
            <div className="flex justify-end space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={saveSession}>Save</button>
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeacherSessions;
