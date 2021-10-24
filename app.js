const express = require('express');
const app = express();

const cookieParser = require('cookie-parser')
app.use(cookieParser());

const bcrypt = require('bcrypt')

const rateLimit = require('express-rate-limit');
app.use(rateLimit({
    max:100,
    windowMs:15 * 60 * 1000,
    message:"Too many accounts created from this IP, please try after an hour"
}))

// ----------- prevents from parameter pollution
const hpp = require('hpp');
app.use(hpp({
    whitelist:[
        'select',
        'page',
        'sort',
        'myquery'
    ]
}))

// ----------- Prevents from packet sniffing (eg: postman request get headers info) ---------setts various http headers
const helmet = require('helmet')
app.use(helmet())

app.use(express.json());

                                                // After express.json()

// ------------ prevents from cross site  
const xss = require('xss-clean')
app.use(xss())

// ---------- To sanitize mongoDB query
const mongoSanitize = require('express-mongo-sanitize')
app.use(mongoSanitize());


app.listen(process.env.PORT|| 5000, function () {
    console.log('server listening on port 5000');
});

const userRouter = require('./Routers/userRouter');
const authRouter = require('./Routers/authRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter')
const bookingRouter = require('./Routers/bookingRouter')
app.route('/').get(function(req,res){
    res.json({
        message:"hello"
    })
})
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/plan', planRouter)
app.use('/review', reviewRouter)
app.use('/booking', bookingRouter)