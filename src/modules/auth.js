const LOAD = 'hero.client/auth/LOAD';
const LOAD_SUCCESS = 'hero.client/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'hero.client/auth/LOAD_FAIL';
const LOGIN = 'hero.clientauth/LOGIN';
const LOGIN_SUCCESS = 'hero.client/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'hero.client/auth/LOGIN_FAIL';
const LOGOUT = 'hero.client/auth/LOGOUT';
const LOGOUT_SUCCESS = 'hero.client/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'hero.client/auth/LOGOUT_FAIL';
const AUTHLOCALSTORAGE = 'hero.client/auth/AUTHLOCALSTORAGE';
const AUTHLOCALSTORAGE_SUCCESS = 'hero.client/auth/AUTHLOCALSTORAGE_SUCCESS';
const AUTHLOCALSTORAGE_FAIL = 'hero.client/auth/AUTHLOCALSTORAGE_FAIL';
const CHANGEPASSWORD = 'hero.client/auth/CHANGEPASSWORD';
const CHANGEPASSWORD_SUCCESS = 'hero.client/auth/CHANGEPASSWORD_SUCCESS';
const CHANGEPASSWORD_FAIL = 'hero.client/auth/CHANGEPASSWORD_FAIL';

const initialState = {
  loaded: false,
  auth: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case LOAD:
    return {
      ...state,
      loading: true
    };
  case LOAD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true
    };
  case LOAD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };
  case LOGIN:
    return {
      ...state,
      loggingIn: true
    };
  case LOGIN_SUCCESS:
    return {
      ...state,
      loggingIn: false,
      user: action.result.user,
      authToken: action.result.authToken,
    };
  case LOGIN_FAIL:
    return {
      ...state,
      loggingIn: false,
      user: null,
      loginError: action.error
    };
  case AUTHLOCALSTORAGE:
    return {
      ...state
    };
  case AUTHLOCALSTORAGE_SUCCESS:
    return {
      ...state,
      loggingIn: false,
      user: action.result.user,
      authToken: action.result.authToken,
    };
  case AUTHLOCALSTORAGE_FAIL:
    return {
      ...state,
      loggingIn: false,
      user: null,
      loginError: action.error
    };
  case LOGOUT:
    return {
      ...state,
      loggingOut: true
    };
  case LOGOUT_SUCCESS:
    return {
      ...state,
      loggingOut: false,
      user: null
    };
  case LOGOUT_FAIL:
    return {
      ...state,
      loggingOut: false,
      logoutError: action.error
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
      return new Promise(() => {
        client.localStorage.remove('Auth');
        return client.api.post('/users/logout', {
          authToken: auth.authToken,
        });
      });
    },
  };
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.api.get('/loadAuth')
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
          client.localStorage.set('Auth', auth);
          auth.user = user.results;
          return {
            user,
            authToken:auth,
          };
        });
      });
    }
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
            client.localStorage.set('Auth', auth);
            auth.user = user.results;
            resolve({
              user,
              authToken:auth,
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
