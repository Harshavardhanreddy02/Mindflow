import express from "express";
import {
  speechController,
  upload,
  addTiming,
} from "../controllers/speechController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Apply timing middleware to all routes
router.use(addTiming);








export default router;
