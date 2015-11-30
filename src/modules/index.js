import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import auth from './auth';
import users from './users';
import contacts from './contacts';
export default combineReducers({
  router: routerStateReducer,
  auth,
  users,
  contacts,
});
