import { useEffect, useState } from "react";
import axios from "axios";
import "./MedicineList.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function MedicineList({ onChanged }) {
  const [medicines, setMedicines] = useState([]);
  const [buyQty, setBuyQty] = useState({});
  const [restockQty, setRestockQty] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${API}/api/medicines`);
      setMedicines(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const deleteMedicine = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await axios.delete(`${API}/api/medicines/${id}`);
      fetchMedicines();
      onChanged?.();
    } catch (error) { alert(error.response?.data?.error || "Delete failed"); }
  };

  const handleUpdate = async (med) => {
    const updatedName = prompt("Enter updated medicine name", med.name);
    if (!updatedName) return;
    try {
      await axios.put(`${API}/api/medicines/${med._id}`, { ...med, name: updatedName });
      fetchMedicines();
      onChanged?.();
    } catch (error) { alert(error.response?.data?.error || "Update failed"); }
  };

  const sellMedicine = async (med) => {
    const quantity = Number(buyQty[med._id] || 0);
    if (!quantity) return alert("Enter a purchase quantity");
    try {
      const res = await axios.post(`${API}/api/sales`, { medicineId: med._id, quantity });
      alert(`Sale successful. Remaining stock: ${res.data.medicine.quantity}`);
      setBuyQty({ ...buyQty, [med._id]: "" });
      fetchMedicines();
      onChanged?.();
    } catch (error) { alert(error.response?.data?.message || "Sale failed"); }
  };

  const restockMedicine = async (med) => {
    const quantity = Number(restockQty[med._id] || 0);
    if (!quantity) return alert("Enter a restock quantity");
    try {
      const res = await axios.post(`${API}/api/restocks`, { medicineId: med._id, quantity });
      alert(`Stock updated: ${res.data.medicine.quantity}`);
      setRestockQty({ ...restockQty, [med._id]: "" });
      fetchMedicines();
      onChanged?.();
    } catch (error) { alert(error.response?.data?.message || "Restock failed"); }
  };

  const status = (med) => {
    const expired = new Date(med.expiryDate) < new Date();
    if (expired) return <span className="badge expired">Expired</span>;
    if (med.quantity === 0) return <span className="badge out">Out of Stock</span>;
    if (med.quantity <= 5) return <span className="badge low">Low Stock</span>;
    return <span className="badge in">In Stock</span>;
  };

  if (loading) return <p>Loading medicines...</p>;

  return (
    <div className="stock-section">
      <h2>Medicine Stock</h2>
      <div className="medicine-list">
        {medicines.length === 0 && <p>No medicines added yet.</p>}
        {medicines.map((med) => {
          const expired = new Date(med.expiryDate) < new Date();
          const unavailable = med.quantity === 0 || expired;
          return (
            <div className="card" key={med._id}>
              <div className="card-header"><h3>{med.name}</h3>{status(med)}</div>
              <p><strong>Category:</strong> {med.category || "—"}</p>
              <p><strong>Price:</strong> ₹{med.price}</p>
              <p><strong>Quantity:</strong> {med.quantity}</p>
              <p><strong>Expiry:</strong> {new Date(med.expiryDate).toLocaleDateString()}</p>

              <div className="action-box">
                <strong>Sell Medicine</strong>
                <div className="inline-actions">
                  <input min="1" max={med.quantity} type="number" placeholder="Qty" value={buyQty[med._id] || ""} onChange={(e) => setBuyQty({ ...buyQty, [med._id]: e.target.value })} disabled={unavailable} />
                  <button className="sell-btn" disabled={unavailable} onClick={() => sellMedicine(med)}>Sell</button>
                </div>
                {med.quantity === 0 && <small>Restock before selling.</small>}
                {expired && <small>Expired medicines cannot be sold.</small>}
              </div>

              <div className="action-box">
                <strong>Restock</strong>
                <div className="inline-actions">
                  <input min="1" type="number" placeholder="Add Qty" value={restockQty[med._id] || ""} onChange={(e) => setRestockQty({ ...restockQty, [med._id]: e.target.value })} />
                  <button className="restock-btn" onClick={() => restockMedicine(med)}>Add Stock</button>
                </div>
              </div>

              <div className="card-buttons">
                <button className="delete-btn" onClick={() => deleteMedicine(med._id)}>Delete</button>
                <button className="update-btn" onClick={() => handleUpdate(med)}>Update</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MedicineList;
