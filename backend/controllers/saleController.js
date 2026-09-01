const Medicine = require("../models/Medicine");
const Sale = require("../models/Sale");

exports.createSale = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const requestedQuantity = Number(quantity);

    if (!medicineId || !Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
      return res.status(400).json({ message: "Medicine and a valid quantity are required" });
    }

    // Atomic stock check + decrement prevents selling more than the available stock.
    const medicine = await Medicine.findOneAndUpdate(
      { _id: medicineId, quantity: { $gte: requestedQuantity }, expiryDate: { $gte: new Date() } },
      { $inc: { quantity: -requestedQuantity } },
      { new: true }
    );

    if (!medicine) {
      const existing = await Medicine.findById(medicineId);
      if (!existing) return res.status(404).json({ message: "Medicine not found" });
      if (new Date(existing.expiryDate) < new Date()) {
        return res.status(400).json({ message: "Expired medicine cannot be sold" });
      }
      return res.status(400).json({
        message: `Not enough stock. Only ${existing.quantity} unit(s) available.`,
      });
    }

    const totalAmount = medicine.price * requestedQuantity;
    const sale = await Sale.create({
      medicine: medicine._id,
      medicineName: medicine.name,
      quantity: requestedQuantity,
      pricePerUnit: medicine.price,
      totalAmount,
    });

    res.status(201).json({ sale, medicine, message: "Sale completed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
