import express from "express";
import authRoute from "./auth.routes.js";
import postRoute from "./post.routes.js";
import protect from "../middleware/auth.middleware.js";
const router = express.Router();

router.use('/user/auth', authRoute);
router.use('/posts', postRoute);

export default router;