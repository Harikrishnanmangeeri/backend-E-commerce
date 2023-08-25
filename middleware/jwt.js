const jwt = require('jsonwebtoken')
const auth =(req,res,next)=>{
    const token = req.headers['authorization']
    console.log(token);
    if(token){
        const recive = token && token.split(' ')[1]
        const jwtverify = jwt.verify(recive,'secret')
        if(jwtverify){
        next()
        }
        else{
            res.json("permision decline")
        }
    }
else{
     res.json("permision decline")
}
}
module.exports=auth
