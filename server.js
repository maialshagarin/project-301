'use strict';

require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

const server = express();

server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }))

server.set('view engine', 'ejs');


server.get('/enter', (req, res) => {
  res.render('pages/index');
});

function Number(data) {
  this.number = data.number;
  this.text = data.text;
  this.found = data.found;
  this.type = data.type;

}




server.post('/enter', (req, res) => {
  let url =`http://numbersapi.com/`;
  
  

  if (req.body.type === 'date') {
    url = url + req.body.number +'/'+ req.body.items + `?json`
   


  } else if (req.body.type === 'maths') {
    url= url + req.body.number +'/'+ req.body.items + `?json`


  } else if (req.body.type === 'trivia') {
    url = url + req.body.number +'/'+ req.body.items + `?json`
  }
  else if (req.body.type === 'year') {
    url = url + req.body.number +'/'+ req.body.items + `?json`


  }
 console.log('body', req.body);
 
 console.log("url",url);
  
 console.log("number", req.body.number);


  return superagent.get(url)
  .then(data => {
    console.log('hhhhhh',data.body);
    let stuff = data.body;
         let x =  new Number(stuff);
      console.log('numberitem', numberitem);
      res.render('pages/results', {item: x});
  });
});




server.listen(PORT, () => console.log(`I'M  Alive ${PORT}`));