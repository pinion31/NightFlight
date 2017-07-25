'use strict';

import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';
import express from 'express';
import bodyParser from 'body-parser';

const yelp = require('yelp-fusion');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nightflight');

const clientId = process.env.CLIENT_ID_YELP;
const clientSecret = process.env.CLIENT_KEY_YELP;


const idAssigner = mongoose.Schema({
  counter:Number,
});

const clubSchema = mongoose.Schema({
  id: Number,
  name: String,
  occupants: Array,

});

const userSchema = mongoose.Schema({
  id: Number,
  name: String,
  clubs: Array,
});

const User = mongoose.model('user', userSchema);
const Club = mongoose.model('club', clubSchema);
const Counter = mongoose.model('counter', idAssigner);



const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

app.post('/list', (req, res) => {
  yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);

  const searchRequest = {
    term:'nightlife',
    location: req.body.query,
  };

  client.search(searchRequest).then(response => {
    const results = response.jsonBody.businesses;
    console.dir(results);
    results.map(club => {
      const newClub = new Club({
        id: club.id,
        name: club.name,
        occupants: [],

      });
    });

    //const results = response.jsonBody.businesses;
    //const prettyJson = JSON.stringify(response.jsonBody.businesses[0]);
   // console.dir(JSON.stringify(response.jsonBody.businesses));
    res.json(JSON.stringify(results));
    });
  }).catch(e => {
    console.log(e);
  });
});

app.get('*', (req, res) => {
    res.send('no match');
  });
app.listen(3000, () => {
  console.log('App started on port 3000');

});