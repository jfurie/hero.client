import superagent from 'superagent';
import * as constants from './constants';
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
  return {
    types: [constants.CREATE_JOB, constants.CREATE_JOB_SUCCESS, constants.CREATE_JOB_FAIL],
    promise: (client, auth) => client.api.post('/jobs', {
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

export function updateJobLocal(job,dontMergeDeep){
  return {
    type: constants.UPDATE_JOB_LOCAL,
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

export function updateJobImageLocal(file) {
  return (dispatch) => {
    dispatch({
      types: [constants.UPDATE_JOB_IMAGE_LOCAL, constants.UPDATE_JOB_IMAGE_LOCAL_SUCCESS, constants.UPDATE_JOB_IMAGE_LOCAL_FAIL],
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
                type: constants.UPDATE_JOB_IMAGE_LOCAL_PROGRESS,
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
export function saveLocalJob(){
  return (dispatch, getState) => {
    let current = getState().jobs.localJob;
    dispatch(createJob(current));
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
