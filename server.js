'use strict';

require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

const server = express();

server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }))

server.set('view engine', 'ejs');

server.get('/contact', (req, res) => {
  res.render('pages/contact')
});
server.get('/index', (req, res) => {
  res.render('pages/index')
});
server.get('/results', (req, res) => {
  res.render('pages/results')
});

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
  let num= req.body.number;
  let type = req.body.items
  console.log(num)
  let url =`http://numbersapi.com/${num}/${type}?json`
 
 
 


  return superagent.get(url)
  .then(data => {
    console.log('hhhhhh',data.body);
    let stuff = data.body;
         let x =  new Number(stuff);
      // console.log('numberitem', numberitem);
      res.render('pages/results', {item: x});
  });
});




server.listen(PORT, () => console.log(`I'M  Alive ${PORT}`));