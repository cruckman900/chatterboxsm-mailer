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

    let verificationCode = null;
    let link = null;

    if (q.vc) {
        verificationCode = q.vc;
    }

    if (q.li) {
        link = q.li;
    }

    sendMail(action, email, userName, verificationCode, link);

    res.write('I love you, Alexa!!');
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
                <body>
                    <div style="margin: 0 1rem; max-width: 600px">
                        <p>Hello ${userName}</p>
                        <p>
                            Please use the verification code below to 
                            verify your user account on chatterboxsm.com
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
    } else if (action === 'resetPass') {
        subject = 'In response to your ChatterboxSM password reset request:'
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
                            https://${link}?un=${userName}
                        </p>
                        <br />
                        <p>Thank you.</p>
                        <p>Admin at &copy;ChatterboxSM</p>
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
            subject: subject,
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