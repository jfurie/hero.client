import {IndexRoute, Route} from 'react-router';
import React from 'react';
import * as authActions from './modules/auth';
import LocalStorageClient from './utils/localStorageClient';

// general containers
import Home from './containers/web/homeContainer';
import LoginPage from './containers/web/loginContainer';
import LogoutPage from './containers/web/logoutContainer';
import Restricted from './containers/web/restrictedContainer';
import InvitedPage from './containers/web/invitedContainer';
import ErrorPage from './containers/web/errorContainer';

// settings containers
import SettingsHomePage from './containers/web/settings/settingsHomeContainer';
import SettingsAccountPage from './containers/web/settings/SettingsAccountContainer';

// account containers
import AccountHomePage from './containers/web/account/accountHomeContainer';

// contacts
import ConctactsListPage from './containers/web/contacts/contactsListContainer';

const localStorage = new LocalStorageClient('Auth');

export default (store) => {

  /* block access if it's not a user */
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
          cb();
        }
      } else {
        cb();
      }
    }

    checkAuth();
  };

  const requireAccount = (nextState, replaceState, cb) => {

    function checkAuth() {
      const { auth: { authToken }} = ((store) ? (store.getState()) : (null));

      if (!authToken || !authToken.accountInfo || !authToken.accountInfo.account || !authToken.accountInfo.account.id) {
        replaceState(null, '/error?type=access');
      }

      cb();
    }

    checkAuth();
  };

  /* just load the user if logged in */
  const loadUser = (nextState, replaceState, cb) => {

    function checkAuth() {
      const { auth: { user }} = ((store) ? (store.getState()) : (null));

      if (!user) {
        let auth = localStorage.get('Auth');
        if (auth && auth.id && auth.ttl && auth.created && auth.userId) {
          store.dispatch(authActions.logginWithAuthLocalStorage()).then(() => {
            cb();
          });
        } else {
          cb();
        }
      } else {
        cb();
      }
    }

    setTimeout(() => { // TMP
      checkAuth();
    }, 0);
  };

  return (

      <Route path="/" onEnter={loadUser}>

        { /* Home (main) route */ }
        <IndexRoute component={Home} />
        <Route path="login" component={LoginPage}/>
        <Route path="error" component={ErrorPage}/>

        { /* Routes requiring login  */ }
        <Route onEnter={requireLogin}>
          <Route path="logout" component={LogoutPage}/>

          { /* Settings  */ }
          <Route path="settings">
            <IndexRoute component={SettingsHomePage}/>
            <Route path="account" onEnter={requireAccount} component={SettingsAccountPage}/>
          </Route>

          { /* Account  */ }
          <Route path="/account" onEnter={requireAccount}>
            <IndexRoute component={AccountHomePage}/>
            <Route path="/contacts" component={ConctactsListPage}/>
          </Route>
        </Route>
        <Route path="invited" component={InvitedPage}/>
        { /* Catch all route */ }
        { /*  <Route path="*" component={NotFound} status={404} /> */ }

      </Route>
    );
};
