'use strict';

require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');
const methodOverride=require('method-override')

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.error(err));

// server.use(methodOverride((req, res) => {
//   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//     // look in urlencoded POST bodies and delete it
//     let method = req.body._method;
//     delete req.body._method;
//     return method;
//   }
// }))






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

server.get('/results', getnumbers);



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

    let SQL = `SELECT * FROM numbertable where type=${type}&& number=${num}` ;
    if (results.rows>0){
      res.render('pages/yourChoice' , results)
    }else {

  // SELECT IF  (num ='number' && type ='type' )




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
      res.render('pages/yourChoice', {item: record})

    })
  })   
}
});


function getnumbers(req, res) {
  let SQL = 'SELECT * FROM numbertable;';
  return client.query(SQL)
      .then(results => {
        
          res.render('pages/results', { item: results.rows });
          
      })
      
}



server.delete('/delete/:book_id',(request,response)=>{

  // need SQL to update the specific task that we were on
  let SQL = `DELETE FROM books WHERE id=$1;`;
  // use request.params.task_id === whatever task we were on
  let values = [request.params.book_id];

  client.query(SQL, values)
    .then(response.redirect('/'))
    // .catch(err => errorHandler(err, response));

})


client.connect()
    .then(() => server.listen(PORT, () => console.log(`I'M  Alive ${PORT}`)));