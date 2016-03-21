import * as constants from './constants';

export function getJobByShortId(shortId) {
  let filter = {
    where: {
      shortId,
    },
    include:[
      {
        relation:'company',
      },
      {
        relation:'location',
      },
    ],
  };

  let filterString = encodeURIComponent(JSON.stringify(filter));

  return (dispatch) => {
    dispatch({
      types: [constants.GET_JOB_BY_SHORT_ID, constants.GET_JOB_BY_SHORT_ID_SUCCESS, constants.GET_JOB_BY_SHORT_ID_FAIL],
      promise: (client, auth) => client.api.get(`/jobs?filter=${filterString}`, {
        authToken: auth.authToken,
      }).then((job)=> {
        if (job) return job[0];

        return;
      }),
    });
  };
}
