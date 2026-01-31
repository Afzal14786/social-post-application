import express from "express";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const app = express();


app.get("/", (req, res, next)=> {
    res.send(`Server is running fine`);
});

export default app;