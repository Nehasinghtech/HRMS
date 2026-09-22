import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const EmployeeDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard/employee");

      setDashboard(response.data.dashboard);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Navbar />

          <div className="page-content">
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-content">
          <div className="employee-heading">
            <div>
              <h1>Employee Dashboard</h1>
              <p>Welcome to your HRMS portal</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Personal Information */}
          <div className="employee-card">
            <h2>Personal Information</h2>

            <div className="profile-info-grid">
              <div>
                <span>Name</span>
                <strong>{dashboard?.personalInformation?.name || "-"}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{dashboard?.personalInformation?.email || "-"}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{dashboard?.personalInformation?.phone || "-"}</strong>
              </div>

              <div>
                <span>Department</span>
                <strong>
                  {dashboard?.personalInformation?.department || "-"}
                </strong>
              </div>

              <div>
                <span>Designation</span>
                <strong>
                  {dashboard?.personalInformation?.designation || "-"}
                </strong>
              </div>

              <div>
                <span>Date of Joining</span>
                <strong>
                  {formatDate(dashboard?.personalInformation?.dateOfJoining)}
                </strong>
              </div>
            </div>
          </div>

          {/* Today's Attendance */}
          <div className="employee-card">
            <h2>Today's Attendance</h2>

            <div className="profile-info-grid">
              <div>
                <span>Check In</span>
                <strong>
                  {formatTime(dashboard?.todayAttendance?.checkIn)}
                </strong>
              </div>

              <div>
                <span>Check Out</span>
                <strong>
                  {formatTime(dashboard?.todayAttendance?.checkOut)}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {dashboard?.todayAttendance?.status || "Not Marked"}
                </strong>
              </div>
            </div>
          </div>

          {/* Leave Summary */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Approved Leaves</h3>

              <div className="stat-value">{dashboard?.approvedLeaves || 0}</div>
            </div>

            <div className="stat-card">
              <h3>Leave History</h3>

              <div className="stat-value">
                {dashboard?.leaveHistory?.length || 0}
              </div>
            </div>
          </div>

          {/* Leave History */}
          <div className="employee-card">
            <h2>Recent Leave History</h2>

            {!dashboard?.leaveHistory || dashboard.leaveHistory.length === 0 ? (
              <p>No leave history found.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dashboard.leaveHistory.map((leave) => (
                      <tr key={leave._id}>
                        <td>{leave.leaveType}</td>

                        <td>{formatDate(leave.startDate)}</td>

                        <td>{formatDate(leave.endDate)}</td>

                        <td>
                          <span
                            className={`status-badge status-${leave.status.toLowerCase()}`}
                          >
                            {leave.status}
                          </span>
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

export default EmployeeDashboard;
