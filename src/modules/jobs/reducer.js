import Immutable from 'immutable';
import * as constants from './constants';
const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  localJob: new Immutable.Map(),
  myJobIds: new Immutable.List(),
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
    action.result.saving = false;
    action.result.savingError = '';
    jobMap[action.result.id] = action.result;
    jobMap[action.id] = jobMap[action.result.id];

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
    let myJobIds = [];
    let jobList = {};
    myJobIds = action.result.map(job =>{
      jobList[job.id] = job;
      return job.id;
    });
    return{
      ...state,
      myJobIds: new Immutable.List(myJobIds),
      list: state.list.mergeDeep(jobList)
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
  default:
    return state;
  }
}
