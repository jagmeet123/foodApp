const nodemailer = require('nodemailer');

module.exports = async function sendMail(userObj) {
  console.log('userObj',userObj);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'rihaanaggarwal89.st@gmail.com', // generated ethereal user
      pass: 'cajgmeuhqkoicjua', // generated ethereal password
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