const jwt = require('jsonwebtoken');
const User = require("../schemas/user");

module.exports = (req, res, next) => {
    console.log("여기를 지나쳤어요")
    const {authorization} = req.headers;
    // console.log(authorization)
    const [tokenType, tokenValue] = (authorization || "").split(" ");
    // console.log(tokenType, tokenValue)
    
    if(tokenType !== "Bearer"){
        res.status(401).send({
            errorMessage: "로그인이 필요한 기능입니다.",
        });
        return;
    }

    try{
        const {userId} = jwt.verify(tokenValue, "my-secret-key");
        // console.log(userId)
        User.findById(userId).then((user) => {
            res.locals.user = user; 
            // console.log(user)
            next();
        });
        
    }catch (error){
        res.status(401).send({
            errorMessage: "로그인이 필요한 기능입니다.",
        });
        return;
    } 
};