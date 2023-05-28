require('dotenv').config({ debug: false });

const ejs = require('ejs');

console.log('First parameter: ', process.argv[2]);
console.log('Second parameter: ', process.argv[3]);

const express = require('express');
var app = express();

const nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates');

let template = null;
let userName = null;
let verificationCode = null;

let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.port,
    secure: true,
    auth: {
        user: process.env.emailUser,
        pass: process.env.emailPass
    }
});

app.get('/validateUser', function(req, res) {
    template = "EmailTemplates/verifyuser.ejs";
    email = req.query.e;
    userName = req.query.un;
    verificationCode = req.query.vc;
    response.send("params: " + email + ' ' + userName + verificationCode);
})

if ( template !== null && email !== null )
ejs.renderFile(template, { userName: userName, verificationCode: verificationCode }, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var mailOptions = {
            from: 'donotreply@chatterboxsm.com',
            to: email, 
            subject: 'Please verify your ChatterboxSM account.',
            html: data
        };
        console.log("html data =========>", mailOptions.html);
        
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
});

app.listen(process.env.port, () => console.log(`App listening on port ${process.env.port}`));