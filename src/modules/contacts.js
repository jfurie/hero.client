import Immutable from 'immutable';
import * as companyConstants from './companies/constants';
import * as jobConstants from './jobs/constants';
import { createCandidateFavorite, deleteCandidateFavorite, saveCandidateByContactResult } from './candidates';
import { saveJobsByContactResult } from './jobs';
const GET_CONTACTS = 'hero.client/contacts/GET_CONTACTS';
const GET_CONTACTS_SUCCESS = 'hero.client/contacts/GET_CONTACTS_SUCCESS';
const GET_CONTACTS_FAIL = 'hero.client/contacts/GET_CONTACTS_FAIL';
const GET_CONTACT_CREATED = 'hero.client/contacts/GET_CONTACT_CREATED';
const GET_CONTACT_CREATED_SUCCESS = 'hero.client/contacts/GET_CONTACT_CREATED_SUCCESS';
const GET_CONTACT_CREATED_FAIL = 'hero.client/contacts/GET_CONTACT_CREATED_FAIL';
const GET_CONTACTS_BY_COMPANY = 'hero.client/contacts/GET_CONTACTS_BY_COMPANY';
const GET_CONTACTS_BY_COMPANY_SUCCESS = 'hero.client/contacts/GET_CONTACTS_BY_COMPANY_SUCCESS';
const GET_CONTACTS_BY_COMPANY_FAIL = 'hero.client/contacts/GET_CONTACTS_BY_COMPANY_FAIL';
const CREATE_CONTACT = 'hero.client/contacts/CREATE_CONTACT';
const CREATE_CONTACT_SUCCESS = 'hero.client/contacts/CREATE_CONTACT_SUCCESS';
const CREATE_CONTACT_FAIL = 'hero.client/contacts/CREATE_CONTACT_FAIL';
const GET_ONE_CONTACT = 'hero.client/contacts/GET_ONE_CONTACT';
const GET_ONE_CONTACT_SUCCESS = 'hero.client/contacts/GET_ONE_CONTACT_SUCCESS';
const GET_ONE_CONTACT_FAIL = 'hero.client/contacts/GET_ONE_CONTACT_FAIL';
const SEARCH_CONTACTS = 'hero.client/contacts/SEARCH_CONTACTS';
const SEARCH_CONTACTS_SUCCESS = 'hero.client/contacts/SEARCH_CONTACTS_SUCCESS';
const SEARCH_CONTACTS_FAIL = 'hero.client/contacts/SEARCH_CONTACTS_FAIL';
const CREATE_TEMP_CONTACT = 'hero.client/contacts/CREATE_TEMP_CONTACT';
const CREATE_COMPANY_CONTACT = 'hero.client/contacts/CREATE_COMPANY_CONTACT';
const CREATE_COMPANY_CONTACT_SUCCESS = 'hero.client/contacts/CREATE_COMPANY_CONTACT_SUCCESS';
const CREATE_COMPANY_CONTACT_FAIL = 'hero.client/contacts/CREATE_COMPANY_CONTACT_FAIL';
const EDIT_CONTACT = 'hero.client/contacts/EDIT_CONTACT';
const EDIT_CONTACT_SUCCESS = 'hero.client/contacts/EDIT_CONTACT_SUCCESS';
const EDIT_CONTACT_FAIL = 'hero.client/contacts/EDIT_CONTACT_FAIL';
const GET_CONTACT_DETAIL = 'hero.client/contacts/GET_CONTACT_DETAIL';
const GET_CONTACT_DETAIL_SUCCESS = 'hero.client/contacts/GET_CONTACT_DETAIL_SUCCESS';
const GET_CONTACT_DETAIL_FAIL = 'hero.client/contacts/GET_CONTACT_DETAIL_FAIL';
const CREATE_CONTACT_FAVORITE = 'hero.client/contacts/CREATE_CONTACT_FAVORITE';
const CREATE_CONTACT_FAVORITE_SUCCESS = 'hero.client/contacts/CREATE_CONTACT_FAVORITE_SUCCESS';
const CREATE_CONTACT_FAVORITE_FAIL = 'hero.client/contacts/CREATE_CONTACT_FAVORITE_FAIL';
const DELETE_CONTACT_FAVORITE = 'hero.client/contacts/DELETE_CONTACT_FAVORITE';
const DELETE_CONTACT_FAVORITE_SUCCESS = 'hero.client/contacts/DELETE_CONTACT_FAVORITE_SUCCESS';
const DELETE_CONTACT_FAVORITE_FAIL = 'hero.client/contacts/DELETE_CONTACT_FAVORITE_FAIL';
const GET_MY_CONTACTS = 'hero.client/candidates/GET_MY_CONTACTS';
const GET_MY_CONTACTS_SUCCESS = 'hero.client/candidates/GET_MY_CONTACTS_SUCCESS';
const GET_MY_CONTACTS_FAIL = 'hero.client/candidates/GET_MY_CONTACTS_FAIL';
const GET_MY_FAVORITE_CONTACTS = 'hero.client/candidates/GET_MY_FAVORITE_CONTACTS';
const GET_MY_FAVORITE_CONTACTS_SUCCESS = 'hero.client/candidates/GET_MY_FAVORITE_CONTACTS_SUCCESS';
const GET_MY_FAVORITE_CONTACTS_FAIL = 'hero.client/candidates/GET_MY_FAVORITE_CONTACTS_FAIL';
const SET_CONTACT_CATEGORIES_LOCAL = 'hero.client/contacts/SET_CONTACT_CATEGORIES_LOCAL';
const SET_EXPERIENCE = 'hero.client/contacts/SET_EXPERIENCE';
const SET_PRIMARY = 'hero.client/contacts/SET_PRIMARY';
const CREATE_CONTACT_CATEGORY = 'hero.client/contacts/CREATE_CONTACT_CATEGORY';
const CREATE_CONTACT_CATEGORY_SUCCESS = 'hero.client/contacts/CREATE_CONTACT_CATEGORY_SUCCESS';
const CREATE_CONTACT_CATEGORY_FAIL = 'hero.client/contacts/CREATE_CONTACT_CATEGORY_FAIL';
const EDIT_CONTACT_CATEGORY = 'hero.client/contacts/EDIT_CONTACT_CATEGORY';
const EDIT_CONTACT_CATEGORY_SUCCESS = 'hero.client/contacts/EDIT_CONTACT_CATEGORY_SUCCESS';
const EDIT_CONTACT_CATEGORY_FAIL = 'hero.client/contacts/EDIT_CONTACT_CATEGORY_FAIL';
let ContactCategory = new Immutable.Record({
  id:null,
  categoryId:null,
  contactId:null,
  experience:0,
  primary:true,
  frameworkInclude: []
});

