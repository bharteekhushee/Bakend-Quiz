const mongoose = require('mongoose');
const User = require('../models/userModel')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const TOKEN_EXPIRE_IN = '24h';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email."
            })
        }
        const exists = await User.findOne({ email }).lean();
        if (exists) return res.status(409).json({ success: false, message: "User already Exists." })
        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            _id: newId,
            name,
            email,
            password: hashedPassword
        })
        const response = await user.save();
        if (!JWT_SECRET_KEY) throw new Error('JWT_SECRET_KEY is not found on the server');
        const token = jwt.sign({ id: newId.toString() }, JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRE_IN });
        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            token,
            response
            // user: { id: user._id.toString(), name: user.name, email: user.email }
        })
    }
    catch (err) {
        console.error("Register error:- ", err);
        return res.status(500).json({
            success: false,
            message: "Server Error."
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: "Invalid email." })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid  password." })

        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRE_IN });
        return res.status(201).json({
            success: true,
            message: "Login successfully.",
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email }
        })
    }
    catch (err) {
        console.error("Login error:- ", err);
        return res.status(500).json({
            success: false,
            message: "Server Error."
        })
    }
}

module.exports = { register, login }