import {IndexRoute, Route} from 'react-router';
import React from 'react';
import * as authActions from './modules/auth';
import LocalStorageClient from './utils/localStorageClient';

// general containers
import Home from './containers/web/homeContainer';
import LoginPage from './containers/web/login/loginContainer';
import LogoutPage from './containers/web/logoutContainer';
import InvitedPage from './containers/web/invited/invitedContainer';
import ErrorPage from './containers/web/errorContainer';
import Layout from './containers/web/layoutContainer';

// settings containers
import SettingsHomePage from './containers/web/settings/settingsHomeContainer';
import SettingsAccountPage from './containers/web/settings/settingsAccountContainer';

// account containers
import AccountHomePage from './containers/web/account/accountHomeContainer';

// candidates
import MyCandidatesPage from './containers/web/candidates/myCandidatesContainer';
import CandidateSearchContainer from './containers/web/candidates/candidateSearchContainer';
// clients
import ClientsPage from './containers/web/clients/clientsContainer';
import ClientDetailsPage from './containers/web/clients/clientDetailsContainer';

//jobs
import JobsDetailsPage from './containers/web/jobs/jobDetailsContainer';
import MyJobsPage from './containers/web/jobs/myJobsContainer';


const localStorage = new LocalStorageClient('Auth');

function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  let results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default(store) => {

  /* block access if it's not a user */
  const requireLogin = (nextState, replaceState, cb) => {

    function checkAuth() {
      const { auth: { user } } = ((store) ? (store.getState()) : (null));

      if (!user) {
        let auth = localStorage.get('Auth');
        if (auth && auth.id && auth.ttl && auth.created && auth.userId) {
          store.dispatch(authActions.logginWithAuthLocalStorage()).then(() => {
            cb();
          });
        } else {
          replaceState(null, `/login?redirect=${nextState.location.pathname}`);
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
      const { auth: { authToken } } = ((store) ? (store.getState()) : (null));

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
      const { auth: { user } } = ((store) ? (store.getState()) : (null));
      if (!user) {
        let auth = localStorage.get('Auth');
        let tokenParam = getParameterByName('accessToken');

        console.log(tokenParam);

        if (auth && auth.id && auth.ttl && auth.created && auth.userId) {
          store.dispatch(authActions.logginWithAuthLocalStorage()).then(() => {
            cb();
          });
        } else if (tokenParam) {
          store.dispatch(authActions.logginWithAccessToken(tokenParam)).then(() => {
            cb();
          });
        } else {
          cb();
        }
      } else {
        cb();
      }

      // hide splash if here
      setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
      }, 1250);

    }

    setTimeout(() => { // TMP
      checkAuth();
    }, 0);
  };

  const checkLogin = (nextState, replaceState, cb) => {
    const { auth: { user } } = ((store) ? (store.getState()) : (null));
    if (user) { /* already logged */
      replaceState(null, '/');
    }
    cb();
  };

  return (

    <Route path="/" onEnter={loadUser}>
      <Route component={Layout}>

        <Route path="login" onEnter={checkLogin} component={LoginPage}/>
        <Route path="error" component={ErrorPage}/>

        {/* Routes requiring login  */}
        <Route onEnter={requireLogin}>
          <IndexRoute component={Home}/>
          <Route path="logout" component={LogoutPage}/>

          {/* Clients */}
          <Route path="clients">
            <IndexRoute component={ClientsPage}/>
            <Route path=":id" component={ClientDetailsPage} />
            <Route path=":id/jobs" component={ClientDetailsPage} onEnter={(nextState) => {
              nextState.params.tab = 'jobs';
            }} />
            <Route path=":id/jobs/:jobId" component={ClientDetailsPage} />
            <Route path=":id/jobs(/:create)" component={ClientDetailsPage} />
            <Route path=":id" component={ClientDetailsPage} />
              <Route path=":id/notes" component={ClientDetailsPage}
                onEnter={(nextState) => {
                  nextState.params.tab = 'notes';
                }} />
          </Route>

          <Route path="jobs">
            <IndexRoute component={MyJobsPage}/>
            <Route path=":id" component={JobsDetailsPage} />
          </Route>

          {/*<Route path="/myjobs" component={MyJobsPage}/>*/}
          <Route path="candidates">
            <IndexRoute component={MyCandidatesPage}/>
            <Route path="search" component={CandidateSearchContainer} />
          </Route>

          {/* Settings  */}
          <Route path="settings">
            <IndexRoute component={SettingsHomePage}/>
            <Route path="account" onEnter={requireAccount} component={SettingsAccountPage}/>
          </Route>


          {/* Account  */}
          <Route path="/account" onEnter={requireAccount}>
            <IndexRoute component={AccountHomePage}/>
            {/* <Route path="/contacts" component={ConctactsListPage}/> */}
          </Route>

        </Route>

        <Route path="invited" component={InvitedPage}/>
        {/* Catch all route */}
        {/*  <Route path="*" component={NotFound} status={404} /> */}

      </Route>
    </Route>
  );
};
