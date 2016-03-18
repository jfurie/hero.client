import {IndexRoute, Route} from 'react-router';
import React from 'react';
import * as authActions from './modules/auth';

// general containers
import Home from './containers/web/homeContainer';
import LoginPage from './containers/web/login/loginContainer';
import LogoutPage from './containers/web/logoutContainer';
import InvitedPage from './containers/web/invited/invitedContainer';
import ErrorPage from './containers/web/errorContainer';
import EmptyPage from './containers/web/emptyContainer';
import Layout from './containers/web/layoutContainer';



// settings containers
import SettingsHomePage from './containers/web/settings/settingsHomeContainer';
import SettingsAccountPage from './containers/web/settings/settingsAccountContainer';

// account containers
import AccountHomePage from './containers/web/account/accountHomeContainer';

// contacts
import ContactDetailsPage from './containers/web/contacts/contactDetailsContainer';
import ContactSearchContainer from './containers/web/contacts/contactSearchContainer';
import ContactCreatePage from './containers/web/contacts/contactCreateContainer';
import ContactEditCategoriesContainer from './containers/web/contacts/contactEditCategoriesContainer';
// candidates
import MyCandidatesPage from './containers/web/candidates/myCandidatesContainer';
import CandidateDetailsPage from './containers/web/candidates/candidateDetailsContainer';
import CandidateSearchContainer from './containers/web/candidates/candidateSearchContainer';

// clients
import ClientsPage from './containers/web/clients/clientsContainer';
import ClientDetailsPage from './containers/web/clients/clientDetailsContainer';
import ClientSearchContainer from './containers/web/clients/clientSearchContainer';
import ClientCreatePage from './containers/web/clients/clientCreateContainer';

//jobs
import JobDetailsPage from './containers/web/jobs/jobDetailsContainer';
import JobSearchContainer from './containers/web/jobs/jobSearchContainer';
import MyJobsPage from './containers/web/jobs/myJobsContainer';
import JobCreatePage from './containers/web/jobs/jobCreateContainer';
import JobEditPage from './containers/web/jobs/jobEditContainer';

//search
import SearchContainer from './containers/web/search/searchContainer';
//notes
import NoteCreatePage from './containers/web/notes/noteCreateContainer';

