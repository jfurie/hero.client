import * as constants from './constants';
import { getFavoritesByUserId } from '../favorites';
import { getContactDetails } from '../contacts';
import { getCompanyDetails } from '../companies';
import { getJobDetails } from '../jobs';

import Config from '../../utils/config';

const HEROACCOUNTID = Config.get('heroAccountId');

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function logout() {
  return {
    types: [constants.LOGOUT, constants.LOGOUT_SUCCESS, constants.LOGOUT_FAIL],
    promise: (client, auth) => {
      return client.api.post('/users/logout', {
        authToken: auth.authToken,
      });
    },
  };
}

export function load() {
  return {
    types: [constants.LOAD, constants.LOAD_SUCCESS, constants.LOAD_FAIL],
    promise: (client) => client.api.get('/loadAuth'),
  };
}

export function resetLogoutReady(){
  return {
    type: constants.RESET_LOGOUT_READY,
  };
}

function getUser(context){
  let currentProfileUserId =context.state.myProfile.get('userId');
  if(currentProfileUserId && currentProfileUserId == context.auth.userId && context.state.users.users.get(context.auth.userId)){
    return Promise.resolve(context);
  } else {
    return context.client.api.get(`/users/${context.auth.userId}`, {
      authToken: context.auth,
    }).then(response =>{
      context.response.user = response;
      return context;
    });
  }
}

function getContact(context){
  let currentProfileContactId =context.state.myProfile.get('contactId');
  if(currentProfileContactId && context.state.contacts.getIn(['list',currentProfileContactId])){
    return Promise.resolve(context);
  }
  return context.client.api.get(`/contacts/findOne?filter[where][and][0][userId]=${context.auth.userId}&filter[where][and][1][isMaster]=true`, {
    authToken: context.auth,
  }).then(response =>{
    context.response.contact = response;
    return context;
  });
}


function getDataBasedOnUserId(context){
  return Promise.all([getUser(context),getContact(context)]).then(()=>context);
}

function postLogin(auth, client, state, dispatch){

  let context = {
    auth,
    client,
    response:{
      authToken:auth,
    },
    state,
  };
  dispatch({
    type:constants.SET_AUTH,
    result:{
      authToken: auth,
      isHero: auth.accountInfo.account.id == HEROACCOUNTID,
    },
  });
  dispatch(getFavoritesByUserId(auth.userId)).then((response)=>{
    let contactIds = [];
    let companyIds = [];
    let jobIds = [];
    if(response.result){
      response.result.map(function(favorite){
        switch(favorite.favorableType){
        case 'contact':
          contactIds.push(favorite.favorableId);
          break;
        case 'job':
          jobIds.push(favorite.favorableId);
          break;
        case 'company':
          companyIds.push(favorite.favorableId);
          break;
        }
      });
    }
    dispatch(getContactDetails(contactIds, ['companies']));
    dispatch(getJobDetails(jobIds, ['candidates']));
    dispatch(getCompanyDetails(companyIds, ['contacts']));
  });
  return getDataBasedOnUserId(context).then((context)=>{
    return context.response;
  });
}

export function changePassword(password, tmpAuthToken) {

  return {
    types: [constants.CHANGEPASSWORD, constants.CHANGEPASSWORD_SUCCESS, constants.CHANGEPASSWORD_FAIL],
    promise: (client) => {
      return client.api.post('/users/changepassword', {
        data: {
          password,
          access_token:tmpAuthToken,
        },
        params: {
          access_token:tmpAuthToken,
        },
        authToken:tmpAuthToken,
      });
    },
  };
}

export function login(email, password) {
  return (dispatch, getState) => {
    return dispatch({
      types: [constants.LOGIN, constants.LOGIN_SUCCESS, constants.LOGIN_FAIL],
      promise: (client, authToken) => {
        return client.api.post('/users/login', {
          data: {
            email,
            password,
          },
          authToken,
        }).then((auth)=>postLogin(auth,client,getState(),dispatch));
      },
    });
  };
}

export function resetLoginError(){
  return {
    type: constants.RESET_LOGIN_ERROR,
  };
}

export function logginWithAuthLocalStorage() {
  return (dispatch, getState) => {
    dispatch({
      types: [constants.AUTHLOCALSTORAGE, constants.AUTHLOCALSTORAGE_SUCCESS, constants.AUTHLOCALSTORAGE_FAIL],
      promise: (client) => {
        return new Promise((resolve, reject) => {
          let auth = getState().auth && getState().auth.get('authToken').toJS();
          if (auth) {
            return postLogin(auth,client,getState(),dispatch).then((response)=>{
              resolve(response);
            }).catch(()=>{
              reject();
            });
          } else {
            return reject();
          }
        });
      },
    });
  };
}
export function checkAuthServer(accessToken){
  return (dispatch) => {
    dispatch({
      types: [constants.AUTHCHECK, constants.AUTHCHECK_SUCCESS, constants.AUTHCHECK_FAIL],
      promise: (client) => {
        return new Promise((resolve, reject) => {
          if (accessToken) {
            return client.api.get(`/accessTokens/${accessToken}?access_token=${accessToken}`, {
            }).then(()=> {
              //client.localStorage.set('Auth', token);
              resolve();
            }).catch((err) => {
              dispatch(logout());
              //client.localStorage.remove('Auth');
              //document.location.href = '/login?redirect='+encodeURIComponent(document.location.pathname);
              reject({
                error: err,
              });
            });
          } else {
            reject();
          }
        });

      },
    });
  };
}

export function logginWithAccessToken(accessToken,cb) {
  return (dispatch, getState) => {
    dispatch({
      types: [constants.AUTHACCCESSTOKEN, constants.AUTHACCCESSTOKEN_SUCCESS, constants.AUTHACCCESSTOKEN_FAIL],
      promise: (client) => {
        return new Promise((resolve, reject) => {
          if (accessToken) {
            return client.api.get(`/accessTokens/${accessToken}?access_token=${accessToken}`, {
            }).then((token)=> {
              //client.localStorage.set('Auth', token);
              //TODO:set authToken to store
              resolve(postLogin(token,client,getState(),dispatch));
              cb();
            }).catch((err) => {
              reject({
                error: err,
              });
              cb();
            });
          } else {
            reject();
            cb();
          }
        });

      },
    });
  };
}
