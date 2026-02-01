import postModel from "../../models/post/model.post.js";
import {uploadToCloudinary} from "../../config/config.cloudinary.js"

export const createPost = async(req, res)=> {
    try {
        const {content} = req.body;
        /** Array of files */
        const files = req.files;

        if (!content && (!files || files.length == 0)) {
            return res.status(400).json({
                message: "post must have content or images",
                success: false,
            });
        }

        /** 
         * Upload images into cloudinary
         */

        let imageUrls = [];
        if (files && files.length > 0) {
            const uploadPromise = files.map(file => uploadToCloudinary(file.buffer));
            const results = await Promise.all(uploadPromise);
            imageUrls = results.map(result => result.secure_url);
        }

        const newPost = await postModel.create({
            user: req.user._id,
            content: content,
            images: imageUrls
        });

        const populatePost = await postModel.findById(newPost._id).populate("user", "name email");
        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            data: populatePost
        });

    } catch(err) {
        console.error(`error while creating a post : ${err}`);
        return res.status(500).json({
            message: "error while creating a post",
            success: false,
        })
    }
}

export const addComment = async (req, res)=> {
    try {
        const {postId} = req.params;
        const {text} = req.body;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "post not found",
                success: false,
            });
        }

        const newComment = {
            user: req.user._id,
            name: req.user.name,
            username: req.user.username,
            text: text,
            replies: [],
        }

        post.comments.push(newComment);
        return res.status(200).json({
            message: "comment added",
            success: true,
            data: post,
        })

    } catch(err) {
        console.error(`Error while adding comment : ${err}`);
        return res.status(500).json({
            message: "Internal error in adding comment",
            success: false,
        });
    }
}



/**
 * Feeds
 */

export const getAllPosts = async (req, res)=> {
    try {
        const posts = await postModel.find().sort({createdAt: -1}).populate("user", "name username email").populate({
            path: "comments.user",
            select: "name username",
        });

        res.status(200).json({
            message: `fetched total ${posts.length} posts`,
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch(err) {
        console.error(`Error while getting all the posts : ${err}`);
        return res.status(500).json({
            message: "Internal server error while fetching all posts",
            success: false,
        });
    }
}

/**
 * Get single post 
 */

export const getSinglePost = async (req, res)=> {
    try {
        const {postId} = req.params;
        const post = await postModel.findById(postId).populate("user", "name username email").populate({
            path: "comments.user",
            select: "name username"
        });

        if (!post) {
            return res.status(400).json({
                message: "post not found",
                success: false,
            });
        }

        post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return res.status(200).json({
            message: "post fetched",
            success: true,
            data: post,
        });
        
    }catch(err) {
        console.error(`Error while getting one post : ${err}`);
        return res.status(500).json({
            message: "Internal server error while fetching post",
            success: false,
        });
    }
}