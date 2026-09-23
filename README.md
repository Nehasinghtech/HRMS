# HRMS - Human Resource Management System

## Project Overview

HRMS (Human Resource Management System) is a full-stack web application developed to manage employees, attendance, leave requests and employee profiles.

The application has two user roles:

- HR
- Employee

Each role has separate access and permissions.

---

## Technology Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- CORS

### Database

- MongoDB Atlas

---

# Features

## 1. Authentication

The application provides secure authentication using:

- Login
- Logout
- JWT authentication
- Password hashing using bcrypt
- Protected routes
- Role-based access control

There is no public employee registration.

Only HR can create employees and provide their login credentials.

### Login Flow

```text
Login
  |
  +---- HR
  |      |
  |      └── HR Dashboard
  |
  └---- Employee
         |
         └── Employee Dashboard
```

---

# 2. HR Portal

## HR Dashboard

HR can view:

- Total Employees
- Employees Present Today
- Employees on Leave
- Recent Attendance Activity

---

## Employee Management

HR can:

- Add Employee
- Edit Employee
- View Employee List
- Search Employees

Employee information includes:

- Name
- Email
- Phone Number
- Department
- Designation
- Date of Joining

### Add Employee Flow

```text
HR Login
   ↓
Employee Management
   ↓
Add Employee
   ↓
Enter Employee Details
   ↓
Create Employee
   ↓
Employee Credentials
```

Employee credentials are created by HR and provided to the employee for login.

---

# 3. Attendance Management

## HR Attendance

HR can:

- View attendance records
- Filter attendance by employee
- Filter attendance by date
- View check-in time
- View check-out time
- View attendance status

---

# 4. Employee Attendance

Employees can:

- Check In
- Check Out
- View Attendance History

### Attendance Flow

```text
Employee Login
      ↓
My Attendance
      ↓
Check In
      ↓
Check Out
      ↓
Attendance History
```

The system prevents duplicate check-in for the same day.

---

# 5. Leave Management

## HR Leave Management

HR can:

- View leave requests
- Approve leave requests
- Reject leave requests
- Add HR comments

### Leave Workflow

```text
Employee
   ↓
Apply Leave
   ↓
Pending
   ↓
HR Review
   ↓
Approve / Reject
   ↓
Employee sees updated status
```

---

# 6. Employee Leave Management

Employees can:

- Apply for Leave
- Select Leave Type
- Select Start Date
- Select End Date
- Enter Leave Reason
- View Leave Status
- View Leave History
- View HR Comments

### Leave Types

- Casual Leave
- Sick Leave
- Paid Leave
- Other

### Leave Status

- Pending
- Approved
- Rejected

---

# 7. Employee Dashboard

Employee dashboard displays:

### Personal Information

- Name
- Email
- Phone
- Department
- Designation
- Date of Joining

### Today's Attendance

- Check In
- Check Out
- Attendance Status

### Leave Information

- Approved Leaves
- Recent Leave History

---

# 8. Employee Profile

Employees can:

- View Profile
- Edit Basic Personal Information
- Change Password

Profile information includes:

- Name
- Email
- Phone
- Department
- Designation
- Date of Joining

---

# 9. Change Password

Employee can change password using:

```text
Current Password
New Password
Confirm New Password
```

The new password is hashed using bcrypt before being stored in MongoDB.

---

# 10. Role-Based Access

The application has two roles:

```text
HR
EMPLOYEE
```

### HR Routes

```text
/hr/dashboard
/hr/employees
/hr/employees/add
/hr/employees/edit/:id
/hr/attendance
/hr/leaves
```

### Employee Routes

```text
/employee/dashboard
/employee/attendance
/employee/apply-leave
/employee/leaves
/employee/profile
```

Employees cannot access HR modules.

HR-only backend APIs are protected using JWT authentication and role middleware.

---

# 11. Backend Architecture

The backend follows MVC architecture.

```text
Frontend
   ↓
Axios API
   ↓
Express Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Models
   ↓
MongoDB Atlas
```

---

# 12. Backend Folder Structure

```text
server/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── employeeController.js
│   ├── attendanceController.js
│   ├── leaveController.js
│   └── dashboardController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Employee.js
│   ├── Attendance.js
│   └── Leave.js
│
├── routes/
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   ├── attendanceRoutes.js
│   ├── leaveRoutes.js
│   └── dashboardRoutes.js
│
├── utils/
│   └── generateToken.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

# 13. Frontend Folder Structure

```text
client/
│
├── src/
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── pages/
│   │
│   ├── auth/
│   │   └── Login.jsx
│   │
│   ├── hr/
│   │   ├── HRDashboard.jsx
│   │   ├── EmployeeList.jsx
│   │   ├── AddEmployee.jsx
│   │   ├── EditEmployee.jsx
│   │   ├── Attendance.jsx
│   │   └── LeaveRequests.jsx
│   │
│   └── employee/
│       ├── EmployeeDashboard.jsx
│       ├── MyAttendance.jsx
│       ├── ApplyLeave.jsx
│       ├── MyLeaves.jsx
│       └── Profile.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 14. Database Models

## User

```text
name
email
password
role
```

Role values:

```text
HR
EMPLOYEE
```

---

## Employee

```text
userId
name
email
phone
department
designation
dateOfJoining
```

---

## Attendance

