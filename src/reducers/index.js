import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import auth from './auth';
export default combineReducers({
  router: routerStateReducer,
  auth,
});
