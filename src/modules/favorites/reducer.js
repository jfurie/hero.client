import * as constants from './constants';
import Immutable from 'immutable';
import * as authConstants from '../auth/constants';
const initialState = new Immutable.Map({
  list: new Immutable.Map(),
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

  case constants.GET_FAVORITES_SUCCESS:{
    let favoriteMap = {};

    action.result.map(result =>{
      favoriteMap[result.id] = result;
    })
    return state.set('list',Immutable.fromJS(favoriteMap));
  }
  case authConstants.LOGIN_SUCCESS:
  case authConstants.AUTHLOCALSTORAGE_SUCCESS:{
    return state;
  }
  default:
    return state;
  }
}
