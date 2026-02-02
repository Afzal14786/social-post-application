import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./src/routes/index.routes.js";
import dotenv from "dotenv";
dotenv.config({quiet: true});
const app = express();

app.use((req, res, next) => {
    console.log(`[INCOMING] Method: ${req.method} | URL: ${req.url} | Origin: ${req.headers.origin}`);
    next();
});

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log("Blocked Origin:", origin); // Helps debugging
            return callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.JWT_SECRET));

/**
 * configure the route
 */
app.use('/api/v1', route)


app.get("/", (req, res) => {
    res.send(`Server is running fine. Allowed Origins: ${allowedOrigins.join(', ')}`);
});

app.use((req, res) => {
    console.log(`404 Not Found: ${req.originalUrl}`);
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

export default app;