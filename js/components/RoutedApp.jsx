import React from 'react';
import YelpList from './YelpList';

const RoutedApp = () => (
  <div>
    <h1 className="homePageTitle">Night Flight</h1>
    <h1 className="homePageTagline">Let Your Friends Know Where You Are Going Tonight.</h1>
    <YelpList />
  </div>
);

// <footer>Developed By Chris Cantu</footer>
export default RoutedApp;
