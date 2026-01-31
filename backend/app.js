import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/config.db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./src/routes/index.routes.js";
dotenv.config({quiet: true});

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || `http://localhost:5173`,
    methods: 'GET, POST',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json({
    limit: "10mb",
    verify: (req, res, buf)=> {
        req.rawBody = buf;
    }
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10m",
    parameterLimit: 100,
}));

app.use(cookieParser(process.env.JWT_SECRET));

/**
 * configure the route
 */
app.use('/api/v1/user', route)


app.get("/", (req, res, next)=> {
    res.send(`Server is running fine`);
});

connectDB();
export default app;