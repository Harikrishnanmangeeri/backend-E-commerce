const Joi = require('joi');

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const joiProductSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().positive(),
    image: Joi.string(),
    description: Joi.string(),
    category: Joi.string()
});


module.exports={schema ,joiProductSchema}