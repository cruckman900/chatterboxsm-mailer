require('dotenv').config({ debug: false });

var http = require('http');
var url = require('url');

var nodemailer = require('nodemailer');

var server = http.createServer(function (req, res) {
    const headers = {        
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Content-Type": "text/plain"
    }
    res.writeHead(200, headers);

    var q = url.parse(req.url, true).query;

    let action = q.action;
    let email = q.e;
    let userName = q.un;

    let verificationCode = null;
    let link = process.env.RESET_PASS_LINK;

    if (q.vc) {
        verificationCode = q.vc;
    }

    if (q.li) {
        link = q.li;
    }

    sendMail(action, email, userName, verificationCode, link);

    res.write(`${Date.now()}: ${action} email send to ${userName} at ${email}.`);
    res.end();
});

function sendMail(action, email, userName, verificationCode, link) {
    let emailBody = null;
    let subject = null;

    if (action === 'verifyUser') {
        subject = 'Please verify your ChatterboxSM account.'
        emailBody = `
            <html>
                <head></head>
                <body style='border-radius: 12px; background: linear-gradient(180deg, #000000, #630000 80%, #000000); max-height: 400px; max-width: 600px;'>
                    <div style='margin: 0 1rem; padding: 1rem; border-radius: 12px; background: rgb(0, 0, 0)'>
                        <h1 style='color: rgb(255, 69, 0); font-weight: bold;'>ChatterboxSM</h1>
                        <p style='color: rgb(255, 69, 0); font-weight: bold;'>Hello ${userName}</p>
                        <p style='color: rgb(255, 69, 0); font-weight: bold;'>
                            Please use the verification code below to 
                            verify your user account on <a style='color: rgb(255, 120, 0); font-weight: bold;' href='${process.env.SITE_URL}'>ChatterboxSM</a>
                        </p>
                        <p style='color: rgb(255, 69, 0); font-weight: bold; text-align: center;'>
                            <code style='color: rgb(255, 120, 0); font-weight: bold; font-size: 16pt'>${verificationCode}</code>
                        </p>
                        <br />
                        <p style='color: rgb(255, 69, 0); font-weight: bold;'>Thank you.</p>
                        <p style='color: rgb(255, 69, 0); font-weight: bold;'>CRUCKMAN @ &copy;ChatterboxSM</p>
                    </div>
                </body>
            </html>
        `;
    } else if (action === 'resetPass') {
        subject = 'In response to your ChatterboxSM password reset request:'
        emailBody = `
            <html>
                <head></head>
                <body style='border-radius: 12px; background: linear-gradient(180deg, #000000, #630000 80%, #000000); max-height: 400px; max-width: 600px;'>
                    <div style='margin: 0 1rem; padding: 1rem; border-radius: 12px; background: rgb(0, 0, 0);'>
                    <h1 style='color: rgb(255, 69, 0); font-weight: bold;'>ChatterboxSM</h1>
                    <p style='color: rgb(255, 69, 0); font-weight: bold;'>Hello ${userName}</p>
                        <p style='color: rgb(255, 69, 0); font-weight: bold;'>
                            Please use the following link to reset your password.
                        </p>
                        <p style='color: rgb(255, 69, 0); font-weight: bold;; text-align: center;'>
                            <code><a style='color: rgb(255, 120, 0); font-weight: bold; font-size: 16pt' href='${process.env.SITE_URL}/PasswordReset?un=${userName}'>Password Reset</a></code>
                        </p>
                        <br />
                        <p style='color: rgb(255, 69, 0); font-weight: bold;'>Thank you.</p>
                        <p style='color: rgb(255, 69, 0); font-weight: bold;'>CRUCKMAN @ &copy;ChatterboxSM</p>
                    </div>
                </body>
            </html>
        `;
    }

    if ( action !== null && email !== null ) {
        let transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    
        var mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email, 
            subject: subject,
            html: emailBody
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
}

// server.listen(80, () => {
//     console.log(`server running`);
// });

server.listen();