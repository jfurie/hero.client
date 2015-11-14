import Immutable from 'immutable';

const GET_USER = 'hero.client/users/GET_USER';
const GET_USER_SUCCESS = 'hero.client/users/GET_USER_SUCCESS';
const GET_USER_FAIL = 'hero.client/users/GET_USER_FAIL';
const INVITE_USER = 'hero.client/users/INVITE_USER';
const INVITE_USER_SUCCESS = 'hero.client/users/INVITE_USER_SUCCESS';
const INVITE_USER_FAIL = 'hero.client/users/INVITE_USER_FAIL';


const initialState = {
  users: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_USER:
    return {
      ...state,
    };
  case GET_USER_SUCCESS: {
    let user = {};
    let id = action.user.id;
    user[id] = action.user;

    return {
      ...state,
      users: state.users.mergeDeep(user),
    };
  }
  case GET_USER_FAIL:
    return {
      ...state,
      err: action.err,
    };
  case INVITE_USER: {
    return {
      ...state,
      inviteStatus: null,
    };
  }
  case INVITE_USER_SUCCESS: {
    return {
      ...state,
      inviteStatus: 'success',
    };
  }
  case INVITE_USER_FAIL:
    return {
      ...state,
      inviteStatus: 'fail',
    };
  default:
    return state;
  }
}

export function invite(email, redirect) {

  return {
    types: [INVITE_USER, INVITE_USER_SUCCESS, INVITE_USER_FAIL],
    promise: (client, auth) => client.api.post('/users/invite', {
      data: {
        email,
        redirect,
      },
      authToken: auth.authToken,
    }),
  };
}
