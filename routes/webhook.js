// server/routes/webhook.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");

// Models
const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment"); // create this model

// Stripe requires the raw body to verify signature
router.post("/", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const courseId = metadata.courseId;
    const userId = metadata.userId;

    try {
      // 1. Avoid duplicates: check if enrollment already exists
      const already = await Enrollment.findOne({ course: courseId, user: userId });
      if (!already) {
        // 2. Create Enrollment
        const enrollment = new Enrollment({
          user: userId,
          course: courseId,
          paymentIntent: session.payment_intent || session.payment_status,
          amount_total: session.amount_total || null,
          currency: session.currency || "usd",
          status: "active",
          purchasedAt: new Date(),
        });
        await enrollment.save();

        // 3. Optionally update Course or User documents (e.g., increment students)
        await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });

        // 4. Optionally send email / receipt
        console.log(`Enrollment created for user ${userId} course ${courseId}`);
      } else {
        console.log("Enrollment already exists - ignoring duplicate webhook");
      }
    } catch (err) {
      console.error("Error fulfilling checkout:", err);
      // Note: do NOT fail the webhook if you already processed; decide idempotency
    }
  }

  // Return a 200 to acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = router;
