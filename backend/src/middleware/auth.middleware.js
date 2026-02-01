import jwt from "jsonwebtoken";
import User from "../models/user/model.user.js";

const protect = async (req, res, next)=> {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            let user = await User.findById(decode.id).select("-password");

            if (!user) {
                return res.status(401).json({
                    message: "Not Authorized, User No Longer Exist",
                    success: false,
                });
            }
            req.user = user;
            next();
        } catch(err) {
            console.log(`Token verification error: ${err.message}`);
            return res.status(401).json({
                message: "Not Authorized, Token Failed",
                success: false,
            });
        }
    } else {
        if (!token) {
            return res.status(401).json({
                message: "Not Authorized, No Token",
                success: false,
            });
        }
    }
}

export default protect;