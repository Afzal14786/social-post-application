import jwt from "jsonwebtoken";
import User from "../models/user/model.user.js";

const protect = async (req, res, next)=> {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decode.id).select("-password");
            return next();
        } catch(err) {
            console.log(`Access token expired/invalid: ${err.message}`);
        }
    }

    if (req.cookies && req.cookies.jwt) {
        try {
            token = req.cookies.jwt;
            const decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            
            const user = await User.findById(decode.id).select("-password");
            if (!user) {
                 return res.status(401).json({
                    message: "Not Authorized, User No Longer Exist",
                    success: false,
                });
            }

            req.user = user;
            return next();
        } catch (err) {
             console.log(`Refresh token failed: ${err.message}`);
             return res.status(401).json({
                message: "Not Authorized, Token Failed",
                success: false,
            });
        }
    }

    return res.status(401).json({
        message: "Not Authorized, No Token",
        success: false,
    });
}

export default protect;