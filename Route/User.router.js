const express = require('express')
var userRouter = express.Router()
const controller = require("../controllers/user.controller")

userRouter.post('/users/register', controller.register)
userRouter.post('/users/login' , controller.login)  
userRouter.get('/users/products',controller.products)
userRouter.get('/users/products/:id',controller.productbyid)
userRouter.get('/users/products/category/:categoryname',controller.productbycategory)
userRouter.post('/users/:id/cart', controller.cartid)  


module.exports=userRouter