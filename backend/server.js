import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server is running on port: ${PORT}`);
}).on("error", (err)=> {
    console.log(`Something error while running the server`);
});