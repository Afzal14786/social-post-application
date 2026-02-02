import User from "../../models/user/model.user.js";
import {generateAccessToken, generateRefreshToken} from "../../helper/tokens.js";

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const registeration = async (req, res)=> {
    try {
        const {name, email, password} = req.body;
        // check if the user is already exisit or not
        const isExistUser = await User.findOne({email});
        if (isExistUser) {
            return res.status(400).json({
                message: "User already exist with this email",
                success: false
            });
        }
        /**
         * Here pre-hook already handle the hashing automatically
         */
        const newUser = await User.create({name, email, password});
        
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: REFRESH_TOKEN_MAX_AGE
        });

        return res.status(201).json({
            message: "User created successfully",
            success: true,
            data: {
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            },
            accessToken,
        });
        
    } catch(err) {
        console.error(`Error while registering, ${err}`);
        return res.status(500).json({
            message: "Internal error while registering user",
            success: false,
        });
    }
}


export const login = async(req, res)=> {
    try {
        const {email, password} = req.body;
        // check for the existing user;
        const isExistingUser = await User.findOne({email}).select('+password');
        
        if (isExistingUser && (await isExistingUser.matchPassword(password))) {
            const accessToken = generateAccessToken(isExistingUser._id);
            const refreshToken = generateRefreshToken(isExistingUser._id);

            const isProduction = process.env.NODE_ENV === "production";

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: REFRESH_TOKEN_MAX_AGE
            });

            res.status(200).json({
                message: "User loggedin successfully",
                success: true,
                data: {
                    _id: isExistingUser._id,
                    name: isExistingUser.name,
                    username: isExistingUser.username,
                    email: isExistingUser.email,
                },
                accessToken,
            });
        } else {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
            });
        }
    } catch(err) {
        console.error(`Internal Error while login : ${err}`);
        return res.status(500).json({
            message: "Internal server error while login",
            success: false,
        });
    }
}

export const logout = async(req, res)=> {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        });

        res.status(200).json({
            message: "Logout Successfully",
            success: true,
        });
    }catch(err) {
        console.error(`Error while logout : ${err}`);
        return res.status(500).json({
            message: "Internal server error while logout",
            success: false,
        });
    }
}