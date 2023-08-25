const mangoose = require('mongoose')

const userschema = new mangoose.Schema({

    username:String,
    email:String,
    password:String,
    cart:[{type:mangoose.Schema.ObjectId,ref:"Product"}],
    wishlist:[{type:mangoose.Schema.ObjectId,ref:"Product"}],
    order:[]

})
module.exports=mangoose.model('User',userschema)

// TODO: Joi validation implement  