const nodemailer = require('nodemailer');
let APP_PASSWORD;
if(process.env.APP_PASSWORD){
  APP_PASSWORD = process.env.APP_PASSWORD
}else{
  APP_PASSWORD = require('../secrets').APP_PASSWORD
}

module.exports = async function sendMail(userObj) {
  console.log('userObj',userObj);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'rihaanaggarwal89.st@gmail.com', // generated ethereal user
      pass: APP_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <rihaanaggarwal89.st@gmail.com>', // sender address
    to: `${userObj.email}`, // list of receivers
    subject: 'Welcome mail', // Subject line
    text: 'hello'+`${userObj.name}`, // plain text body
    html: '<b>Welcome to foodApp </b>'+`token: ${userObj.token}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}