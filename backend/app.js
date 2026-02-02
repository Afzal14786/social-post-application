import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./src/routes/index.routes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5000",
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

app.use(cookieParser((process.env.JWT_SECRET || "fallback_secret_for_dev")));

/**
 * configure the route
 */
app.use('/api/v1', route)


app.get("/", (req, res, next)=> {
    res.send(`Server is running fine`);
});


export default app;