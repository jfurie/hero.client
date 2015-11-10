const LOAD = 'hero.client/auth/LOAD';
const LOAD_SUCCESS = 'hero.client/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'hero.client/auth/LOAD_FAIL';
const LOGIN = 'hero.clientauth/LOGIN';
const LOGIN_SUCCESS = 'hero.client/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'hero.client/auth/LOGIN_FAIL';
const LOGOUT = 'hero.client/auth/LOGOUT';
const LOGOUT_SUCCESS = 'hero.client/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'hero.client/auth/LOGOUT_FAIL';

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
    promise: (client, authToken) => client.get('/logout', {
      authToken,
    }),
  };
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

export function login(email, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client, authToken) => {
      return client.post('/users/login', {
        data: {
          email,
          password
        },
        authToken
      }).then((auth)=>{
        return client.get('/users/' + auth.userId,{
          authToken:auth
        }).then((user)=>{
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
