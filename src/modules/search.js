import Immutable from 'immutable';

const GET_SEARCH = 'hero.client/search/GET_SEARCH';
const GET_SEARCH_SUCCESS = 'hero.client/search/GET_SEARCH_SUCCESS';
const GET_SEARCH_FAIL = 'hero.client/search/GET_SEARCH_FAIL';

const initialState = {
  bySearchQuery: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_SEARCH:{
    return {...state};
  }
  case GET_SEARCH_SUCCESS:{
    let bySearchQueryMap = {};
    bySearchQueryMap[action.result.query] = action.result.results;
    return {
      ...state,
      bySearchQuery: state.bySearchQuery.mergeDeep(bySearchQueryMap),
    };
  }
  case GET_SEARCH_FAIL:{
    return {...state};
  }
  default:{
    return state;
  }
  }
}

export function search(query,offset, limit) {
  return {
    types: [GET_SEARCH, GET_SEARCH_SUCCESS, GET_SEARCH_FAIL],
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
