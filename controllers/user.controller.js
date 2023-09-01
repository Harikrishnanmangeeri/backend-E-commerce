const userSchema = require("../Model/User");
const jwt = require("jsonwebtoken");
const product = require("../Model/Product");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { schema } = require("../Model/validationschema");
const { decrypt } = require("dotenv");
module.exports = {

  register: async (req, res) => {
    const { value, error } = schema.validate(req.body);
    const { username, password, email } = value;
    if (error) {
      res.json(error.message);
    } else {
      const user = await userSchema.find({ username: username });
      if (user.length > 0) {
        return res.json("user name already exist");
      } else {
        await userSchema.create({
            username: username,
            email: email,
            password:await bcrypt.hash(password, 10)
          });
        

      
        res.json("sucess");
      }
    }
  },
  
  login: async (req, res) => {
    const { value, error } = schema.validate(req.body);
    const { email, password } = value;

    if (error) {
      res.json(error.message);
    } else {
      const user = await userSchema.find({
        email: email  
    });
      if (!user) {
        return res.send("user unavaliable");
      }
      else{
        console.log(user[0].password);

      const checkpass = await bcrypt.compare( password,user[0].password)
      console.log(checkpass);
        if (!checkpass) {
         return res.json("password incorrect");
        }
        else{
             
        const resp = {
            id: user[0].id,
          };
          const token = jwt.sign(resp, process.env.ACESS_USERTOKEN_SECRET, {
            expiresIn: 86400,
          });
          res.send({ auth: true, token: token });
        }
      

      
     
     
    }
  }},
  products: async (req, res) => {
    const prdt = await product.find();
    res.json(prdt);
    
  },

  productbyid: async (req, res) => {
    const productid = await product.find({ _id: req.params.id });
    if (productid.length != 0) {
      res.json(productid);
    } else {
      res.json("product not found!");
    }
  },
  productbycategory: async (req, res) => {
    const productcategory = await product.find({
      category: req.params.categoryname,
    });
    if (productcategory.length != 0) {
      res.json(productcategory);
    } else {
      res.json("category not found!");
    }
  },
  cartid: async (req, res) => {
    const addtocart = await userSchema.findOne({ _id: req.params.id });
    if (addtocart) {
      await userSchema.updateOne(
        { _id: req.params.id },
        { $push: { cart: req.body.id } }
      );
      res.json({ status: "success" });
    }
  },
  productincart: async (req, res) => {
    try {
      // TODO: trycatch middleware
      const productbycart = await userSchema
        .find({ _id: req.params.id })
        .populate("cart");
      if (productbycart) {
        res.json({ data: productbycart, status: "success" });
      }
      console.log(productbycart);
    } catch (error) {
      res.send(error);
    }
  },
  wishlist: async (req, res) => {
    try {
      const wishlist = await userSchema.findOne({ _id: req.params.id });
      if (wishlist.length != 0) {
        await userSchema.updateOne(
          { _id: req.params.id },
          { $push: { wishlist: req.body.id } }
        );
        res.json({ status: "success" });
      }
    } catch (error) {
      req.send(error);
    }
  },
  wishlistbyget: async (req, res) => {
    const wishlistbyget = await userSchema
      .find({ _id: req.params.id })
      .populate("wishlist");
    if (wishlistbyget.length != 0) {
      res.json({ data: wishlistbyget, status: "success" });
    }
  },
  wishlistdelete: async (req, res) => {
    const wishlistdelete = await userSchema.find({ _id: req.params.id });
    if (wishlistdelete.length != 0) {
      await userSchema.updateOne(
        { _id: req.params.id },
        { $pull: { wishlist: req.body.id } }
      );
      res.json({ status: "sucess" });
    }
  },
  payment: async (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_KEY);
    const user = await userSchema.find({ _id: req.params.id }).populate("cart");
    const cartitem = user[0].cart.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });
    console.log(cartitem);
    if (cartitem != 0) {
      const session = await stripe.checkout.sessions.create({
        line_items: cartitem,
        mode: "payment",
        success_url: `http://127.0.0.1:3000/api/users/payment/success`,
        cancel_url: `http://127.0.0.1:3000/api/users/payment/cancel`,
      });
      temp = {
        cartitem: user[0].cart,
        id: req.params.id,
        paymentid: session.id,
        amount: session.amount_total / 100,
      };

      res.send({ url: session.url });
    } else {
      res.send("user no cart item");
    }
  },
  sucess: async (req, res) => {
    const user = await userSchema.find({ _id: temp.id });
    if (user.length != 0) {
      await userSchema.updateOne(
        { _id: temp.id },
        {
          $push: {
            order: {
              product: temp.cartitem,
              date: new Date(),
              orderid: Math.random(),
              paymentid: temp.paymentid,
              totalamount: temp.amount,
            },
          },
        }
      );
      await userSchema.updateOne({ _id: temp.id }, { cart: [] });
    }
    res.status(200).json({
      status: "success",
      message: "successfully added in order",
    });
  },
  cancel: async (req, res) => {
    res.json("cancel");
  },
};
