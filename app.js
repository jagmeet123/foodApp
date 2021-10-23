const express = require('express');

const app = express();
app.use(express.json());

const cookieParser = require('cookie-parser')
app.use(cookieParser());

app.listen(process.env.PORT||8081, function () {
    console.log('server listening on port 5000');
});

const userRouter = require('./Routers/userRouter');
const authRouter = require('./Routers/authRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter')
const bookingRouter = require('./Routers/bookingRouter')

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/plan', planRouter)
app.use('/review', reviewRouter)
app.use('/booking', bookingRouter)