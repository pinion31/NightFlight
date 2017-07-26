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
      <h1 className='homePageTitle'>Night Flight</h1>
      <h1 className='homePageTagline'>Let Your Friends Know Where You Are Going Tonight.</h1>
       <YelpList />
      </div>
    );
  }

}

export default RoutedApp