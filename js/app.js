import React from 'react';
import 'babel-polyfill';
import ReactDOM from 'react-dom';
import {HashRouter, BrowserRouter} from 'react-router-dom';
import '../sass/style.scss';
import RoutedApp from './components/RoutedApp';

ReactDOM.render(
  <HashRouter>
    <RoutedApp />
  </HashRouter>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
