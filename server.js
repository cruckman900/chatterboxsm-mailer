require('dotenv').config({ debug: false });

var http = require('http');
var url = require('url');

var nodemailer = require('nodemailer');

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var q = url.parse(req.url, true).query;
    let action = q.action;
    let email = q.e;
    let userName = q.un;
    let verificationCode = q.vc;
    let url = q.url;
    sendMail(action, email, userName, verificationCode, url);
    res.write('I love you, Alexa!!');
    res.end();
});

function sendMail(action, email, userName, verificationCode, url) {
    let emailBody = null;

    if (action === 'verifyUser') {
        emailBody = `
            <html>
                <head></head>
                <body>
                    <div style="margin: 0 1rem; max-width: 600px">
                        <p>Hello ${userName}</p>
                        <p>
                            Please use the verification code below to 
                            verify your user account on chatterboxsm.com
                        </p>
                        <p style="text-align: center; font-weight: bold">
                            https://chatterboxsm.com/${url}
                        </p>
                        <br />
                        <p>Thank you.</p>
                        <p>&copy;ChatterboxSM</p>
                    </div>
                </body>
            </html>
        `;
    } else if (action === 'resetPass') {
        emailBody = `
            <html>
                <head></head>
                <body>
                    <div style="margin: 0 1rem; max-width: 600px">
                        <p>Hello ${userName}</p>
                        <p>
                            Please use the following link to reset your password.
                        </p>
                        <p style="text-align: center; font-weight: bold">
                            ${verificationCode}
                        </p>
                        <br />
                        <p>Thank you.</p>
                        <p>&copy;ChatterboxSM</p>
                    </div>
                </body>
            </html>
        `;
    }

    if ( action !== null && email !== null ) {
        let transporter = nodemailer.createTransport({
            host: process.env.host,
            port: process.env.port,
            secure: true,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPass
            }
        });
    
        var mailOptions = {
            from: 'donotreply@chatterboxsm.com',
            to: email, 
            subject: 'Please verify your ChatterboxSM account.',
            html: emailBody
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

server.listen();