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

let serverClubList = [];

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
    serverClubList = [];



    results.forEach(club => {
      Club.findOne({id:club.id}, (err,result) => {
        if (err) {console.log(`error ${err}`);}

        const clubResult =  {
              id: club.id,
              name:club.name,
              occupants:[],
              image_url:club.image_url,
              goingMessage: `0 GOING`
            };

        if (result) { // if club already exists in db
            clubResult.occupants = result.occupants;
            clubResult.goingMessage = `${result.occupants.length} GOING`;

            result.occupants.forEach(occ => { //checks and  indicates if user is already going to this club
              if (occ === req.body.name) {
                clubResult.goingMessage = `${result.occupants.length} GOING - YOU'RE GOING TO THIS CLUB TONIGHT!`;
              }
            });

        }
        else {//create new Club entry if does not exist in db
          const newClub = new Club({
            id: club.id,
            name: club.name,
            occupants: [],
            goingMessage: `0 GOING`

          });

          //save new Club entry
          newClub.save((err, club) => {
            if (err) {
               console.log('error!');
               console.dir(err);
            }

          });

        }

        serverClubList.push(clubResult);

       // console.log(`length = ${serverClubList.length}`);

        if (serverClubList.length === results.length) {
          res.json(JSON.stringify(serverClubList));
        }

      });
    });
  });
}).catch(e => {
    console.log(e);
  });
});

app.post('/addSelf', (req, res) => {
  serverClubList.forEach((club)=> {
    if (club.id === req.body.id) { // finds matching club to add user
      let userAlreadyRSVPd = false;

      //
      club.occupants.forEach(user => {
        if (user === req.body.username) { //checks if user has already RSVP'ed
          userAlreadyRSVPd = true;
        }
      });

      if (!userAlreadyRSVPd) { //if user has not already RSVP'd, add user as going
        club.occupants.push(req.body.username);
        club.goingMessage = `${club.occupants.length} GOING - YOU'RE GOING TO THIS CLUB TONIGHT!`;
        Club.findOneAndUpdate({id:club.id}, {
          occupants: club.occupants,
          goingMessage: club.goingMessage,},
          (err) => {
          if (err) return err;
           });

      }
      else {
        //TODO: send back message -'You've already rsvp'ed'
      }

    }
  });

  res.json(JSON.stringify(serverClubList));

});

app.get('*', (req, res) => {
    res.send('no match');
  });
app.listen(3000, () => {
  console.log('App started on port 3000');

});