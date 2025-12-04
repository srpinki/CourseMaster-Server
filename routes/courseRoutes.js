const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// GET /api/courses → list all courses with pagination, search, filter, sort
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, search, category, tags, sort } = req.query;
    page = Number(page);
    limit = Number(limit);

    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(",") };

    let coursesQuery = Course.find(query);

    // Sorting
    if (sort === "price_asc") coursesQuery = coursesQuery.sort({ price: 1 });
    if (sort === "price_desc") coursesQuery = coursesQuery.sort({ price: -1 });

    // Pagination
    const total = await Course.countDocuments(query);
    coursesQuery = coursesQuery.skip((page - 1) * limit).limit(limit);

    const courses = await coursesQuery.exec();

    res.json({ courses, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/courses/:id → get a single course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
