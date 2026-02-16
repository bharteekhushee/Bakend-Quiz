
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized , Token not found"
        });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized , Token not found"
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        req.user = user
        next()
    }
    catch (err) {
        console.log("JWT Verification Failed: ",err);
        return res.status(401).json({ 
            success:false,
            message: "Token Invalid or Expired" 
        })
    }
}
module.exports=authMiddleware;