import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const HRDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeaveToday: 0,
    recentAttendance: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/hr");

      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="dashboard-content">
          <div className="page-heading">
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back to HRMS</p>
            </div>
          </div>

          {loading && <p>Loading dashboard...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <p>Total Employees</p>
                  <h2>{dashboard.totalEmployees}</h2>
                </div>

                <div className="stat-card">
                  <p>Present Today</p>
                  <h2>{dashboard.presentToday}</h2>
                </div>

                <div className="stat-card">
                  <p>On Leave</p>
                  <h2>{dashboard.onLeaveToday}</h2>
                </div>

                <div className="stat-card">
                  <p>Recent Activity</p>
                  <h2>{dashboard.recentAttendance.length}</h2>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Recent Attendance Activity</h2>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dashboard.recentAttendance.length === 0 ? (
                        <tr>
                          <td colSpan="6">No attendance records found</td>
                        </tr>
                      ) : (
                        dashboard.recentAttendance.map((attendance) => (
                          <tr key={attendance._id}>
                            <td>{attendance.employeeId?.name || "-"}</td>

                            <td>{attendance.employeeId?.department || "-"}</td>

                            <td>{attendance.date}</td>

                            <td>{formatTime(attendance.checkIn)}</td>

                            <td>{formatTime(attendance.checkOut)}</td>

                            <td>{attendance.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;
