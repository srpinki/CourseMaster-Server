// models/Enrollment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  paymentIntent: { type: String },
  amount_total: { type: Number },
  currency: { type: String, default: "usd" },
  status: { type: String, enum: ["active", "refunded", "cancelled"], default: "active" },
  purchasedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
