import Immutable from 'immutable';
import * as constants from './constants';

import {actionTypes} from 'redux-localstorage';

const initialState = new Immutable.Map({
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  byContactId: new Immutable.Map(),
  localJob: new Immutable.Map(),
  myJobIds: new Immutable.Map(),
  myFavoriteJobIds: new Immutable.Map(),
  queries: new Immutable.Map(),
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case actionTypes.INIT:{
    const persistedState = action.payload && action.payload['jobs'];
    if(persistedState){
      return state.set('list', Immutable.fromJS(persistedState.list));
    } else{
      return state;
    }
  }
  case constants.GET_JOBS_BY_IDS_SUCCESS: {
    let jobsMap = {};
    action.result.map((c) => {
      jobsMap[c.id] = c;
    });

    return state.set('list', state.get('list').merge(jobsMap));
  }
  case constants.GET_JOBS: {
    return state;
  }
  case constants.GET_JOBS_SUCCESS: {
    return state;
  }
  case constants.GET_JOBS_FAIL: {
    return state.set('err', action.err);
  }
  case constants.GET_JOB: {
    return state;
  }
  case constants.GET_JOB_SUCCESS: {
    let jobMap = {};
    jobMap[action.result.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(jobMap));
  }
  case constants.GET_JOB_FAIL: {
    return state.set('err', action.err);
  }
  case constants.GET_JOBS_BY_COMPANY:{
    return state.set('loading', true);
  }
  case constants.GET_JOBS_BY_COMPANY_SUCCESS:{

    let companyId = null;

    if (action.result.length) {
      companyId = action.result[0].companyId;
    }

    if (companyId) {
      let byCompanyMap = {};
      byCompanyMap[companyId] = action.result.map((job) => job.id);
      let companyMap = {};
      action.result.map((c) => {
        companyMap[c.id] = c;
      });

      return state.withMutations((state) => {
        state.set('byCompanyId', state.get('byCompanyId').mergeDeep(byCompanyMap))
        .set('list', state.get('list').mergeDeep(companyMap))
        .set('loading', false);
      });
    }

    return state.set('loading', false);
  }
  case constants.GET_JOBS_BY_COMPANY_FAIL:{
    return state.set('loading', false);
  }
  case constants.GET_JOBS_BY_CONTACT_SUCCESS:{

    let contactId = action.result.contactId;

    let byContactMap = {};
    byContactMap[contactId] = action.result.jobs.map((contact) => contact.id);
    let contactMap = {};
    action.result.jobs.map((c) => {
      contactMap[c.id] = c;
    });

    return state.withMutations((state) => {
      state.set('byContactId', state.get('byContactId').mergeDeep(byContactMap))
      .set('list', state.get('list').mergeDeep(contactMap));
    });
  }
  case constants.CREATE_JOB:{
    let job = {};
    action.job = action.job.set('saving',true);
    action.job = action.job.set('savingError',null);
    job[action.id] = action.job;

    return state.withMutations((state) => {
      state.set('saving', true)
      .set('savingError', '')
      .set('list', state.get('list').mergeDeep(job))
      .set('localJob', action.job);
    });
  }
  case constants.CREATE_JOB_SUCCESS:{
    let jobMap = {};
    jobMap[action.result.id] = action.result;

    jobMap[action.id] = {
      saving: false,
      savingError: '',
      newId: action.result.id,
    };

    let companyId = action.result.companyId;
    let byCompanyMapNew = {};

    byCompanyMapNew[companyId] = state.byCompanyId.get(companyId) || new Immutable.List();
    byCompanyMapNew[companyId] = byCompanyMapNew[companyId].push(action.result.id);

    return state.withMutations((state) => {
      state.set('saving', false)
      .set('savingError', '')
      .set('loading', false)
      .set('list', state.get('list').mergeDeep(jobMap))
      .set('byCompanyId', state.get('byCompanyId').mergeDeep(byCompanyMapNew))
      .set('localJob', new Immutable.Map(action.result));
    });
  }
  case constants.CREATE_JOB_FAIL:{
    let job = {};
    action.job = action.job.set('saving',true);
    action.job = action.job.set('savingError', (action.error && action.error.error && action.error.error.message) || 'Failed to create job');

    job[action.id] = action.job;

    return state.withMutations((state) => {
      state.set('saving', false)
      .set('savingError', 'Failed to create job')
      .set('list', state.get('list').mergeDeep(job))
      .set('localJob', action.job);
    });
  }
  case constants.EDIT_JOB:{
    let job = {};
    action.job = action.job.set('saving',true);
    action.job = action.job.set('savingError',null);
    job[action.id] = action.job;

    return state.withMutations((state) => {
      state.set('saving', true)
      .set('savingError', '')
      .set('list', state.get('list').mergeDeep(job))
      .set('localJob', action.job);
    });
  }
  case constants.EDIT_JOB_SUCCESS:{
    let jobMap = {};
    jobMap[action.result.id] = action.result;

    jobMap[action.id] = {
      saving: false,
      savingError: '',
      newId: action.result.id,
    };

    return state.withMutations((state) => {
      state.set('saving', false)
      .set('loading', false)
      .set('savingError', '')
      .set('list', state.get('list').mergeDeep(jobMap))
      .set('localJob', state.localJob.mergeDeep(action.result));
    });
  }
  case constants.EDIT_JOB_FAIL:{
    let job = {};
    action.job = action.job.set('saving',true);
    action.job = action.job.set('savingError', (action.error && action.error.error && action.error.error.message) || 'Failed to edit job');

    job[action.id] = action.job;

    return state.withMutations((state) => {
      state.set('saving', false)
      .set('savingError', 'Failed to edit job')
      .set('list', state.get('list').mergeDeep(job));
    });
  }
  case constants.CREATE_JOB_LOCAL: {
    return state.set('localJob', state.get('localJob').mergeDeep(action.result));
  }
  case constants.UPDATE_JOB:{
    let job ={};
    job[action.id] = action.result;
    if(action.dontMergeDeep){
      return state.set('list', state.get('list').merge(job));
    } else {
      return state.set('list', state.get('list').mergeDeep(job));
    }
  }
  case constants.REPLACE_JOB_LOCAL:{
    return state.set('localJob', new Immutable.Map(action.result));
  }
  case constants.UPDATE_JOB_IMAGE:{
    let job = {};
    job[action.id] = {
      isUploading:true,
      percentUploaded:0
    };

    return state.set('list', state.get('list').mergeDeep(job));
  }
  case constants.UPDATE_JOB_IMAGE_SUCCESS:{
    let job = {};
    let image = {
      imageId:action.result.id,
      isUploading:false,
      percentUploaded:100
    };
    job[action.id] = image;

    return state.set('list', state.get('list').mergeDeep(job));
  }
  case constants.UPDATE_JOB_IMAGE_PROGRESS:{
    let job = {};

    let image = {
      isUploading:true,
      percentUploaded:action.result
    };
    job[action.id] = image;

    return state.set('list', state.get('list').mergeDeep(job));
  }
  case constants.GET_MY_JOBS_SUCCESS:{
    let jobsMap = {};
    action.result.map((job) => {
      jobsMap[job.id] = job;
    });

    return state.withMutations((state) => {
      state.set('myJobIds', state.get('myJobIds').mergeDeep(jobsMap))
      .set('list', state.get('list').mergeDeep(jobsMap));
    });
  }
  case constants.GET_MY_FAVORITE_JOBS_SUCCESS: {

    let jobsMap = {};
    action.result.map((c) => {
      jobsMap[c.id] = c;
    });

    return state.withMutations((state) => {
      state.set('myFavoriteJobIds', state.get('myFavoriteJobIds').mergeDeep(jobsMap))
      .set('list', state.get('list').mergeDeep(jobsMap));
    });
  }
  case constants.CREATE_JOB_FAVORITE_SUCCESS: {
    let job = state.list.get(action.result.favorableId);
    job = job.set('isFavorited', true);

    let jobMap = {};
    jobMap[job.get('id')] = job;

    return state.withMutations((state) => {
      state.set('myFavoriteJobIds', state.get('myFavoriteJobIds').mergeDeep(jobsMap))
      .set('list', state.get('list').mergeDeep(jobsMap))
      .set('myJobIds', state.get('myJobIds').mergeDeep(jobsMap));
    });
  }
  case constants.DELETE_JOB_FAVORITE_SUCCESS: {
    let job = state.list.get(action.result.favorableId);
    job = job.set('isFavorited', false);

    let jobMap = {};
    jobMap[job.get('id')] = job;

    return state.withMutations((state) => {
      state.set('myFavoriteJobIds', state.get('myFavoriteJobIds').delete(action.result.favorableId))
      .set('list', state.get('list').mergeDeep(jobsMap))
      .set('myJobIds', state.get('myJobIds').mergeDeep(jobsMap));
    });
  }
  case constants.UPDATE_JOB_IMAGE_FAIL:{
    return state;
  }
  case constants.SEARCH_JOBS_SUCCESS: {
    let query = action.result.query;

    let queriesMap = {};
    queriesMap[query] = action.result.results;

    return state.set('queries', state.get('queries').mergeDeep(queriesMap));
  }
  case constants.CREATE_TEMP_JOB:{
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(contactsMap));
  }
  case constants.GET_JOB_DETAIL: {
    return state;
  }
  case constants.GET_JOB_DETAIL_SUCCESS: {
    let jobMap = {};
    jobMap[action.result.id] = action.result;

    return state.set('list', state.get('list').mergeDeep(jobMap));
  }
  case constants.GET_JOB_DETAIL_FAIL: {
    return state.set('err', action.err);
  }
  default:
    return state;
  }
}