import TestPage from './containers/web/testContainer';


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
      const auth = store.getState().auth;
      let authToken = auth.get('authToken');
      console.log('checkAuth');
      if (authToken) {
        store.dispatch(authActions.checkAuthServer(authToken.get('id')));
        store.dispatch(authActions.logginWithAuthLocalStorage());
        cb();
      } else {
        replaceState(null, `/login?redirect=${nextState.location.pathname}`);
        cb();
      }
    }

    checkAuth();
  };

  const requireAccount = (nextState, replaceState, cb) => {

    function checkAuth() {
      const auth = store.getState().auth;
      let authToken = auth.get('authToken');

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
      const auth = store.getState().auth;
      let tokenParam = getParameterByName('accessToken');

      if (auth.get('authToken')) {
        store.dispatch(authActions.logginWithAuthLocalStorage());
        cb();
      } else if (tokenParam) {
        store.dispatch(authActions.logginWithAccessToken(tokenParam,cb));
      } else {
        //replaceState(null, `/login?redirect=${nextState.location.pathname}`);
        cb();
      }

      // hide splash if here
      setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
      }, 0);

    }

    setTimeout(() => { // TMP
      checkAuth();
    }, 0);
  };

  const checkLogin = (nextState, replaceState, cb) => {
    const auth = store.getState().auth;
    if (auth.get('authToken')) { /* already logged */
      replaceState(null, '/');
    }
    cb();
  };

  return (
    <Route path="/" onUpdate={() => window.scrollTo(0, 0)} onEnter={loadUser}>
    <Route path="test" component={TestPage}/>
      <Route component={Layout}>
        <Route path="login" onEnter={checkLogin} component={LoginPage}/>
        <Route path="error" component={ErrorPage}/>

        {/* Routes requiring login  */}
        <Route onEnter={requireLogin}>
          <Route component={Home}>
            <IndexRoute component={EmptyPage}/>
          </Route>

          <Route path="logout" component={LogoutPage}/>


          {/* Clients */}
          <Route path="clients">
            <IndexRoute component={ClientsPage} />
            <Route path="search" component={ClientSearchContainer} />
            <Route path=":companyId/contacts/search" component={ContactSearchContainer} />
            <Route path=":companyId/contacts/:contactId/create" component={ContactCreatePage} />
            <Route path=":companyId/jobs/search" component={JobSearchContainer} />
            <Route path=":companyId/jobs/:jobId/create" component={JobCreatePage} />
            <Route path=":companyId/jobs/:jobId/edit" component={JobEditPage} />
            <Route path=":companyId/jobs/:jobId/candidates/search" component={ContactSearchContainer} />
            <Route path=":companyId/jobs/:jobId/candidates/:contactId/create" component={ContactCreatePage} />
            <Route path=":companyId/notes/:noteId/create" component={NoteCreatePage} />
            <Route path=":companyId/jobs/:jobId/notes/:noteId/create" component={NoteCreatePage} />
            <Route path=":companyId/create" component={ClientCreatePage} />
            <Route path=":companyId" component={ClientDetailsPage} onEnter={(nextState) => {
              nextState.params.clientDetailsOpen = true;}}
            />
            <Route path=":id/jobs" component={ClientDetailsPage} onEnter={(nextState) => {
              nextState.params.tab = 'jobs';}}
            />
            <Route path=":id/jobs/:jobId" component={JobDetailsPage} />
            <Route path=":id/jobs(/:create)" component={ClientDetailsPage} />
            <Route path=":id" component={ClientDetailsPage} />
            <Route path=":id/notes" component={ClientDetailsPage} onEnter={(nextState) => {
              nextState.params.tab = 'notes';}}
            />
          </Route>

          {/* Contacts */}
          <Route path="contacts">
            {/* <IndexRoute component={ClientsPage}/> */}
            <Route path="search" component={ContactSearchContainer}/>
            <Route path=":contactId" component={ContactDetailsPage}/>
            <Route path=":contactId/create" component={ContactCreatePage}/>
            <Route path=":contactId/categories/edit" component={ContactEditCategoriesContainer}/>
            <Route path=":contactId/notes/:noteId/create" component={NoteCreatePage} />
          </Route>

          {/* Jobs */}
          <Route path="jobs">
              <IndexRoute component={MyJobsPage}/>
              <Route path="search" component={JobSearchContainer}/>
                <Route path=":jobId/applicants" component={JobDetailsPage}
                  onEnter={(nextState) => {
                    nextState.location.state={'tab':'applicants'};}}
                />
              <Route path=":jobId/desc" component={JobDetailsPage}
                  onEnter={(nextState) => {
                    nextState.location.state={'tab':'desc'};}}
                />
              <Route path=":jobId/notes" component={JobDetailsPage}
                  onEnter={(nextState) => {
                    nextState.location.state={'tab':'notes'};}}
                />
              <Route path=":jobId" component={JobDetailsPage}/>

              <Route path=":jobId/create" component={JobCreatePage}/>
              <Route path=":jobId/edit" component={JobEditPage}/>
          </Route>

          {/*<Route path="/myjobs" component={MyJobsPage}/>*/}
          <Route path="candidates">
            <IndexRoute component={MyCandidatesPage}/>
            <Route path="search" component={CandidateSearchContainer} />
            <Route path=":candidateId" component={CandidateDetailsPage}/>
            <Route path=":candidateId/notes/:noteId/create" component={NoteCreatePage} />
          </Route>
          <Route path="search">
            <IndexRoute component={SearchContainer}/>
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
        <Route path="*" component={ErrorPage} status={404} />

      </Route>
    </Route>
  );
};
