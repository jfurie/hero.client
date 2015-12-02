import Immutable from 'immutable';

const GET_COMPANIES = 'hero.client/clients/GET_COMPANIES';
const GET_COMPANIES_SUCCESS = 'hero.client/clients/GET_COMPANIES_SUCCESS';
const GET_COMPANIES_FAIL = 'hero.client/clients/GET_COMPANIES_FAIL';

const initialState = {
  list: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_COMPANIES:
    return {
      ...state,
    };
  case GET_COMPANIES_SUCCESS: {
    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return {
      list: state.list.mergeDeep(companiesMap),
    };
  }
  case GET_COMPANIES_FAIL:
    return {
      ...state,
      err: action.err,
    };
  default:
    return state;
  }
}

export function getAllCompanies() {
  return {
    types: [GET_COMPANIES, GET_COMPANIES_SUCCESS, GET_COMPANIES_FAIL],
    promise: (client, auth) => client.api.get('/companies', {
      authToken: auth.authToken,
    }),
  };
}
