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

var clientId = process.env.CLIENT_ID_YELP;
var clientSecret = process.env.CLIENT_KEY_YELP;

var searchRequest = {
  term: 'nightlife',
  location: 'austin, tx'
};

var app = (0, _express2.default)();

app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

app.get('/list', function (req, res) {

  yelp.accessToken(clientId, clientSecret).then(function (response) {
    var client = yelp.client(response.jsonBody.access_token);

    client.search(searchRequest).then(function (response) {
      //const results = response.jsonBody.businesses[0];
      //const prettyJson = JSON.stringify(response.jsonBody.businesses[0]);
      console.dir(JSON.stringify(response.jsonBody.businesses));
      res.json(JSON.stringify(response.jsonBody.businesses));
    });
  }).catch(function (e) {
    console.log(e);
  });
});

app.listen(3000, function () {
  console.log('App started on port 3000');
});
//# sourceMappingURL=server.js.map