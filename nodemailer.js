require('dotenv').config({ debug: false });

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.port,
    secure: true,
    auth: {
        user: process.env.emailUser,
        pass: process.env.emailPass
    }
});

console.log('credentials', process.env.emailUser + ' ' + process.env.emailPass);

var mailOptions = {
    from: 'donotreply@chatterboxsm.com',
    to: 'cruckman900@gmail.com', 
    subject: 'Please verify your ChatterboxSM account.',
    html: '<h1>Booya!</h1>'
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});