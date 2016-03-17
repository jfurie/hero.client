import Immutable from 'immutable';

const GET_LOCATION = 'hero.client/locations/GET_LOCATION';
const GET_LOCATION_SUCCESS = 'hero.client/locations/GET_LOCATION_SUCCESS';
const GET_LOCATION_FAIL = 'hero.client/locations/GET_LOCATION_FAIL';
const GET_LOCATIONS_BY_IDS = 'hero.client/locations/GET_LOCATIONS_BY_IDS';
const GET_LOCATIONS_BY_IDS_SUCCESS = 'hero.client/locations/GET_LOCATIONS_BY_IDS_SUCCESS';
const GET_LOCATIONS_BY_IDS_FAIL = 'hero.client/locations/GET_LOCATIONS_BY_IDS_FAIL';

const initialState = {
  list: new Immutable.Map(),
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_LOCATIONS_BY_IDS_SUCCESS: {
    let locationsMap = {};
    action.result.map((c) => {
      locationsMap[c.id] = c;
    });

    return {
      ...state,
      list: state.list.merge(locationsMap),
    };
  }
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

export function getLocationsByIds(locationIds){
  return (dispatch) => {
    return dispatch({
      types:[GET_LOCATIONS_BY_IDS, GET_LOCATIONS_BY_IDS_SUCCESS, GET_LOCATIONS_BY_IDS_FAIL],
      promise:(client,auth) => {
        let filter= {where:{id:{inq:locationIds}}};
        let filterString = encodeURIComponent(JSON.stringify(filter));
        return client.api.get(`/locations?filter=${filterString}`,{
          authToken: auth.authToken,
        });
      }
    });
  };
}

export function getLocationsByIdsIfNeeded(locationIds){
  return (dispatch, getState) => {
    var newLocationIds =[];
    locationIds.map((locationId => {
      if(!getState().locations.list.get(locationId)){
        newLocationIds.push(locationId);
      }
    }));
    return dispatch(getLocationsByIds(newLocationIds));
  };
}
