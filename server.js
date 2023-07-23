require('dotenv').config({ debug: false });

const url = require('url');
const express = require('express');

const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'text/plain');
  next();
});

app.set('view engine', 'pug');

const PORT = 4000 // process.env.PORT || 8000;

const mainController = require('./controllers/mailer');

app.get('/mailer', (req, res) => {
  let q = url.parse(req.url, true).query;

  let action = q.action;
  let email = q.e;
  let username = q.un;
  
  let verificationCode = null
  
  if (q.vc) {
    verificationCode = q.vc;
  }
  
  switch (action) {
    case 'verifyUser':
      mainController.sendVerifyUserEmail(email, username, verificationCode);
      break;
    case 'resetPass':
      mainController.sendForgotPasswordEmail(email, username);
      break;
    default:
      console.log('Email type not found.');
  }
  res.send('mailer path reached');
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));