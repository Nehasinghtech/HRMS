import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const isHR = user?.role === "HR";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>HRMS</h2>
        <span>{isHR ? "HR Portal" : "Employee Portal"}</span>
      </div>

      <nav>
        {isHR ? (
          <>
            <NavLink to="/hr/dashboard">Dashboard</NavLink>

            <NavLink to="/hr/employees">Employees</NavLink>

            <NavLink to="/hr/attendance">Attendance</NavLink>

            <NavLink to="/hr/leaves">Leave Requests</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/employee/dashboard">Dashboard</NavLink>

            <NavLink to="/employee/attendance">My Attendance</NavLink>

            <NavLink to="/employee/apply-leave">Apply Leave</NavLink>

            <NavLink to="/employee/leaves">My Leaves</NavLink>

            <NavLink to="/employee/profile">Profile</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
