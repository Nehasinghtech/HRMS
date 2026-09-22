import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    dateOfJoining: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard/employee");

      const employee = response.data.dashboard?.personalInformation;

      setProfile(employee);

      setFormData({
        name: employee?.name || "",
        email: employee?.email || "",
        phone: employee?.phone || "",
        department: employee?.department || "",
        designation: employee?.designation || "",
        dateOfJoining: employee?.dateOfJoining
          ? employee.dateOfJoining.split("T")[0]
          : "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.put(`/employees/${profile._id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        dateOfJoining: formData.dateOfJoining,
      });

      alert("Profile updated successfully");

      fetchProfile();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("Please fill all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      setPasswordLoading(true);
      setError("");

      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!photoFile) return;

    const data = new FormData();
    data.append("photo", photoFile);

    try {
      setPhotoLoading(true);
      setError("");
      await api.post("/employees/profile/photo", data);
      setPhotoFile(null);
      await fetchProfile();
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || "Failed to upload photo");
    } finally {
      setPhotoLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Navbar />

          <div className="page-content">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-content">
          <div className="employee-heading">
            <div>
              <h1>My Profile</h1>
              <p>View and update your profile information</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Profile Information */}
          <div className="form-card">
            <h2>Personal Information</h2>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              {profile?.photoUrl ? (
                <img
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800"
                  src={`${api.defaults.baseURL.replace("/api", "")}${profile.photoUrl}`}
                  alt="Profile"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500 dark:bg-slate-800">
                  No photo
                </div>
              )}

              <form
                onSubmit={handlePhotoUpload}
                className="flex flex-wrap items-center gap-3"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setPhotoFile(event.target.files?.[0] || null)
                  }
                />
                <button
                  type="submit"
                  className="secondary-button"
                  disabled={!photoFile || photoLoading}
                >
                  {photoLoading ? "Uploading..." : "Upload photo"}
                </button>
              </form>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>

                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Date of Joining</label>

                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="form-card">
            <h2>Change Password</h2>

            <form onSubmit={handlePasswordUpdate}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Password</label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>

                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
