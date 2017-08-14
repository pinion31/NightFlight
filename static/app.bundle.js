webpackJsonp([0],{

/***/ 335:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(228);

var _reactDom = __webpack_require__(31);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouterDom = __webpack_require__(134);

__webpack_require__(649);

var _RoutedApp = __webpack_require__(650);

var _RoutedApp2 = _interopRequireDefault(_RoutedApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(
  _reactRouterDom.HashRouter,
  null,
  _react2.default.createElement(_RoutedApp2.default, null)
), document.getElementById('app'));

if (false) {
  module.hot.accept();
}

/***/ }),

/***/ 649:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 650:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(32);

var _reactRouterDom = __webpack_require__(134);

var _YelpList = __webpack_require__(651);

var _YelpList2 = _interopRequireDefault(_YelpList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NoMatch = function NoMatch() {
  return _react2.default.createElement(
    'h2',
    null,
    'This page does not exist! Please go back!'
  );
};

var Login = function Login() {
  return _react2.default.createElement(
    'div',
    { className: 'login' },
    _react2.default.createElement(
      'a',
      { href: '/auth/twitter' },
      _react2.default.createElement('img', { src: 'twitterbutton.png', alt: 'sign in with twitter' })
    )
  );
};

var MainContent = function MainContent() {
  return _react2.default.createElement(
    _reactRouterDom.Switch,
    null,
    _react2.default.createElement(_reactRouter.Route, { exact: true, path: '/', component: Login }),
    _react2.default.createElement(_reactRouter.Route, { path: '/search/:id', component: _YelpList2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch })
  );
};

var RoutedApp = function RoutedApp() {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h1',
      { className: 'homePageTitle' },
      'Night Flight'
    ),
    _react2.default.createElement(
      'h1',
      { className: 'homePageTagline' },
      'Let Your Friends Know Where You Are Going Tonight.'
    ),
    _react2.default.createElement(MainContent, null)
  );
};

exports.default = RoutedApp;

/***/ }),

/***/ 651:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(285);

