import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

const EquipmentListPage = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/equipment")
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message));
  }, []);

  const filtered = items.filter((item) => {
    if (filter === "available") {
      return item.available_quantity > 0;
    }
    return true;
  });

  return (
    <div className="page">
      <div className="card">
        <h2>Equipment</h2>
        <p>Check availability and request what you need.</p>
        {error && <p style={{ color: "#b42318" }}>{error}</p>}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button
            className={`button ${filter === "all" ? "" : "secondary"}`}
            onClick={() => setFilter("all")}
            type="button"
          >
            All
          </button>
          <button
            className={`button ${filter === "available" ? "" : "secondary"}`}
            onClick={() => setFilter("available")}
            type="button"
          >
            Available
          </button>
        </div>
        <div className="grid grid-2">
          {filtered.map((item) => (
            <div key={item.id} className="card" style={{ padding: 16 }}>
              <h3>{item.name}</h3>
              <p>
                <span className="tag">{item.category}</span>
              </p>
              <p style={{ marginTop: 8 }}>Condition: {item.condition}</p>
              <p>Available: {item.available_quantity}</p>
              <Link to={`/equipment/${item.id}`} className="button">
                View details
              </Link>
            </div>
          ))}
          {!filtered.length && <p>No equipment found.</p>}
        </div>
      </div>
    </div>
  );
};

export default EquipmentListPage;
