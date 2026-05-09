import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

const BorrowRequestPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await apiFetch(user?.role === "student" ? "/borrow/mine" : "/borrow");
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  const handleAction = async (id, action) => {
    try {
      await apiFetch(`/borrow/${id}/${action}`, { method: "POST" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>{user?.role === "student" ? "My requests" : "Borrow requests"}</h2>
        {error && <p style={{ color: "#b42318" }}>{error}</p>}
        <div className="grid">
          {requests.map((req) => (
            <div key={req.id} className="card" style={{ padding: 16 }}>
              <h3>{req.equipment_name}</h3>
              {req.user_name && <p>Requested by {req.user_name}</p>}
              <p>
                {req.start_date} to {req.end_date}
              </p>
              <p>Status: {req.status}</p>
              {(user?.role === "admin" || user?.role === "staff") &&
                req.status === "pending" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      className="button"
                      type="button"
                      onClick={() => handleAction(req.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleAction(req.id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              {(user?.role === "admin" || user?.role === "staff") &&
                req.status === "approved" && (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => handleAction(req.id, "return")}
                  >
                    Mark returned
                  </button>
                )}
            </div>
          ))}
          {!requests.length && <p>No requests yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default BorrowRequestPage;
