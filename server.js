'use strict';

require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.error(err));

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
server.get('/results', getnumbers);
server.post('/add', savednumbers);
server.get('/', (req, res) => {
  res.render('pages/index');
  
});

function Number(data) {
  this.number = data.number;
  this.text = data.text;
  this.found = data.found;
  this.type = data.type;

}



function savednumbers(req, res) {
  console.log('jjjjjjjkjkjkjkjkj',item);
  
  let {number, type, text } = req.body;
  console.log(req.body);
  let SQL = 'INSERT INTO numbertable (number, type, text) VALUES ($1, $2, $3);';
  let values = [number, type, text];
  
  console.log('vallllllllllllllllll', values);
  client.query(SQL, values)
      .then(results => {
          res.redirect('/results');
      })
};

server.post('/add', (req, res) => {
  let num= req.body.number;
  let type = req.body.items;
  // let {number, type, text } = req.body;
  console.log('tye\n\n\n\n\n\n', type);
  let url =`http://numbersapi.com/${num}/${type}?json`
console.log ('urllllllllll', url);
   superagent.get(url)
  .then(data => {
    let item = data.body;
    console.log ('item', item );
  
      res.render('pages/results', {item: item})
       
  .then(stuff => {
    
    stuff=savednumbers();
  

   
 
 });

  })
 
});


function getnumbers(req, res) {
  let SQL = 'SELECT * FROM numbertable;';
  return client.query(SQL)
      .then(results => {
        
          res.render('pages/results', { item: results.rows });
      })
      
}


client.connect()
    .then(() => server.listen(PORT, () => console.log(`I'M  Alive ${PORT}`)));