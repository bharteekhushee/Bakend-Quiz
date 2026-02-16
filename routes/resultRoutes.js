const express=require('express');
const router=express.Router();
const {createResult,listResults}=require('../controllers/resultController')
const authMiddleware=require('../middleware/auth')

router.post('/',authMiddleware,createResult)
router.get('/',authMiddleware,listResults)

module.exports=router;