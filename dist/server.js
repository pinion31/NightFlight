'use strict';

require('babel-polyfill');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nightflight');
mongoose.Promise = global.Promise;

var yelp = require('yelp-fusion');

var clientId = process.env.CLIENT_ID_YELP;
var clientSecret = process.env.CLIENT_KEY_YELP;

var idAssigner = mongoose.Schema({
  counter: Number
});

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
var Counter = mongoose.model('counter', idAssigner);

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
      var dbData = Array.from(response.jsonBody.businesses);
      serverClubList = [];

      results.forEach(function (club) {
        Club.findOne({ id: club.id }, function (err, result) {
          if (err) {
            console.log('error ' + err);
          }

          var clubResult = {
            id: club.id,
            name: club.name,
            occupants: [],
            image_url: club.image_url
          };

          if (result) {
            // if club already exists in db
            clubResult.occupants = result.occupants;
          } else {
            //create new Club entry if does not exist in db
            var newClub = new Club({
              id: club.id,
              name: club.name,
              occupants: []

            });

            //save new Club entry
            newClub.save(function (err, club) {
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
  }).catch(function (e) {
    console.log(e);
  });
});

app.post('/addSelf', function (req, res) {
  serverClubList.forEach(function (club) {
    if (club.id === req.body.id) {
      // finds matching club to add user
      var userAlreadyRSVPd = false;

      //
      club.occupants.forEach(function (user) {
        if (user === req.body.username) {
          //checks if user has already RSVP'ed
          userAlreadyRSVPd = true;
        }
      });

      if (!userAlreadyRSVPd) {
        //if user has not already RSVP'd, add user as going
        club.occupants.push(req.body.username);
        Club.findOneAndUpdate({ id: club.id }, { occupants: club.occupants }, function (err, response) {
          if (err) return err;
        });
      } else {
        //TODO: send back message -'You've already rsvp'ed'
      }
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