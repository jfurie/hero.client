import Immutable from 'immutable';
import * as constants from './constants';
const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  localJob: new Immutable.Map(),
};

// TMP FAKE JOBS

let FAKEJOBS = {};

FAKEJOBS['1a'] = {
  title: 'Android Mobile Engineer',
  location: 'Santa Monica, CA',
  id: '1a',
};

FAKEJOBS['2b'] = {
  title: 'Software Ruby Engineer',
  location: 'Venice, CA',
  id: '2b',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case constants.GET_JOBS: {
    return {
      ...state,
    };
  }
  case constants.GET_JOBS_SUCCESS: {
    return {
      ...state,
      list: state.list.mergeDeep(FAKEJOBS),
    };
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
    let byCompanyMap = {};
    byCompanyMap[action.result.companyId] = action.result.map((job)=>job.id);
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
  case constants.GET_JOBS_BY_COMPANY_FAIL:{
    return {
      ...state,
      loading:false,
    };
  }
  case constants.CREATE_JOB:{
    return {
      ...state,
      loading:true,
    };
  }
  case constants.CREATE_JOB_SUCCESS:{
    let jobMap = {};
    jobMap[action.result.id] = action.result;
    let byCompanyMap ={};
    byCompanyMap[action.result.companyId] = [action.result.id];
    return {
      ...state,
      list: state.list.mergeDeep(jobMap),
      byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
      loading:false,
      localJob: state.localJob.mergeDeep({success:true}),
    };
  }
  case constants.CREATE_JOB_FAIL:{
    return {
      ...state,
      loading:false,
    };
  }
  case constants.CREATE_JOB_LOCAL: {

    return {
      ...state,
      localJob: state.localJob.mergeDeep(action.result),
    };
  }
  case constants.UPDATE_JOB_LOCAL:{

    return {
      ...state,
      localJob: state.localJob.mergeDeep(action.result),
    };
  }
  case constants.REPLACE_JOB_LOCAL:{
    return {
      ...state,
      localJob: new Immutable.Map(action.result),
    };
  }
  case constants.UPDATE_JOB_IMAGE_LOCAL:{

    return{
      ...state,
      localJob: state.localJob.mergeDeep({
        isUploading:true,
        percentUploaded:0
      }),

    };
  }
  case constants.UPDATE_JOB_IMAGE_LOCAL_SUCCESS:{
    let image = {
      imageId:action.result.id,
      isUploading:false,
      percentUploaded:100
    };
    return{
      ...state,
      localJob: state.localJob.mergeDeep(image),
    };
  }
  case constants.UPDATE_JOB_IMAGE_LOCAL_PROGRESS:{
    let image = {
      isUploading:true,
      percentUploaded:action.result
    };
    return{
      ...state,
      localJob: state.localJob.mergeDeep(image),
    };
  }
  case constants.UPDATE_JOB_IMAGE_LOCAL_FAIL:{
    return{
      ...state
    };
  }
  default:
    return state;
  }
}
