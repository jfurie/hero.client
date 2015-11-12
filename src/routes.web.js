import Home from './containers/web/homeContainer';
import {LoginPage} from './containers/web/loginContainer';
import {LogoutPage} from './containers/web/logoutContainer';
import Restricted from './containers/web/restrictedContainer';
import {IndexRoute, Route} from 'react-router';
import React from 'react';
import * as authActions from './reducers/auth';
import LocalStorageClient from './utils/localStorageClient';

const localStorage = new LocalStorageClient('Auth');

export default (store) => {

  const requireLogin = (nextState, replaceState, cb) => {

    function checkAuth() {
      const { auth: { user }} = ((store) ? (store.getState()) : (null));

      if (!user) {
        let auth = localStorage.get('Auth');
        if (auth && auth.id && auth.ttl && auth.created && auth.userId) {
          store.dispatch(authActions.logginWithAuthLocalStorage()).then(() => {
            cb();
          });
        } else {
          replaceState(null, '/login?redirect=' + nextState.location.pathname);
        }
      }

      cb();
    }

    setTimeout(() => { // TMP
      checkAuth();
    }, 0);
  };

  return (

      <Route path="/">

        { /* Home (main) route */ }
        <IndexRoute component={Home}/>

        { /* Routes requiring login */ }
        <Route onEnter={requireLogin}>
          <Route path="restricted" component={Restricted}/>
          { /* <Route path="loginSuccess" component={LoginSuccess}/> */ }
        </Route>

        { /* Routes */ }
        <Route path="login" component={LoginPage}/>
        <Route path="logout" component={LogoutPage}/>
        <Route path="restricted" component={Restricted}/>

        { /* Catch all route */ }
        { /*  <Route path="*" component={NotFound} status={404} /> */ }

      </Route>
    );
};
