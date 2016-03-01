import Immutable from 'immutable';
import * as jobConstants from './jobs/constants';

const CREATE_CANDIDATE = 'hero.client/candidates/CREATE_CANDIDATE';
const CREATE_CANDIDATE_SUCCESS = 'hero.client/candidates/CREATE_CANDIDATE_SUCCESS';
const CREATE_CANDIDATE_FAIL = 'hero.client/candidates/CREATE_CANDIDATE_FAIL';
const GET_CANDIDATES = 'hero.client/candidates/GET_CANDIDATES';
const GET_CANDIDATES_SUCCESS = 'hero.client/candidates/GET_CANDIDATES_SUCCESS';
const GET_CANDIDATES_FAIL = 'hero.client/candidates/GET_CANDIDATES_FAIL';
const GET_ONE_CANDIDATE = 'hero.client/candidates/GET_ONE_CANDIDATE';
const GET_ONE_CANDIDATE_SUCCESS = 'hero.client/candidates/GET_ONE_CANDIDATE_SUCCESS';
const GET_ONE_CANDIDATE_FAIL = 'hero.client/candidates/GET_ONE_CANDIDATE_FAIL';
const GET_CANDIDATE_DETAIL = 'hero.client/contacts/GET_CANDIDATE_DETAIL';
const GET_CANDIDATE_DETAIL_SUCCESS = 'hero.client/contacts/GET_CANDIDATE_DETAIL_SUCCESS';
const GET_CANDIDATE_DETAIL_FAIL = 'hero.client/contacts/GET_CANDIDATE_DETAIL_FAIL';
const GET_MY_CANDIDATES = 'hero.client/candidates/GET_MY_CANDIDATES';
const GET_MY_CANDIDATES_SUCCESS = 'hero.client/candidates/GET_MY_CANDIDATES_SUCCESS';
const GET_MY_CANDIDATES_FAIL = 'hero.client/candidates/GET_MY_CANDIDATES_FAIL';
const GET_MY_FAVORITE_CANDIDATES = 'hero.client/candidates/GET_MY_FAVORITE_CANDIDATES';
const GET_MY_FAVORITE_CANDIDATES_SUCCESS = 'hero.client/candidates/GET_MY_FAVORITE_CANDIDATES_SUCCESS';
const GET_MY_FAVORITE_CANDIDATES_FAIL = 'hero.client/candidates/GET_MY_FAVORITE_CANDIDATES_FAIL';
const CREATE_CANDIDATE_FAVORITE_SUCCESS = 'hero.client/candidates/CREATE_CANDIDATE_FAVORITE_SUCCESS';
const DELETE_CANDIDATE_FAVORITE_SUCCESS = 'hero.client/candidates/DELETE_CANDIDATE_FAVORITE_SUCCESS';
const DELETE_CANDIDATE = 'hero.client/candidates/DELETE_CANDIDATE';
const DELETE_CANDIDATE_SUCCESS = 'hero.client/candidates/DELETE_CANDIDATE_SUCCESS';
const DELETE_CANDIDATE_FAIL = 'hero.client/candidates/DELETE_CANDIDATE_FAIL';
const SAVE_CANDIDATE_BY_CONTACT_RESULT = 'hero.client/candidates/SAVE_CANDIDATE_BY_CONTACT_RESULT';

