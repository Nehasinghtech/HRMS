import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (user?.role !== "EMPLOYEE") return;

    api
      .get("/dashboard/employee")
      .then((response) =>
        setPhotoUrl(
          response.data.dashboard?.personalInformation?.photoUrl || "",
        ),
      )
      .catch(() => setPhotoUrl(""));
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="navbar">
      <div>
        <h3>{user?.role === "HR" ? "HR Dashboard" : "Employee Dashboard"}</h3>
      </div>

      <div className="navbar-user">
        {photoUrl && (
          <img
            className="profile-avatar"
            src={`${api.defaults.baseURL.replace("/api", "")}${photoUrl}`}
            alt="Profile"
          />
        )}
        <span>{user?.name}</span>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
