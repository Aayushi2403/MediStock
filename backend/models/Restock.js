const mongoose = require("mongoose");

const restockSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
    medicineName: { type: String, required: true },
    quantityAdded: { type: Number, required: true, min: 1 },
    previousQuantity: { type: Number, required: true, min: 0 },
    newQuantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restock", restockSchema);
