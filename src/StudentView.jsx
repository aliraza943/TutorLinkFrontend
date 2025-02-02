import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const TeacherSchedule = () => {
  const { teacherId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [daysAllowed, setDaysAllowed] = useState([]);
  const [allowedTimeSlots, setAllowedTimeSlots] = useState([]);
  const [minTime, setMinTime] = useState(null);
  const [maxTime, setMaxTime] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedSession, setSelectedSession] = useState(null); 
  const [SessionBookings,useSessionBookings]=useState([])
  const [sessionTitle, setSessionTitle] = useState("");

  useEffect(() => {
    const fetchTeacherSchedule = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tutors/getSession/${teacherId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        const allowedHours = data.availableTime;
        const allowedDays = data.availableDays;
        setTeacherData(data);
        console.log(data)

        const startTime = moment(allowedHours[0], "h A");
        const endTime = moment(allowedHours[1], "h A");

        let timeSlots = [];
        let currentTime = startTime.clone();
        while (currentTime <= endTime) {
          timeSlots.push(currentTime.format("h:mm A"));
          currentTime.add(1, "hour");
        }

        setAllowedTimeSlots(timeSlots);
        setDaysAllowed(allowedDays);
        setMinTime(startTime);
        setMaxTime(endTime);
      } catch (error) {
        toast.error("Error fetching data. Please try again.");
      }
    };
    const fetchTeacherSession = async () => {
      try {
        const response = await fetch(`http://localhost:3000/session/TutorSession/${teacherId}`);
        console.log("THIS IS THE RESPONSE FROM OUR SESSIONS", response);
    
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
    
        const data = await response.json(); 
        console.log("THIS IS THE RESPONSE FROM OUR SESSIONS", data);// Parse the response as JSON
        console.log("Fetched session data:", data); // Log the session data
    
        // Retrieve the userId from localStorage
        const userId = JSON.parse(localStorage.getItem("user"))?.id;
    
        // Transform the fetched session data to match the format for sessions state
        const fetchedSessions = data.map((session) => {
          const isBooked = session.studentId === userId ? false : true;
          
          return {
            date: session.date, // Assuming the date is in the expected format
            time: session.startTime, // Assuming the time is in the expected format
            isBooked: isBooked, 
            title:session.sessionTitle
          };
        });
    
        setSessions(fetchedSessions); // Set the fetched sessions to state
      } catch (error) {
      
        console.error("Error fetching session:", error);
      }
    };


    if (teacherId) {
      fetchTeacherSchedule();
      fetchTeacherSession();
    }

    const hardcodedSessions = [
      { date: "2023-01-27", time: "9:00 AM", isBooked: true },
      { date: "2023-01-27", time: "10:00 AM", isBooked: false },
      { date: "2023-01-27", time: "11:00 AM", isBooked: true },
    ];
    setSessions(hardcodedSessions);
  }, [teacherId]);

  const handleAddSession = (slotInfo) => {
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(role)
    console.log(user)
    const sessionTime = moment(slotInfo.start).format("h:mm A");
    const sessionDate = moment(slotInfo.start).format("YYYY-MM-DD");
    console.log("this got called")

    if (moment(slotInfo.start).isBefore(moment())) {
      toast.error("You cannot create sessions in the past.");
      return;
    }

    if (!allowedTimeSlots.includes(sessionTime)) {
      toast.error("You can only create sessions for specific predefined time slots.");
      return;
    }

    const sessionExists = sessions.some(
      (session) => session.time === sessionTime && session.date === sessionDate
    );

    if (sessionExists) {
      toast.error("This time slot already has a session. Please choose another slot.");
      return;
    }

    setSelectedSession({ date: sessionDate, time: sessionTime });
    setShowModal(true); // Show the modal
  };

  const handleConfirmBooking = async () => {
    if (!sessionTitle.trim()) {
      toast.error("Please enter a session title.");
      return;
    }
  
    try {
      const role = localStorage.getItem("role");
      const user = JSON.parse(localStorage.getItem("user"));
  
      const sessionStartTime = selectedSession.time;
      const sessionDate = selectedSession.date;
      const startTime = new Date(`${sessionDate} ${sessionStartTime}`);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);
      const startFormatted = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const endFormatted = endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
      const newSession = {
        teacherId,
        teacherName: teacherData.name,
        teacherEmail: teacherData.email,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        sessionTitle, // Include user-defined title
        startTime: startFormatted,
        endTime: endFormatted,
        date: sessionDate,
      };
  
      const response = await fetch("http://localhost:3000/session/addAsession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSession),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create session");
      }
  
     
  
      setSessions((prevSessions) => [
        ...prevSessions,
        {
          date: sessionDate,
          time: sessionStartTime,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          isBooked: false,
          title: sessionTitle, // Update with user input
        },
      ]);
  
      setShowModal(false);
      setSessionTitle(""); // Reset title input after booking
      toast.success("Session successfully booked!");
    } catch (error) {
      toast.error("Failed to book session. Please try again.");
    }
  };
  
  const handleCancelBooking = () => {
    setShowModal(false);
  };

  const customDayPropGetter = (date) => {
    const dayOfWeek = moment(date).format("dddd");
    if (!daysAllowed.includes(dayOfWeek)) {
      return {
        className: "hidden-day",
        style: { display: "none" },
      };
    }
    return {};
  };
  console.log(sessions)

  const events = sessions.map((session) => {
    const startTime = new Date(`${session.date} ${session.time}`);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);
    console.log(session.sessionTitle)

    return {
      start: startTime,
      end: endTime,
      title: session.isBooked ? "Already Booked" : session.title,
      isBooked: session.isBooked,
    };
  });

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.isBooked ? "#3B82F6" : "#FCA5A5",
      color: "#1F2937",
      border: "none",
      borderRadius: "4px",
    };
    return { style };
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">{teacherData.name} Schedule</h1>
      <div className="mb-6">
        {minTime && maxTime && (
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectSlot={handleAddSession}
            selectable
            step={60}
            timeslots={1}
            views={["work_week", "day"]}
            defaultView="work_week"
            dayPropGetter={customDayPropGetter}
            min={minTime.toDate()}
            max={maxTime.toDate()}
            eventPropGetter={eventStyleGetter}
          />
        )}
      </div>

      {showModal && (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Are you sure you want to book this session?</h2>
      <p>
        <strong>Session Date:</strong> {selectedSession?.date}
      </p>
      <p>
        <strong>Session Time:</strong> {selectedSession?.time}
      </p>
      <p>
        <strong>Price:</strong> ${teacherData?.price}/hr
      </p>
      {/* Session Title Input Field */}
      <input
        type="text"
        className="w-full p-2 border rounded mt-2"
        placeholder="Enter session title"
        value={sessionTitle}
        onChange={(e) => setSessionTitle(e.target.value)}
      />
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleConfirmBooking}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={!sessionTitle.trim()} // Disable if empty
        >
          Confirm Booking
        </button>
        <button
          onClick={handleCancelBooking}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <ToastContainer />
    </div>
  );
};

export default TeacherSchedule;
