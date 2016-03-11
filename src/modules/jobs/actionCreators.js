import superagent from 'superagent';
import * as constants from './constants';
import { saveNotesByJobResult } from '../notes';
import { saveCandidatesByJobResult } from '../candidates';

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

export function createJob(job, category){
  let id = job.get('id');

  if (id && id.indexOf('tmp') > -1) {
    job = job.remove('id');
  }

  if (category) {
    //Going to fill out the fields based on category
    job = job
    .set('description',category.get('description'))
    .set('title',category.get('title'));
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
    dontMergeDeep,
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
export function saveJob(job, category){
  return (dispatch) => {
    let current = job;
    let id = current.get('id');
    if(!id || (id.indexOf('tmp') > -1)){
      dispatch(createJob(current, category));
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
      authToken: auth.authToken,
    }),
  };
}

export function getMyFavoriteJobs() {
  return {
    types: [constants.GET_MY_FAVORITE_JOBS, constants.GET_MY_FAVORITE_JOBS_SUCCESS, constants.GET_MY_FAVORITE_JOBS_FAIL],
    promise: (client, auth) => client.api.get('/jobs/myFavoriteJobs', {
      authToken: auth.authToken,
    }),
  };
}

export function createJobFavorite(jobId){
  return {
    types: [constants.CREATE_JOB_FAVORITE, constants.CREATE_JOB_FAVORITE_SUCCESS, constants.CREATE_JOB_FAVORITE_FAIL],
    promise: (client, auth) => client.api.post(`/jobs/${jobId}/favorites`, {
      authToken: auth.authToken,
    }),
  };
}

export function deleteJobFavorite(jobId){
  return {
    types: [constants.DELETE_JOB_FAVORITE, constants.DELETE_JOB_FAVORITE_SUCCESS, constants.DELETE_JOB_FAVORITE_FAIL],
    promise: (client, auth) => client.api.del(`/jobs/unfavorite?id=${jobId}`, {
      authToken: auth.authToken,
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

export function saveJobsByContactResult(jobs, contactId){
  return {
    type: constants.GET_JOBS_BY_CONTACT_SUCCESS,
    result: {jobs, contactId},
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

        if (job.candidates && job.candidates.length > 0) {
          dispatch(saveCandidatesByJobResult(job.candidates));
        }
        return job;
      }),
    });
  };
}

export function getJobsByIds(jobIds){
  return (dispatch) => {
    return dispatch({
      types:[constants.GET_JOBS_BY_IDS, constants.GET_JOBS_BY_IDS_SUCCESS, constants.GET_JOBS_BY_IDS_FAIL],
      promise:(client,auth) => {
        let filter= {where:{id:{inq:jobIds}}};
        let filterString = encodeURIComponent(JSON.stringify(filter));
        return client.api.get(`/jobs?filter=${filterString}`,{
          authToken: auth.authToken,
        });
      }
    });
  };
}

export function getJobsByIdsIfNeeded(jobIds){
  return (dispatch, getState) => {
    var newJobIds =[];
    jobIds.map((jobId => {
      if(!getState().companies.get('list').get(jobId)){
        newJobIds.push(jobId);
      }
    }));
    return dispatch(getJobsByIds(newJobIds));
  };
}
