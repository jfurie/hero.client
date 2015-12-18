import Immutable from 'immutable';
import {getOneLocation} from './locations';
const GET_COMPANIES = 'hero.client/clients/GET_COMPANIES';
const GET_COMPANIES_SUCCESS = 'hero.client/clients/GET_COMPANIES_SUCCESS';
const GET_COMPANIES_FAIL = 'hero.client/clients/GET_COMPANIES_FAIL';
const GET_COMPANY = 'hero.client/clients/GET_COMPANY';
const GET_COMPANY_SUCCESS = 'hero.client/clients/GET_COMPANY_SUCCESS';
const GET_COMPANY_FAIL = 'hero.client/clients/GET_COMPANY_FAIL';
const CREATE_COMPANY = 'hero.client/clients/CREATE_COMPANY';
const CREATE_COMPANY_SUCCESS = 'hero.client/clients/CREATE_COMPANY_SUCCESS';
const CREATE_COMPANY_FAIL = 'hero.client/clients/CREATE_COMPANY_FAIL';
const SEARCH_COMPANIES = 'hero.client/clients/SEARCH_COMPANIES';
const EDIT_COMPANY = 'hero.client/clients/EDIT_COMPANY';
const EDIT_COMPANY_SUCCESS = 'hero.client/clients/EDIT_COMPANY_SUCCESS';
const EDIT_COMPANY_FAIL = 'hero.client/clients/EDIT_COMPANY_FAIL';

const initialState = {
  list: new Immutable.Map(),
  searches: new Immutable.Map(),
  currentSearch: '',
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
      ...state,
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
      ...state,
      list: state.list.mergeDeep(company),
    };
  }
  case GET_COMPANY_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case EDIT_COMPANY: {
    return {
      ...state,
    };
  }
  case EDIT_COMPANY_SUCCESS: {
    let company = {};
    let id = action.result.id;
    company[id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(company),
    };
  }
  case EDIT_COMPANY_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case CREATE_COMPANY:
    return {
      ...state,
      creating:true,
      creatingError:''
    };
  case CREATE_COMPANY_SUCCESS:
    let newItem = {};
    newItem[action.result.id] = action.result;
    return {
      ...state,
      creating:false,
      creatingError:'',
      list:state.list.mergeDeep(newItem)
    };
  case CREATE_COMPANY_FAIL:
    return {
      ...state,
      creating:false,
      creatingError:'Failed to create company'
    };
  case SEARCH_COMPANIES:
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
      type:SEARCH_COMPANIES,
      result: resultIds,
      query
    });
  };
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
  return (dispatch) => {
    dispatch({
      types: [GET_COMPANY, GET_COMPANY_SUCCESS, GET_COMPANY_FAIL],
      promise: (client, auth) =>  client.api.get(`/companies/${id}`, {
        authToken: auth.authToken,
      }).then((company)=>{
        dispatch(getOneLocation(company.location));
        return company;
      }),
    });
  };
}

export function createCompany(company) {
  return {
    types: [CREATE_COMPANY, CREATE_COMPANY_SUCCESS, CREATE_COMPANY_FAIL],
    promise: (client, auth) => client.api.post('/companies', {
      authToken: auth.authToken,
      data: company,
    }),
  };
}

export function editCompany(company) {
  return {
    types: [EDIT_COMPANY, EDIT_COMPANY_SUCCESS, EDIT_COMPANY_FAIL],
    promise: (client, auth) => client.api.put(`/companies/${company.id}`, {
      authToken: auth.authToken,
      data: company,
    }),
  };
}
