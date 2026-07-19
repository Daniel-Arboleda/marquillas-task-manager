import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ROUTE_TITLES = {
  "/app": "Dashboard",
  "/app/tasks": "Tasks",
  "/app/users": "Users"
};

const ROLE_LABELS = {
  admin: "Administrator",
  member: "Member"
};

function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");
}

function getRoleLabel(role = "") {
  return ROLE_LABELS[role] ?? role;
}

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const title = ROUTE_TITLES[pathname] ?? "Dashboard";
  const userName = user?.name ?? "";
  const userRole = getRoleLabel(user?.role);
  const initials = getInitials(userName);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu" type="button" onClick={onMenuClick} aria-label="Open navigation">
          ☰
        </button>
        <div className="topbar-heading">
          <h1 className="topbar-title">{title}</h1>
        </div>
      </div>
      <div className="topbar-user">
        <div className="topbar-user-info">
          <span className="topbar-user-name">{userName}</span>
          <span className="topbar-user-role">{userRole}</span>
        </div>
        <div className="topbar-avatar" aria-hidden="true">
          {initials}
        </div>
        <button className="topbar-logout" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

TopBar.propTypes = {
  onMenuClick: PropTypes.func
};

TopBar.defaultProps = {
  onMenuClick: () => {}
};