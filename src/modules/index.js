import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import auth from './auth';
import users from './users';
import contacts from './contacts';
import companies from './companies/index';
import leftNav from './leftNav';
import locations from './locations';
import jobs from './jobs';
import notes from './notes';
import resources from './resources';
import currentAccount from './currentAccount';
import candidates from './candidates';
import categories from './categories';
import search from './search';
import myProfile from './myProfile';
import favorites from './favorites';
export default combineReducers({
  router: routerStateReducer,
  auth,
  users,
  contacts,
  leftNav,
  companies,
  locations,
  jobs,
  notes,
  resources,
  currentAccount,
  candidates,
  categories,
  search,
  myProfile,
  favorites,
});
