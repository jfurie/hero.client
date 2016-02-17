import superagent from 'superagent';
import * as constants from './constants';
import { saveNotesByJobResult } from '../notes';

export function getJobsByCompany(companyId){

  let include = [
    {
      relation:'company',
      scope:{
        fields:['name','website'],
      },
    },
    {
      relation:'candidates',
      scope:{
        fields:['status','isActive','jobId','contactId'],
        include:{
          relation:'contact',
          scope:{
            fields:['displayName','email','status'],
          },
        },
      },
    },
  ];

  let includeStr = encodeURIComponent(JSON.stringify(include));
  return {
    types: [constants.GET_JOBS_BY_COMPANY, constants.GET_JOBS_BY_COMPANY_SUCCESS, constants.GET_JOBS_BY_COMPANY_FAIL],
    promise: (client, auth) => client.api.get(`/companies/${companyId}/jobs?filter={"include":${includeStr}}`, {
      authToken: auth.authToken,
    }),
  };
}

export function getAllJobs() {
  return {
    types: [constants.GET_JOBS, constants.GET_JOBS_SUCCESS, constants.GET_JOBS_FAIL],
    promise: (client, auth) => client.api.get('/jobs', {
      authToken: auth.authToken,
    }),
  };
}

export function createJob(job){
  let id = job.get('id');
  if(id && id.indexOf('tmp') > -1){
    job = job.remove('id');
  }
  return {
    id,
    job,
    types: [constants.CREATE_JOB, constants.CREATE_JOB_SUCCESS, constants.CREATE_JOB_FAIL],
    promise: (client, auth) => client.api.post('/jobs', {
      authToken: auth.authToken,
      data:job,
    }),
  };
}

export function editJob(job){
  let id = job.get('id');
  return {
    id,
    job,
    types: [constants.EDIT_JOB, constants.EDIT_JOB_SUCCESS, constants.EDIT_JOB_FAIL],
    promise: (client, auth) => client.api.put(`/jobs/${job.get('id')}`, {
      authToken: auth.authToken,
      data:job,
    }),
  };
}

export function shareJob(jobId, data){
  return {
    types: [constants.SHARE_JOB, constants.SHARE_JOB_SUCCESS, constants.SHARE_JOB_FAIL],
    promise: (client, auth) => client.api.post(`/jobs/${jobId}/share`, {
      authToken: auth.authToken,
      data,
    }),
  };
}

export function updateJob(job,dontMergeDeep){
  return {
    id:job.get('id'),
    type: constants.UPDATE_JOB,
    result: job,
    dontMergeDeep
  };
}
export function replaceJobLocal(job){
  return {
    type: constants.REPLACE_JOB_LOCAL,
    result: job,
  };
}

export function updateJobImage(id,file) {
  return (dispatch) => {
    dispatch({
      id,
      types: [constants.UPDATE_JOB_IMAGE, constants.UPDATE_JOB_IMAGE_SUCCESS, constants.UPDATE_JOB_IMAGE_FAIL],
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
                type: constants.UPDATE_JOB_IMAGE_PROGRESS,
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
export function saveJob(job){
  return (dispatch) => {
    let current = job;
    let id = current.get('id');
    if(!id || (id.indexOf('tmp') > -1)){
      dispatch(createJob(current));
    }
    else {
      dispatch(editJob(current));
    }
  };
}

export function getMyJobs(){
  return {
    types: [constants.GET_MY_JOBS, constants.GET_MY_JOBS_SUCCESS, constants.GET_MY_JOBS_FAIL],
    promise: (client, auth) => client.api.get('/jobs/myJobs', {
      authToken: auth.authToken
    }),
  };
}

export function getOneJob(id) {
  return {
    types: [constants.GET_JOB, constants.GET_JOB_SUCCESS, constants.GET_JOB_FAIL],
    promise: (client, auth) => client.api.get(`/jobs/${id}?filter[include]=talentAdvocate&filter[include]=contact&filter[include]=company`, {
      authToken: auth.authToken,
      data: {
        id,
      },
    }),
  };
}

export function searchJobs(query) {
  return {
    types: [constants.SEARCH_JOBS, constants.SEARCH_JOBS_SUCCESS, constants.SEARCH_JOBS_FAIL],
    promise: (client, auth) => client.api.get(`/jobs/search?query=${query}`, {
      authToken: auth.authToken,
    }),
  };
}

export function createTempJob(job){
  return {
    type: constants.CREATE_TEMP_JOB,
    result: job,
  };
}

export function saveJobsByCompanyResult(jobs){
  return {
    type: constants.GET_JOBS_BY_COMPANY_SUCCESS,
    result: jobs,
  };
}

export function getJobDetail(id) {
  return (dispatch) => {
    dispatch({
      types: [constants.GET_JOB_DETAIL, constants.GET_JOB_DETAIL_SUCCESS, constants.GET_JOB_DETAIL_FAIL],
      promise: (client, auth) => client.api.get(`/jobs/detail?id=${id}`, {
        authToken: auth.authToken,
      }).then((job)=> {
        if (job.notes && job.notes.length > 0) {
          dispatch(saveNotesByJobResult(job.notes));
        }

        return job;
      }),
    });
  };
}
