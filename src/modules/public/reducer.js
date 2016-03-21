import Immutable from 'immutable';
import * as constants from './constants';

import {actionTypes} from 'redux-localstorage';

const initialState = new Immutable.Map({
  jobs: new Immutable.Map(),
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case actionTypes.INIT:{
    const persistedState = action.payload && action.payload['publik'];
    if(persistedState){
      return state.set('jobs', Immutable.fromJS(persistedState.jobs));
    } else{
      return state;
    }
  }
  case constants.GET_JOB_BY_SHORT_ID: {
    return state;
  }
  case constants.GET_JOB_BY_SHORT_ID_SUCCESS: {
    let jobMap = {};

    if (action.result) {
      jobMap[action.result.shortId] = action.result;
    }

    return state.set('jobs', state.get('jobs').mergeDeep(jobMap));
  }
  case constants.GET_JOB_BY_SHORT_ID_FAIL: {
    return state.set('err', action.err);
  }
  default:
    return state;
  }
}
