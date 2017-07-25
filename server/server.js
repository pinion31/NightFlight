'use strict';

import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';
import express from 'express';
import bodyParser from 'body-parser';
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nightflight');
mongoose.Promise = global.Promise;

const yelp = require('yelp-fusion');

const clientId = process.env.CLIENT_ID_YELP;
const clientSecret = process.env.CLIENT_KEY_YELP;

const idAssigner = mongoose.Schema({
  counter:Number,
});

const clubSchema = mongoose.Schema({
  id: String,
  name: String,
  occupants: Array,

});

const userSchema = mongoose.Schema({
  id: String,
  name: String,
  clubs: Array,
});

const Clubber = mongoose.model('user', userSchema);
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
    const dbData = Array.from(response.jsonBody.businesses);
    const clubsToReturn = [];



    results.forEach(club => {
      Club.findOne({id:club.id}, (err,result) => {
        if (err) {console.log(`error ${err}`);}

        const clubResult =  {
              id: club.id,
              name:club.name,
              occupants:[],
              image_url:club.image_url
            };

        if (result) { // if club already exists in db
            clubResult.occupants = result.occupants;
        }
        else {//create new Club entry if does not exist in db
          const newClub = new Club({
            id: club.id,
            name: club.name,
            occupants: [],

          });

          //save new Club entry
          newClub.save((err, club) => {
            if (err) {
               console.log('error!');
               console.dir(err);
            }
            console.log('club saved');
          });

        }

        clubsToReturn.push(clubResult);

       // console.log(`length = ${clubsToReturn.length}`);

        if (clubsToReturn.length === results.length) {
          console.dir(clubResult);
          res.json(JSON.stringify(clubsToReturn));
        }

      });
    });
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