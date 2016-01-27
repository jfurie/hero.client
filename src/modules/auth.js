const LOAD = 'hero.client/auth/LOAD';
const LOAD_SUCCESS = 'hero.client/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'hero.client/auth/LOAD_FAIL';
const LOGIN = 'hero.clientauth/LOGIN';
const LOGIN_SUCCESS = 'hero.client/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'hero.client/auth/LOGIN_FAIL';
const RESET_LOGIN_ERROR = 'hero.client/auth/RESET_LOGIN_ERROR';
const LOGOUT = 'hero.client/auth/LOGOUT';
const LOGOUT_SUCCESS = 'hero.client/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'hero.client/auth/LOGOUT_FAIL';
const AUTHLOCALSTORAGE = 'hero.client/auth/AUTHLOCALSTORAGE';
const AUTHLOCALSTORAGE_SUCCESS = 'hero.client/auth/AUTHLOCALSTORAGE_SUCCESS';
const AUTHLOCALSTORAGE_FAIL = 'hero.client/auth/AUTHLOCALSTORAGE_FAIL';
const AUTHACCCESSTOKEN = 'hero.client/auth/AUTHACCCESSTOKEN';
const AUTHACCCESSTOKEN_SUCCESS = 'hero.client/auth/AUTHACCCESSTOKEN_SUCCESS';
const AUTHACCCESSTOKEN_FAIL = 'hero.client/auth/AUTHACCCESSTOKEN_FAIL';
const CHANGEPASSWORD = 'hero.client/auth/CHANGEPASSWORD';
const CHANGEPASSWORD_SUCCESS = 'hero.client/auth/CHANGEPASSWORD_SUCCESS';
const CHANGEPASSWORD_FAIL = 'hero.client/auth/CHANGEPASSWORD_FAIL';
const AUTHCHECK = 'hero.client/auth/AUTHCHECK';
const AUTHCHECK_SUCCESS = 'hero.client/auth/AUTHCHECK_SUCCESS';
const AUTHCHECK_FAIL = 'hero.client/auth/AUTHCHECK_FAIL';
const initialState = {
  loaded: false,
  auth: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case LOAD:
    return {
      ...state,
      loading: true,
    };
  case LOAD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
    };
  case LOAD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error,
    };
  case LOGIN:
    return {
      ...state,
      loggingIn: true,
    };
  case LOGIN_SUCCESS:
    return {
      ...state,
      loggingIn: false,
      contact: action.result.contact,
      user: action.result.user,
      authToken: action.result.authToken,
    };
  case LOGIN_FAIL:
    return {
      ...state,
      loggingIn: false,
      user: null,
      loginError: action.error,
    };
  case RESET_LOGIN_ERROR:

    return {
      ...state,
      loginError: null,
    };
  case AUTHLOCALSTORAGE:
    return {
      ...state,
    };
  case AUTHLOCALSTORAGE_SUCCESS:
    return {
      ...state,
      loggingIn: false,
      contact: action.result.contact,
      user: action.result.user,
      authToken: action.result.authToken,
    };
  case AUTHLOCALSTORAGE_FAIL:
    return {
      ...state,
      loggingIn: false,
      user: null,
      loginError: action.error,
    };
  case LOGOUT:
    return {
      ...state,
      loggingOut: true,
    };
  case LOGOUT_SUCCESS:
    return {
      ...state,
      loggingOut: false,
      user: null,
      logoutReady: true,
    };
  case LOGOUT_FAIL:
    return {
      ...state,
      loggingOut: false,
      logoutError: action.error,
    };
  case CHANGEPASSWORD:
    return {
      ...state,
      changingPasswordError:null,
      changingPassword: true,
    };
  case CHANGEPASSWORD_SUCCESS:
    return {
      ...state,
      changingPasswordError:null,
      changingPassword: false,
    };
  case CHANGEPASSWORD_FAIL:
    return {
      ...state,
      changingPasswordError: action.error,
      changingPassword: false,
    };
  default:
    return state;
  }
}
export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client, auth) => {
      client.localStorage.remove('Auth');
      return client.api.post('/users/logout', {
        authToken: auth.authToken,
      });
    },
  };
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.api.get('/loadAuth'),
  };
}

export function changePassword(password, tmpAuthToken) {

  return {
    types: [CHANGEPASSWORD, CHANGEPASSWORD_SUCCESS, CHANGEPASSWORD_FAIL],
    promise: (client) => {
      return client.api.post('/users/changepassword', {
        data: {
          password,
          access_token:tmpAuthToken
        },
        params: {
          access_token:tmpAuthToken
        },
        authToken:tmpAuthToken,
      });
    }
  };
}

export function login(email, password) {

  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client, authToken) => {
      return client.api.post('/users/login', {
        data: {
          email,
          password,
        },
        authToken,
      }).then((auth)=>{
        return client.api.get('/users/' + auth.userId, {
          authToken: auth,
        }).then((user)=> {
          auth.user = user.results;

          return client.api.get(`/contacts/findOne?filter[where][and][0][userId]=${auth.userId}&filter[where][and][1][isMaster]=true`, {
            authToken: auth,
          }).then((contact)=> {
            client.localStorage.set('Auth', auth);
            auth.contact = contact.results;
            return {
              contact,
              user,
              authToken:auth,
            };
          });
        });
      });
    }
  };
}

export function resetLoginError(){
  return {
    type: RESET_LOGIN_ERROR,
  };
}

export function logginWithAuthLocalStorage() {

  return {
    types: [AUTHLOCALSTORAGE, AUTHLOCALSTORAGE_SUCCESS, AUTHLOCALSTORAGE_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject)=>{
        let auth = client.localStorage.get('Auth');
        if (auth) {
          return client.api.get('/users/' + auth.userId, {
            authToken: auth,
          }).then((user)=> {
            auth.user = user.results;

            return client.api.get(`/contacts/findOne?filter[where][and][0][userId]=${auth.userId}&filter[where][and][1][isMaster]=true`, {
              authToken: auth,
            }).then((contact)=> {
              client.localStorage.set('Auth', auth);
              auth.contact = contact.results;
              resolve({
                contact,
                user,
                authToken:auth,
              });
            });
          }).catch((err) => {
            reject({
              error: err,
            });
          });
        } else {
          reject();
        }
      });

    },
  };
}
export function checkAuthServer(accessToken){
  return {
    types: [AUTHCHECK, AUTHCHECK_SUCCESS, AUTHCHECK_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        if (accessToken) {
          return client.api.get('/accessTokens/' + accessToken + '?access_token=' + accessToken, {
          }).then(()=> {
            //client.localStorage.set('Auth', token);
            resolve();
          }).catch((err) => {
            client.localStorage.remove('Auth');
            document.location.href = '/login?redirect='+encodeURIComponent(document.location.pathname);
            reject({
              error: err,
            });
          });
        } else {
          reject();
        }
      });

    },
  };
}

export function logginWithAccessToken(accessToken) {

  return {
    types: [AUTHACCCESSTOKEN, AUTHACCCESSTOKEN_SUCCESS, AUTHACCCESSTOKEN_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        if (accessToken) {
          return client.api.get('/accessTokens/' + accessToken + '?access_token=' + accessToken, {
          }).then((token)=> {
            client.localStorage.set('Auth', token);
            resolve();
          }).catch((err) => {
            reject({
              error: err,
            });
          });
        } else {
          reject();
        }
      });

    },
  };
}
