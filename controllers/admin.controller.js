const userSchema = require('../Model/User')
const productSchema = require('../Model/Product')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const {joiProductSchema} = require('../Model/validationschema')
module.exports={
    admin:async(req,res)=>{
        const admin = {email:'admin@gmail.com',password:'admin'}
        const { email,password } = req.body
        if(admin.email == email && admin.password == password){
            const resp ={
                id : admin.email
            }
            const jwt_token = jwt.sign(resp,process.env.ACESS_ADMINTOKEN_SECRET, { expiresIn: 86400 })
            res.json({auth:true,token:jwt_token, status: 'success',
            message: 'Successfully logged In.'})
         
            }
            else {
           res.send('user unavaliable')
          
            }
    },
    // admin view hole users 
    adminuser:async(req,res)=>{
        const adminuser = await userSchema.find()
            res.status(200).json({
                
                status: 'success',
                message: 'Successfully fetched user datas.',
                data: adminuser
                })
       
    },
    // admin view user by id
    adminuserbyid:async(req,res)=>{
        const adminuserbyid = await userSchema.find({_id:req.params.id})
        res.status(200).json({
            status: 'success',
            message: 'Successfully fetched user data.',
            data: adminuserbyid
            })
    },
    //admin view product 
    adminviewproduct:async(req,res)=>{
        const adminviewproduct = await productSchema.find()
        res.status(200).json({
            status: 'success',
            message: 'Successfully fetched products detail.',
            data: adminviewproduct
            })
    },
    //admin view product by id
    adminviewproductbyid:async(req,res)=>{
        const adminviewproductbyid =await productSchema.find({_id:req.params.id})
        res.status(200).json({
            status: 'success',
            message: 'Successfully fetched product details.',
            data: adminviewproductbyid
            })
    },
    //admin view product by category
    productcategory:async(req,res)=>{
        const productcategory = await productSchema.find({category:req.params.categoryname})
        if(productcategory.length != 0 ){
            res.status(200).json({
                status: 'success',
                message: 'Successfully fetched products detail.',
                data: productcategory
                })
        }
        else{
            res.json('The product not found!')
        }
    },
    //admin add product
    adminAddproduct:async(req,res)=>{
        const {value,error} = joiProductSchema.validate(req.body)
        const {title,price,image,description,category} = value
       if (error){
        res.json(error.message)
       }
       else{
        await  productSchema.create({
            title:title,price:price,image:image,description:description,category:category
    })
    res.status(201).json({
        status: 'success',
        message: 'Successfully created a product.',
        })
       }
    
    },
    // admin edit product 
    adminEditproduct:async(req,res)=>{
        const {id,title,price,image,description,category} = req.body
        const adminedit = await productSchema.findOne({_id:id})
        if (adminedit.length != 0){
        await  productSchema.findByIdAndUpdate(id,{$set:{title:title,price:price,image:image,description:description,category:category}
            })
        res.json({
        status: 'success',
        message: 'Successfully updated a product.',
        })}
    },
    adminDelete:async(req,res)=>{
        const adminDelete = await productSchema.find({_id:req.params.id})
        if (adminDelete.length != 0) {
            await productSchema.updateOne({_id:req.params.id},{$pull:{'Product':req.body.id}})
            res.json({
                status: 'success',
                message: 'Successfully deleted a product.',
                })
        }
    },
    stats:async(req,res)=>{
        
    },


    orders:async(req,res)=>{const order =await userSchema.find({},"order")
    orders = order.filter((item)=>{
     return item.order.length>0
    })


    res.json({
      status: 'success',
      message: 'Successfully fetched order detail.',
      data: orders
      })

  
        
    }







}
   

    