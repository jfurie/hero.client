import Immutable from 'immutable';

import * as constants from './constants';

const initialState = {
  bySearchQuery: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case constants.GET_SEARCH:{
    return {...state};
  }
  case constants.GET_SEARCH_SUCCESS:{
    let bySearchQueryMap = {};
    bySearchQueryMap[action.result.query] = action.result.results;
    return {
      ...state,
      bySearchQuery: state.bySearchQuery.mergeDeep(bySearchQueryMap),
    };
  }
  case constants.GET_SEARCH_FAIL:{
    return {...state};
  }
  default:{
    return state;
  }
  }
}

export function search(query,offset, limit) {
  return {
    types: [constants.GET_SEARCH, constants.GET_SEARCH_SUCCESS, constants.GET_SEARCH_FAIL],
    promise: (client, auth) => new Promise((resolve,reject) => {
      let filter = {
        where:{
          query,
        },
        limit:limit || 20,
        offset:offset||0,
      };
      let filterstring = encodeURIComponent(JSON.stringify(filter));
      client.api.get(`/search?filter=${filterstring}`, {
        authToken: auth.authToken,
      }).then((results) =>{
        resolve({
          query,
          offset,
          limit,
          results,
        });
      }).catch((err) => {
        reject(err);
      });
    }),
  };
}
