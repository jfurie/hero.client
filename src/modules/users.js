import Immutable from 'immutable';

const GET_USER = 'hero.client/users/GET_USER';
const GET_USER_SUCCESS = 'hero.client/users/GET_USER_SUCCESS';
const GET_USER_FAIL = 'hero.client/users/GET_USER_FAIL';
const GET_USER_CONTACT = 'hero.client/users/GET_USER_CONTACT_CONTACT';
const GET_USER_CONTACT_SUCCESS = 'hero.client/users/GET_USER_CONTACT_SUCCESS';
const GET_USER_CONTACT_FAIL = 'hero.client/users/GET_USER_CONTACT_FAIL';
const GET_USER_STATS = 'hero.client/users/GET_USER_STATS';
const GET_USER_STATS_SUCCESS = 'hero.client/users/GET_USER_STATS_SUCCESS';
const GET_USER_STATS_FAIL = 'hero.client/users/GET_USER_STATS_FAIL';
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
  case GET_USER_CONTACT_SUCCESS: {
    return {
      ...state,
      userContact: action.result,
    };
  }
  case GET_USER_CONTACT_FAIL: {
    return {
      ...state,
      err: action.error,
    };
  }
  case GET_USER_STATS_SUCCESS: {
    return {
      ...state,
      stats: action.result,
    };
  }
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

export function getUserContact(id) {
  return {
    types: [GET_USER_CONTACT, GET_USER_CONTACT_SUCCESS, GET_USER_CONTACT_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/findOne?filter[where][userId]=${id}`, {
      authToken: auth.authToken,
    }),
  };
}

export function getUserStats(accountId, userId) {
  return {
    types: [GET_USER_STATS, GET_USER_STATS_SUCCESS, GET_USER_STATS_FAIL],
    promise: (client, auth) => client.api.get(`/users/stats?accountId=${accountId}&userId=${userId}`, {
      authToken: auth.authToken,
    }),
  };
}

export function getOneUser(id) {
  return {
    types: [GET_USER, GET_USER_SUCCESS, GET_USER_FAIL],
    promise: (client, auth) => client.api.get(`/users/${id}`, {
      authToken: auth.authToken,
    }),
  };
}
