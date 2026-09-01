const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    medicineName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    pricePerUnit: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
