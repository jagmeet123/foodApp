const express = require('express');
const authRouter = express.Router();
const userModel = require('../model/userModels');
const sendMail = require('../Helper/sendMail')
const path = require('path')

// ---------------------JWT-------------------------
const jwt = require('jsonwebtoken')
const { JWT_KEY } = process.env || require('../secrets');

// ---------------------routes----------------------
authRouter
    .route('/signup')
    .post(setCreatedAt, signupUser);

authRouter
    .route('/login')
    .post(loginUser)

authRouter
    .route('/forgotPassword')
    .get(getPasswordForgot)
    .post(postForgetPassword);

authRouter
    .route('/resetPassword')
    .post(resetPassword)

//-----------------------function---------------------
function setCreatedAt(req, res, next) {
    let obj = req.body;
    //keys ka arr -> uska length
    let length = Object.keys(obj).length;
    if (length == 0) {
        return res.status(400).json({ message: "cannot create user if req.body is empty" })
    }
    req.body.createdAt = new Date().toISOString();
    next();
}

async function signupUser(req, res) {
    // let userDetails=req.body;
    // let name=userDetails.name;
    // let email=userDetails.email;
    // let password=userDetails.password;
    try {
        let userObj = req.body;
        // user.push({email,name,password});
        //put all data in mongo db
        // create document in userModel
        let user = await userModel.create(userObj);
        sendMail(userObj)
        console.log('user', user);
        res.json({
            message: 'user signedUp',
            user: userObj
        });
    }
    catch (err) {
        console.log(err);
        res.json({ message: err.message })
    }
}

async function loginUser(req, res) {
    try {
        // email,password
        if (req.body.email) {

            let user = await userModel.findOne({ email: req.body.email })

            if (user) {
                if (req.body.password == user.password) {
                    // If we login the send the cookies to frontend
                    let payload = user['_id']
                    let token = jwt.sign({ id: payload }, JWT_KEY)
                    res.cookie('login', token, { httpOnly: true })
                    return res.json({
                        message: "user loged in"
                    })
                } else {
                    return res.json({
                        message: "email or password is wrong"
                    })
                }
            } else {
                return res.json({
                    message: "user is not present"
                })
            }
        } else {
            return res.json({
                message: "enter the email to continue"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function getPasswordForgot(req,res){
    let restOfPath = path.join(__dirname,'../')
    res.status(200).json({
        message:"404"
    })
}

async function postForgetPassword(req, res) {
    console.log('req.body',req.body)
    try {
        let { email } = req.body;
        let user = await userModel.findOne({ email })
        if (user) {
            let token = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);;
            await userModel.updateOne({ email }, { token })
            let userWithToken = await userModel.findOne({ email })
            await sendMail(userWithToken)
            res.status(200).json({
                message: "user Token send to mail",
                user: userWithToken,
                token
            })
        } else {
            res.status(404).json({
                message: "user Not found"
            })
        }
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};

async function resetPassword(req,res){
    
    try{
        let {token,password,confirmPassword} = req.body;
        let userWithToken = await userModel.findOne({token})
        if(userWithToken){
            
            userWithToken.resetHandler(password,confirmPassword)
            await userWithToken.save()

            let user = await userModel.findOne({email:userWithToken.email})
            res.json({
                message:"User password changed",
                user:user
            })
            
        }else{
            res.status(404).json({
                message: "user Not found"
            })
        }
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = authRouter;