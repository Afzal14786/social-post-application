import express from "express";
import authRoute from "./auth.routes.js";
import protect from "../middleware/auth.middleware.js";
const router = express.Router();

router.use('/auth', authRoute);

export default router;