require('dotenv').config({ debug: false });

const nodemailer = require('nodemailer');
const { pugEngine } = require('nodemailer-pug-engine');

function sendVerifyUserEmail(email, username, verificationCode) {
    let subject = 'Please verify your ChatterboxSM account.';
    let template = 'verify-user';
    let context = {
        pageTitle: 'Verify User',
        username: username,
        verificationCode: verificationCode
    }

    sendMail(email, subject, template, context);
}

function sendForgotPasswordEmail(email, username) {
    let subject = 'In response to your ChatterboxSM password reset request:';
    let template = 'forgot-password';
    let context = {
        pageTitle: 'Forgot Password',
        username: username,
        url: `${process.env.SITE_URL}/PasswordReset?un=${username}`
    }

    sendMail(email, subject, template, context);
}

function sendMail(email, subject, template, context) {
    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT || 8000,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    transporter.use('compile', pugEngine({
        templateDir: __dirname + '/../views',
        pretty: true
    }));

    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: subject,
        template: template,
        ctx: context
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            transporter.close();
        }
    });
}

module.exports = {
    sendVerifyUserEmail,
    sendForgotPasswordEmail
}