import dotenv from "dotenv";
dotenv.config({quiet: true});

import app from "./app.js";
import connectDB from "./src/config/config.db.js";

const PORT = process.env.PORT || 5000;

/**
 * Connect Database
 */
connectDB();

app.listen(PORT, ()=> {
    console.log(`Server is running on port: ${PORT}`);
}).on("error", (err)=> {
    console.log(`Something error while running the server`);
});