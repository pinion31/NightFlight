import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';

const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const session = require('express-session');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const yelp = require('yelp-fusion');

mongoose.connect(process.env.MONGOLAB_URI); //production db
mongoose.Promise = global.Promise;

const clientId = process.env.CLIENT_ID_YELP;
const clientSecret = process.env.CLIENT_KEY_YELP;

const clubSchema = mongoose.Schema({
  id: String,
  name: String,
  attendees: Array,
});

const twitterUser = mongoose.Schema({
  twitterUser: {
    id: String,
    token: String,
    displayName: String,
    userName: String,
  }
});

const Club = mongoose.model('club', clubSchema);
const User = mongoose.model('twitterUser', twitterUser);

let serverClubList = [];

const app = express();

app.use(express.static('static'));
app.use(cookieparser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(session({secret: 'keyboard cat', cookie: {secure: false}, resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new TwitterStrategy({
  consumerKey: process.env.CLIENT_ID_TWITTER,
  consumerSecret: process.env.CLIENT_KEY_TWITTER,
  //callbackURL: 'https://nightflight.herokuapp.com/auth/twitter/callback'
  callbackURL: 'http://localhost:3000/auth/twitter/callback'
},
(token, tokenSecret, profile, done) => {
  User.findOne({'twitterUser.id': profile.id})
    .exec((err, user) => {
      if (user !== null) {
        return done(null, user);
      }
      const newUser = new User({
        twitterUser: {
          id: profile.id,
          token,
          displayName: profile.displayName,
          userName: profile.username
        }
      });

      newUser.save((err, data) => {
        if (err) {
          return done(err);
        }
        return done(null, data);
      });
    });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
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
  passport.authenticate('twitter', {failureRedirect: '/'}),
  (req, res) => {
    res.redirect(`/#/search/${req.user.twitterUser.userName}`);
  }
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
  Club.findOne({id: req.body.id}, (err, result) => {
    if (err) { return err; }
    res.json({list: result.attendees});
  });
});

app.get('*', (req, res) => {
  res.send('no match');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App started');
});
