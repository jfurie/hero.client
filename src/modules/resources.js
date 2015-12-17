import Immutable from 'immutable';
import * as jobConstants from './jobs/constants';
const initialState = {
  list: new Immutable.Map(),
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
  default:
    return state;
  }
}
