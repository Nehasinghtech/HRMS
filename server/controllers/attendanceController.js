const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Employee Check In
const checkIn = async (req, res) => {
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

    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "You have already checked in today",
      });
    }

    const attendance = await Attendance.create({
      employeeId: employee._id,
      date: today,
      checkIn: new Date(),
      status: "Present",
    });

    res.status(201).json({
      success: true,
      message: "Check-in successful",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Check-in failed",
      error: error.message,
    });
  }
};

// Employee Check Out
const checkOut = async (req, res) => {
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

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "Please check in first",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "You have already checked out today",
      });
    }

    attendance.checkOut = new Date();

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Check-out failed",
      error: error.message,
    });
  }
};

// Employee Attendance History
const getMyAttendance = async (req, res) => {
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

    const attendance = await Attendance.find({
      employeeId: employee._id,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// HR - Get All Attendance
const getAllAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const query = {};

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (date) {
      query.date = date;
    }

    const [attendance, total] = await Promise.all([
      Attendance.find(query)
        .populate("employeeId", "name email department designation photoUrl")
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Attendance.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
};