const RESET_ERROR = 'hero.client/candidates/RESET_ERROR';
const initialState = {
  list: new Immutable.Map(),
  byJobId: new Immutable.Map(),
  byAccountId: new Immutable.Map(),
  myCandidateIds: new Immutable.Map(),
  myFavoriteCandidateIds: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case CREATE_CANDIDATE: {
    return {
      ...state,
      saving:true,
      savingError:false,
      errorMessage:null,
    };
  }
  case RESET_ERROR:{
    return {
      ...state,
      saving:false,
      savingError:false,
      errorMessage:null,
    };
  }
  case CREATE_CANDIDATE_SUCCESS: {

    let jobId = action.result.jobId;
    let accountId = action.result.accountId;
    let byJobIdNew = {};
    let byAccountIdNew = {};

    // add candidate Id to the byJobId list
    byJobIdNew[jobId] = state.byJobId.get(jobId) || new Immutable.List();
    byJobIdNew[jobId] = byJobIdNew[jobId].push(action.result.id);

    // add candidate Id to the byAccountId list
    byAccountIdNew[accountId] = state.byAccountId.get(accountId) || new Immutable.List();
    byAccountIdNew[accountId] = byAccountIdNew[accountId].push(action.result.id);

    // // add candidate to the global list
    // let listNew = {};
    // listNew[action.result.id] = action.result;

    return {
      ...state,
      byJobId: state.byJobId.mergeDeep(byJobIdNew),
      byAccountId: state.byAccountId.mergeDeep(byAccountIdNew),
      saving:false,
      savingError:false,
      errorMessage:null,
      // list: state.list.mergeDeep(listNew),
    };
  }
  case CREATE_CANDIDATE_FAIL: {
    console.log('CREATE_CANDIDATE_FAIL:',action);
    let errorMessage = 'There was an error adding a candidate to your job';
    if(action && action.error && action.error.error && action.error.error.errMsg  && action.error.error.code){
      if(action.error.error.code == 11000){
        errorMessage = 'This candidate has already been added to this job';
      }
    }
    return {
      ...state,
      saving:false,
      savingError:true,
      errorMessage,
    };
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
      byJobIdNew[jobId] = new Immutable.List();
      byJobIdNew[jobId] = byJobIdNew[jobId].concat(action.result.map((c) => {
        return c.id;
      }));

      // add contact Ids to the byAccountId list
      let byAccountIdNew = {};

      /* doing a forEach here because some candidates might not have
      an accountId yet. (bug fixed in API since then) */
      action.result.forEach((candidate) => {
        if (candidate.accountId) {

          let accountId = candidate.accountId;

          if (!byAccountIdNew[accountId]) {
            byAccountIdNew[accountId] = new Immutable.List();
          }

          byAccountIdNew[accountId] = byAccountIdNew[accountId].concat(candidate.id);
        }
      });

      // add every candidate in the list
      let listNew = {};
      action.result.map((c) => {
        listNew[c.id] = c;
      });

      return {
        ...state,
        byJobId: state.byJobId.mergeDeep(byJobIdNew),
        byAccountId: state.byAccountId.mergeDeep(byAccountIdNew),
        list: state.list.mergeDeep(listNew),
      };
    }

    return state;
  }
  case GET_MY_CANDIDATES_SUCCESS: {
    let candidatesMap = {};
    action.result.map((c) => {
      candidatesMap[c.id] = c;
    });

    return{
      ...state,
      myCandidateIds: state.myCandidateIds.mergeDeep(candidatesMap),
      list: state.list.mergeDeep(candidatesMap),
    };
  }
  case GET_MY_FAVORITE_CANDIDATES_SUCCESS: {
    let candidatesMap = {};
    action.result.map((c) => {
      candidatesMap[c.id] = c;
    });

    return{
      ...state,
      myFavoriteCandidateIds: state.myFavoriteCandidateIds.mergeDeep(candidatesMap),
      list: state.list.mergeDeep(candidatesMap),
    };
  }
  case jobConstants.GET_MY_JOBS_SUCCESS:
    {
      let candidateList =  {};
      action.result.map(job =>{
        job.candidates.map(candidate=>{
          candidateList[candidate.id] = candidate;
        });
      });
      return {
        ...state,
        list:state.list.mergeDeep(candidateList),
      };
    }
  case GET_CANDIDATE_DETAIL: {
    return state;
  }
  case GET_CANDIDATE_DETAIL_SUCCESS: {

    let listNew = {};
    listNew[action.result.id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(listNew),
    };
  }
  case GET_MY_FAVORITE_CANDIDATES_FAIL: {
    return state;
  }
  case GET_CANDIDATE_DETAIL_FAIL: {
    return state;
  }

  case CREATE_CANDIDATE_FAVORITE_SUCCESS: {
    let candidates = state.list.filter(x => {
      return x.get('contactId') == action.result.favorableId;
    });

    let candidatesMap = {};

    candidates.forEach(function(candidate) {
      candidatesMap[candidate.get('id')] = candidate.set('contact', candidate.get('contact').set('isFavorited', true));
    });

    return {
      ...state,
      list: state.list.mergeDeep(candidatesMap),
      myCandidateIds: state.myCandidateIds.mergeDeep(candidatesMap),
    };
  }
  case DELETE_CANDIDATE_FAVORITE_SUCCESS: {
    let candidates = state.list.filter(x => {
      return x.get('contactId') == action.result.favorableId;
    });

    let candidatesMap = {};

    candidates.forEach(function(candidate) {
      candidatesMap[candidate.get('id')] = candidate.set('contact', candidate.get('contact').set('isFavorited', false));
    });

    return {
      ...state,
      list: state.list.mergeDeep(candidatesMap),
      myCandidateIds: state.myCandidateIds.mergeDeep(candidatesMap),
    };
  }
  case DELETE_CANDIDATE_SUCCESS: {
    let byJobIdMap = {};

    let candidates = state.byJobId.get(action.jobId);

    if (candidates) {
      let index = candidates.indexOf(action.id);

      if (index > -1) {
        byJobIdMap = state.byJobId.set(action.jobId, candidates.splice(index, 1));
      }
    }

    return {
      ...state,
      list: state.list.delete(action.id),
      byJobId: byJobIdMap,
      myCandidateIds: state.myCandidateIds.delete(action.id),
    };
  }
  case SAVE_CANDIDATE_BY_CONTACT_RESULT: {
    let candidates = state.list.filter(x => {
      return x.get('contactId') == action.result.id;
    });

    let candidatesMap = {};

    candidates.forEach(function(candidate) {
      candidatesMap[candidate.get('id')] = candidate.set('contact', new Immutable.Map(action.result));
    });

    return {
      ...state,
      list: state.list.mergeDeep(candidatesMap),
      myCandidateIds: state.myCandidateIds.mergeDeep(candidatesMap),
    };
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

let include = [
  {
    relation:'contact',
    scope:{
      include:{
        relation:'resume',
        scope:{
        },
      },
    },
  },
];
let includeStr = encodeURIComponent(JSON.stringify(include));

export function getAllJobCandidates(jobId) {
  return {
    types: [GET_CANDIDATES, GET_CANDIDATES_SUCCESS, GET_CANDIDATES_FAIL],
    promise: (client, auth) => client.api.get(`/candidates?filter={"where": {"jobId": "${jobId}"}, "include": ${includeStr}}`, {
      authToken: auth.authToken,
    }),
  };
}

export function resetError(){
  return{
    type:RESET_ERROR,
  };
}

export function getAllUserCandidates(userId) {
  return {
    types: [GET_CANDIDATES, GET_CANDIDATES_SUCCESS, GET_CANDIDATES_FAIL],
    promise: (client, auth) => client.api.get(`/candidates?filter={"where": {"createdBy": "${userId}"}, "include": "contact"}`, {
      authToken: auth.authToken,
    }),
  };
}

export function getAllAccountCandidates(accountId) {
  return {
    types: [GET_CANDIDATES, GET_CANDIDATES_SUCCESS, GET_CANDIDATES_FAIL],
    promise: (client, auth) => client.api.get(`/candidates?filter={"where": {"accountId": "${accountId}"}, "include": "contact"}`, {
      authToken: auth.authToken,
    }),
  };
}

export function getMyCandidates() {
  return {
    types: [GET_MY_CANDIDATES, GET_MY_CANDIDATES_SUCCESS, GET_MY_CANDIDATES_FAIL],
    promise: (client, auth) => client.api.get(`/candidates/myCandidates`, {
      authToken: auth.authToken,
    }),
  };
}

export function getMyFavoriteCandidates() {
  return {
    types: [GET_MY_FAVORITE_CANDIDATES, GET_MY_FAVORITE_CANDIDATES_SUCCESS, GET_MY_FAVORITE_CANDIDATES_FAIL],
    promise: (client, auth) => client.api.get(`/candidates/myFavoriteCandidates`, {
      authToken: auth.authToken,
    }),
  };
}

export function getCandidateDetail(id) {
  return (dispatch) => {
    dispatch({
      types: [GET_CANDIDATE_DETAIL, GET_CANDIDATE_DETAIL_SUCCESS, GET_CANDIDATE_DETAIL_FAIL],
      promise: (client, auth) => client.api.get(`/candidates/detail?id=${id}`, {
        authToken: auth.authToken,
      }).then((candidate)=> {
        return candidate;
      }),
    });
  };
}

export function createCandidateFavorite(favorite){
  return {
    type: CREATE_CANDIDATE_FAVORITE_SUCCESS,
    result: favorite,
  };
}

export function deleteCandidateFavorite(favorite){
  return {
    type: DELETE_CANDIDATE_FAVORITE_SUCCESS,
    result: favorite,
  };
}

export function deleteCandidate(candidate){
  return {
    id: candidate.get('id'),
    jobId: candidate.get('jobId'),
    types: [DELETE_CANDIDATE, DELETE_CANDIDATE_SUCCESS, DELETE_CANDIDATE_FAIL],
    promise: (client, auth) => client.api.del(`/candidates/${candidate.get('id')}`, {
      authToken: auth.authToken,
    }),
  };
}

export function saveCandidatesByJobResult(candidates){
  return {
    type: GET_CANDIDATES_SUCCESS,
    result: candidates,
  };
}

export function saveCandidateByContactResult(contact){
  return {
    type: SAVE_CANDIDATE_BY_CONTACT_RESULT,
    result: contact,
  };
}
