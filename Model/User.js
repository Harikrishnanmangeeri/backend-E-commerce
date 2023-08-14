const mangoose = require('mongoose')

const userschema = new mangoose.Schema({

    username:String,
    email:String,
    password:String,
    cart:[],
    wishlist:[],
    order:[]

})
module.exports=mangoose.model('User',userschema)

