'use strict';

import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';
import express from 'express';
import bodyParser from 'body-parser';

const yelp = require('yelp-fusion');

const clientId = process.env.CLIENT_ID_YELP;
const clientSecret = process.env.CLIENT_KEY_YELP;

const searchRequest = {
  term:'nightlife',
  location: 'austin, tx'
};



const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/list', (req, res) => {

  yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);

  client.search(searchRequest).then(response => {
    //const results = response.jsonBody.businesses[0];
    //const prettyJson = JSON.stringify(response.jsonBody.businesses[0]);
    console.dir(JSON.stringify(response.jsonBody.businesses));
    res.json(JSON.stringify(response.jsonBody.businesses));
    });
  }).catch(e => {
    console.log(e);
  });

  });


app.listen(3000, () => {
  console.log('App started on port 3000');

});