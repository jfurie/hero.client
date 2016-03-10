import * as constants from './constants';
import * as authConstants from '../auth/constants';
import {actionTypes} from 'redux-localstorage';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  contactId: null,
  userId:null,
  myContacts:new Immutable.List(),
  myClients: new Immutable.List(),
  myJobs: new Immutable.List(),
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case actionTypes.INIT:{
    const persistedState = action.payload && action.payload['myProfile'];
    if(persistedState){
      return Immutable.fromJS(persistedState);
    } else{
      return state;
    }
  }
  case authConstants.LOGOUT_SUCCESS:{
    return initialState;
  }
  case authConstants.LOGIN_SUCCESS:
  case authConstants.AUTHLOCALSTORAGE_SUCCESS:{

    if(action.result.contact){
      state = state.set('contactId',action.result.contact.id);
    }
    if(action.result.user){
      state = state.set('userId',action.result.user.id);
    }
    return state


  }
  default:
    return state;
  }
}
