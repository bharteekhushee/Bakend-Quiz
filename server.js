const express=require('express');
const cors=require('cors');
require('dotenv').config();
require('./config/db')
const app=express();
const userRouter=require('./routes/userRoutes')
const resultRouter=require('./routes/resultRoutes')

// const bodyParser=require('body-parser');

const PORT=process.env.PORT || 3001;

//middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// routes
app.use('/api/auth',userRouter);
app.use('/api/results',resultRouter);
app.get('/',(req,res)=>{
    res.send('API Working')
})

app.listen(PORT,()=>{
    console.log(`Server start on http://localhost:${PORT}`)
})