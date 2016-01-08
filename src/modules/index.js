import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import auth from './auth';
import users from './users';
import contacts from './contacts';
import companies from './companies';
import leftNav from './leftNav';
import locations from './locations';
import companyContacts from './companyContacts';
import jobs from './jobs';
import resources from './resources';
import currentAccount from './currentAccount';
import candidates from './candidates';

export default combineReducers({
  router: routerStateReducer,
  auth,
  users,
  contacts,
  leftNav,
  companies,
  locations,
  companyContacts,
  jobs,
  resources,
  currentAccount,
  candidates,
});
