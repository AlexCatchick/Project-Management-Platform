import healthCheckController from "../controllers/healthCheck.controller.js";
import { Router } from "express";
const router = Router();
router.route("/").get(healthCheckController.healthCheck)
export default router;