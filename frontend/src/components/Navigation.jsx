import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navigation.css";

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-brand">
        <Link to="/">Lending Portal</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/equipment">Equipment</Link>
            <Link to="/borrow">My Requests</Link>
            {(user.role === "admin" || user.role === "staff") && (
              <Link to="/admin">Admin</Link>
            )}
            <button className="nav-button" onClick={logout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
