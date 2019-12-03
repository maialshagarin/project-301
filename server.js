'use strict';

require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

const server = express();

///////////////////////////////twilio 

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client =require('twilio')(accountSid ,authToken);

// client.messages
// .create({
// to :'+962772518040',
// from :'+12562729525',
// body :' you do agreat shop'

// })

// .then((message) => console.log(message.sid))
// .catch(error =>(console.error(error)));

// const http = require('http');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;


// server.post('/sms', (req, res) => {
//   const twiml = new MessagingResponse();

//   twiml.message('The Robots are coming! Head for the hills!');

//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.end(twiml.toString());
// });


server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }))

server.set('view engine', 'ejs');

server.get('/views', (req, res) =>
  res.status(200).send('hi'))


server.get('/message', (req, res) => {

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
      to: '+962772518040',
      from: '+12562729525',
      body: ' you do agreat shop'

    })

    .then((message) => res.status(200).send(message.sid))
    .catch(error => res.send('ERROR', error));

})




server.listen(PORT, () => console.log(`I'M  Alive ${PORT}`));