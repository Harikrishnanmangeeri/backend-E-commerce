const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRouter =require('./Route/User.router')
const adminRoute = require('./Route/Admin.router')

mongoose.connect('mongodb://127.0.0.1/website')  
app.use(express.json())

app.use('/api',userRouter,adminRoute)
app.listen(3000 , ()=>console.log("server on"))

//  TODO: .env and .gitignore