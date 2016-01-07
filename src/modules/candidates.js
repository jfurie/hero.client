import Immutable from 'immutable';

const CREATE_CANDIDATE = 'hero.client/candidates/CREATE_CANDIDATE';
const CREATE_CANDIDATE_SUCCESS = 'hero.client/candidates/CREATE_CANDIDATE_SUCCESS';
const CREATE_CANDIDATE_FAIL = 'hero.client/candidates/CREATE_CANDIDATE_FAIL';

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

    byJobIdNew[jobId] = (state.byJobId.get(jobId)) ? (state.byJobId.get(jobId).get()) : ([]);
    byJobIdNew[jobId].push(action.result.contactId);

    return {
      ...state,
      byJobId: state.byJobId.mergeDeep(byJobIdNew),
    };
  }
  case CREATE_CANDIDATE_FAIL: {
    // let byCompanyMap = {};
    // let allCompanyContacts = state.byCompanyId.get(action.result.companyId).toJS() || [];
    // allCompanyContacts.push(action.result.contactId);
    // byCompanyMap[action.result.companyId] = allCompanyContacts;

    return {
      ...state,
      //byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
    };
  }
  default:
    return state;
  }
}


export function createCandidate(candidateData, jobId) {
  return {
    types: [CREATE_CANDIDATE, CREATE_CANDIDATE_SUCCESS, CREATE_CANDIDATE_FAIL],
    promise: (client, auth) => client.api.post('/candidates', {
      authToken: auth.authToken,
      data: {
        contact: candidateData,
        jobId,
      },
    }),
  };
}
