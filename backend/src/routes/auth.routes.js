import express from "express";
import {registeration, login, logout} from "../controllers/auth/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/register', registeration);
router.post('/login', login);
router.post('/logout', protect, logout);


export default router;