
import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
//require('es6-promise').polyfill();
//require('isomorphic-fetch');
//var cors = require('cors');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');

const mongoose = require('mongoose');
const yelp = require('yelp-fusion');

mongoose.connect('mongodb://localhost/nightflight');
mongoose.Promise = global.Promise;

const clientId = process.env.CLIENT_ID_YELP;
const clientSecret = process.env.CLIENT_KEY_YELP;

const clubSchema = mongoose.Schema({
  id: String,
  name: String,
  attendees: Array,
});

const userSchema = mongoose.Schema({
  id: String,
  name: String,
  clubs: Array,
});

const Clubber = mongoose.model('user', userSchema);
const Club = mongoose.model('club', clubSchema);

let serverClubList = [];

const app = express();

app.use(express.static('static'));
//app.use(passport.initialize());
//app.use(passport.session());
/*app.use(bodyParser.urlencoded({
  extended: true
}));*/
app.use(bodyParser.json());

app.use(function(req, res, next){
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
     res.header('Access-Control-Allow-Credentials', "true");
     next();
 });

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: new Date(Date.now() + 3600000), secure: false }}));



passport.use(new TwitterStrategy({
    consumerKey: 'x2rfeTTyNcv8gswFNjfXdiGoH',
    consumerSecret: 'erZgMcrVqE6AfRvUiUPWeTxi8XwPB4ONmZcBl8zKqol1lQ0P4s',
    callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.dir(profile);
    console.log('getting token...');
   console.log('token is ' + token);
   console.log('tokenSecret is ' + tokenSecret);
  }
  ));

app.get('/login', (req,res) => {
  console.log('passport failure');

});
app.get('/callback', (req,res) => {
    console.log('successful callback');
});

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/callback',
                                     failureRedirect: '/login' })
);

app.post('/list', (req, res) => {
  yelp.accessToken(clientId, clientSecret).then((response) => {
    const client = yelp.client(response.jsonBody.access_token);

    const searchRequest = {
      term: 'nightlife',
      location: req.body.query,
    };

    client.search(searchRequest).then((response) => {
      const results = response.jsonBody.businesses;
      serverClubList = [];

      results.forEach((club) => {
        Club.findOne({id: club.id}, (err, result) => {
          if (err) { console.log(`error ${err}`); }
          console.dir(club);

          const clubResult = {
            id: club.id,
            name: club.name,
            attendees: [],
            image_url: club.image_url,
            goingMessage: '0 GOING',
            RSVPmessage: 'RSVP',
            address: club.location.address1,
            city: club.location.city,
            state: club.location.state,
            zipcode: club.location.zip_code,
            stars: club.rating,
            price: club.price,
          };

          if (result) { // if club already exists in db
            clubResult.attendees = result.attendees;
            clubResult.goingMessage = `${result.attendees.length} GOING`;
            // checks and  indicates if user is already going to this club
            result.attendees.forEach((occ) => {
              if (occ === req.body.name) {
                clubResult.goingMessage = `${result.attendees.length} GOING - YOU'RE GOING!`;
                clubResult.RSVPmessage = 'unRSVP';
              }
            });
          } else { // create new Club entry if does not exist in db
            const newClub = new Club({
              id: club.id,
              name: club.name,
              attendees: [],
              goingMessage: '0 GOING',
              RSVPmessage: 'RSVP',
              address: club.location.address1,
              city: club.location.city,
              state: club.location.state,
              zipcode: club.location.zip_code,
              stars: club.rating,
              price: club.price,
            });

            // save new Club entry
            newClub.save((err) => {
              if (err) return err;
            });
          }

          serverClubList.push(clubResult);

          if (serverClubList.length === results.length) {
            res.json(JSON.stringify(serverClubList));
          }
        });
      });
    });
  }).catch((e) => {
    console.log(e);
  });
});

// this url doubles as removeSelf too - user can toggle adding self and removing self
app.post('/addSelf', (req, res) => {
  serverClubList.forEach((club) => {
    if (club.id === req.body.id) { // finds corresponding club to add or remove user from
      let userAlreadyRSVPd = false;

      club.attendees = club.attendees.filter((user) => {
        // checks if user has already RSVP'ed--if so, removes user from occupant list
        if (user === req.body.username) {
          userAlreadyRSVPd = true;
          // resets goingMessage to one less occupant after user removal
          club.goingMessage = `${club.attendees.length - 1} GOING`;
          club.RSVPmessage = 'RSVP'; // resets RSVP button from unRSVP to RSVP
        } else {
          return user;
        }
      });

      if (!userAlreadyRSVPd) { // if user has not already RSVP'd, add user as going
        club.attendees.push(req.body.username);
        club.goingMessage = `${club.attendees.length} GOING - YOU'RE GOING!`;
        club.RSVPmessage = 'unRSVP';
      }

      // updates occupant list in DB
      Club.findOneAndUpdate({id: club.id}, {
        attendees: club.attendees,
        goingMessage: club.goingMessage,
        RSVPmessage: club.RSVPmessage},
      (err) => {
        if (err) return err;
      });
    }
  });

  res.json(JSON.stringify(serverClubList));
});

app.post('/getAttendees', (req, res) => {
  console.log('hit');
  res.json({list:['chris','nicole', 'corryn', 'krystle']});
});

app.get('*', (req, res) => {
  res.send('no match');
});

app.listen(3000, () => {
  console.log('App started on port 3000');
});
