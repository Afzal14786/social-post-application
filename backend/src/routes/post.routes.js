import {createPost, addComment, getAllPosts, getSinglePost, likeUnlikePost} from "../controllers/post/posts.controller.js";
import {upload} from "../middleware/upload.middleware.js";
import protect from "../middleware/auth.middleware.js";

import express from "express";
const router = express.Router();

/**
 * Create Post
 *  @baseAPI /api/v1/posts
 */

/**
 * @route /creates
 */
router.post('/creates', protect, upload.array("images", 4), createPost);

/**
 * Adding comment to a post
 * @route /:postId/comments
 */

router.post('/:postId/comment', protect, addComment);

/**
 * Like / Unlike Post
 * @route /:postId/like
 */
router.post('/:postId/like', protect, likeUnlikePost);

/**
 * Get all the posts ~ feed
 * @route /
 */

router.get('/', protect, getAllPosts);

/**
 * Get one post using id
 * @route /:postId
 */

router.get('/:postId', protect, getSinglePost)

export default router;