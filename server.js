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
// server.post('/add', savednumbers);
server.get('/', (req, res) => {
  res.render('pages/index');
  
});
server.post('/addto', (req,res)=>{
  let {number, type, text} = req.body;
  console.log('reqqqqqqqq', req.body);
  
  let SQL = 'INSERT INTO numbertable (number, type, text) VALUES ($1, $2, $3);';
  let values = [number, type, text];
  
  console.log('vallllllllllllllllll', values);
  client.query(SQL, values)
      .then(results => {s
          res.redirect('/results');
      })

})

// function Number(data) {
//   this.number = data.number;
//   this.text = data.text;
//   this.found = data.found;
//   this.type = data.type;

// }



function savednumbers(data) {
  
  let {number, type, text } = data;
  // console.log(req.body);
  let SQL = 'INSERT INTO numbertable (number, type, text) VALUES ($1, $2, $3) RETURNING *' ;
  let values = [number, type, text];
  
  // console.log('vallllllllllllllllll', values);
  return client.query(SQL, values)
  .then(results => results.rows[0])
    
};

server.post('/add', (req, res) => {
  let num= req.body.number;
  let type = req.body.items;
  // let {number, type, text } = req.body;
  // console.log('tye\n\n\n\n\n\n', type);
  let url =`http://numbersapi.com/${num}/${type}?json`
// console.log ('urllllllllll', url);
   superagent.get(url)
  .then(data => {
    let item = {
      number: num,
      type: type,
      text: data.body.text
    };

    savednumbers(item)
    .then (record =>{
      res.render('pages/results', {item: record})

    })

  
       
 

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