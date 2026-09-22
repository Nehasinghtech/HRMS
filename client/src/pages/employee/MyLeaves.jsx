import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const MyLeaves = () => {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leaves/my");

      setLeaves(response.data.leaves || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
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
              <h1>My Leaves</h1>
              <p>View your leave requests and status</p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/employee/apply-leave")}
            >
              Apply Leave
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="employee-card">
            {loading ? (
              <p>Loading leaves...</p>
            ) : leaves.length === 0 ? (
              <p>No leave requests found.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>HR Comment</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave._id}>
                        <td>{leave.leaveType}</td>

                        <td>{formatDate(leave.startDate)}</td>

                        <td>{formatDate(leave.endDate)}</td>

                        <td>{leave.reason}</td>

                        <td>
                          <span
                            className={`status-badge status-${leave.status.toLowerCase()}`}
                          >
                            {leave.status}
                          </span>
                        </td>

                        <td>{leave.hrComment || "-"}</td>
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

export default MyLeaves;
