import Immutable from 'immutable';
import * as jobConstants from './jobs/constants';

const GET_IMAGE_BY_JOB = 'hero.client/resources/GET_LOCATION';
const GET_IMAGE_BY_JOB_SUCCESS = 'hero.client/resources/GET_IMAGE_BY_JOB_SUCCESS';
const GET_IMAGE_BY_JOB_FAIL = 'hero.client/resources/GET_IMAGE_BY_JOB_FAIL';

const initialState = {
  list: new Immutable.Map(),
  byJobId: new Immutable.Map()
};
console.log(jobConstants);
export default function reducer(state = initialState, action = {}) {

  switch (action.type) {
  case jobConstants.UPDATE_JOB_IMAGE_LOCAL_SUCCESS: {
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
