import * as constants from './constants';

export function getJobByShortId(shortId) {
  return (dispatch) => {
    dispatch({
      types: [constants.GET_JOB_BY_SHORT_ID, constants.GET_JOB_BY_SHORT_ID_SUCCESS, constants.GET_JOB_BY_SHORT_ID_FAIL],
      promise: (client, auth) => client.api.get(`/jobs/publicJob?shortId=${shortId}`, {
        authToken: auth.authToken,
      }).then((job)=> {
        return job;
      }),
    });
  };
}
