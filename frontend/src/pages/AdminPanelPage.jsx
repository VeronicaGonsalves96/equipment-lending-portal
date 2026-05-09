import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AdminPanelPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    condition: "",
    quantity: 1,
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const data = await apiFetch("/equipment");
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await apiFetch("/equipment", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
        }),
      });
      setMessage("Equipment added.");
      setForm({ name: "", category: "", condition: "", quantity: 1 });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await apiFetch(`/equipment/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="grid grid-2">
        <div className="card">
          <h2>Add equipment</h2>
          {message && <p style={{ color: "#067647" }}>{message}</p>}
          {error && <p style={{ color: "#b42318" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="condition">Condition</label>
              <input
                id="condition"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
            <button className="button" type="submit">
              Add item
            </button>
          </form>
        </div>
        <div className="card">
          <h2>Inventory</h2>
          <div className="grid">
            {items.map((item) => (
              <div key={item.id} className="card" style={{ padding: 16 }}>
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <p>Available: {item.available_quantity}</p>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            ))}
            {!items.length && <p>No items yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
