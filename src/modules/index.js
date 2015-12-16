import {
  combineReducers,
  routerStateReducer,
  auth,
  users,
  contacts,
  companies,
  leftNav,
  locations,
  companyContacts,
  jobs,
} from './container';

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
});
