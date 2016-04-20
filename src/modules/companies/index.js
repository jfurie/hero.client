import Immutable from 'immutable';

import * as constants from './constants';
import * as jobConstants from '../jobs/constants';
import * as authConstants from '../auth/constants';
import { saveJobsResult } from '../jobs';
import { saveContactsResult } from '../contacts';
import { saveNotesResult } from '../notes';
import { createCompanyLocation, editLocation, deleteLocation, saveLocationsResult, getOneLocation } from '../locations';
import { getFavoriteByType } from '../favorites';

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
  case authConstants.LOGOUT:{
    return initialState;
  }
  case constants.GET_COMPANIES_BY_IDS_SUCCESS: {
    let companiesMap = {};
    action.result.map((c) => {
      companiesMap[c.id] = c;
    });

    return state.set('list', state.get('list').mergeDeep(companiesMap));
  }
  case constants.GET_COMPANY_DETAILS_SUCCESS: {
    let companiesMap = {};
    action.companyIds.map((c) => {
      let result = action.result.find(x => {
        return x.id == c;
      });
      if(result){
        companiesMap[c] = result;
      } else {
        companiesMap[c] = {id:c, show404:true};
      }
    });

    return state.set('list', state.get('list').mergeDeep(companiesMap));
  }
  case constants.GET_COMPANY_DETAILS_FAIL: {
    let companiesMap = {};
    action.companyIds.map((c) => {
      companiesMap[c] = {id:c, show404:true};
    });

    return state.set('list', state.get('list').mergeDeep(companiesMap));
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
  case constants.GET_COMPANY_SUCCESS: {
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
    newItem[action.id] = {
      saving: false,
      savingError: null,
      newId: action.result.id,
    };

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
      state.set('searches', state.get('searches').mergeDeep(action.result)).set('currentSearch', action.query);
    });
  }
  case jobConstants.GET_JOB_SUCCESS: {
    let companyList =  {};
    companyList[action.result.company.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(companyList));
  }
  case jobConstants.GET_JOB_DETAIL_SUCCESS: {
    if(action.result.company){
      let companyList =  {};
      companyList[action.result.company.id] = action.result.company;
      return state.set('list', state.get('list').mergeDeep(companyList));
    } else {
      return state;
    }
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
      state.set('myFavoriteCompanyIds', state.get('myFavoriteCompanyIds').mergeDeep(companiesMap)).set('list', state.get('list').mergeDeep(companiesMap));
    });
  }
  case constants.CREATE_COMPANY_FAVORITE_SUCCESS: {
    let company = state.get('list').get(action.result.favorableId);
    company = company.set('isFavorited', true);

    let companyMap = {};
    companyMap[company.get('id')] = company;

    return state.withMutations((state) => {
      state.set('list', state.get('list').mergeDeep(companyMap)).set('myCompanyIds', state.get('myCompanyIds').mergeDeep(companyMap)).set('myFavoriteCompanyIds', state.get('myFavoriteCompanyIds').mergeDeep(companyMap));
    });
  }
  case constants.DELETE_COMPANY_FAVORITE_SUCCESS: {
    let company = state.get('list').get(action.result.favorableId);
    company = company.set('isFavorited', false);

    let companyMap = {};
    companyMap[company.get('id')] = company;

    return state.withMutations((state) => {
      state.set('list', state.get('list').mergeDeep(companyMap)).set('myCompanyIds', state.get('myCompanyIds').mergeDeep(companyMap)).set('myFavoriteCompanyIds', state.get('myFavoriteCompanyIds').delete(action.result.favorableId));
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

    return state.set('queries', state.get('queries').mergeDeep(queriesMap));
  }
  case constants.SEARCH_COMPANIES_FAIL: {
    return state.set('err', action.err);
  }
  case constants.UPDATE_COMPANY_IMAGE:{
    let company = {};
    company[action.id] = {
      isUploading:true,
      percentUploaded:0,
    };

    return state.set('list', state.get('list').mergeDeep(company));
  }
  case constants.UPDATE_COMPANY_IMAGE_SUCCESS:{
    let company = {};
    let image = {
      imageId:action.result.id,
      isUploading:false,
      percentUploaded:100,
    };
    company[action.id] = image;

    return state.set('list', state.get('list').mergeDeep(company));
  }
  case constants.UPDATE_COMPANY_IMAGE_PROGRESS:{
    let company = {};

    let image = {
      isUploading:true,
      percentUploaded:action.result,
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
    let current = getState().companies.get('list');
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
  let id = company.get('id');
  if(id && id.indexOf('tmp') > -1){
    company = company.remove('id');
  }
  return (dispatch) => {
    dispatch({
      id,
      company,
      types: [constants.CREATE_COMPANY, constants.CREATE_COMPANY_SUCCESS, constants.CREATE_COMPANY_FAIL],
      promise: (client, auth) => client.api.post('/companies', {
        authToken: auth.authToken,
        data: company,
      }).then(function (result) {
        let promises = [];
        promises.push(dispatch(getFavoriteByType('company', result.id)));
        company.get('locationsPendingSave').forEach(location => {
          promises.push(dispatch(createCompanyLocation(result.id, location)));
        });

        return Promise.all(promises).then(() => {
          return dispatch(setCompanyPrimaryLocation(result.id, company.get('pendingPrimaryLocation'))).then(action => {
            return action.result;
          });
        });
      }),
    });
  };
}

export function editCompany(company) {
  let id = company.id;
  if(!company.id){
    id = company.get('id');
  }
  return (dispatch) => {
    return dispatch({
      id,
      company,
      types: [constants.EDIT_COMPANY, constants.EDIT_COMPANY_SUCCESS, constants.EDIT_COMPANY_FAIL],
      promise: (client, auth) => client.api.put(`/companies/${id}`, {
        authToken: auth.authToken,
        data: company,
      }).then(function (result) {
        let locationPromises = [];
        company.get('locationsPendingSave').forEach(location => {
          if (location.has('id')) {
            locationPromises.push(dispatch(editLocation(location)));
          }
          else {
            locationPromises.push(dispatch(createCompanyLocation(result.id, location)));
          }
        });
        company.get('locationsPendingDelete').forEach(location => {
          locationPromises.push(dispatch(deleteLocation(location.get('id'))));
        });

        return Promise.all(locationPromises).then(() => {
          return dispatch(setCompanyPrimaryLocation(result.id, company.get('pendingPrimaryLocation'))).then(action => {
            return action.result;
          });
        });
      }),
    });
  };
}

function combineStrings(strings) {
  let output = [];

  strings.forEach(x => {
    if (x) {
      output.push(x);
    }
  });

  output = output.join();
  return output;
}

export function setCompanyPrimaryLocation(companyId, pendingPrimaryLocation) {
  // set to first location for now
  return dispatch => {
    return dispatch(getCompaniesByIds([companyId])).then(action => {
      let company = action.result[0];
      if (company.locations && company.locations.length > 0) {
        let ppl = pendingPrimaryLocation;

        let primaryLocation = company.locations.filter(x => {
          return ppl.get('id') == x.id
          || (combineStrings([ppl.get('name'), ppl.get('addressLine'), ppl.get('city'), ppl.get('countrySubDivisionCode'), ppl.get('postalCode'), ppl.get('countryCode')])
          == combineStrings([x.name, x.addressLine, x.city, x.countrySubDivisionCode, x.postalCode, x.countryCode]));
        });

        company.locationId = primaryLocation.length > 0 ? primaryLocation[0].id : company.locations[0].id;
        return dispatch({
          types: [constants.SET_COMPANY_PRIMARY_LOCATION, constants.SET_COMPANY_PRIMARY_LOCATION_SUCCESS, constants.SET_COMPANY_PRIMARY_LOCATION_FAIL],
          promise: (client, auth) => client.api.put(`/companies/${companyId}`, {
            authToken: auth.authToken,
            data: company,
          }).then(function (result) {
            return result;
          }),
        });
      }
      else {
        return company;
      }
    });
  };
}

export function getMyCompanies() {
  let filter = {
    include:[
      {
        relation:'clientAdvocate',
      },
      {
        relation:'locations',
      },
      {
        relation:'contacts',
      },
    ],
  };

  let filterString = encodeURIComponent(JSON.stringify(filter));

  return (dispatch) => {
    dispatch({
      types: [constants.GET_MY_COMPANIES, constants.GET_MY_COMPANIES_SUCCESS, constants.GET_MY_COMPANIES_FAIL],
      promise: (client, auth) => client.api.get(`/companies?filter=${filterString}`, {
        authToken: auth.authToken,
      }).then((companies)=> {
        let locations = [];
        let contacts = [];

        companies.forEach(company => {
          if (company.clientAdvocate) {
            contacts.push(company.clientAdvocate);
          }

          if (company.locations) {
            company.locations.map((location => {
              locations.push(location);
            }));
          }

          if (company.contacts) {
            company.contacts.map((contact => {
              contacts.push(contact);
            }));
          }
        });

        if (locations.length > 0) {
          dispatch(saveLocationsResult(locations));
        }

        if (contacts.length > 0) {
          dispatch(saveContactsResult(contacts));
        }

        return companies;
      }),
    });
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

// export function getCompaniesByIds(companyIds){
//   return (dispatch) => {
//     return dispatch({
//       types:[constants.GET_COMPANIES_BY_IDS, constants.GET_COMPANIES_BY_IDS_SUCCESS, constants.GET_COMPANIES_BY_IDS_FAIL],
//       promise:(client,auth) => {
//         if(companyIds && companyIds.length >0){
//           let filter= {where:{id:{inq:companyIds}}};
//           let filterString = encodeURIComponent(JSON.stringify(filter));
//           return client.api.get(`/companies?filter=${filterString}`,{
//             authToken: auth.authToken,
//           });
//         } else {
//           return Promise.resolve([]);
//         }
//       },
//     });
//   };
// }

export function getCompaniesByIds(companyIds, include) {
  return (dispatch, getState) => {
    let filter = {
      where: {
        id: {inq:companyIds},
      },
      include:[
        {
          relation:'clientAdvocate',
        },
        {
          relation:'image',
        },
        {
          relation:'location',
        },
        {
          relation:'locations',
        },
      ],
    };

    if (include) {
      if (include.indexOf('contacts') > -1) {
        filter.include.push({
          relation:'contacts',
        });
      }

      if (include.indexOf('jobs') > -1) {
        filter.include.push({
          relation:'jobs',
        });
      }

      if (include.indexOf('notes') > -1) {
        filter.include.push({
          relation:'notes',
          scope:{
            order: 'updated DESC',
            where: { or: [
              {and: [{privacyValue: 0}, {userId: getState().auth.get('user').get('id')}]},
              {privacyValue: 1},
            ]},
            include:{
              relation:'contact',
            },
          },
        });
      }
    }

    let filterString = encodeURIComponent(JSON.stringify(filter));

    return dispatch({
      companyIds,
      types: [constants.GET_COMPANIES_BY_IDS, constants.GET_COMPANIES_BY_IDS_SUCCESS, constants.GET_COMPANIES_BY_IDS_FAIL],
      promise: (client, auth) => client.api.get(`/companies?filter=${filterString}`, {
        authToken: auth.authToken,
      }).then((companies)=> {
        let locations = [];
        let contacts = [];
        let jobs = [];
        let notes = [];

        companies.forEach(company => {
          if (company.clientAdvocate) {
            contacts.push(company.clientAdvocate);
          }

          if (company.location) {
            locations.push(company.location);
          }

          if (company.locations) {
            company.locations.map((location => {
              locations.push(location);
            }));
          }

          if (include && include.indexOf('contacts') > -1 && company.contacts) {
            company.contacts.map((contact => {
              contacts.push(contact);
            }));
          }

          if (include && include.indexOf('jobs') > -1 && company.jobs) {
            company.jobs.map((job => {
              jobs.push(job);
            }));
          }

          if (include && include.indexOf('notes') > -1 && company.notes) {
            company.notes.map((note => {
              notes.push(note);
              if (note.contact) {
                contacts.push(note.contact);
              }
            }));
          }
        });

        if (locations.length > 0) {
          dispatch(saveLocationsResult(locations));
        }

        if (contacts.length > 0) {
          dispatch(saveContactsResult(contacts));
        }

        if (jobs.length > 0) {
          dispatch(saveJobsResult(jobs));
        }

        if (notes.length > 0) {
          dispatch(saveNotesResult(notes));
        }

        return companies;
      }),
    });
  };
}

export function getCompaniesByIdsIfNeeded(companyIds){
  return (dispatch, getState) => {
    let newCompanyIds =[];
    companyIds.map((companyId => {
      if(!getState().companies.get('list').get(companyId)){
        newCompanyIds.push(companyId);
      }
    }));
    return dispatch(getCompaniesByIds(newCompanyIds));
  };
}
