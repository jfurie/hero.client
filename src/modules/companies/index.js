import Immutable from 'immutable';

import { getOneLocation } from '../locations';

import * as constants from './constants';

const initialState = {
  list: new Immutable.Map(),
  searches: new Immutable.Map(),
  currentSearch: '',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case constants.GET_COMPANIES: {
    return {
      ...state,
    };
  }
  case constants.GET_COMPANIES_SUCCESS: {
    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return {
      ...state,
      list: state.list.mergeDeep(companiesMap),
    };
  }
  case constants.GET_COMPANIES_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case constants.GET_COMPANY: {
    return {
      ...state,
    };
  }
  case constants.GET_COMPANY_SUCCESS: {
    let company = {};
    let id = action.result.id;
    company[id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(company),
    };
  }
  case constants.GET_COMPANY_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case constants.EDIT_COMPANY: {
    return {
      ...state,
    };
  }
  case constants.EDIT_COMPANY_SUCCESS: {
    let company = {};
    let id = action.result.id;
    company[id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(company),
    };
  }
  case constants.EDIT_COMPANY_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case constants.CREATE_COMPANY:
    return {
      ...state,
      creating:true,
      creatingError:''
    };
  case constants.CREATE_COMPANY_SUCCESS:
    let newItem = {};
    newItem[action.result.id] = action.result;
    return {
      ...state,
      creating:false,
      creatingError:'',
      list:state.list.mergeDeep(newItem)
    };
  case constants.CREATE_COMPANY_FAIL:
    return {
      ...state,
      creating:false,
      creatingError:'Failed to create company'
    };
  case constants.SEARCH_COMPANIES:
    return {
      ...state,
      searches: state.searches.mergeDeep(action.result),
      currentSearch: action.query,
    };
  default:
    return state;
  }
}
export function searchCompany(query){
  return (dispatch, getState) => {
    let current = getState().companies.list;
    let results = current.filter(y=>{
      return y.get('name').toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    let listOfkeys =results.keySeq().toArray();
    let resultIds = {};
    resultIds[query] = listOfkeys;
    dispatch({
      type:constants.SEARCH_COMPANIES,
      result: resultIds,
      query
    });
  };
}

export function getAllCompanies() {
  return {
    types: [constants.GET_COMPANIES, constants.GET_COMPANIES_SUCCESS, constants.GET_COMPANIES_FAIL],
    promise: (client, auth) => client.api.get('/companies', {
      authToken: auth.authToken,
    }),
  };
}

export function getOneCompany(id) {
  return (dispatch) => {
    dispatch({
      types: [constants.GET_COMPANY, constants.GET_COMPANY_SUCCESS, constants.GET_COMPANY_FAIL],
      promise: (client, auth) =>  client.api.get(`/companies/${id}?filter[include]=clientAdvocate`, {
        authToken: auth.authToken,
      }).then((company)=> {
        if (company.location) {
          dispatch(getOneLocation(company.location));
        }
        return company;
      }),
    });
  };
}

export function createCompany(company) {
  return {
    types: [constants.CREATE_COMPANY, constants.CREATE_COMPANY_SUCCESS, constants.CREATE_COMPANY_FAIL],
    promise: (client, auth) => client.api.post('/companies', {
      authToken: auth.authToken,
      data: company,
    }),
  };
}

export function editCompany(company) {
  return {
    types: [constants.EDIT_COMPANY, constants.EDIT_COMPANY_SUCCESS, constants.EDIT_COMPANY_FAIL],
    promise: (client, auth) => client.api.put(`/companies/${company.id}`, {
      authToken: auth.authToken,
      data: company,
    }),
  };
}
