const Medicine = require("../models/Medicine");
const Sale = require("../models/Sale");

exports.getDashboard = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const sales = await Sale.find();
    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const totalStock = medicines.reduce((sum, m) => sum + m.quantity, 0);
    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);

    res.json({
      totalMedicines: medicines.length,
      totalStock,
      lowStock: medicines.filter((m) => m.quantity > 0 && m.quantity <= 5).length,
      outOfStock: medicines.filter((m) => m.quantity === 0).length,
      expired: medicines.filter((m) => new Date(m.expiryDate) < now).length,
      expiringSoon: medicines.filter((m) => new Date(m.expiryDate) >= now && new Date(m.expiryDate) <= inSevenDays).length,
      totalSales,
      totalOrders: sales.length,
      recentSales: sales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
