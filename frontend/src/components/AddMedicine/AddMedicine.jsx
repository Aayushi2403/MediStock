import { useState } from "react";
import axios from "axios";
import "./AddMedicine.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AddMedicine({ onAdded }) {
  const empty = { name: "", category: "", price: "", quantity: "", expiryDate: "" };
  const [medicine, setMedicine] = useState(empty);

  const handleChange = (e) => setMedicine({ ...medicine, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/medicines`, {
        ...medicine,
        price: Number(medicine.price),
        quantity: Number(medicine.quantity),
      });
      alert("Medicine Added");
      setMedicine(empty);
      onAdded?.();
    } catch (error) {
      alert(error.response?.data?.error || "Could not add medicine");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Medicine</h2>
      <form onSubmit={handleSubmit}>
        <input required type="text" placeholder="Medicine Name" name="name" value={medicine.name} onChange={handleChange} />
        <input type="text" placeholder="Category" name="category" value={medicine.category} onChange={handleChange} />
        <input required min="0" step="0.01" type="number" placeholder="Price" name="price" value={medicine.price} onChange={handleChange} />
        <input required min="0" type="number" placeholder="Quantity" name="quantity" value={medicine.quantity} onChange={handleChange} />
        <input required type="date" name="expiryDate" value={medicine.expiryDate} onChange={handleChange} />
        <button type="submit">Add Medicine</button>
      </form>
    </div>
  );
}

export default AddMedicine;
