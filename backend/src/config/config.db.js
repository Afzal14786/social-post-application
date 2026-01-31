import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URL || `mongodb://127.0.0.1:27017`;

const connectDB = ()=> {
    mongoose.connect(mongo_url, {
        dbName: "social-application"
    }).then(()=> {
        console.log(`Database connected successful`);
    }).catch((err)=> {
        console.error(`Error while connecting database : ${err}`);
        process.exit(1);
    })
}

export default connectDB;