import Immutable from 'immutable';
import * as constants from './constants';
const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  byContactId: new Immutable.Map(),
  localJob: new Immutable.Map(),
  myJobIds: new Immutable.Map(),
  myFavoriteJobIds: new Immutable.Map(),
  queries: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case constants.GET_JOBS: {
    return {
      ...state,
    };
  }
  case constants.GET_JOBS_SUCCESS: {
    return state;
    // return {
    //   ...state,
    //   list: state.list.mergeDeep(FAKEJOBS),
    // };
  }
  case constants.GET_JOBS_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case constants.GET_JOB: {
    return {
      ...state,
    };
  }
  case constants.GET_JOB_SUCCESS: {
    let jobMap = {};
    jobMap[action.result.id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(jobMap),
    };
  }
  case constants.GET_JOB_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case constants.GET_JOBS_BY_COMPANY:{
    return {
      ...state,
      loading:true,
    };
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

      return {
        ...state,
        byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
        list: state.list.mergeDeep(companyMap),
        loading:false,
      };

    }

    return {
      ...state,
      loading:false,
    };
  }
  case constants.GET_JOBS_BY_COMPANY_FAIL:{
    return {
      ...state,
      loading:false,
    };
  }
  case constants.GET_JOBS_BY_CONTACT_SUCCESS:{

    let contactId = action.result.contactId;

    let byContactMap = {};
    byContactMap[contactId] = action.result.jobs.map((contact) => contact.id);
    let contactMap = {};
    action.result.jobs.map((c) => {
      contactMap[c.id] = c;
    });

    return {
      ...state,
      byContactId: state.byContactId.mergeDeep(byContactMap),
      list: state.list.mergeDeep(contactMap),
    };
  }
  case constants.CREATE_JOB:{
    let job = {};
    action.job = action.job.set('saving',true);
    action.job = action.job.set('savingError',null);
    job[action.id] = action.job;
    return {
      ...state,
      saving:true,
      savingError:'',
      list: state.list.mergeDeep(job),
      localJob: action.job,
    };
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

    return {
      ...state,
      list: state.list.mergeDeep(jobMap),
      byCompanyId: state.byCompanyId.mergeDeep(byCompanyMapNew),
      loading:false,
      localJob: new Immutable.Map(action.result),
      saving:false,
      savingError:'',
    };
  }
  case constants.CREATE_JOB_FAIL:{
    let job = {};
    action.job = action.job.set('saving',true);
    action.job = action.job.set('savingError', (action.error && action.error.error && action.error.error.message) || 'Failed to create job');

    job[action.id] = action.job;
    return {
      ...state,
      saving:false,
      savingError:'Failed to create job',
      list:state.list.mergeDeep(job),
      localJob: action.job,
    };
  }
  case constants.EDIT_JOB:{
    let job = {};
    action.job = action.job.set('saving',true);
    action.job = action.job.set('savingError',null);
    job[action.id] = action.job;
    return {
      ...state,
      saving:true,
      savingError:'',
      list: state.list.mergeDeep(job),
      localJob: action.job,
    };
  }
  case constants.EDIT_JOB_SUCCESS:{
    let jobMap = {};
    jobMap[action.result.id] = action.result;

    jobMap[action.id] = {
      saving: false,
      savingError: '',
      newId: action.result.id,
    };

    return {
      ...state,
      list: state.list.mergeDeep(jobMap),
      loading:false,
      localJob: state.localJob.mergeDeep(action.result),
      saving:false,
      savingError:'',
    };
  }
  case constants.EDIT_JOB_FAIL:{
    let job = {};
    action.job = action.job.set('saving',true);
    action.job = action.job.set('savingError', (action.error && action.error.error && action.error.error.message) || 'Failed to edit job');

    job[action.id] = action.job;
    return {
      ...state,
      saving:false,
      savingError:'Failed to edit job',
      list:state.list.mergeDeep(job),
    };
  }
  case constants.CREATE_JOB_LOCAL: {

    return {
      ...state,
      localJob: state.localJob.mergeDeep(action.result),
    };
  }
  case constants.UPDATE_JOB:{
    let job ={};
    job[action.id] = action.result;
    if(action.dontMergeDeep){
      return {
        ...state,
        list: state.list.merge(job),
      };
    } else {
      return {
        ...state,
        list: state.list.mergeDeep(job),
      };
    }
  }
  case constants.REPLACE_JOB_LOCAL:{
    return {
      ...state,
      localJob: new Immutable.Map(action.result),
    };
  }
  case constants.UPDATE_JOB_IMAGE:{
    let job = {};
    job[action.id] = {
      isUploading:true,
      percentUploaded:0
    };
    return{
      ...state,
      list: state.list.mergeDeep(job),
    };
  }
  case constants.UPDATE_JOB_IMAGE_SUCCESS:{
    let job = {};
    let image = {
      imageId:action.result.id,
      isUploading:false,
      percentUploaded:100
    };
    job[action.id] = image;
    return{
      ...state,
      list: state.list.mergeDeep(job),
    };
  }
  case constants.UPDATE_JOB_IMAGE_PROGRESS:{
    let job = {};

    let image = {
      isUploading:true,
      percentUploaded:action.result
    };
    job[action.id] = image;
    return{
      ...state,
      list: state.list.mergeDeep(job),
    };
  }
  case constants.GET_MY_JOBS_SUCCESS:{
    let jobsMap = {};
    action.result.map((job) => {
      jobsMap[job.id] = job;
    });
    return{
      ...state,
      myJobIds: state.myJobIds.mergeDeep(jobsMap),
      list: state.list.mergeDeep(jobsMap),
    };
  }
  case constants.GET_MY_FAVORITE_JOBS_SUCCESS: {

    let jobsMap = {};
    action.result.map((c) => {
      jobsMap[c.id] = c;
    });

    return{
      ...state,
      myFavoriteJobIds: state.myFavoriteJobIds.mergeDeep(jobsMap),
      list: state.list.mergeDeep(jobsMap),
    };
  }
  case constants.CREATE_JOB_FAVORITE_SUCCESS: {
    let job = state.list.get(action.result.favorableId);
    job = job.set('isFavorited', true);

    let jobMap = {};
    jobMap[job.get('id')] = job;

    return {
      ...state,
      list: state.list.mergeDeep(jobMap),
      myJobIds: state.myJobIds.mergeDeep(jobMap),
      myFavoriteJobIds: state.myFavoriteJobIds.mergeDeep(jobMap),
    };
  }
  case constants.DELETE_JOB_FAVORITE_SUCCESS: {
    let job = state.list.get(action.result.favorableId);
    job = job.set('isFavorited', false);

    let jobMap = {};
    jobMap[job.get('id')] = job;

    return {
      ...state,
      list: state.list.mergeDeep(jobMap),
      myJobIds: state.myJobIds.mergeDeep(jobMap),
      myFavoriteJobIds: state.myFavoriteJobIds.delete(action.result.favorableId),
    };
  }
  case constants.UPDATE_JOB_IMAGE_FAIL:{
    return{
      ...state
    };
  }
  case constants.SEARCH_JOBS_SUCCESS: {
    let query = action.result.query;

    let queriesMap = {};
    queriesMap[query] = action.result.results;

    return {
      ...state,
      queries: state.queries.mergeDeep(queriesMap),
    };
  }
  case constants.CREATE_TEMP_JOB:{
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;
    return {
      ...state,
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case constants.GET_JOB_DETAIL: {
    return {
      ...state,
    };
  }
  case constants.GET_JOB_DETAIL_SUCCESS: {
    let jobMap = {};
    jobMap[action.result.id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(jobMap),
    };
  }
  case constants.GET_JOB_DETAIL_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  default:
    return state;
  }
}
