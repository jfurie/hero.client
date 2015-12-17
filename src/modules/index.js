import {
  combineReducers,
  routerStateReducer,
  auth,
  users,
  contacts,
  companies,
  leftNav,
  locations,
  clientContacts,
  jobs,
  resources,
} from './container';

export default combineReducers({
  router: routerStateReducer,
  auth,
  users,
  contacts,
  leftNav,
  companies,
  locations,
  clientContacts,
  jobs,
  resources,
});
