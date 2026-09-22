import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const ApplyLeave = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before start date");
      return;
    }

    try {
      setLoading(true);

      await api.post("/leaves", formData);

      alert("Leave request submitted successfully");

      navigate("/employee/leaves");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to submit leave request",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-content">
          <div className="employee-heading">
            <div>
              <h1>Apply Leave</h1>
              <p>Submit your leave request</p>
            </div>
          </div>

          <div className="form-card">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Leave Type */}
                <div className="form-group">
                  <label>Leave Type</label>

                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                  >
                    <option value="Casual Leave">Casual Leave</option>

                    <option value="Sick Leave">Sick Leave</option>

                    <option value="Paid Leave">Paid Leave</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                {/* End Date */}
                <div className="form-group">
                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Reason */}
                <div className="form-group full-width">
                  <label>Reason</label>

                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter reason for leave"
                    rows="5"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate("/employee/dashboard")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Apply Leave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplyLeave;
