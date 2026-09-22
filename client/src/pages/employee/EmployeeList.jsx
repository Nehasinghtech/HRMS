import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const EmployeeList = () => {
  const navigate = useNavigate();

  const departments = ["IT", "HR", "Finance", "Sales", "Marketing"];
  const designations = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "HR Manager",
    "Accountant",
    "Sales Executive",
    "Project Manager",
  ];

  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    designation: "",
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async (page = 1, nextFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/employees", {
        params: {
          ...nextFilters,
          page,
          limit: 10,
        },
      });

      setEmployees(response.data.employees);
      setPagination(response.data.pagination || { page, pages: 1 });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(1);
  }, []);

  const handleFilterChange = (e) => {
    const nextFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(nextFilters);
    fetchEmployees(1, nextFilters);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="dashboard-content">
          <div className="page-heading employee-heading">
            <div>
              <h1>Employees</h1>
              <p>Manage company employees</p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/hr/employees/add")}
            >
              + Add Employee
            </button>
          </div>

          <div className="employee-card">
            <div className="search-box">
              <div className="form-grid">
                <input
                  type="text"
                  name="search"
                  placeholder="Search by name, email, phone, department or designation"
                  value={filters.search}
                  onChange={handleFilterChange}
                />

                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                >
                  <option value="">All departments</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>

                <select
                  name="designation"
                  value={filters.designation}
                  onChange={handleFilterChange}
                >
                  <option value="">All designations</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && <p>Loading employees...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && !error && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Joining Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan="7">No employees found</td>
                      </tr>
                    ) : (
                      employees.map((employee) => (
                        <tr key={employee._id}>
                          <td>
                            <div className="flex items-center gap-3">
                              {employee.photoUrl ? (
                                <img
                                  className="profile-avatar"
                                  src={`${api.defaults.baseURL.replace("/api", "")}${employee.photoUrl}`}
                                  alt=""
                                />
                              ) : null}
                              <span>{employee.name}</span>
                            </div>
                          </td>

                          <td>{employee.email}</td>

                          <td>{employee.phone}</td>

                          <td>{employee.department}</td>

                          <td>{employee.designation}</td>

                          <td>
                            {new Date(
                              employee.dateOfJoining,
                            ).toLocaleDateString()}
                          </td>

                          <td>
                            <button
                              className="edit-button"
                              onClick={() =>
                                navigate(`/hr/employees/edit/${employee._id}`)
                              }
                            >
                              Edit
                            </button>
                          </td>
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
                  onClick={() => fetchEmployees(pagination.page - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="secondary-button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchEmployees(pagination.page + 1)}
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

export default EmployeeList;
