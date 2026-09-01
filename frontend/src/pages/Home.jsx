import { useEffect, useState } from "react";
import axios from "axios";
import AddMedicine from "../components/AddMedicine/AddMedicine";
import MedicineList from "../components/MedicineList/MedicineList";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Home() {
  const [refresh, setRefresh] = useState(0);
  const [dashboard, setDashboard] = useState(null);
  const [sales, setSales] = useState([]);
  const [restocks, setRestocks] = useState([]);

  const loadData = async () => {
    try {
      const [dashRes, salesRes, restockRes] = await Promise.all([
        axios.get(`${API}/api/dashboard`),
        axios.get(`${API}/api/sales`),
        axios.get(`${API}/api/restocks`),
      ]);
      setDashboard(dashRes.data);
      setSales(salesRes.data);
      setRestocks(restockRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadData(); }, [refresh]);

  const handleChanged = () => setRefresh((value) => value + 1);

  return (
    <div className="home">
      <AddMedicine onAdded={handleChanged} />

      {dashboard && (
        <section className="dashboard">
          <h2>Dashboard</h2>
          <div className="stats-grid">
            <div className="stat-card"><span>Total Medicines</span><strong>{dashboard.totalMedicines}</strong></div>
            <div className="stat-card"><span>Total Stock</span><strong>{dashboard.totalStock}</strong></div>
            <div className="stat-card warning"><span>Low Stock</span><strong>{dashboard.lowStock}</strong></div>
            <div className="stat-card danger"><span>Out of Stock</span><strong>{dashboard.outOfStock}</strong></div>
            <div className="stat-card danger"><span>Expired</span><strong>{dashboard.expired}</strong></div>
            <div className="stat-card"><span>Expiring ≤ 7 days</span><strong>{dashboard.expiringSoon}</strong></div>
            <div className="stat-card success"><span>Total Sales</span><strong>₹{dashboard.totalSales.toFixed(2)}</strong></div>
            <div className="stat-card"><span>Orders</span><strong>{dashboard.totalOrders}</strong></div>
          </div>
        </section>
      )}

      <MedicineList onChanged={handleChanged} />

      <section className="history-grid">
        <div className="history-card">
          <h2>Recent Sales</h2>
          {sales.length === 0 ? <p>No sales yet.</p> : sales.slice(0, 8).map((sale) => (
            <div className="history-row" key={sale._id}>
              <span>{sale.medicineName} × {sale.quantity}</span>
              <strong>₹{sale.totalAmount.toFixed(2)}</strong>
            </div>
          ))}
        </div>
        <div className="history-card">
          <h2>Recent Restocks</h2>
          {restocks.length === 0 ? <p>No restocks yet.</p> : restocks.slice(0, 8).map((item) => (
            <div className="history-row" key={item._id}>
              <span>{item.medicineName} +{item.quantityAdded}</span>
              <strong>{item.previousQuantity} → {item.newQuantity}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
