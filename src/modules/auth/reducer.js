import * as constants from './constants';
import {actionTypes} from 'redux-localstorage';

const initialState = {
  loaded: false,
  auth: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case actionTypes.INIT:{
    const persistedState = action.payload && action.payload['auth'];
    if(persistedState){
      return persistedState;
    } else{
      return state;
    }
  }
  case constants.RESET_LOGOUT_READY:{
    return {
      ...state,
      logoutReady: false,
    };
  }
  case constants.LOAD:
    return {
      ...state,
      loading: true,
    };
  case constants.LOAD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
    };
  case constants.LOAD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error,
    };
  case constants.LOGIN:
    return {
      ...state,
      loggingIn: true,
    };
  case constants.LOGIN_SUCCESS:
    return {
      ...state,
      loggingIn: false,
      contact: action.result.contact,
      user: action.result.user,
      authToken: action.result.authToken,
    };
  case constants.SET_AUTH:{
    return {
      ...state,
      authToken: action.result.authToken,
    }
  }
  case constants.LOGIN_FAIL:
    return {
      ...state,
      loggingIn: false,
      user: null,
      loginError: action.error,
    };
  case constants.RESET_LOGIN_ERROR:

    return {
      ...state,
      loginError: null,
    };
  case constants.AUTHLOCALSTORAGE:
    return {
      ...state,
    };
  case constants.AUTHACCCESSTOKEN_SUCCESS:
  case constants.AUTHLOCALSTORAGE_SUCCESS:
    return {
      ...state,
      loggingIn: false,
      contact: action.result.contact,
      user: action.result.user,
      authToken: action.result.authToken,
    };
  case constants.AUTHLOCALSTORAGE_FAIL:
    return {
      ...state,
      loggingIn: false,
      user: null,
      authToken:null,
      contact:null,
      loginError: action.error,
    };
  case constants.LOGOUT:
    return {
      ...state,
      loggingOut: true,
    };
  case constants.LOGOUT_SUCCESS:
    return {
      ...state,
      loggingOut: false,
      user: null,
      authToken:null,
      contact:null,
      logoutReady: true,
    };
  case constants.LOGOUT_FAIL:
    return {
      ...state,
      loggingOut: false,
      logoutError: action.error,
    };
  case constants.CHANGEPASSWORD:
    return {
      ...state,
      changingPasswordError:null,
      changingPassword: true,
    };
  case constants.CHANGEPASSWORD_SUCCESS:
    return {
      ...state,
      changingPasswordError:null,
      changingPassword: false,
    };
  case constants.CHANGEPASSWORD_FAIL:
    return {
      ...state,
      changingPasswordError: action.error,
      changingPassword: false,
    };
  default:
    return state;
  }
}