```text
employeeId
date
checkIn
checkOut
status
```

Status values:

```text
Present
Absent
Half Day
```

---

## Leave

```text
employeeId
leaveType
startDate
endDate
reason
status
hrComment
```

Status values:

```text
Pending
Approved
Rejected
```

---

# 15. Default Login Credentials

Use these demo accounts for testing the application:

## HR Login

```text
Email: hr@hrms.com
Password: admin123
```

## Employee Login

```text
Email: rahul@hrms.com
Password: rahul123
```

Use the HR account to review employee activity, leave requests, and dashboard data.

---

# 16. API Endpoints

## Authentication

### Login

```http
POST /api/auth/login
```

### Profile

```http
GET /api/auth/profile
```

### Change Password

```http
PUT /api/auth/change-password
```

---

## Employees

### Add Employee

```http
POST /api/employees
```

HR access only.

### Get Employees

```http
GET /api/employees
```

### Get Employee

```http
GET /api/employees/:id
```

### Update Employee

```http
PUT /api/employees/:id
```

---

## Attendance

### Check In

```http
POST /api/attendance/check-in
```

### Check Out

```http
POST /api/attendance/check-out
```

### My Attendance

```http
GET /api/attendance/my
```

### HR Attendance

```http
GET /api/attendance
```

Supported filters:

```text
employeeId
date
```

---

## Leave

### Apply Leave

```http
POST /api/leaves
```

### My Leaves

```http
GET /api/leaves/my
```

### HR Leave Requests

```http
GET /api/leaves
```

### Approve Leave

```http
PUT /api/leaves/:id/approve
```

### Reject Leave

```http
PUT /api/leaves/:id/reject
```

---

## Dashboard

### HR Dashboard

```http
GET /api/dashboard/hr
```

### Employee Dashboard

```http
GET /api/dashboard/employee
```

---

# 16. Authentication Security

The application uses:

- JWT for authentication
- bcryptjs for password hashing
- JWT middleware for protected APIs
- Role middleware for authorization
- Protected React routes
- Environment variables for sensitive configuration

Passwords are never returned as plain text.

---

# 17. Error Handling

The application handles:

- Invalid login credentials
- Missing authentication token
- Invalid JWT
- Expired JWT
- Unauthorized role access
- Duplicate employee/email
- Missing required fields
- Invalid leave dates
- Duplicate attendance
- Invalid check-out
- User not found
- Employee not found
- Leave not found

---

# 18. MongoDB Atlas

MongoDB Atlas is used as the cloud database.

The application connects to MongoDB using Mongoose.

Connection configuration is stored in:

```text
server/.env
```

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
```

The `.env` file is not committed to GitHub.

---

# 19. Installation

## Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL

cd hrms
```

---

## Backend Installation

```bash
cd server

npm install
```

Create:

```text
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Start backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Frontend Installation

Open another terminal:

```bash
cd client

npm install
```

Start frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 20. Complete Application Flow

## HR

text
HR Login
↓
HR Dashboard
↓
Employee Management
↓
Add Employee
↓
Employee Credentials
↓
Attendance Management
↓
Leave Management
↓
Approve / Reject Leave

## Employee

text
Employee Login
↓
Employee Dashboard
↓
My Attendance
↓
Check In / Check Out
↓
Apply Leave
↓
My Leaves
↓
Profile
↓
Change Password

````

---

## AI Usage Disclosure

AI tools were used during the development of this project for:
- Understanding and clarifying technical requirements.
- Getting guidance on implementation approaches.
- Debugging and resolving development issues.
- Reviewing and improving code where required.
- Preparing project documentation and README content.

The project requirements, implementation decisions, integration, testing, and final review were handled by me.

# 21. Testing

## HR Testing

- HR login
- HR dashboard
- Add employee
- Edit employee
- View employee list
- Search employee
- View attendance
- Filter attendance
- View leave requests
- Approve leave
- Reject leave

## Employee Testing

- Employee login
- Employee dashboard
- Check in
- Check out
- Attendance history
- Apply leave
- Leave status
- Leave history
- View profile
- Edit profile
- Change password
- Logout

---

# 22. Project Highlights

The main highlights of the project are:

- Full-stack MERN application
- JWT authentication
- bcrypt password hashing
- Role-based authorization
- MVC backend architecture
- MongoDB Atlas database
- REST APIs
- HR portal
- Employee portal
- Attendance management
- Leave management
- Employee profile management
- Protected routes
- API error handling
- Search and filtering

# 23. Additional Features Implemented

Responsive Design – The application is responsive and works across desktop, tablet, and mobile screens.
Dark Mode – Users can switch between light and dark themes.
Profile Photo Upload – Employees can upload and manage their profile photos.
Email Notifications – Email notifications are integrated for relevant HRMS activities.
Pagination – Pagination is implemented for large data lists.
Search and Filtering – Employee, attendance, and leave records can be searched and filtered.
Multiple Filters – Multiple filtering conditions can be applied simultaneously.
Deployment – The application is configured for deployment in a production environment.

# 26. Author

**Neha Singh**

Full Stack Developer

### Technologies

```text
React.js
Node.js
Express.js
MongoDB
JWT
REST APIs
````

---

## Conclusion

This HRMS project demonstrates a complete full-stack workflow for managing employees, attendance, leave requests and employee profiles with secure authentication and role-based access control.
