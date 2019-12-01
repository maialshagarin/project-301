'use strict';

require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

const server = express();

server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }))

server.set('view engine', 'ejs');




server.get('./views', (req, res) => {

    res.render('views/index');


})




server.listen(PORT, () => console.log(`I'M  Alive ${PORT}`));