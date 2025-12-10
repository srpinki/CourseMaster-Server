const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  module: { type: String, required: true },
  submission: { type: String }, // link or text
  score: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
