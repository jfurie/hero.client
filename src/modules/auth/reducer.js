import * as constants from './constants';
import {actionTypes} from 'redux-localstorage';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  loaded: false,
  auth: {},
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case actionTypes.INIT:{
    const persistedState = action.payload && action.payload['auth'];
    if(persistedState){
      return Immutable.fromJS(persistedState);
    } else{
      return state;
    }
  }
  case constants.RESET_LOGOUT_READY:{
    return state
    .set('logoutReady',false);
  }
  case constants.LOAD:
    return state
    .set('loading',true);
  case constants.LOAD_SUCCESS:
    return state
    .set('loading',false)
    .set('loaded',true);
  case constants.LOAD_FAIL:
    return state
    .set('loading', false)
    .set('loaded',false)
    .set('error',action.error);
  case constants.LOGIN:
    return state.set('loggingIn',true);
  case constants.LOGIN_SUCCESS:
    return state.withMutations(ctx=> {
      ctx
      .set('loggingIn',false)
      .set('contact',Immutable.fromJS(action.result.contact))
      .set('user', Immutable.fromJS(action.result.user))
      .set('authToken', Immutable.fromJS(action.result.authToken));
    });
  case constants.SET_AUTH:{
    return state.set('authToken',Immutable.fromJS(action.result.authToken));
  }
  case constants.LOGIN_FAIL:
    return state.withMutations(ctx=>{
      ctx
      .set('loggingIn',false)
      .set('user',null)
      .set('loginError',Immutable.fromJS(action.error));
    });
  case constants.RESET_LOGIN_ERROR:
    return state.set('loginError', null);
  case constants.AUTHLOCALSTORAGE:
    return state;
  case constants.AUTHACCCESSTOKEN:{
    return state.set('checking', true);
  }
  case constants.AUTHACCCESSTOKEN_SUCCESS:
  case constants.AUTHLOCALSTORAGE_SUCCESS:
    return state.withMutations(ctx => {
      ctx.set('loggingIn',false)
      .set('contact',Immutable.fromJS(action.result.contact))
      .set('checking', false)
      .set('user',Immutable.fromJS(action.result.user))
      .set('authToken',Immutable.fromJS(action.result.authToken));
    });
  case constants.AUTHLOCALSTORAGE_FAIL:
    return state.withMutations(ctx => {
      ctx.set('loggingIn',false)
      .set('user',null)
      .set('authToken',null)
      .set('checking', false)
      .set('contact',null)
      .set('loginError',Immutable.fromJS(action.error));
    });
  case constants.LOGOUT:
    return state.set('loggingOut',true);
  case constants.LOGOUT_SUCCESS:
    return state.withMutations(ctx => {
      ctx.set('loggingOut',false)
      .set('user',null)
      .set('authToken',null)
      .set('contact',null)
      .set('logoutReady',true);
    });
  case constants.LOGOUT_FAIL:
    return state.withMutations(ctx => {
      ctx.set('loggingOut',false)
      .set('logoutError',Immutable.fromJS(action.error));
    });
  case constants.CHANGEPASSWORD:
    return state.withMutations(ctx => {
      ctx.set('changingPasswordError',null)
      .set('changingPassword',true);
    });
  case constants.CHANGEPASSWORD_SUCCESS:
    return state.withMutations(ctx => {
      ctx.set('changingPasswordError',null)
      .set('changingPassword',false);
    });
  case constants.CHANGEPASSWORD_FAIL:
    return state.withMutations(ctx =>{
      ctx.set('changingPasswordError',Immutable.fromJS(action.error))
      .set('changingPassword',false);
    });
  default:
    return state;
  }
}
