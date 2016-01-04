import Immutable from 'immutable';

const GET_CURRENT_ACCOUNT = 'hero.client/account/GET_CURRENT_ACCOUNT';
const GET_CURRENT_ACCOUNT_SUCCESS = 'hero.client/account/GET_CURRENT_ACCOUNT_SUCCESS';
const GET_CURRENT_ACCOUNT_FAIL = 'hero.client/account/GET_CURRENT_ACCOUNT_FAIL';

const GET_CURRENT_ACCOUNT_USERS= 'hero.client/account/GET_CURRENT_ACCOUNT_USERS';
const GET_CURRENT_ACCOUNT_USERS_SUCCESS = 'hero.client/account/GET_CURRENT_ACCOUNT_USERS_SUCCESS';
const GET_CURRENT_ACCOUNT_USERS_FAIL = 'hero.client/account/GET_CURRENT_ACCOUNT_USERS_FAIL';

const initialState = {
  info: {},
  usersList: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_CURRENT_ACCOUNT: {
    return {
      ...state,
    };
  }
  case GET_CURRENT_ACCOUNT_SUCCESS: {
    state.info = action.result;
    return state;
  }
  case GET_CURRENT_ACCOUNT_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case GET_CURRENT_ACCOUNT_USERS: {
    return state;
  }
  case GET_CURRENT_ACCOUNT_USERS_SUCCESS: {
    let usersMap = {};

    action.result.forEach(function(result) {
      let id = result.user.id;
      usersMap[id] = result.user;
    });

    return {
      ...state,
      usersList: state.usersList.mergeDeep(usersMap),
    };
  }
  case GET_CURRENT_ACCOUNT_USERS_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  default:
    return state;
  }
}

function getCurrentAccountUsers(account) {
  return {
    types: [GET_CURRENT_ACCOUNT_USERS, GET_CURRENT_ACCOUNT_USERS_SUCCESS, GET_CURRENT_ACCOUNT_USERS_FAIL],
    promise: (client, auth) => client.api.get(`/accounts/${account.id}/accountUsers`, {
      authToken: auth.authToken,
    }),
  };
}

export function getCurrentAccount() {
  return (dispatch) => {
    dispatch({
      types: [GET_CURRENT_ACCOUNT, GET_CURRENT_ACCOUNT_SUCCESS, GET_CURRENT_ACCOUNT_FAIL],
      promise: (client, auth) => new Promise(function(resolve, reject){
        let accountPromise = client.api.get(`/accounts/${auth.authToken.accountInfo.account.id}`, {
          authToken: auth.authToken,
        });

        accountPromise.then((res) => {
          resolve(res);
        }).catch((ex) => {
          reject(ex);
        });
      }).then((account)=>{
        dispatch(getCurrentAccountUsers(account));
        return account;
      }),
    });
  };
}
