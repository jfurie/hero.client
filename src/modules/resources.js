import Immutable from 'immutable';
import * as jobConstants from './jobs/constants';
import * as companyConstants from './companies/constants';
import * as contactConstants from './contacts/constants';
import superagent from 'superagent';

const GET_IMAGE_BY_JOB = 'hero.client/resources/GET_LOCATION';
const GET_IMAGE_BY_JOB_SUCCESS = 'hero.client/resources/GET_IMAGE_BY_JOB_SUCCESS';
const GET_IMAGE_BY_JOB_FAIL = 'hero.client/resources/GET_IMAGE_BY_JOB_FAIL';

const GET_IMAGE_BY_COMPANY = 'hero.client/resources/GET_LOCATION';
const GET_IMAGE_BY_COMPANY_SUCCESS = 'hero.client/resources/GET_IMAGE_BY_COMPANY_SUCCESS';
const GET_IMAGE_BY_COMPANY_FAIL = 'hero.client/resources/GET_IMAGE_BY_COMPANY_FAIL';

const CREATE_RESOURCE = 'hero.client/resources/CREATE_RESOURCE';
const CREATE_RESOURCE_SUCCESS = 'hero.client/resources/CREATE_RESOURCE_SUCCESS';
const CREATE_RESOURCE_FAIL = 'hero.client/resources/CREATE_RESOURCE_FAIL';
const CREATE_RESOURCE_PROGRESS = 'hero.client/resources/CREATE_RESOURCE_PROGRESS';
const initialState = {
  list: new Immutable.Map(),
  byJobId: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {

  switch (action.type) {
  case jobConstants.UPDATE_JOB_IMAGE_SUCCESS: {
    let newMap ={};
    newMap[action.result.id] = action.result;
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
    };
  }
  case GET_IMAGE_BY_JOB_SUCCESS:{
    let newMap ={};
    newMap[action.result.image.id] = action.result.image;
    let jobIdMap = {};
    jobIdMap[action.result.jobId] = action.result.image.id;
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
      byJobId: state.list.mergeDeep(jobIdMap),
    };
  }
  case companyConstants.UPDATE_COMPANY_IMAGE_SUCCESS: {
    let newMap ={};
    newMap[action.result.id] = action.result;
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
    };
  }
  case GET_IMAGE_BY_COMPANY_SUCCESS:{
    let newMap ={};
    newMap[action.result.image.id] = action.result.image;
    let companyIdMap = {};
    companyIdMap[action.result.companyId] = action.result.image.id;
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
      byCompanyId: state.list.mergeDeep(companyIdMap),
    };
  }
  case contactConstants.UPDATE_COVER_IMAGE_SUCCESS:{
    let newMap ={};
    newMap[action.result.id] = action.result;
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
    };
  }
  case contactConstants.GET_CONTACT_DETAIL_SUCCESS:{
    let newMap ={};
    if(action.result.coverImage){
      newMap[action.result.coverImage.id] = action.result.coverImage;
    }
    if(action.result.avatarImage){
      newMap[action.result.avatarImage.id] = action.result.avatarImage;
    }
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
    };
  }
  case CREATE_RESOURCE:{
    let newMap ={};
    newMap[action.id] = {}
  }
  default:
    return state;
  }
}

export function getImageByJobId(id) {
  return {
    types: [GET_IMAGE_BY_JOB, GET_IMAGE_BY_JOB_SUCCESS, GET_IMAGE_BY_JOB_FAIL],
    promise: (client, auth) => new Promise((resolve,reject) => {
      client.api.get(`/jobs/${id}/image`, {
        authToken: auth.authToken,
      }).then((image) =>{
        resolve({
          jobId: id,
          image,
        });
      }).catch((err) => {
        reject(err);
      });
    }),
  };
}

export function getImageByCompanyId(id) {
  return {
    types: [GET_IMAGE_BY_COMPANY, GET_IMAGE_BY_COMPANY_SUCCESS, GET_IMAGE_BY_COMPANY_FAIL],
    promise: (client, auth) => new Promise((resolve,reject) => {
      client.api.get(`/companies/${id}/image`, {
        authToken: auth.authToken,
      }).then((image) =>{
        resolve({
          companyId: id,
          image,
        });
      }).catch((err) => {
        reject(err);
      });
    }),
  };
}

export function createResource(uniqueRequestId, type, file){
  return (dispatch) => {
    return dispatch({
      uniqueRequestId,
      types:[CREATE_RESOURCE,CREATE_RESOURCE_SUCCESS,CREATE_RESOURCE_FAIL],
      promise: (client,auth) => client.api.post('/resources/signUrl', {
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
                uniqueRequestId,
                type: CREATE_RESOURCE_PROGRESS,
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
            resourceType: type,
            item: signUrlData,
          },
        });
      }),
    });
  };
}
