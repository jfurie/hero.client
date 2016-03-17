import Immutable from 'immutable';
const GET_CATEGORIES = 'hero.client/categories/GET_CATEGORIES';
const GET_CATEGORIES_SUCCESS = 'hero.client/categories/GET_CATEGORIES_SUCCESS';
const GET_CATEGORIES_FAIL= 'hero.client/categories/GET_CATEGORIES_FAIL';

const initialState = {
  list: new Immutable.Map(),
};
function sortOrder(a,b){
  if(a.get('order') < b.get('order')){
    return -1;
  } else if(a.get('order') > b.get('order')) {
    return 1;
  } else {
    return 0;
  }
}
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_CATEGORIES_SUCCESS:{
    let categoriesMap = {};
    action.result.map(category =>{
      categoriesMap[category.id] = category;
    });
    return {
      ...state,
      list:state.list.mergeDeep(categoriesMap).sort(sortOrder),
    };
  }
  default:{
    return state;
  }

  }
}

export function shouldGetCategories(state){
  return state && state.categories && state.categories.list && state.categories.list.size <= 0;
}

export function getCategoriesIfNeeded(){
  return (dispatch, getState) => {
    if(shouldGetCategories(getState())){
      return dispatch(getAllCategories());
    }
  };
}

export function getAllCategories() {
  return {
    types: [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL],
    promise: (client, auth) => client.api.get(`/categories`, {
      authToken: auth.authToken,
    }),
  };
}
