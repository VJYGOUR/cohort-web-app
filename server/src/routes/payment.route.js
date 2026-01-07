import express from "express";
import { createRazorpayOrder } from "../controllers/payment.controllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);

export default router;
