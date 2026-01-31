import mongoose from "mongoose";
import postSchema from "./schema.post.js";

const postModel = mongoose.model('Post', postSchema);
export default postModel;