__webpack_require__(333);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YelpList = function (_Component) {
  _inherits(YelpList, _Component);

  function YelpList(props) {
    _classCallCheck(this, YelpList);

    var _this = _possibleConstructorReturn(this, (YelpList.__proto__ || Object.getPrototypeOf(YelpList)).call(this, props));

    _this.state = {
      barList: [],
      query: '',
      attendeeList: { list: [] },
      showModal: false
    };

    _this.retrieveSearchData = _this.retrieveSearchData.bind(_this);
    _this.setQuery = _this.setQuery.bind(_this);
    _this.addSelf = _this.addSelf.bind(_this);
    _this.toggleGoingModal = _this.toggleGoingModal.bind(_this);
    return _this;
  }

  _createClass(YelpList, [{
    key: 'setQuery',
    value: function setQuery(e) {
      this.setState({
        query: e.target.value
      });
    }
  }, {
    key: 'retrieveSearchData',
    value: function retrieveSearchData(e) {
      var _this2 = this;

      e.preventDefault();

      fetch('/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: this.state.query, name: this.props.match.params.id })
      }).then(function (res) {
        res.json().then(function (result) {
          _this2.setState({
            barList: JSON.parse(result)
          });
        });
      });
    }
  }, {
    key: 'toggleGoingModal',
    value: function toggleGoingModal(e) {
      var _this3 = this;

      if (!this.state.showModal) {
        fetch('/getAttendees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: e.target.name })
        }).then(function (res) {
          res.json().then(function (result) {
            _this3.setState({
              showModal: true,
              attendeeList: result
            });
          });
        });
      } else {
        this.setState({
          showModal: false
        });
      }
    }
  }, {
    key: 'addSelf',
    value: function addSelf(e) {
      var _this4 = this;

      fetch('/addSelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.props.match.params.id, id: e.target.name })
      }).then(function (res) {
        res.json().then(function (result) {
          _this4.setState({
            barList: JSON.parse(result)
          });
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _reactBootstrap.Col,
          { md: 9, mdOffset: 2, sm: 9, smOffset: 2, xs: 10, xsOffset: 1, lg: 9, lgOffset: 2 },
          _react2.default.createElement(
            _reactBootstrap.Form,
            { inline: true },
            _react2.default.createElement(
              _reactBootstrap.FormGroup,
              { className: 'search-field' },
              _react2.default.createElement(_reactBootstrap.FormControl, {
                name: 'query',
                type: 'text',
                placeholder: 'City, State',
                onChange: this.setQuery,
                maxLength: '47'
              }),
              _react2.default.createElement(
                _reactBootstrap.Button,
                { bsStyle: 'info', className: 'search-button', onClick: this.retrieveSearchData },
                'Search'
              )
            )
          )
        ),
        this.state.barList.map(function (result, key) {
          var titleFontSize = result.name.length > 20 ? 'small-title' : 'large-title';
          var addressBar = result.address.length === 0 ? 'No Street Address' : result.address;

          return _react2.default.createElement(
            'div',
            { key: key },
            _react2.default.createElement(
              _reactBootstrap.Col,
              { md: 8, mdOffset: 2, sm: 12, xs: 12, lg: 8, lgOffset: 2 },
              _react2.default.createElement(
                _reactBootstrap.Media,
                { className: 'card' },
                _react2.default.createElement(
                  _reactBootstrap.Media.Left,
                  { align: 'top' },
                  _react2.default.createElement(_reactBootstrap.Image, { className: 'clubImage', src: result.image_url, alt: result.name })
                ),
                _react2.default.createElement(
                  _reactBootstrap.Media.Body,
                  null,
                  _react2.default.createElement(
                    'p',
                    { className: 'card-title ' + titleFontSize },
                    result.name
                  ),
                  _react2.default.createElement(
                    _reactBootstrap.Button,
                    { className: 'RSVP', bsStyle: 'danger', name: result.id, onClick: _this5.addSelf },
                    result.RSVPmessage
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'address' },
                    _react2.default.createElement(
                      'p',
                      null,
                      addressBar
                    ),
                    _react2.default.createElement(
                      'p',
                      null,
                      result.city + ', ' + result.state + ' ' + result.zipcode
                    )
                  ),
                  _react2.default.createElement(
                    _reactBootstrap.Row,
                    null,
                    _react2.default.createElement(
                      _reactBootstrap.Col,
                      { md: 8, mdOffset: 2, sm: 12, xs: 12, lg: 12, lgOffset: 0 },
                      _react2.default.createElement(
                        'div',
                        { className: 'cardBottom' },
                        _react2.default.createElement(
                          'p',
                          { className: 'going-message' },
                          result.goingMessage
                        ),
                        _react2.default.createElement(
                          'p',
                          { className: 'rating-message' },
                          'Rating: ' + result.stars
                        ),
                        _react2.default.createElement(
                          _reactBootstrap.Button,
                          { name: result.id, className: 'goingButton', bsStyle: 'danger', onClick: _this5.toggleGoingModal },
                          "See Who's Going"
                        )
                      )
                    )
                  )
                )
              )
            )
          );
        }),
        _react2.default.createElement(
          _reactBootstrap.Modal,
          {
            show: this.state.showModal,
            bsSize: 'small',
            'aria-labelledby': 'contained-modal-title-sm',
            onHide: this.toggleGoingModal
          },
          _react2.default.createElement(
            _reactBootstrap.Modal.Header,
            { closeButton: true },
            _react2.default.createElement(
              _reactBootstrap.Modal.Title,
              { id: 'contained-modal-title-sm' },
              'Club Attendees'
            )
          ),
          _react2.default.createElement(
            _reactBootstrap.Modal.Body,
            null,
            this.state.attendeeList.list.map(function (attendee, key) {
              return _react2.default.createElement(
                'a',
                { key: key, href: 'https://twitter.com/' + attendee, target: '_blank' },
                _react2.default.createElement(
                  'b',
                  null,
                  '@' + attendee + ','
                )
              );
            })
          ),
          _react2.default.createElement(
            _reactBootstrap.Modal.Footer,
            null,
            _react2.default.createElement(
              _reactBootstrap.Button,
              { className: 'goingButton', onClick: this.toggleGoingModal },
              'Close'
            )
          )
        )
      );
    }
  }]);

  return YelpList;
}(_react.Component);

YelpList.propTypes = {
  barList: _react2.default.PropTypes.array,
  query: _react2.default.PropTypes.string,
  attendeeList: _react2.default.PropTypes.object,
  showModal: _react2.default.PropTypes.bool
};

exports.default = YelpList;

/***/ })

},[335]);
//# sourceMappingURL=app.bundle.js.map