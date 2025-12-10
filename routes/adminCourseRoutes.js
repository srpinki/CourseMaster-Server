const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");
const Course = require("../models/Course");
const { courseSchema } = require("../validators/courseValidator");
const { z } = require("zod");

// Create course
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try { 
    const validated = courseSchema.parse(req.body);
    const course = await Course.create(validated);
    res.status(201).json(course);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
});

// Update course
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Make all fields optional for updates
    const updateCourseSchema = courseSchema.partial();

    // Validate request body
    const validated = updateCourseSchema.parse(req.body);

    // Update course
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      validated,
      { new: true, runValidators: true }
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);

  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
});


// Delete course
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all courses (optional for admin dashboard)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// backend route: GET /admin/courses/:id
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


