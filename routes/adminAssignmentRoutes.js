const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");
const Assignment = require("../models/Assignment");

// Get all submissions for a course
router.get("/:courseId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const submissions = await Assignment.find({ courseId: req.params.courseId })
      .populate("studentId", "name email");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
