let JWT_KEY;
if(process.env.JWT_KEY){
    JWT_KEY = process.env.JWT_KEY
}else{
    JWT_KEY = require('../secrets').JWT_KEY
}
const jwt = require('jsonwebtoken');
const userModel =require('../model/userModels');

module.exports.ProtectRoute= function ProtectRoute(req,res,next){

    try{
        if(req.cookies.login){
            let decryptedToken = jwt.verify(req.cookies.login,JWT_KEY)
            if(decryptedToken){
                console.log('decryptedToken',decryptedToken)
                let userId = decryptedToken.id;
                req.body.userId = userId
                next();
            }
            else{
                res.json({
                    message:"not authorized"
                });
            }
        }
        else{
            res.json({
                message:"operation not allowed"
            });
        }
    }
    
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

module.exports.bodyChecker = function bodyChecker(req,res,next){
    console.log('body checker inside')
    try{
        let isCheck = Object.keys(req).length > 0;
        if(isCheck){
            next()
        }else{
            res.status(200).json({
                message:"kind send details in body"
            })
        }
    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

module.exports.isAuthorized = function isAuthorized(roles){
    console.log('server on')
    return async function(req,res,next){
        let {userId} = req.body;
        console.log('userId',userId)
        try{
            let user = await userModel.findById(userId)
            console.log('user',user)
            let userIsAuthorized = roles.includes(user.role);
            if(userIsAuthorized){
                req.user = user
                console.log('isAuthorized',user)
                next()
            }else{
                res.status(200).json({
                    message: "user Not Authorized for this operation"
                })
            }
        }catch(err){
            res.status(502).json({
                message: err.message
            })
        }
    }
}
