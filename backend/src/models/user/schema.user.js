import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    username: {
        type: String,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Email is required"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/,
            "Please provide a valid email id",
        ]
    },
    password: {
        type: String,
        minlength: [8, "Password must be at least 8 characters"],
        required: [true, "Password is required"],
        select: false,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.username && this.email) {
        let baseUsername = this.email.split('@')[0];
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        this.username = `${baseUsername}${randomSuffix}`;
    }
    if (!this.isModified('password')) {
        return next;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (providedPassword) {
    return await bcrypt.compare(providedPassword, this.password);
}

export default userSchema;