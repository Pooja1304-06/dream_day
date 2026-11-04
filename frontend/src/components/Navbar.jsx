import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, UserCircle, LogOut, Shield, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
  <img
    src="/img1.jpeg"
    alt=""
    className="brand-logo"
  />

  <span className="brand-name">Dream Day</span>
</Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/events">Events</NavLink>
        
        
        <NavLink to="/ai-planner"> <Sparkles size={16} /> AI Planner </NavLink>
        <NavLink to="/venue-visualizer">Venue Studio✨</NavLink>
        <NavLink to="/vendor-hub">Vendor Hub</NavLink>
        {user && <NavLink to="/my-events">My Events</NavLink>}
        {user?.role === "admin" && (
          <NavLink to="/admin"><Shield size={16} /> Admin</NavLink>
        )}
        <NavLink to="/about">About</NavLink>
      </nav>
      

      <div className="nav-actions">
        <Search size={19} />
        {user ? (
          <>
            <Link to="/profile" className="avatar-btn"><UserCircle size={25} /></Link>
            <button className="icon-btn" onClick={handleLogout} title="Logout"><LogOut size={18} /></button>
          </>
        ) : (
          <Link className="outline-btn small" to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