const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  queries: new Immutable.Map(),
  myContactIds: new Immutable.Map(),
  myFavoriteContactIds: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case GET_CONTACTS:
    return {
      ...state,
    };
  case GET_CONTACTS_SUCCESS: {
    let contactsMap = {};
    action.result.map((c) => {
      contactsMap[c.id] = c;
    });

    return {
      ...state,
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case GET_CONTACTS_FAIL:
    return {
      ...state,
      err: action.err,
    };
  case GET_ONE_CONTACT: {
    return {
      ...state,
    };
  }
  case GET_ONE_CONTACT_SUCCESS: {
    let contactsMap = {};
    let id = action.result.id;
    contactsMap[id] = action.result;

    return {
      ...state,
      list: state.list.merge(contactsMap),
    };
  }
  case GET_ONE_CONTACT_FAIL: {
    return state;
  }
  case GET_CONTACT_CREATED:{
    let contactList = {};
    let contact = {};
    contact.id = action.id;
    contact.saving = true;
    contact.savingError = null;
    contactList[action.id] = contact;
    return {
      ...state,
      saving:true,
      savingError:'',
      list: state.list.mergeDeep(contactList),
    };
  }
  case GET_CONTACT_CREATED_SUCCESS: {
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;
    contactsMap[action.id] = {
      saving: false,
      savingError: '',
    };
    return {
      ...state,
      saving:false,
      savingError:'',
      list:state.list.mergeDeep(contactsMap),
    };
  }
  case GET_CONTACT_CREATED_FAIL: {
    return {
      ...state,
      creating: false,
      error: 'Error Creating Contact',
    };
  }
  case CREATE_CONTACT: {
    let contact = {};
    action.contact = action.contact.set('saving',true);
    action.contact = action.contact.set('savingError',null);
    contact[action.id] = action.contact;
    return {
      ...state,
      saving:true,
      savingError:'',
      list: state.list.mergeDeep(contact),
    };
  }
  case CREATE_CONTACT_SUCCESS: {
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;

    contactsMap[action.id] = {
      saving: false,
      savingError: '',
      newId: action.result.id,
    };

    return {
      ...state,
      saving:false,
      savingError:'',
      list:state.list.mergeDeep(contactsMap),
    };
  }
  case CREATE_CONTACT_FAIL: {
    let contact = {};
    contact[action.id] = {};
    contact[action.id].saving = false;
    contact[action.id].savingError = (action.error && action.error.error && action.error.error.message) || 'Failed to create contact';
    return {
      ...state,
      saving:false,
      savingError:'Failed to create contact',
      list:state.list.mergeDeep(contact),
    };
  }
  case EDIT_CONTACT:
    {
      let contactList ={};
      let contact = {};
      contact.id = action.id;
      contact.saving = true;
      contact.savingError = null;
      contactList[action.id] = contact;
      return {
        ...state,
        saving:true,
        savingError:'',
        list: state.list.mergeDeep(contactList),
      };
    }
  case EDIT_CONTACT_SUCCESS:
    {
      let contactsMap = {};
      contactsMap[action.result.id] = action.result;

      contactsMap[action.id] = {
        saving: false,
        savingError: '',
        newId: action.result.id,
      };

      return {
        ...state,
        saving:false,
        savingError:'',
        list:state.list.mergeDeep(contactsMap),
      };
    }
  case EDIT_CONTACT_FAIL:
    return {
      ...state,
      creating: false,
      error: 'Error Creating Contact',
    };
  case GET_CONTACTS_BY_COMPANY_SUCCESS: {
    let byCompanyMap = {};
    byCompanyMap[action.result.companyId] = action.result.result.map((contact)=>contact.id);
    let contactsMap = {};
    action.result.result.map((c) => {
      contactsMap[c.id] = c;
    });
    return {
      ...state,
      byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case CREATE_COMPANY_CONTACT: {
    let contact = {};
    if(action.contact){
      action.contact = action.contact.set('saving',true);
      action.contact = action.contact.set('savingError',null);
      contact[action.id] = action.contact;
    }
    return {
      ...state,
      saving:true,
      savingError:'',
      list: state.list.mergeDeep(contact),
    };
  }
  case CREATE_COMPANY_CONTACT_SUCCESS: {
    let contactMap = {};
    contactMap[action.result.id] = action.result;

    contactMap[action.id] = {
      saving: false,
      savingError: '',
      newId: action.result.contactId,
    };

    let companyId = action.result.companyId;
    let byCompanyMapNew = {};

    byCompanyMapNew[companyId] = state.byCompanyId.get(companyId) || new Immutable.List();
    byCompanyMapNew[companyId] = byCompanyMapNew[companyId].push(action.result.id);

    return {
      ...state,
      saving:false,
      savingError:'',
      byCompanyId: state.byCompanyId.mergeDeep(byCompanyMapNew),
      list:state.list.mergeDeep(contactMap),
    };
  }
  case CREATE_COMPANY_CONTACT_FAIL: {
    let contact = {};
    contact[action.id] = {};
    contact[action.id].saving = false;
    contact[action.id].savingError = (action.error && action.error.error && action.error.error.message) || 'Failed to create contact';
    return {
      ...state,
      saving:false,
      savingError:'Failed to create contact',
      list:state.list.mergeDeep(contact),
    };
  }
  case CREATE_TEMP_CONTACT:{
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;
    return {
      ...state,
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case companyConstants.GET_COMPANY_SUCCESS:{
    let contactsMap = {};
    if(action.result && action.result.clientAdvocate){
      let id = action.result.clientAdvocate.id;
      contactsMap[id] = action.result.clientAdvocate;
    }
    return {
      ...state,
      list: state.list.merge(contactsMap),
    };

  }
  case jobConstants.GET_JOB_SUCCESS:{
    let contactsMap = {};
    if(action.result.talentAdvocate){
      let id = action.result.talentAdvocate.id;
      contactsMap[id] = action.result.talentAdvocate;
    }
    if(action.result.contact){
      let id = action.result.contact.id;
      contactsMap[id] = action.result.contact;
    }
    return {
      ...state,
      list: state.list.merge(contactsMap),
    };
  }
  case jobConstants.GET_MY_JOBS_SUCCESS:
    {
      let contactList =  {};
      action.result.map(job =>{
        job.candidates.map(candidate=>{
          contactList[candidate.contact.id] = candidate.contact;
        });
      });
      return {
        ...state,
        list:state.list.mergeDeep(contactList),
      };
    }
  case SEARCH_CONTACTS_SUCCESS: {
    let query = action.result.query;

    let queriesMap = {};
    queriesMap[query] = action.result.results;

    return {
      ...state,
      queries: state.queries.mergeDeep(queriesMap),
    };
  }
  case SEARCH_CONTACTS_FAIL:
    return {
      ...state,
      err: action.err,
    };
  case GET_CONTACT_DETAIL: {
    return {
      ...state,
    };
  }
  case GET_CONTACT_DETAIL_SUCCESS: {
    let contactsMap = {};
    let id = action.result.id;
    contactsMap[id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case GET_CONTACT_DETAIL_FAIL: {
    return {
      ...state,
    };
  }
  case GET_MY_CONTACTS_SUCCESS: {
    let contactsMap = {};
    action.result.map((c) => {
      contactsMap[c.id] = c;
    });

    return{
      ...state,
      myContactIds: state.myContactIds.mergeDeep(contactsMap),
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case GET_MY_FAVORITE_CONTACTS_SUCCESS: {
    let contactsMap = {};
    action.result.map((c) => {
      contactsMap[c.id] = c;
    });

    return{
      ...state,
      myFavoriteContactIds: state.myFavoriteContactIds.mergeDeep(contactsMap),
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case CREATE_CONTACT_FAVORITE_SUCCESS: {
    let contact = state.list.get(action.result.favorableId);

    if (contact) {
      contact = contact.set('isFavorited', true);

      let contactMap = {};
      contactMap[contact.get('id')] = contact;

      return {
        ...state,
        list: state.list.mergeDeep(contactMap),
        myContactIds: state.myContactIds.mergeDeep(contactMap),
        myFavoriteContactIds: state.myFavoriteContactIds.mergeDeep(contactMap),
      };
    }
    else {
      return state;
    }
  }
  case DELETE_CONTACT_FAVORITE_SUCCESS: {
    let contact = state.list.get(action.result.favorableId);

    if (contact) {
      contact = contact.set('isFavorited', false);

      let contactMap = {};
      contactMap[contact.get('id')] = contact;

      return {
        ...state,
        list: state.list.mergeDeep(contactMap),
        myContactIds: state.myContactIds.mergeDeep(contactMap),
        myFavoriteContactIds: state.myFavoriteContactIds.delete(action.result.favorableId),
      };
    }
    else {
      return state;
    }
  }
  case SET_EXPERIENCE:{
    let contactCategory = action.result;
    let list = state.list.updateIn([action.contactId,'_contactCategories'],arr =>{
      let returnArr = null;
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(row){
        let newItem = row[1].set('experience',contactCategory.experience);
        returnArr = arr.set(row[0],newItem);
      } else {
        returnArr = arr;
      }
      return returnArr;
    });
    return {
      ...state,
      list,
    };
  }
  case SET_CONTACT_CATEGORIES_LOCAL:{
    //find current contact
    let contactCategory = action.result;
    let list = state.list.updateIn([action.contactId,'_contactCategories'],arr =>{
      let returnArr = null;
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(!row){
        returnArr = arr.push( new ContactCategory(contactCategory));
      } else {
        returnArr = arr.set(row[0],new ContactCategory(contactCategory));
      }
      return returnArr;
    });
    return {
      ...state,
      list,
    };
  }
  case SET_PRIMARY:{
    let contactCategory = action.result;
    let list = state.list.updateIn([action.contactId,'_contactCategories'],arr =>{
      let returnArr = null;
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(row){
        let newItem = row[1].set('primary',contactCategory.primary);
        returnArr = arr.set(row[0],newItem);
      } else {
        returnArr = arr;
      }
      return returnArr;
    });
    return {
      ...state,
      list,
    };
  }
  case CREATE_CONTACT_CATEGORY_SUCCESS:{
    let contactCategory = action.result.response;
    let contactId = action.result.contactId;
    let list = state.list.updateIn([contactId,'_contactCategories'],arr =>{
      let returnArr = null;
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(row){
        returnArr = arr.set(row[0],new ContactCategory(contactCategory));
      } else {
        returnArr = arr;
      }
      return returnArr;
    });
    return {
      ...state,
      list,
    };
  }
  case EDIT_CONTACT_CATEGORY_SUCCESS:{
    let contactCategory = action.result.response;
    let contactId = action.result.contactId;
    let list = state.list.updateIn([contactId,'_contactCategories'],arr =>{
      let returnArr = null;
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(row){
        returnArr = arr.set(row[0],new ContactCategory(contactCategory));
      } else {
        returnArr = arr;
      }
      return returnArr;
    });
    return {
      ...state,
      list,
    };
  }
  default:
    return state;
  }
}

export function getAllContacts() {
  return {
    types: [GET_CONTACTS, GET_CONTACTS_SUCCESS, GET_CONTACTS_FAIL],
    promise: (client, auth) => client.api.get('/contacts', {
      authToken: auth.authToken,
    }),
  };
}

export function getContactsByCompany(companyId) {
  return {
    types: [GET_CONTACTS_BY_COMPANY, GET_CONTACTS_BY_COMPANY_SUCCESS, GET_CONTACTS_BY_COMPANY_FAIL],
    promise: (client, auth) =>new Promise((resolve, reject)=>{
      client.api.get('/companies/'+ companyId +'/contacts', {
        authToken: auth.authToken,
      }).then((result)=>{
        resolve({
          companyId,
          result,
        });
      }).catch((err)=>{
        reject(err);
      });
    }),
  };
}

export function getOneContact(contactId) {
  return {
    types: [GET_ONE_CONTACT, GET_ONE_CONTACT_SUCCESS, GET_ONE_CONTACT_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/${contactId}`, {
      authToken: auth.authToken,
    }),
  };
}

export function contactCreated(oringinalContactId, newContactId){
  return {
    id:oringinalContactId,
    types: [GET_CONTACT_CREATED, GET_CONTACT_CREATED_SUCCESS, GET_CONTACT_CREATED_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/${newContactId}`, {
      authToken: auth.authToken,
    }),
  };
}

export function createContact(contact) {
  var id = contact.get('id');
  if(id && id.indexOf('tmp') > -1){
    contact = contact.remove('id');
  }
  return {
    id,
    contact,
    types: [CREATE_CONTACT, CREATE_CONTACT_SUCCESS, CREATE_CONTACT_FAIL],
    promise: (client, auth) => client.api.post('/contacts', {
      authToken: auth.authToken,
      data:contact,
    }),
  };
}

export function editContact(contact) {
  var id = contact.get('id');
  if(id && id.indexOf('tmp') > -1){
    contact = contact.remove('id');
  }

  return (dispatch) => {
    dispatch({
      id,
      types: [EDIT_CONTACT, EDIT_CONTACT_SUCCESS, EDIT_CONTACT_FAIL],
      promise: (client, auth) => client.api.put(`/contacts/${id}`, {
        authToken: auth.authToken,
        data:contact,
      }).then(function (contact) {
        dispatch(saveCandidateByContactResult(contact));
        return contact;
      }),
    });
  };
}

export function searchContacts(query) {
  return {
    types: [SEARCH_CONTACTS, SEARCH_CONTACTS_SUCCESS, SEARCH_CONTACTS_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/search?query=${query}`, {
      authToken: auth.authToken,
    }),
  };
}

export function createTempContact(contact){
  return {
    type: CREATE_TEMP_CONTACT,
    result: contact,
  };
}

export function createCompanyContact(companyId, contact) {
  var id = contact.get('id');
  if(id && id.indexOf('tmp') > -1){
    contact = contact.remove('id');
  }
  return (dispatch) => {
    dispatch({
      id,
      contact,
      types: [CREATE_COMPANY_CONTACT, CREATE_COMPANY_CONTACT_SUCCESS, CREATE_COMPANY_CONTACT_FAIL],
      promise: (client, auth) => new Promise(function(resolve, reject){
        let contactPromise = client.api.post('/companyContacts', {
          authToken: auth.authToken,
          data: {
            companyId,
            contact,
          },
        });
        contactPromise.then((res) => {
          resolve(res);
        }).catch((ex) => {
          reject(ex);
        });
      }).then((companyContact)=>{
        dispatch(getOneContact(companyContact.contactId));
        return companyContact;
      }),
    });
  };
}

export function saveContactsByCompanyResult(contacts){
  return {
    type: GET_CONTACTS_BY_COMPANY_SUCCESS,
    result: contacts,
  };
}

export function getContactDetail(id) {
  return (dispatch) => {
    dispatch({
      types: [GET_CONTACT_DETAIL, GET_CONTACT_DETAIL_SUCCESS, GET_CONTACT_DETAIL_FAIL],
      promise: (client, auth) => client.api.get(`/contacts/detail?id=${id}`, {
        authToken: auth.authToken,
      }).then((contact)=> {
        if (contact.jobs && contact.jobs.length > 0) {
          dispatch(saveJobsByContactResult(contact.jobs, contact.id));
        }
        return contact;
      }),
    });
  };
}

export function getMyContacts() {
  return {
    types: [GET_MY_CONTACTS, GET_MY_CONTACTS_SUCCESS, GET_MY_CONTACTS_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/myContacts`, {
      authToken: auth.authToken,
    }),
  };
}

export function getMyFavoriteContacts() {
  return {
    types: [GET_MY_FAVORITE_CONTACTS, GET_MY_FAVORITE_CONTACTS_SUCCESS, GET_MY_FAVORITE_CONTACTS_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/myFavoriteContacts`, {
      authToken: auth.authToken,
    }),
  };
}

export function createContactFavorite(contactId){
  return (dispatch) => {
    dispatch({
      types: [CREATE_CONTACT_FAVORITE, CREATE_CONTACT_FAVORITE_SUCCESS, CREATE_CONTACT_FAVORITE_FAIL],
      promise: (client, auth) => client.api.post(`/contacts/${contactId}/favorites`, {
        authToken: auth.authToken,
      }).then(function (favorite) {
        dispatch(createCandidateFavorite(favorite));
        return favorite;
      }),
    });
  };
}

export function deleteContactFavorite(contactId){
  return (dispatch) => {
    dispatch({
      types: [DELETE_CONTACT_FAVORITE, DELETE_CONTACT_FAVORITE_SUCCESS, DELETE_CONTACT_FAVORITE_FAIL],
      promise: (client, auth) => client.api.del(`/contacts/unfavorite?id=${contactId}`, {
        authToken: auth.authToken,
      }).then(function (favorite) {
        dispatch(deleteCandidateFavorite(favorite));
        return favorite;
      }),
    });
  };
}

let guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export function setCategoryLocal(contactId, contactCategory){
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
    contactId,
  };
}
export function setPrimary(contactId,contactCategory){
  return (dispatch) => {
    if(contactCategory){
      if(contactCategory.toJSON){
        contactCategory = contactCategory.toJSON();
      }
    }
    if((contactCategory.id && contactCategory.id.indexOf('tmp')>-1 )|| !contactCategory.id){
      //is a temp object, delete the id and createContactCategory
      delete contactCategory.id;
      dispatch(createContactCategory(contactId, contactCategory));
    } else{
      dispatch(saveContactCategory(contactId, contactCategory));
    }
    dispatch({
      type:SET_PRIMARY,
      result:contactCategory,
      contactId,
    });
  };

}

export function saveContactCategory(contactId,contactCategory){
  return {
    types: [EDIT_CONTACT_CATEGORY, EDIT_CONTACT_CATEGORY_SUCCESS, EDIT_CONTACT_CATEGORY_FAIL],
    promise: (client, auth) => client.api.put(`/contacts/${contactId}/contactCategories/${contactCategory.id}`, {
      authToken: auth.authToken,
      data: contactCategory,
    }).then((response) => {
      return {
        response,
        contactId,
      };
    }),
  };
}
export function createContactCategory(contactId,contactCategory){
  return {
    types: [CREATE_CONTACT_CATEGORY, CREATE_CONTACT_CATEGORY_SUCCESS, CREATE_CONTACT_CATEGORY_FAIL],
    promise: (client, auth) => client.api.post(`/contacts/${contactId}/contactCategories`, {
      authToken: auth.authToken,
      data: contactCategory,
    }).then((response) =>{
      return {
        response,
        contactId,
      };
    }),
  };
}

export function setExperience(contactId,contactCategory, category){
  return (dispatch, getState) => {
    if(contactCategory){
      if(contactCategory.toJSON){
        contactCategory = contactCategory.toJSON();
      }
    }
    let currentContact = getState().contacts.list.get(contactId);
    let _contactCategories = currentContact.get('_contactCategories');
    let currentContactCategory = _contactCategories.find(x=>x.get('categoryId') == contactCategory.categoryId );
    if(currentContactCategory){
      if(currentContactCategory.get('experience') == 0 && contactCategory.experience > 0){
        //Setting from zero to something, set the Tags
        contactCategory.frameworkInclude = category.get('frameworkArr').toArray();
      } else if (currentContactCategory.get('experience') != 0 && contactCategory.experience <=0) {
        contactCategory.frameworkInclude = [];
      }
    }
    if((contactCategory.id && contactCategory.id.indexOf('tmp')>-1 )|| !contactCategory.id){
      //is a temp object, delete the id and createContactCategory
      delete contactCategory.id;
      dispatch(createContactCategory(contactId, contactCategory));
    } else{
      dispatch(saveContactCategory(contactId, contactCategory));
    }
    dispatch({
      type:SET_EXPERIENCE,
      result:contactCategory,
      contactId,
      category,
    });
  };

}
