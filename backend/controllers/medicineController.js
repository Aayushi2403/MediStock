const Medicine = require("../models/Medicine");

// @desc Add Medicine
exports.addMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const saved = await medicine.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get All Medicines
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get Single Medicine
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ msg: "Not Found" });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update Medicine
exports.updateMedicine = async (req, res) => {
  try {
    if (req.body.quantity !== undefined && Number(req.body.quantity) < 0) {
      return res.status(400).json({ error: "Quantity cannot be negative" });
    }
    if (req.body.price !== undefined && Number(req.body.price) < 0) {
      return res.status(400).json({ error: "Price cannot be negative" });
    }

    const updated = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Medicine not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Delete Medicine
exports.deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};