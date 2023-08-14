const mangoose = require('mongoose')

const productSchema = new mangoose.Schema({
    title:String,
    price:Number,
    image:String,
    description:String,
    category:String
})
module.exports = mangoose.model('Product',productSchema)

  

  