import Immutable from 'immutable';

const GET_LOCATION = 'hero.client/locations/GET_LOCATION';
const GET_LOCATION_SUCCESS = 'hero.client/locations/GET_LOCATION_SUCCESS';
const GET_LOCATION_FAIL = 'hero.client/locations/GET_LOCATION_FAIL';
const GET_LOCATIONS_BY_IDS = 'hero.client/locations/GET_LOCATIONS_BY_IDS';
const GET_LOCATIONS_BY_IDS_SUCCESS = 'hero.client/locations/GET_LOCATIONS_BY_IDS_SUCCESS';
const GET_LOCATIONS_BY_IDS_FAIL = 'hero.client/locations/GET_LOCATIONS_BY_IDS_FAIL';
const GET_LOCATIONS_SUCCESS = 'hero.client/locations/GET_LOCATIONS_SUCCESS';
const CREATE_COMPANY_LOCATION = 'hero.client/locations/CREATE_COMPANY_LOCATION';
const CREATE_COMPANY_LOCATION_SUCCESS = 'hero.client/locations/CREATE_COMPANY_LOCATION_SUCCESS';
const CREATE_COMPANY_LOCATION_FAIL = 'hero.client/locations/CREATE_COMPANY_LOCATION_FAIL';
const EDIT_LOCATION = 'hero.client/locations/EDIT_LOCATION';
const EDIT_LOCATION_SUCCESS = 'hero.client/locations/EDIT_LOCATION_SUCCESS';
const EDIT_LOCATION_FAIL = 'hero.client/locations/EDIT_LOCATION_FAIL';
const DELETE_LOCATION = 'hero.client/locations/DELETE_LOCATION';
const DELETE_LOCATION_SUCCESS = 'hero.client/locations/DELETE_LOCATION_SUCCESS';
const DELETE_LOCATION_FAIL = 'hero.client/locations/DELETE_LOCATION_FAIL';

const initialState = {
  list: new Immutable.Map(),
};
export default function reducer(state = initialState, action = {}) {
  if(action && action.result && action.result.entities && action.result.entities.locations){
    let locations = Immutable.fromJS(action.result.entities.locations);
    state = {
      ...state,
      list:state.list.mergeDeep(locations),
    };
  }
  switch (action.type) {
  case GET_LOCATIONS_BY_IDS_SUCCESS: {
    let locationsMap = {};
    action.result.map((c) => {
      locationsMap[c.id] = c;
    });

    return {
      ...state,
      list: state.list.mergeDeep(locationsMap),
    };
  }
  case GET_LOCATIONS_SUCCESS: {
    let locationsMap = {};
    action.result.map((c) => {
      locationsMap[c.id] = c;
    });

    return {
      ...state,
      list: state.list.mergeDeep(locationsMap),
    };
  }
  case GET_LOCATION: {
    return {
      ...state,
    };
  }
  case GET_LOCATION_SUCCESS: {
    let locationMap = {};
    let id = action.result.id;
    locationMap[id] = action.result;

    return {
      list: state.list.mergeDeep(locationMap),
    };
  }
  case GET_LOCATION_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case CREATE_COMPANY_LOCATION_SUCCESS: {
    let locationMap = {};
    let id = action.result.id;
    locationMap[id] = action.result;

    return {
      list: state.list.mergeDeep(locationMap),
    };
  }
  case EDIT_LOCATION_SUCCESS: {
    let locationMap = {};
    let id = action.result.id;
    locationMap[id] = action.result;

    return {
      list: state.list.mergeDeep(locationMap),
    };
  }
  case DELETE_LOCATION_SUCCESS: {
    return {
      list: state.list.delete(action.id),
    };
  }
  default:
    return state;
  }
}

export function createCompanyLocation(companyId, location){
  return {
    types: [CREATE_COMPANY_LOCATION, CREATE_COMPANY_LOCATION_SUCCESS, CREATE_COMPANY_LOCATION_FAIL],
    promise: (client, auth) => client.api.post(`/companies/${companyId}/locations`, {
      authToken: auth.authToken,
      data: location,
    }),
  };
}

export function editLocation(location){
  return {
    types: [EDIT_LOCATION, EDIT_LOCATION_SUCCESS, EDIT_LOCATION_FAIL],
    promise: (client, auth) => client.api.put(`/locations/${location.get('id')}`, {
      authToken: auth.authToken,
      data: location,
    }),
  };
}

export function deleteLocation(locationId){
  return {
    id: locationId,
    types: [DELETE_LOCATION, DELETE_LOCATION_SUCCESS, DELETE_LOCATION_FAIL],
    promise: (client, auth) => client.api.del(`/locations/${locationId}`, {
      authToken: auth.authToken,
    }),
  };
}


export function getOneLocation(id) {
  return {
    types: [GET_LOCATION, GET_LOCATION_SUCCESS, GET_LOCATION_FAIL],
    promise: (client, auth) => client.api.get(`/locations/${id}`, {
      authToken: auth.authToken,
    }),
  };
}

export function saveLocationResult(location){
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

export function saveLocationsResult(locations){
  return {
    type: GET_LOCATIONS_SUCCESS,
    result: locations,
  };
}
