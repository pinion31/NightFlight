'use strict';

import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';
import express from 'express';
import bodyParser from 'body-parser';

const yelp = require('yelp-fusion');

const clientId = process.env.CLIENT_ID_YELP;
const clientSecret = process.env.CLIENT_KEY_YELP;





const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

app.post('/list', (req, res) => {
  console.log('getting');
  console.dir(req.body.query);

  yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);

  const searchRequest = {
    term:'nightlife',
    location: req.body.query,
  };

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

app.get('*', (req, res) => {
    res.send('no match');
  });
app.listen(3000, () => {
  console.log('App started on port 3000');

});