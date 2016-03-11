import Immutable from 'immutable';

import { getOneLocation } from '../locations';

import * as constants from './constants';
import * as jobConstants from '../jobs/constants';

import { saveJobsByCompanyResult } from '../jobs';
import { getContactsByIdsIfNeeded } from '../contacts';
import { saveNotesByCompanyResult } from '../notes';
import { getLocationsByIdsIfNeeded } from '../locations';

import superagent from 'superagent';
import {actionTypes} from 'redux-localstorage';

const initialState = new Immutable.Map({
  list: new Immutable.Map(),
  myCompanyIds: new Immutable.Map(),
  myFavoriteCompanyIds: new Immutable.Map(),
  searches: new Immutable.Map(),
  currentSearch: '',
  queries: new Immutable.Map(),
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case actionTypes.INIT:{
    const persistedState = action.payload && action.payload['companies'];
    if(persistedState){
      return state.set('list', Immutable.fromJS(persistedState.list));
    } else{
      return state;
    }
  }
  case constants.GET_COMPANIES_BY_IDS_SUCCESS: {
    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return state.set('list', state.get('list').merge(companiesMap));
  }
  case constants.GET_COMPANIES: {
    return state;
  }
  case constants.GET_COMPANIES_SUCCESS: {
    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return state.set('list', state.get('list').mergeDeep(companiesMap));
  }
  case constants.GET_COMPANIES_FAIL: {
    return state.set('err', action.err);
  }
  case constants.GET_COMPANY: {
    return state;
  }
  case constants.GET_COMPANY_SUCCESS:
  case constants.GET_COMPANY_DETAIL_SUCCESS: {
    let company = {};
    let id = action.result.id;
    company[id] = action.result;

    return state.set('list', state.get('list').mergeDeep(company));
  }
  case constants.GET_COMPANY_FAIL: {
    return state.set('err', action.err);
  }
  case constants.EDIT_COMPANY: {
    let company = {};
    action.company = action.company.set('saving',true);
    action.company = action.company.set('savingError',null);
    company[action.id] = action.company;

    return state.withMutations((state) => {
      state.set('saving', true).set('savingError', '').set('list', state.get('list').mergeDeep(company));
    });
  }
  case constants.EDIT_COMPANY_SUCCESS: {
    let company = {};
    let id = action.result.id;
    company[id] = action.result;
    company[id].saving = false;
    company[id].savingError = '';

    return state.withMutations((state) => {
      state.set('saving', false).set('list', state.get('list').mergeDeep(company));
    });
  }
  case constants.EDIT_COMPANY_FAIL: {
    let company = {};
    let id = action.result.id;
    company[id].saving = false;
    company[id].savingError = action.err;

    return state.withMutations((state) => {
      state.set('saving', false).set('savingError', action.err).set('list', state.get('list').mergeDeep(company));
    });
  }
  case constants.CREATE_COMPANY:{
    let company = {};
    action.company = action.company.set('saving',true);
    action.company = action.company.set('savingError',null);
    company[action.id] = action.company;

    return state.withMutations((state) => {
      state.set('saving', true).set('savingError', '').set('list', state.get('list').mergeDeep(company));
    });
  }
  case constants.CREATE_COMPANY_SUCCESS: {
    let newItem = {};
    newItem[action.result.id] = action.result;
    newItem[action.result.id].saving = false;
    newItem[action.result.id].savingError = null;
    newItem[action.id] = newItem[action.result.id];

    return state.withMutations((state) => {
      state.set('saving', false).set('savingError', '').set('list', state.get('list').mergeDeep(newItem));
    });
  }
  case constants.CREATE_COMPANY_FAIL: {
    let company = {};
    company[action.id] = {};
    company[action.id].saving = false;
    company[action.id].savingError = (action.error && action.error.error && action.error.error.message) || 'Failed to create company';

    return state.withMutations((state) => {
      state.set('saving', false).set('savingError', 'Failed to create company').set('list', state.get('list').mergeDeep(company));
    });
  }
  case constants.SEARCH_COMPANIES: {
    return state.withMutations((state) => {
      state.set('searches', state.searches.mergeDeep(action.result)).set('currentSearch', action.query);
    });
  }
  case jobConstants.GET_MY_JOBS_SUCCESS: {
    let companyList =  {};
    action.result.map(job =>{
      if(job.company){
        companyList[job.company.id] = job.company;
      }
    });

    return state.set('list', state.get('list').mergeDeep(companyList));
  }
  case jobConstants.GET_JOB_SUCCESS: {
    let companyList =  {};
    companyList[action.result.company.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(companyList));
  }
  case constants.GET_MY_COMPANIES_SUCCESS: {

    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return state.withMutations((state) => {
      state.set('myCompanyIds', state.get('myCompanyIds').mergeDeep(companiesMap)).set('list', state.get('list').mergeDeep(companiesMap));
    });
  }
  case constants.GET_MY_COMPANIES_FAIL: {
    return state.set('err', action.err);
  }
  case constants.GET_MY_FAVORITE_COMPANIES_SUCCESS: {
    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return state.withMutations((state) => {
      state.set('myFavoriteCompanyIds', state.myFavoriteCompanyIds.mergeDeep(companiesMap)).set('list', state.get('list').mergeDeep(companiesMap));
    });
  }
  case constants.CREATE_COMPANY_FAVORITE_SUCCESS: {
    let company = state.get('list').get(action.result.favorableId);
    company = company.set('isFavorited', true);

    let companyMap = {};
    companyMap[company.get('id')] = company;

    return state.withMutations((state) => {
      state.set('list', state.get('list').mergeDeep(companyMap)).set('myCompanyIds', state.get('myCompanyIds').mergeDeep(companyMap)).set('myFavoriteCompanyIds', state.myFavoriteCompanyIds.mergeDeep(companyMap));
    });
  }
  case constants.DELETE_COMPANY_FAVORITE_SUCCESS: {
    let company = state.get('list').get(action.result.favorableId);
    company = company.set('isFavorited', false);

    let companyMap = {};
    companyMap[company.get('id')] = company;

    return state.withMutations((state) => {
      state.set('list', state.get('list').mergeDeep(companyMap)).set('myCompanyIds', state.get('myCompanyIds').mergeDeep(companyMap)).set('myFavoriteCompanyIds', state.myFavoriteCompanyIds.delete(action.result.favorableId));
    });
  }
  case constants.CREATE_TEMP_COMPANY: {
    let companiesMap = {};
    companiesMap[action.result.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(companiesMap));
  }
  case constants.SEARCH_COMPANIES_SUCCESS: {
    let query = action.result.query;

    let queriesMap = {};
    queriesMap[query] = action.result.results;

    return state.set('queries', state.queries.mergeDeep(queriesMap));
  }
  case constants.SEARCH_COMPANIES_FAIL: {
    return state.set('err', action.err);
  }
  case constants.UPDATE_COMPANY_IMAGE:{
    let company = {};
    company[action.id] = {
      isUploading:true,
      percentUploaded:0
    };

    return state.set('list', state.get('list').mergeDeep(company));
  }
  case constants.UPDATE_COMPANY_IMAGE_SUCCESS:{
    let company = {};
    let image = {
      imageId:action.result.id,
      isUploading:false,
      percentUploaded:100
    };
    company[action.id] = image;

    return state.set('list', state.get('list').mergeDeep(company));
  }
  case constants.UPDATE_COMPANY_IMAGE_PROGRESS:{
    let company = {};

    let image = {
      isUploading:true,
      percentUploaded:action.result
    };
    company[action.id] = image;

    return state.set('list', state.get('list').mergeDeep(company));
  }
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

export function getMyFavoriteCompanies() {
  return {
    types: [constants.GET_MY_FAVORITE_COMPANIES, constants.GET_MY_FAVORITE_COMPANIES_SUCCESS, constants.GET_MY_FAVORITE_COMPANIES_FAIL],
    promise: (client, auth) => client.api.get('/companies/myFavoriteCompanies', {
      authToken: auth.authToken,
    }),
  };
}

export function createCompanyFavorite(companyId){
  return {
    types: [constants.CREATE_COMPANY_FAVORITE, constants.CREATE_COMPANY_FAVORITE_SUCCESS, constants.CREATE_COMPANY_FAVORITE_FAIL],
    promise: (client, auth) => client.api.post(`/companies/${companyId}/favorites`, {
      authToken: auth.authToken,
    }),
  };
}

export function deleteCompanyFavorite(companyId){
  return {
    types: [constants.DELETE_COMPANY_FAVORITE, constants.DELETE_COMPANY_FAVORITE_SUCCESS, constants.DELETE_COMPANY_FAVORITE_FAIL],
    promise: (client, auth) => client.api.del(`/companies/unfavorite?id=${companyId}`, {
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

export function saveCompaniesResult(companies){
  return {
    type: constants.GET_COMPANIES_SUCCESS,
    result: companies,
  };
}

// export function getCompanyDetail(id) {
//
//   return (dispatch) => {
//     dispatch({
//       types: [constants.GET_COMPANY_DETAIL, constants.GET_COMPANY_DETAIL_SUCCESS, constants.GET_COMPANY_DETAIL_FAIL],
//       promise: (client, auth) => client.api.get(`/companies/detail?id=${id}`, {
//         authToken: auth.authToken,
//       }).then((company)=> {
//
//         dispatch(saveCompanyResult(company));
//
//         if (company.location) {
//           dispatch(saveLocationByCompanyResult(company.location));
//         }
//
//         if (company.jobs && company.jobs.length > 0) {
//           dispatch(saveJobsByCompanyResult(company.jobs));
//         }
//
//         if (company.contacts && company.contacts.length > 0) {
//           dispatch(saveContactsByCompanyResult({
//             companyId: company.id,
//             result: company.contacts,
//           }));
//         }
//
//         if (company.notes && company.notes.length > 0) {
//           dispatch(saveNotesByCompanyResult(company.notes));
//         }
//
//         return company;
//       }),
//     });
//   };
// }

export function getCompanyDetail(id) {

  return (dispatch) => {
    dispatch({
      types: [constants.GET_COMPANY_DETAIL, constants.GET_COMPANY_DETAIL_SUCCESS, constants.GET_COMPANY_DETAIL_FAIL],
      promise: (client, auth) => client.api.get(`/companies/detail?id=${id}`, {
        authToken: auth.authToken,
      }).then((company)=> {
        if (company.locationId) {
          dispatch(getLocationsByIdsIfNeeded([company.locationId]));
        }

        if (company.talentAdvocateId) {
          dispatch(getContactsByIdsIfNeeded([company.talentAdvocateId]));
        }

        let contactIds = [];

        if (company.talentAdvocateId) {
          contactIds.push(company.talentAdvocateId);
        }

        if (company.contacts) {
          company.contacts.map((contact => {
              contactIds.push(contact.id);
          }));
        }

        if (contactIds) {
          dispatch(getContactsByIdsIfNeeded(contactIds));
        }

        // if (company.jobs && company.jobs.length > 0) {
        //   dispatch(saveJobsByCompanyResult(company.jobs));
        // }

        //
        // if (company.notes && company.notes.length > 0) {
        //   dispatch(saveNotesByCompanyResult(company.notes));
        // }

        return company;
      }),
    });
  };
}

export function updateCompanyImage(id,file) {
  return (dispatch) => {
    dispatch({
      id,
      types: [constants.UPDATE_COMPANY_IMAGE, constants.UPDATE_COMPANY_IMAGE_SUCCESS, constants.UPDATE_COMPANY_IMAGE_FAIL],
      promise: (client, auth) => client.api.post('/resources/signUrl', {
        authToken: auth.authToken,
        data: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      }).then((signUrlData) => new Promise((resolve, reject) => {
        superagent.put(signUrlData.signed_request)
            .send(file)
            .on('progress', function(e) {
              dispatch({
                id,
                type: constants.UPDATE_COMPANY_IMAGE_PROGRESS,
                result: e.percent,
              });
            })
            .end((err, {
              body,
            } = {}) => {
              if (err) {
                return reject(body || err);
              } else {
                return resolve(signUrlData.url);
              }
            });
      })).then((signUrlData) => {
        console.log(signUrlData);
        return client.api.post('/resources', {
          authToken: auth.authToken,
          data: {
            resourceType: 'image',
            item: signUrlData,
          },
        });
      }),
    });
  };
}

export function getCompaniesByIds(companyIds){
  return (dispatch) => {
    return dispatch({
      types:[constants.GET_COMPANIES_BY_IDS, constants.GET_COMPANIES_BY_IDS_SUCCESS, constants.GET_COMPANIES_BY_IDS_FAIL],
      promise:(client,auth) => {
        let filter= {where:{id:{inq:companyIds}}};
        let filterString = encodeURIComponent(JSON.stringify(filter));
        return client.api.get(`/companies?filter=${filterString}`,{
          authToken: auth.authToken,
        });
      }
    });
  };
}

export function getCompaniesByIdsIfNeeded(companyIds){
  return (dispatch, getState) => {
    var newCompanyIds =[];
    companyIds.map((companyId => {
      if(!getState().companies.get('list').get(companyId)){
        newCompanyIds.push(companyId);
      }
    }));
    return dispatch(getCompaniesByIds(newCompanyIds));
  };
}
