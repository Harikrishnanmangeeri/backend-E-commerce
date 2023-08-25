const userSchema =require('../Model/User')
const jwt = require('jsonwebtoken')
const product =require('../Model/Product')
const {schema} =require('../Model/validationschema')
module.exports={
    register:async (req,res) => {
        const {value,error} = schema.validate(req.body)
        const {username , password, email} = value
        if(error){
            res.json(error.message)
        } 
         else{
            await userSchema.create({
                username:username,email:email,password:password
             })
             res.json('sucess')}
         
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
        try {
            const addtocart = await userSchema.findOne({_id:req.params.id})
            if (addtocart){
                await userSchema.updateOne({_id:req.params.id},{$push:{'cart':req.body.id}})
                res.json( {status: 'success'})
               
            }
        } catch (error) {
            console.log(error);
        }
        
        
    },
    productincart:async(req,res)=>{
        try { // TODO: trycatch middleware 
            const productbycart = await userSchema.find({_id:req.params.id}).populate("cart")
            if (productbycart){
                res.json({data:productbycart,status: 'success'})
            }
            console.log(productbycart);

            
        } catch (error) {
            res.send(error)
        }
    },
    wishlist:async(req,res)=>{
        try {
            const wishlist = await userSchema.findOne({_id:req.params.id})
            if(wishlist.length !=0){
                await userSchema.updateOne({_id:req.params.id},{$push:{'wishlist':req.body.id}})
                res.json( {status: 'success'})
            }
        } catch (error) {
            req.send(error)
        }
    },
    wishlistbyget:async(req,res)=>{
        const wishlistbyget = await userSchema.find({_id:req.params.id}).populate("wishlist")
        if (wishlistbyget.length != 0){
            res.json({data:wishlistbyget,status: 'success'})
        }
    },
    wishlistdelete:async(req,res)=>{
        const wishlistdelete = await userSchema.find({_id:req.params.id})
        if (wishlistdelete.length != 0){
            await userSchema.updateOne({_id:req.params.id},{$pull:{'wishlist':req.body.id}})
            res.json({status: "sucess"})
        }
       
        
    }






}
