const Employee = require("../models/Employee");
const User = require("../models/User");

const getPagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(query.limit, 10) || 10, 1),
    100,
  );

  return { page, limit, skip: (page - 1) * limit };
};

// Add Employee
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      designation,
      role = "EMPLOYEE",
      dateOfJoining,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !department ||
      !designation ||
      !role ||
      !dateOfJoining ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!["HR", "EMPLOYEE"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const bcrypt = require("bcryptjs");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const employee = await Employee.create({
      userId: user._id,
      name,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add employee",
      error: error.message,
    });
  }
};

// Get Employees
const getEmployees = async (req, res) => {
  try {
    const { name, email, department, designation, search } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    let query = {};

    if (search) {
      query.$or = ["name", "email", "phone", "department", "designation"].map(
        (field) => ({ [field]: { $regex: search, $options: "i" } }),
      );
    }

    for (const [field, value] of Object.entries({
      name,
      email,
      department,
      designation,
    })) {
      if (value) query[field] = { $regex: value, $options: "i" };
    }

    const [employees, total] = await Promise.all([
      Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Employee.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

const uploadMyPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Photo is required" });
    }

    const employee = await Employee.findOneAndUpdate(
      { userId: req.user._id },
      { photoUrl: `/uploads/${req.file.filename}` },
      { new: true },
    );

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee profile not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to upload photo",
        error: error.message,
      });
  }
};

// Get Single Employee
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    // Keep User basic information synchronized
    await User.findByIdAndUpdate(employee.userId, {
      name: updatedEmployee.name,
      email: updatedEmployee.email,
    });

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  uploadMyPhoto,
};
