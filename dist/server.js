'use strict';

require('babel-polyfill');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yelp = require('yelp-fusion');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nightflight');

var clientId = process.env.CLIENT_ID_YELP;
var clientSecret = process.env.CLIENT_KEY_YELP;

var idAssigner = mongoose.Schema({
  counter: Number
});

var clubSchema = mongoose.Schema({
  id: Number,
  name: String,
  occupants: Array

});

var userSchema = mongoose.Schema({
  id: Number,
  name: String,
  clubs: Array
});

var User = mongoose.model('user', userSchema);
var Club = mongoose.model('club', clubSchema);
var Counter = mongoose.model('counter', idAssigner);

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
      console.dir(results);
      results.map(function (club) {
        var newClub = new Club({
          id: club.id,
          name: club.name,
          occupants: []

        });
      });

      //const results = response.jsonBody.businesses;
      //const prettyJson = JSON.stringify(response.jsonBody.businesses[0]);
      // console.dir(JSON.stringify(response.jsonBody.businesses));
      res.json(JSON.stringify(results));
    });
  }).catch(function (e) {
    console.log(e);
  });
});

app.get('*', function (req, res) {
  res.send('no match');
});
app.listen(3000, function () {
  console.log('App started on port 3000');
});
//# sourceMappingURL=server.js.map