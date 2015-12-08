import Immutable from 'immutable';

const GET_JOBS = 'hero.client/clients/GET_JOBS';
const GET_JOBS_SUCCESS = 'hero.client/clients/GET_JOBS_SUCCESS';
const GET_JOBS_FAIL = 'hero.client/clients/GET_JOBS_FAIL';
const GET_JOB = 'hero.client/clients/GET_JOB';
const GET_JOB_SUCCESS = 'hero.client/clients/GET_JOB_SUCCESS';
const GET_JOB_FAIL = 'hero.client/clients/GET_JOB_FAIL';

const initialState = {
  list: new Immutable.Map(),
};

// TMP FAKE JOBS

let FAKEJOBS = {};

FAKEJOBS['1a'] = {
  title: 'Android Mobile Engineer',
};

FAKEJOBS['2b'] = {
  title: 'Software Ruby Engineer',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_JOBS: {
    return {
      ...state,
    };
  }
  case GET_JOBS_SUCCESS: {
    return {
      ...state,
      list: state.list.mergeDeep(FAKEJOBS),
    };
  }
  case GET_JOBS_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case GET_JOB: {
    return {
      ...state,
    };
  }
  case GET_JOB_SUCCESS: {
    let job = {};
    let id = action.result.id;
    job[id] = FAKEJOBS[id];

    return {
      ...state,
      list: state.list.mergeDeep(job),
    };
  }
  case GET_JOB_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  default:
    return state;
  }
}

export function getAllJobs() {
  return {
    types: [GET_JOBS, GET_JOBS_SUCCESS, GET_JOBS_FAIL],
    promise: (client) => client.fakeApi.get('/jobs', {
    }),
  };
}

export function getOneJob(id) {
  return {
    types: [GET_JOB, GET_JOB_SUCCESS, GET_JOB_FAIL],
    promise: (client) => client.fakeApi.get(`/jobs/${id}`, {
      data: {
        result: {id},
      },
    }),
  };
}
