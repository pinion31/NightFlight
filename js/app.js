import React from 'react';
import 'babel-polyfill';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1> Hello World says NightFlight </h1>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}