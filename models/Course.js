const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true }, // e.g. mm:ss
  videoUrl: { type: String, required: true },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    syllabus: [{ type: String, required: true }],
    price: { type: Number, default: 0 },
    category: { type: String, required: true },
    tags: [{ type: String }],
    thumbnail: { type: String },
    videoUrl: { type: String },
    batches: [batchSchema],
    modules: [moduleSchema], // Added modules & lessons
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
