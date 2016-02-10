import Immutable from 'immutable';

import { getOneLocation } from '../locations';

import * as constants from './constants';
import * as jobConstants from '../jobs/constants';

import { saveJobsByCompanyResult } from '../jobs';
import { saveContactsByCompanyResult } from '../contacts';
import { saveNotesByCompanyResult } from '../notes';
import { saveLocationByCompanyResult } from '../locations';

const initialState = {
  list: new Immutable.Map(),
  myCompanyIds: new Immutable.Map(),
  searches: new Immutable.Map(),
  currentSearch: '',
  queries: new Immutable.Map(),
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
    let company = {};
    action.company = action.company.set('saving',true);
    action.company = action.company.set('savingError',null);
    company[action.id] = action.company;
    return {
      ...state,
      saving:true,
      savingError: '',
      list: state.list.mergeDeep(company),
    };
  }
  case constants.EDIT_COMPANY_SUCCESS: {
    let company = {};
    let id = action.result.id;
    company[id] = action.result;
    company[id].saving = false;
    company[id].savingError = '';
    return {
      ...state,
      saving:false,
      list: state.list.mergeDeep(company),
    };
  }
  case constants.EDIT_COMPANY_FAIL: {
    let company = {};
    let id = action.result.id;
    company[id].saving = false;
    company[id].savingError = action.err;
    return {
      ...state,
      saving:false,
      savingError: action.err,
      list: state.list.mergeDeep(company),
    };
  }
  case constants.CREATE_COMPANY:{
    let company = {};
    action.company = action.company.set('saving',true);
    action.company = action.company.set('savingError',null);
    company[action.id] = action.company;
    return {
      ...state,
      saving:true,
      savingError:'',
      list: state.list.mergeDeep(company),
    };
  }
  case constants.CREATE_COMPANY_SUCCESS:
    let newItem = {};
    newItem[action.result.id] = action.result;
    newItem[action.result.id].saving = false;
    newItem[action.result.id].savingError = null;
    newItem[action.id] = newItem[action.result.id];
    return {
      ...state,
      saving:false,
      savingError:'',
      list:state.list.mergeDeep(newItem),
    };
  case constants.CREATE_COMPANY_FAIL:
    {
      let company = {};
      company[action.id] = {};
      company[action.id].saving = false;
      company[action.id].savingError = (action.error && action.error.error && action.error.error.message) || 'Failed to create company';
      return {
        ...state,
        saving:false,
        savingError:'Failed to create company',
        list:state.list.mergeDeep(company),
      };
    }
  case constants.SEARCH_COMPANIES:
    return {
      ...state,
      searches: state.searches.mergeDeep(action.result),
      currentSearch: action.query,
    };
  case jobConstants.GET_MY_JOBS_SUCCESS:
    {
      let companyList =  {};
      action.result.map(job =>{
        if(job.company){
          companyList[job.company.id] = job.company;
        }
      });
      return {
        ...state,
        list:state.list.mergeDeep(companyList),
      };
    }
  case jobConstants.GET_JOB_SUCCESS:
    {
      let companyList =  {};
      companyList[action.result.company.id] = action.result;
      return {
        ...state,
        list:state.list.mergeDeep(companyList),
      };
    }
  case constants.GET_MY_COMPANIES_SUCCESS: {

    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return{
      ...state,
      myCompanyIds: state.myCompanyIds.mergeDeep(companiesMap),
      list: state.list.mergeDeep(companiesMap),
    };
  }
  case constants.GET_MY_COMPANIES_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case constants.CREATE_TEMP_COMPANY:{
    let companiesMap = {};
    companiesMap[action.result.id] = action.result;
    return {
      ...state,
      list: state.list.mergeDeep(companiesMap),
    };
  }
  case constants.SEARCH_COMPANIES_SUCCESS: {
    let query = action.result.query;

    let queriesMap = {};
    queriesMap[query] = action.result.results;

    return {
      ...state,
      queries: state.queries.mergeDeep(queriesMap),
    };
  }
  case constants.SEARCH_COMPANIES_FAIL:
    return {
      ...state,
      err: action.err,
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
      query,
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
      promise: (client, auth) =>  client.api.get(`/companies/${id}?filter[include]=clientAdvocate&filter[include]=location`, {
        authToken: auth.authToken,
      }).then((company)=> {
        if (company.locationId) {
          dispatch(getOneLocation(company.locationId));
        }
        return company;
      }),
    });
  };
}

export function createTempCompany(company){
  return {
    type:constants.CREATE_TEMP_COMPANY,
    result:company,
  };
}

export function createCompany(company) {
  var id = company.get('id');
  if(id && id.indexOf('tmp') > -1){
    company = company.remove('id');
  }
  return {
    id,
    company,
    types: [constants.CREATE_COMPANY, constants.CREATE_COMPANY_SUCCESS, constants.CREATE_COMPANY_FAIL],
    promise: (client, auth) => client.api.post('/companies', {
      authToken: auth.authToken,
      data: company,
    }),
  };
}

export function editCompany(company) {
  var id = company.id;
  if(!company.id){
    id = company.get('id');
  }
  return {
    id,
    company,
    types: [constants.EDIT_COMPANY, constants.EDIT_COMPANY_SUCCESS, constants.EDIT_COMPANY_FAIL],
    promise: (client, auth) => client.api.put(`/companies/${id}`, {
      authToken: auth.authToken,
      data: company,
    }),
  };
}

export function getMyCompanies() {
  return {
    types: [constants.GET_MY_COMPANIES, constants.GET_MY_COMPANIES_SUCCESS, constants.GET_MY_COMPANIES_FAIL],
    promise: (client, auth) => client.api.get('/companies/myCompanies', {
      authToken: auth.authToken,
    }),
  };
}

export function searchCompanies(query) {
  return {
    types: [constants.SEARCH_COMPANIES, constants.SEARCH_COMPANIES_SUCCESS, constants.SEARCH_COMPANIES_FAIL],
    promise: (client, auth) => client.api.get(`/companies/search?query=${query}`, {
      authToken: auth.authToken,
    }),
  };
}

export function saveCompanyResult(company){
  return {
    type: constants.GET_COMPANY_SUCCESS,
    result: company,
  };
}

export function getCompanyDetail(id) {
  return (dispatch) => {
    dispatch({
      types: [constants.GET_COMPANY_DETAIL, constants.GET_COMPANY_DETAIL_SUCCESS, constants.GET_COMPANY_DETAIL_FAIL],
      promise: (client, auth) => client.api.get(`/companies/detail?id=${id}`, {
        authToken: auth.authToken,
      }).then((company)=> {
        dispatch(saveCompanyResult(company));

        if (company.location) {
          dispatch(saveLocationByCompanyResult(company.location));
        }

        if (company.jobs && company.jobs.length > 0) {
          dispatch(saveJobsByCompanyResult(company.jobs));
        }

        if (company.contacts && company.contacts.length > 0) {
          dispatch(saveContactsByCompanyResult({
            companyId: company.id,
            result: company.contacts,
          }));
        }

        if (company.notes && company.notes.length > 0) {
          dispatch(saveNotesByCompanyResult(company.notes));
        }

        return company;
      }),
    });
  };
}
