import Immutable from 'immutable';

const GET_LOCATION = 'hero.client/clients/GET_LOCATION';
const GET_LOCATION_SUCCESS = 'hero.client/clients/GET_LOCATION_SUCCESS';
const GET_LOCATION_FAIL = 'hero.client/clients/GET_LOCATION_FAIL';

const initialState = {
  list: new Immutable.Map(),
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_LOCATION: {
    return {
      ...state,
    };
  }
  case GET_LOCATION_SUCCESS: {
    let location = {};
    let id = action.result.id;
    location[id] = action.result;

    return {
      list: state.list.mergeDeep(location),
    };
  }
  case GET_LOCATION_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  default:
    return state;
  }
}

export function getOneLocation(id) {
  return {
    types: [GET_LOCATION, GET_LOCATION_SUCCESS, GET_LOCATION_FAIL],
    promise: (client, auth) => client.api.get(`/locations/${id}`, {
      authToken: auth.authToken,
    }),
  };
}

export function saveLocationByCompanyResult(location){
  return {
    type: GET_LOCATION_SUCCESS,
    result: location,
  };
}
