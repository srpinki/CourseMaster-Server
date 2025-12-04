const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    syllabus: [{ type: String }],
    price: { type: Number, default: 0 },
    category: { type: String },
    tags: [{ type: String }],
    thumbnail: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
