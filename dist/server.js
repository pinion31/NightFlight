'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
var yelp = require('yelp-fusion');

mongoose.connect('mongodb://localhost/nightflight');
mongoose.Promise = global.Promise;

var clientId = process.env.CLIENT_ID_YELP;
var clientSecret = process.env.CLIENT_KEY_YELP;

var clubSchema = mongoose.Schema({
  id: String,
  name: String,
  occupants: Array

});

var userSchema = mongoose.Schema({
  id: String,
  name: String,
  clubs: Array
});

var Clubber = mongoose.model('user', userSchema);
var Club = mongoose.model('club', clubSchema);

var serverClubList = [];

var app = (0, _express2.default)();

app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

app.post('/list', function (req, res) {
  yelp.accessToken(clientId, clientSecret).then(function (response) {
    var client = yelp.client(response.jsonBody.access_token);

    var searchRequest = {
      term: 'nightlife',
      location: req.body.query
    };

    client.search(searchRequest).then(function (response) {
      var results = response.jsonBody.businesses;
      serverClubList = [];

      results.forEach(function (club) {
        Club.findOne({ id: club.id }, function (err, result) {
          if (err) {
            console.log('error ' + err);
          }
          console.dir(club);

          var clubResult = {
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
            price: club.price
          };

          if (result) {
            // if club already exists in db
            clubResult.occupants = result.occupants;
            clubResult.goingMessage = result.occupants.length + ' GOING';
            // checks and  indicates if user is already going to this club
            result.occupants.forEach(function (occ) {
              if (occ === req.body.name) {
                clubResult.goingMessage = result.occupants.length + ' GOING - YOU\'RE GOING!';
                clubResult.RSVPmessage = 'unRSVP';
              }
            });
          } else {
            // create new Club entry if does not exist in db
            var newClub = new Club({
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
              price: club.price
            });

            // save new Club entry
            newClub.save(function (err) {
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
  }).catch(function (e) {
    console.log(e);
  });
});

// this url doubles as removeSelf too - user can toggle adding self and removing self
app.post('/addSelf', function (req, res) {
  serverClubList.forEach(function (club) {
    if (club.id === req.body.id) {
      // finds corresponding club to add or remove user from
      var userAlreadyRSVPd = false;

      club.occupants = club.occupants.filter(function (user) {
        // checks if user has already RSVP'ed--if so, removes user from occupant list
        if (user === req.body.username) {
          userAlreadyRSVPd = true;
          // resets goingMessage to one less occupant after user removal
          club.goingMessage = club.occupants.length - 1 + ' GOING';
          club.RSVPmessage = 'RSVP'; // resets RSVP button from unRSVP to RSVP
        } else {
          return user;
        }
      });

      if (!userAlreadyRSVPd) {
        // if user has not already RSVP'd, add user as going
        club.occupants.push(req.body.username);
        club.goingMessage = club.occupants.length + ' GOING - YOU\'RE GOING!';
        club.RSVPmessage = 'unRSVP';
      }

      // updates occupant list in DB
      Club.findOneAndUpdate({ id: club.id }, {
        occupants: club.occupants,
        goingMessage: club.goingMessage,
        RSVPmessage: club.RSVPmessage }, function (err) {
        if (err) return err;
      });
    }
  });

  res.json(JSON.stringify(serverClubList));
});

app.get('*', function (req, res) {
  res.send('no match');
});

app.listen(3000, function () {
  console.log('App started on port 3000');
});
//# sourceMappingURL=server.js.map