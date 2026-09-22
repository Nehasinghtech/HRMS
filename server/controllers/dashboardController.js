const User = require("../models/User");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

// HR Dashboard
const getHRDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Total employees
    const totalEmployees = await Employee.countDocuments();

    // Present today
    const presentToday = await Attendance.countDocuments({
      date: today,
      status: "Present",
    });

    // Employees on leave today
    const onLeaveToday = await Leave.countDocuments({
      status: "Approved",
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    // Recent attendance
    const recentAttendance = await Attendance.find()
      .populate("employeeId", "name email department designation")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalEmployees,
        presentToday,
        onLeaveToday,
        recentAttendance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch HR dashboard",
      error: error.message,
    });
  }
};

// Employee Dashboard
const getEmployeeDashboard = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      userId: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // Today's attendance
    const todayAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    // Leave history
    const leaveHistory = await Leave.find({
      employeeId: employee._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Approved leave count
    const approvedLeaves = await Leave.countDocuments({
      employeeId: employee._id,
      status: "Approved",
    });

    res.status(200).json({
      success: true,
      dashboard: {
        personalInformation: {
          _id: employee._id,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          designation: employee.designation,
          dateOfJoining: employee.dateOfJoining,
          photoUrl: employee.photoUrl,
        },
        todayAttendance,
        approvedLeaves,
        leaveHistory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getHRDashboard,
  getEmployeeDashboard,
};
