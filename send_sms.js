require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client =require('twilio')(accountSid ,authToken);

client.messages
.create({
to :'+962791903635',
from :'+12562729525',
body :' you do agreat job'

})

.then((message) => console.log('Good', message.sid))
.catch(error =>(console.error('Error', error)));

