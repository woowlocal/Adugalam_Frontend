import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("KEY ID:", process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // ✅ Get amount from frontend

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    console.log("Received amount (paise):", amount);

    const order = await razorpay.orders.create({
      amount: amount, // ✅ Use dynamic amount
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    res.json(order);

  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log("✅ Backend running on http://0.0.0.0:5000");
});
