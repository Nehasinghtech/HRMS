import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const response = await api.get("/attendance/my");

      setAttendance(response.data.attendance || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendance.find((item) => item.date === today);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setError("");

      await api.post("/attendance/check-in");

      alert("Check-in successful");

      fetchAttendance();
    } catch (error) {
      setError(error.response?.data?.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setError("");

      await api.post("/attendance/check-out");

      alert("Check-out successful");

      fetchAttendance();
    } catch (error) {
      setError(error.response?.data?.message || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-content">
          <div className="employee-heading">
            <div>
              <h1>My Attendance</h1>
              <p>View and manage your attendance</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Today's Attendance */}
          <div className="employee-card">
            <h2>Today's Attendance</h2>

            <div className="attendance-today">
              <div>
                <span>Date</span>
                <strong>{formatDate(today)}</strong>
              </div>

              <div>
                <span>Check In</span>
                <strong>{formatTime(todayAttendance?.checkIn)}</strong>
              </div>

              <div>
                <span>Check Out</span>
                <strong>{formatTime(todayAttendance?.checkOut)}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{todayAttendance?.status || "Not Marked"}</strong>
              </div>

              <div className="attendance-actions">
                {!todayAttendance && (
                  <button
                    className="primary-button"
                    onClick={handleCheckIn}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Check In"}
                  </button>
                )}

                {todayAttendance && !todayAttendance.checkOut && (
                  <button
                    className="primary-button"
                    onClick={handleCheckOut}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Check Out"}
                  </button>
                )}

                {todayAttendance?.checkOut && (
                  <span className="attendance-completed">
                    Attendance Completed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="employee-card">
            <h2>Attendance History</h2>

            {loading ? (
              <p>Loading attendance...</p>
            ) : attendance.length === 0 ? (
              <p>No attendance records found.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((item) => (
                      <tr key={item._id}>
                        <td>{formatDate(item.date)}</td>

                        <td>{formatTime(item.checkIn)}</td>

                        <td>{formatTime(item.checkOut)}</td>

                        <td>
                          <span className="status-badge">{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAttendance;
