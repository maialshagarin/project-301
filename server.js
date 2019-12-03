'use strict';

require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');
const methodOverride = require('method-override')

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.error(err));
const server = express();

server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));

server.set('view engine', 'ejs');


/////////// these use as indirect method for use delete /////////
server.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))


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
server.delete('/delete/:number_id', deleteNumber);




/////// to save value in database and return it from database to the user ///////// 
function savednumbers(data) {
  let { number, type, text } = data;
  let SQL = 'INSERT INTO numbertable (number, type, text) VALUES ($1, $2, $3) RETURNING *';
  let values = [number, type, text];
  console.log('vallllllllllllllllll', values);
  return client.query(SQL, values)
    .then(results => results.rows[0])
    .catch(err => handleError(err, response));


};




////////// to get data from database if exist or go throw API if not ////////////////
server.post('/add', (req, res) => {
  let num = req.body.number;
  let type = req.body.items;
  // let SQL = `SELECT * FROM numbertable where type=${type}&& number=${num}`;

  // client.query(SQL, num, type)
  //   .then(data => {
  //     if (data.rows > 0) {
  //       res.send(results.rows[0]);

  //     } else {
        let url = `http://numbersapi.com/${num}/${type}?json`
        superagent.get(url)
          .then(data => {
            let item = {
              number: num,
              type: type,
              text: data.body.text
            };


            savednumbers(item)
              .then(record => {
                res.render('pages/yourChoice', { item: record })
                // .catch(err => handleError(err, response));


              });
          });
      // }
    });

//////////////////////////// to show  all of results in the result page //////////////////
  function getnumbers(req, res) {
    let SQL = 'SELECT * FROM numbertable;';
    return client.query(SQL)
      .then(results => {

        res.render('pages/results', { item: results.rows })

        .catch(err => handleError(err, response));


      })

  }
/////////////////////////// to delete the one you don't it to still in your page //////////////
  function deleteNumber(req, res) {
    let SQL = 'DElETE FROM numbertable WHERE number_id=$1'
    let values = [req.params.number_id]
    client.query(SQL, values)
      .then(res.redirect('/'))
      .catch(err => handleError(err, response));

    // .catch((error)=>errorHandler(error,res))
  }



  function handleError(error, response) {
    response.render('pages/error-view', {error: 'there is error'});
  }

  //////////// listen to port /////////////////////
  client.connect()
    .then(() => server.listen(PORT, () => console.log(`I'M  Alive ${PORT}`)));
