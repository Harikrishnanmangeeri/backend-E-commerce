const mangoose = require('mongoose')

const productSchema = new mangoose.Schema({
    title: {
        type:String,
        required:true
    },
    price:Number,
    image:String,
    description:String,
    category:String
})
module.exports = mangoose.model('Product',productSchema)

  
  