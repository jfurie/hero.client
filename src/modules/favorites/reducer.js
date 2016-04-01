import * as constants from './constants';
import Immutable from 'immutable';
import * as authConstants from '../auth/constants';
import {actionTypes} from 'redux-localstorage';
const initialState = new Immutable.Map({
  list: new Immutable.Map(),
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case actionTypes.INIT:{
    const persistedState = action.payload && action.payload['favorites'];
    if(persistedState){
      return Immutable.fromJS(persistedState);
    } else{
      return state;
    }
  }
  case authConstants.LOGOUT:{
    return initialState;
  }
  case constants.GET_FAVORITES_SUCCESS:
  case constants.GET_FAVORITE_BY_TYPE_SUCCESS:{
    let favoriteMap = {};

    action.result.map(result => {
      favoriteMap[result.id] = result;
    });
    favoriteMap = Immutable.fromJS(favoriteMap);
    return state.set('list',favoriteMap);
  }
  case constants.CREATE_COMPANY_FAVORITE_SUCCESS: {
    let favoriteMap = {};

    favoriteMap[action.result.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(favoriteMap));
  }
  case constants.DELETE_COMPANY_FAVORITE_SUCCESS: {

    return state.set('list', state.get('list').delete(action.result.id));
  }
  case constants.CREATE_CONTACT_FAVORITE_SUCCESS: {
    let favoriteMap = {};

    favoriteMap[action.result.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(favoriteMap));
  }
  case constants.DELETE_CONTACT_FAVORITE_SUCCESS: {

    return state.set('list', state.get('list').delete(action.result.id));
  }
  case constants.CREATE_JOB_FAVORITE_SUCCESS: {
    let favoriteMap = {};

    favoriteMap[action.result.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(favoriteMap));
  }
  case constants.DELETE_JOB_FAVORITE_SUCCESS: {

    return state.set('list', state.get('list').delete(action.result.id));
  }
  case authConstants.LOGIN_SUCCESS:
  case authConstants.AUTHLOCALSTORAGE_SUCCESS:{
    return state;
  }
  default:
    return state;
  }
}
