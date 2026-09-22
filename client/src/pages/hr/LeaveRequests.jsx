import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaves = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (status) {
        params.status = status;
      }
      params.page = page;
      params.limit = 10;

      const response = await api.get("/leaves", {
        params,
      });

      setLeaves(response.data.leaves);
      setPagination(response.data.pagination || { page, pages: 1 });
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load leave requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves(1);
  }, [status]);

  const handleApprove = async (id) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this leave?",
    );

    if (!confirmApprove) return;

    try {
      await api.put(`/leaves/${id}/approve`, {
        hrComment: "Leave approved by HR",
      });

      fetchLeaves(pagination.page);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve leave");
    }
  };

  const handleReject = async (id) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this leave?",
    );

    if (!confirmReject) return;

    try {
      await api.put(`/leaves/${id}/reject`, {
        hrComment: "Leave rejected by HR",
      });

      fetchLeaves(pagination.page);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject leave");
    }
  };

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
              <h1>Leave Requests</h1>
              <p>Manage employee leave requests</p>
            </div>
          </div>

          {/* Filter */}
          <div className="filter-container">
            <div className="filter-group">
              <label>Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading && <p>Loading leave requests...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && (
            <div className="employee-card">
              {leaves.length === 0 ? (
                <p>No leave requests found.</p>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaves.map((leave) => (
                        <tr key={leave._id}>
                          <td>{leave.employeeId?.name || "-"}</td>

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

                          <td>
                            {leave.status === "Pending" ? (
                              <div className="action-buttons">
                                <button
                                  className="approve-button"
                                  onClick={() => handleApprove(leave._id)}
                                >
                                  Approve
                                </button>

                                <button
                                  className="reject-button"
                                  onClick={() => handleReject(leave._id)}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {!loading && !error && pagination.pages > 1 && (
            <div className="flex items-center justify-between gap-3">
              <button
                className="secondary-button"
                disabled={pagination.page <= 1}
                onClick={() => fetchLeaves(pagination.page - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className="secondary-button"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchLeaves(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeaveRequests;
