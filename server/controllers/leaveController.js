const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const sendEmail = require("../utils/sendEmail");

// Employee - Apply Leave
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All leave fields are required",
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    const employee = await Employee.findOne({
      userId: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const leave = await Leave.create({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to apply leave",
      error: error.message,
    });
  }
};

// Employee - My Leave History
const getMyLeaves = async (req, res) => {
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

    const leaves = await Leave.find({
      employeeId: employee._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave history",
      error: error.message,
    });
  }
};

// HR - Get All Leave Requests
const getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const query = {};

    if (status) {
      query.status = status;
    }

    const [leaves, total] = await Promise.all([
      Leave.find(query)
        .populate(
          "employeeId",
          "name email phone department designation photoUrl",
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Leave.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave requests",
      error: error.message,
    });
  }
};

// HR - Approve Leave
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Leave is already ${leave.status}`,
      });
    }

    leave.status = "Approved";
    leave.hrComment = req.body.hrComment || "";

    await leave.save();

    try {
      await notifyLeaveDecision(leave, "approved");
    } catch (emailError) {
      console.error("Leave approval email failed:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve leave",
      error: error.message,
    });
  }
};

// HR - Reject Leave
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Leave is already ${leave.status}`,
      });
    }

    leave.status = "Rejected";
    leave.hrComment = req.body.hrComment || "";

    await leave.save();

    try {
      await notifyLeaveDecision(leave, "rejected");
    } catch (emailError) {
      console.error("Leave rejection email failed:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject leave",
      error: error.message,
    });
  }
};

const notifyLeaveDecision = async (leave, decision) => {
  const populatedLeave = await Leave.findById(leave._id).populate(
    "employeeId",
    "name email",
  );
  if (!populatedLeave?.employeeId?.email) return;

  await sendEmail({
    to: populatedLeave.employeeId.email,
    subject: `Leave request ${decision}`,
    text: `Hello ${populatedLeave.employeeId.name}, your ${populatedLeave.leaveType} leave request from ${new Date(populatedLeave.startDate).toLocaleDateString()} to ${new Date(populatedLeave.endDate).toLocaleDateString()} was ${decision}.`,
  });
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
};
