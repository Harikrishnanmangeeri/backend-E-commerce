const userSchema =require('../Model/User')
const jwt = require('jsonwebtoken')
const product =require('../Model/Product')
module.exports={
    register:async (req,res) => {
        const {username , password, email} = req.body
         await userSchema.create({
            username:username,email:email,password:password
         })
         res.json('sucess')
    },
    login:async (req ,res) =>{
        const {email , password } =req.body
       const user = await userSchema.find({
            email:email,password:password
        })
    
        console.log(user);
        if (user.length != 0){
            const resp ={
            id :user[0].id
        }
        const token = jwt.sign(resp,"secret")
        res.send({auth:true,token:token})
        }
        else {
       res.send('user unavaliable')
      
        }
        
    },
    products: async (req,res)=>{

        const prdt = await product.find()
        res.json(prdt)
        console.log();
        },
     
    productbyid: async (req,res)=>{
        const productid = await product.find({_id:req.params.id})
        if (productid.length != 0){
            res.json(productid)
        }
        else{
        res.json("product not found!")
        }
      
    },
    productbycategory: async (req,res)=>{
        const productcategory =await product.find({category:req.params.categoryname})
        if (productcategory.length != 0){
            res.json(productcategory)
        }
        else{
        res.json("category not found!")
        }
    },
    cartid:async (req,res)=>{
        
    }







}
