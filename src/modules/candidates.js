import Immutable from 'immutable';

const CREATE_CANDIDATE = 'hero.client/candidates/CREATE_CANDIDATE';
const CREATE_CANDIDATE_SUCCESS = 'hero.client/candidates/CREATE_CANDIDATE_SUCCESS';
const CREATE_CANDIDATE_FAIL = 'hero.client/candidates/CREATE_CANDIDATE_FAIL';
const GET_CANDIDATES = 'hero.client/candidates/GET_CANDIDATES';
const GET_CANDIDATES_SUCCESS = 'hero.client/candidates/GET_CANDIDATES_SUCCESS';
const GET_CANDIDATES_FAIL = 'hero.client/candidates/GET_CANDIDATES_FAIL';
const GET_ONE_CANDIDATE = 'hero.client/candidates/GET_ONE_CANDIDATE';
const GET_ONE_CANDIDATE_SUCCESS = 'hero.client/candidates/GET_ONE_CANDIDATE_SUCCESS';
const GET_ONE_CANDIDATE_FAIL = 'hero.client/candidates/GET_ONE_CANDIDATE_FAIL';

const initialState = {
  list: new Immutable.Map(),
  byJobId: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case CREATE_CANDIDATE: {
    return state;
  }
  case CREATE_CANDIDATE_SUCCESS: {

    let jobId = action.result.jobId;
    let byJobIdNew = {};

    // add candidate Id to the byJobId list
    byJobIdNew[jobId] = state.byJobId.get(jobId) || new Immutable.List();
    byJobIdNew[jobId] = byJobIdNew[jobId].push(action.result.id);

    // // add candidate to the global list
    // let listNew = {};
    // listNew[action.result.id] = action.result;

    return {
      ...state,
      byJobId: state.byJobId.mergeDeep(byJobIdNew),
      // list: state.list.mergeDeep(listNew),
    };
  }
  case CREATE_CANDIDATE_FAIL: {
    return state;
  }
  case GET_ONE_CANDIDATE: {
    return state;
  }
  case GET_ONE_CANDIDATE_SUCCESS: {

    let listNew = {};
    listNew[action.result.id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(listNew),
    };
  }
  case GET_ONE_CANDIDATE_FAIL: {
    return state;
  }
  case GET_CANDIDATES: {
    return state;
  }
  case GET_CANDIDATES_SUCCESS: {

    if (action.result.length) {
      let jobId = action.result[0].jobId;

      // add contact Ids to the byJobId list
      let byJobIdNew = {};
      byJobIdNew[jobId] = state.byJobId.get(jobId) || new Immutable.List();
      byJobIdNew[jobId] = byJobIdNew[jobId].concat(action.result.map((c) => {
        return c.id;
      }));

      // add every candidate in the list
      let listNew = {};
      action.result.map((c) => {
        listNew[c.id] = c;
      });

      return {
        ...state,
        byJobId: state.byJobId.mergeDeep(byJobIdNew),
        list: state.list.mergeDeep(listNew),
      };
    }

    return state;
  }
  default:
    return state;
  }
}

export function getOneCandidate(candidateId) {
  return {
    types: [GET_ONE_CANDIDATE, GET_ONE_CANDIDATE_SUCCESS, GET_ONE_CANDIDATE_FAIL],
    promise: (client, auth) => client.api.get(`/candidates/${candidateId}?filter={"include": "contact"}`, {
      authToken: auth.authToken,
    }),
  };
}

export function createCandidate(candidateData, jobId) {
  return (dispatch) => {
    dispatch({
      types: [CREATE_CANDIDATE, CREATE_CANDIDATE_SUCCESS, CREATE_CANDIDATE_FAIL],
      promise: (client, auth) => new Promise(function(resolve, reject){
        let createCandidatePromise = client.api.post('/candidates', {
          authToken: auth.authToken,
          data: {
            contact: candidateData,
            jobId,
          },
        });

        createCandidatePromise.then((res) => {
          resolve(res);
        }).catch((ex) => {
          reject(ex);
        });

      }).then((candidate)=> {
        dispatch(getOneCandidate(candidate.id)); // to get the contact associated
        return candidate;
      }),
    });
  };
}

export function getAllJobCandidates(jobId) {
  return {
    types: [GET_CANDIDATES, GET_CANDIDATES_SUCCESS, GET_CANDIDATES_FAIL],
    promise: (client, auth) => client.api.get(`/candidates?filter={"where": {"jobId": "${jobId}"}, "include": "contact"}`, {
      authToken: auth.authToken,
    }),
  };
}
