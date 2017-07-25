import React, {Component} from 'react';
import {Provider} from 'react-redux';
//import {store} from
import YelpList from './YelpList';

class RoutedApp extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
      <h1>NightFlight</h1>
      <YelpList />
      </div>
    );
  }

}

export default RoutedApp