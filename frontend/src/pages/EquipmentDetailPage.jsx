import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [form, setForm] = useState({ startDate: "", endDate: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/equipment/${id}`)
      .then((data) => setItem(data.item))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleRequest = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await apiFetch("/borrow", {
        method: "POST",
        body: JSON.stringify({
          equipmentId: id,
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      });
      setMessage("Request submitted for approval.");
      setForm({ startDate: "", endDate: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!item) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h2>{item.name}</h2>
        <p>
          <span className="tag">{item.category}</span>
        </p>
        <p>Condition: {item.condition}</p>
        <p>Available: {item.available_quantity}</p>

        <form onSubmit={handleRequest} style={{ marginTop: 20 }}>
          <h3>Request this item</h3>
          {message && <p style={{ color: "#067647" }}>{message}</p>}
          {error && <p style={{ color: "#b42318" }}>{error}</p>}
          <div className="field">
            <label htmlFor="startDate">Start date</label>
            <input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
              required
            />
          </div>
          <div className="field">
            <label htmlFor="endDate">End date</label>
            <input
              id="endDate"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>
          <button className="button" type="submit">
            Submit request
          </button>
        </form>
      </div>
    </div>
  );
};

export default EquipmentDetailPage;
