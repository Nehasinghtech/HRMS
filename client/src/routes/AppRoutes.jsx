import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import HRDashboard from "../pages/hr/HRDashboard";
import EmployeeList from "../pages/employee/EmployeeList";
import AddEmployee from "../pages/hr/AddEmployee";
import EditEmployee from "../pages/hr/EditEmployee";
import Attendance from "../pages/hr/Attendance";
import LeaveRequests from "../pages/hr/LeaveRequests";
import ApplyLeave from "../pages/employee/ApplyLeave";
import MyAttendance from "../pages/employee/MyAttendance";
import MyLeaves from "../pages/employee/MyLeaves";
import Profile from "../pages/employee/Profile";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <EmployeeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/employees/add"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/leaves"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <LeaveRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/apply-leave"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <ApplyLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/attendance"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <MyAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/leaves"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <MyLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
