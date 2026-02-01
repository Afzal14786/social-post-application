import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        trim: true,
    },
    images: [{
        type: String,
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        /** If any comments having replies */
        replies: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }]
    }]
}, {
    timestamps: true,
    toJSON:{virtuals: true},
    toObject: {virtuals: true}
});

postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

postSchema.virtual('commentCount').get(function () {
    return this.comments.length;
})

export default postSchema;