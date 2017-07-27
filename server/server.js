
import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';

const mongoose = require('mongoose');
const yelp = require('yelp-fusion');

mongoose.connect('mongodb://localhost/nightflight');
mongoose.Promise = global.Promise;

const clientId = process.env.CLIENT_ID_YELP;
const clientSecret = process.env.CLIENT_KEY_YELP;

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

let serverClubList = [];

const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

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
            occupants: [],
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
            clubResult.occupants = result.occupants;
            clubResult.goingMessage = `${result.occupants.length} GOING`;
            // checks and  indicates if user is already going to this club
            result.occupants.forEach((occ) => {
              if (occ === req.body.name) {
                clubResult.goingMessage = `${result.occupants.length} GOING - YOU'RE GOING!`;
                clubResult.RSVPmessage = 'unRSVP';
              }
            });
          } else { // create new Club entry if does not exist in db
            const newClub = new Club({
              id: club.id,
              name: club.name,
              occupants: [],
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

      club.occupants = club.occupants.filter((user) => {
        // checks if user has already RSVP'ed--if so, removes user from occupant list
        if (user === req.body.username) {
          userAlreadyRSVPd = true;
          // resets goingMessage to one less occupant after user removal
          club.goingMessage = `${club.occupants.length - 1} GOING`;
          club.RSVPmessage = 'RSVP'; // resets RSVP button from unRSVP to RSVP
        } else {
          return user;
        }
      });

      if (!userAlreadyRSVPd) { // if user has not already RSVP'd, add user as going
        club.occupants.push(req.body.username);
        club.goingMessage = `${club.occupants.length} GOING - YOU'RE GOING!`;
        club.RSVPmessage = 'unRSVP';
      }

      // updates occupant list in DB
      Club.findOneAndUpdate({id: club.id}, {
        occupants: club.occupants,
        goingMessage: club.goingMessage,
        RSVPmessage: club.RSVPmessage},
      (err) => {
        if (err) return err;
      });
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
