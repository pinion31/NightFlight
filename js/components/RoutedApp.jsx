import React from 'react';
import {Route} from 'react-router';
import {Switch} from 'react-router-dom';
import YelpList from './YelpList';


const NoMatch = () => <h2>This page does not exist! Please go back!</h2>;

const Login = () => (
  <div className="login">
    <a href="/auth/twitter">
      <img src="twitterbutton.png" alt="sign in with twitter" />
    </a>
  </div>
);

const MainContent = () => (
  <Switch>
    <Route exact path="/" component={Login} />
    <Route path="/search/:id" component={YelpList} />
    <Route path="*" component={NoMatch} />
  </Switch>
);

const Footer = () => (
  <div className="footer">
    <div />
  </div>
);

const RoutedApp = () => (
  <div>
    <h1 className="homePageTitle">Night Flight</h1>
    <h1 className="homePageTagline">Let Your Friends Know Where You Are Going Tonight.</h1>
    <MainContent />
    <Footer />
  </div>
);

export default RoutedApp;
