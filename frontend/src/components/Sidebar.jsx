import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const DashboardIcon = () => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 3h8v8H3zm10 0h8v5h-8zM3 13h8v8H3zm10 7h8v-12h-8z" fill="currentColor" />
  </svg>
);

const TasksIcon = () => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 4h11v2H9zm0 7h11v2H9zm0 7h11v2H9zM4 5h2v2H4zm0 7h2v2H4zm0 7h2v2H4z" fill="currentColor" />
  </svg>
);

const UsersIcon = () => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.31 0-6 1.79-6 4v2h12v-2c0-2.21-2.69-4-6-4zm7-5a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-.77 0-1.49.12-2.15.34A5.98 5.98 0 0 1 20 16v2h2v-2c0-1.83-1.3-3.4-3-3.9z" fill="currentColor" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 17l1.41-1.41L8.83 13H20v-2H8.83l2.58-2.59L10 7l-5 5zm-5 3h7v-2H5V6h7V4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" fill="currentColor" />
  </svg>
);

const Logo = () => (
  <svg className="sidebar-logo-icon" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 3 4 9v14l12 6 12-6V9L16 3zm0 3.2 8.8 4.4L16 15l-8.8-4.4L16 6.2zm-10 6.9 9 4.5v8.2l-9-4.5zm20 0v8.2l-9 4.5v-8.2z" fill="currentColor" />
  </svg>
);

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => onClose();

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={closeMenu} />}
      <aside className={`sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Logo />
            <span className="sidebar-title">Task Manager</span>
          </div>
          <button className="sidebar-toggle" type="button" onClick={closeMenu} aria-label="Close navigation">
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/app" end onClick={closeMenu}>
                <DashboardIcon />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/app/tasks" onClick={closeMenu}>
                <TasksIcon />
                <span>Tasks</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/app/users" onClick={closeMenu}>
                <UsersIcon />
                <span>Users</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-logout" type="button" onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

Sidebar.defaultProps = {
  isOpen: false,
  onClose: () => {}
};