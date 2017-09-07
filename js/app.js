import React from 'react';
import 'babel-polyfill';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import '../sass/style.scss';
import RoutedApp from './components/RoutedApp';

ReactDOM.render(
  <BrowserRouter>
    <RoutedApp />
  </BrowserRouter>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
