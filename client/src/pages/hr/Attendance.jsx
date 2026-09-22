import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");

      setEmployees(response.data.employees);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendance = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (employeeId) {
        params.employeeId = employeeId;
      }

      if (date) {
        params.date = date;
      }

      params.page = page;
      params.limit = 10;

      const response = await api.get("/attendance", {
        params,
      });

      setAttendance(response.data.attendance);
      setPagination(response.data.pagination || { page, pages: 1 });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance(1);
  }, []);

  const handleFilter = () => {
    fetchAttendance(1);
  };

  const handleClear = () => {
    setEmployeeId("");
    setDate("");

    setTimeout(() => {
      fetchAttendance(1);
    }, 0);
  };

  const formatTime = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleTimeString([], {
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
            <h1>Attendance Management</h1>
            <p>View and filter employee attendance</p>
          </div>

          <div className="employee-card">
            <div className="filter-container">
              <div className="filter-group">
                <label>Employee</label>

                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  <option value="">All Employees</option>

                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                <button className="primary-button" onClick={handleFilter}>
                  Filter
                </button>

                <button className="secondary-button" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </div>

            {loading && <p>Loading attendance...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && !error && (
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
                    {attendance.length === 0 ? (
                      <tr>
                        <td colSpan="6">No attendance records found</td>
                      </tr>
                    ) : (
                      attendance.map((record) => (
                        <tr key={record._id}>
                          <td>{record.employeeId?.name || "-"}</td>

                          <td>{record.employeeId?.department || "-"}</td>

                          <td>{record.date}</td>

                          <td>{formatTime(record.checkIn)}</td>

                          <td>{formatTime(record.checkOut)}</td>

                          <td>{record.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && pagination.pages > 1 && (
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  className="secondary-button"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchAttendance(pagination.page - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="secondary-button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchAttendance(pagination.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Attendance;
