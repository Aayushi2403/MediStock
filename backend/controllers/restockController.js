const Medicine = require("../models/Medicine");
const Restock = require("../models/Restock");

exports.restockMedicine = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const added = Number(quantity);

    if (!medicineId || !Number.isInteger(added) || added <= 0) {
      return res.status(400).json({ message: "Medicine and a valid restock quantity are required" });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    const previousQuantity = medicine.quantity;
    medicine.quantity += added;
    await medicine.save();

    const restock = await Restock.create({
      medicine: medicine._id,
      medicineName: medicine.name,
      quantityAdded: added,
      previousQuantity,
      newQuantity: medicine.quantity,
    });

    res.status(201).json({ restock, medicine, message: "Stock added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestocks = async (req, res) => {
  try {
    const restocks = await Restock.find().sort({ createdAt: -1 });
    res.json(restocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
