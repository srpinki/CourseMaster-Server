// server/routes/checkout.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Models (adjust paths)
const Course = require("../models/Course");
const User = require("../models/User");

router.post("/create-session", async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    if (!courseId || !userId) return res.status(400).json({ error: "Missing params" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
              images: course.thumbnail ? [course.thumbnail] : [],
            },
            unit_amount: Math.round(Number(course.price) * 100), // price in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: course._id.toString(),
        userId: userId.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/courses/${course._id}`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("create-session error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
