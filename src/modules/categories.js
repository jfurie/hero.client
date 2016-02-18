import Immutable from 'immutable';
const GET_CATEGORIES = 'hero.client/categories/GET_CATEGORIES';
const GET_CATEGORIES_SUCCESS = 'hero.client/categories/GET_CATEGORIES_SUCCESS';
const GET_CATEGORIES_FAIL= 'hero.client/categories/GET_CATEGORIES_FAIL';

const initialState = {
  list: new Immutable.Map(),
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_CATEGORIES_SUCCESS:{
    let categoriesMap = {};
    action.result.map(category =>{
      categoriesMap[category.id] = category;
    });
    return {
      ...state,
      list:state.list.mergeDeep(categoriesMap),
    };
  }
  default:{
    return state;
  }

  }
}

export function getAllCategories() {
  return {
    types: [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL],
    promise: (client, auth) => client.api.get(`/categories`, {
      authToken: auth.authToken,
    }),
  };
}
