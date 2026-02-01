import express from "express";
import authRoute from "./auth.routes.js";
import postRoute from "./post.routes.js";
const router = express.Router();

router.use('/users/auth', authRoute);
router.use('/posts', postRoute);

export default router;