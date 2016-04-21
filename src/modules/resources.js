import Immutable from 'immutable';
import * as jobConstants from './jobs/constants';
import * as companyConstants from './companies/constants';
import * as contactConstants from './contacts/constants';
import superagent from 'superagent';
//GET_SEARCH_SUCCESS
const GET_SEARCH_SUCCESS = 'hero.client/search/GET_SEARCH_SUCCESS';

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

function getResourcesFromContacts(contacts, newMap ={}){
  contacts && contacts.map((contact)=>{
    if(contact.coverImage){
      newMap[contact.coverImage.id] = contact.coverImage;
    }
    if(contact.avatarImage){
      newMap[contact.avatarImage.id] = contact.avatarImage;
    }
  });
  return newMap;
}

function getResourcesFromJobs(jobs, resources ={}){
  let contacts = [];
  jobs && jobs.map((job)=>{
    if(job){
      if(job.candidates){
        job.candidates.map(candidate =>{
          if(candidate.contact){
            contacts.push(candidate.contact);
          }
        });

      }
      if(job.company && job.company.talentAdvocate){
        var talentAdvocate = job.company.talentAdvocate;
        contacts.push(talentAdvocate);
      }
      if(job.image){
        resources[job.image.id] = job.image;
      }
    }

  });
  if(contacts && contacts.length > 0){
    resources = getResourcesFromContacts(contacts, resources);
  }
  return resources;
}
export default function reducer(state = initialState, action = {}) {
  if(action && action.result && action.result.entities && action.result.entities.resources){
    let resources = Immutable.fromJS(action.result.entities.resources);
    state = {
      ...state,
      list:state.list.mergeDeep(resources),
    };
  }
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
  case contactConstants.UPDATE_AVATAR_IMAGE_SUCCESS:{
    let newMap ={};
    newMap[action.result.id] = action.result;
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
    };
  }
  case contactConstants.GET_CONTACT_DETAIL_SUCCESS:{
    let newMap = getResourcesFromContacts([action.result]);
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
    };
  }

  case contactConstants.SEARCH_CONTACTS_SUCCESS:{
    let newMap = getResourcesFromContacts(action.result.results);
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
    };
  }
  case GET_SEARCH_SUCCESS:{
    let newMap = getResourcesFromContacts(action.result.results.results);
    return {
      ...state,
      list: state.list.mergeDeep(newMap),
    };
  }
  case jobConstants.GET_JOB_DETAIL_SUCCESS:{
    let resources = getResourcesFromJobs([action.result]);
    return {
      ...state,
      list: state.list.mergeDeep(resources)
    };
  }
  case CREATE_RESOURCE:{
    let newMap ={};
    newMap[action.id] = {};
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
