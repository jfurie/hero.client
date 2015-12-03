import Immutable from 'immutable';

const GET_COMPANIES = 'hero.client/clients/GET_COMPANIES';
const GET_COMPANIES_SUCCESS = 'hero.client/clients/GET_COMPANIES_SUCCESS';
const GET_COMPANIES_FAIL = 'hero.client/clients/GET_COMPANIES_FAIL';
const GET_COMPANY = 'hero.client/clients/GET_COMPANY';
const GET_COMPANY_SUCCESS = 'hero.client/clients/GET_COMPANY_SUCCESS';
const GET_COMPANY_FAIL = 'hero.client/clients/GET_COMPANY_FAIL';

const initialState = {
  list: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_COMPANIES: {
    return {
      ...state,
    };
  }
  case GET_COMPANIES_SUCCESS: {
    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return {
      list: state.list.mergeDeep(companiesMap),
    };
  }
  case GET_COMPANIES_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case GET_COMPANY: {
    return {
      ...state,
    };
  }
  case GET_COMPANY_SUCCESS: {
    let company = {};
    let id = action.result.id;
    company[id] = action.result;

    return {
      list: state.list.mergeDeep(company),
    };
  }
  case GET_COMPANY_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
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

export function getOneCompany(id) {
  return {
    types: [GET_COMPANY, GET_COMPANY_SUCCESS, GET_COMPANY_FAIL],
    promise: (client, auth) => client.api.get(`/companies/${id}`, {
      authToken: auth.authToken,
    }),
  };
}
