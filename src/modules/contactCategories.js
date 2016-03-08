import Immutable from 'immutable';
const SET_CONTACT_CATEGORIES_LOCAL = 'hero.client/categoryLinks/SET_CONTACT_CATEGORIES_LOCAL';
const SET_EXPERIENCE = 'hero.client/categoryLinks/SET_EXPERIENCE';
const GET_CONTACT_CATEGORIES_BY_CONTACT = 'hero.client/categoryLinks/GET_CONTACT_CATEGORIES_BY_CONTACT';
const GET_CONTACT_CATEGORIES_BY_CONTACT_SUCCESS = 'hero.client/categoryLinks/GET_CONTACT_CATEGORIES_BY_CONTACT_SUCCESS';
const GET_CONTACT_CATEGORIES_BY_CONTACT_FAIL= 'hero.client/categoryLinks/GET_CONTACT_CATEGORIES_BY_CONTACT_FAIL';

const initialState = {
  list: new Immutable.Map(),
  byContactId: new Immutable.Map(),
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case SET_EXPERIENCE:{
  }
  case SET_CONTACT_CATEGORIES_LOCAL:{
    let categoryLinksMap = {};
    let byContactId = {};

    categoryLinksMap[action.result.id] = action.result;
    if(!byContactId[action.result.contactId]){
      byContactId[action.result.contactId] ={};
    }
    byContactId[action.result.contactId][action.result.categoryId] = action.result;
    return {
      ...state,
      list:state.list.mergeDeep(categoryLinksMap),
      byContactId: state.byContactId.merge(byContactId)
    };
  }
  case GET_CONTACT_CATEGORIES_BY_CONTACT_SUCCESS:{
    let categoryLinksMap = {};
    let byContactId = {};
    action.result.result.map(categoryLink =>{
      categoryLinksMap[categoryLink.id] = categoryLink;
      if(!byContactId[action.result.contactId]){
        byContactId[action.result.contactId] ={};
      }
      byContactId[action.result.contactId][categoryLink.categoryId] = categoryLink;
    });
    return {
      ...state,
      list:state.list.mergeDeep(categoryLinksMap),
      byContactId: state.byContactId.merge(byContactId)
    };
  }
  default:{
    return state;
  }

  }
}

let guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function setCategoryLocal(contactCategory){
  if(contactCategory){
    if(contactCategory.toJSON){
      contactCategory = contactCategory.toJSON();
    }
    if(!contactCategory.id){
      contactCategory.id = 'tmp_' + guid();
    }
  }
  return {
    type:SET_CONTACT_CATEGORIES_LOCAL,
    result:contactCategory,
  }
}

export function setExperience(contactCategory){
  return {
    type:SET_EXPERIENCE,
    result:contactCategory
  };
}

export function getContactCategoriesByContact(contactId) {
  return {
    types: [GET_CONTACT_CATEGORIES_BY_CONTACT, GET_CONTACT_CATEGORIES_BY_CONTACT_SUCCESS, GET_CONTACT_CATEGORIES_BY_CONTACT_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/${contactId}/contactCategories`, {
      authToken: auth.authToken,
    }).then(function(response){
      return {
        result:response,
        contactId,
      }
    }),
  };
}
