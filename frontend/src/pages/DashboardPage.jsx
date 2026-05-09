import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="grid grid-2">
        <div className="card">
          <h2>Hi {user?.name || "there"}!</h2>
          <p>
            Explore available equipment, submit borrowing requests, and track
            approvals.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Link to="/equipment" className="button">
              Browse equipment
            </Link>
            <Link to="/borrow" className="button secondary">
              My requests
            </Link>
          </div>
        </div>
        <div className="card">
          <h3>Role</h3>
          <p className="tag">{user?.role || "guest"}</p>
          <p style={{ marginTop: 12 }}>
            {user?.role === "admin"
              ? "Admins can manage inventory and approvals."
              : "Request what you need for labs, sports, or projects."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
