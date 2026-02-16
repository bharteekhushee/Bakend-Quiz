const mongoose = require('mongoose');
const Result = require('../models/resultModel')

const createResult = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not found (Unauthorized)"
            });
        }
        const { title, technology, level, totalQuestions, correct, wrong } = req.body;
        if (!technology || !level || totalQuestions === undefined || correct === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing fields are required"
            });
        }
        //compute wrong if not provided
        const computeWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Missing Title"
            });
        }
        const payload = {
            title: String(title).trim(),
            technology,
            level,
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computeWrong,
            user: req.user.id //for a particular user
        }
        const created = await Result.create(payload);
        return res.status(200).json({
            success: true,
            message: "Result Created",
            result: created
        })
    }
    catch (err) {
        console.error('CreateResult Error: ', err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

//list the result 
const listResults = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not found (Unauthorized)"
            });
        }
        const { technology } = req.query;
        const query = { user: req.user.id };
        if (technology && technology.toLowerCase() !== 'all') {
            query.technology = technology;
        }
        const items = await Result.find(query).sort({ createAt: -1 }).lean();
        return res.status(200).json({
            success: true,
            results: items
        });

    }
    catch (err) {
        console.error('ListResult Error: ', err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}
module.exports = { createResult, listResults }