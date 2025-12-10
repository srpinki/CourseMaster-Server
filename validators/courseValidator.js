const { z } = require("zod");

// Lesson
const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/, "Duration must be mm:ss"),
  videoUrl: z.string().url("Invalid video URL"),
});

// Module
const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  lessons: z.array(lessonSchema).min(1, "At least 1 lesson required"),
});

// Batch
const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
});

// Course
const courseSchema = z.object({
  title: z.string().min(1, "Course title required"),
  description: z.string().min(10, "Description too short"),
  instructor: z.string().min(1, "Instructor required"),
  price: z.number().nonnegative("Price cannot be negative"),
  category: z.string().min(1, "Category required"),
  thumbnail: z.string().url("Invalid thumbnail URL"),
  videoUrl: z.string().url("Invalid video URL"),
  syllabus: z.array(z.string().min(1)).min(1, "Add at least one topic"),
  tags: z.array(z.string().min(1)).min(1),
  batches: z.array(batchSchema).min(1, "Add at least one batch"),
  modules: z.array(moduleSchema).min(1, "Add at least one module"),
});

module.exports = { courseSchema };
