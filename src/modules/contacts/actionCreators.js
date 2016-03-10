import { createCandidateFavorite, deleteCandidateFavorite, saveCandidateByContactResult } from '../candidates';
import { saveJobsByContactResult } from '../jobs';
import { saveCompaniesResult } from '../companies';
import * as constants from './constants';

export function getAllContacts() {
  return {
    types: [constants.GET_CONTACTS, constants.GET_CONTACTS_SUCCESS, constants.GET_CONTACTS_FAIL],
    promise: (client, auth) => client.api.get('/contacts', {
      authToken: auth.authToken,
    }),
  };
}

export function getContactsByIds(contactIds){
  return (dispatch) => {
    return dispatch({
      types:[constants.GET_CONTACTS_BY_IDS, constants.GET_CONTACTS_BY_IDS_SUCCESS, constants.GET_CONTACTS_BY_IDS_FAIL],
      promise:(client,auth) => {
        let filter= {where:{id:{inq:contactIds}}};
        let filterString = encodeURIComponent(JSON.stringify(filter));
        return client.api.get(`/contacts?filter=${filterString}`,{
          authToken: auth.authToken,
        });
      }
    });
  }
}

export function getContactByIdsIfNeeded(contactIds){
  return (dispatch, getState) => {
    var newContactIds =[];
    contactIds.map((contactId => {
      if(!getState().contacts.list.get(contactId)){
        newContactIds.push(contactId);
      }
    }));
    return dispatch(getContactsByIds(newContactIds));
  };
}

export function getContactsByCompany(companyId) {
  return {
    types: [constants.GET_CONTACTS_BY_COMPANY, constants.GET_CONTACTS_BY_COMPANY_SUCCESS, constants.GET_CONTACTS_BY_COMPANY_FAIL],
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
    types: [constants.GET_ONE_CONTACT, constants.GET_ONE_CONTACT_SUCCESS, constants.GET_ONE_CONTACT_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/${contactId}`, {
      authToken: auth.authToken,
    }),
  };
}

export function contactCreated(oringinalContactId, newContactId){
  return {
    id:oringinalContactId,
    types: [constants.GET_CONTACT_CREATED, constants.GET_CONTACT_CREATED_SUCCESS, constants.GET_CONTACT_CREATED_FAIL],
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
    types: [constants.CREATE_CONTACT, constants.CREATE_CONTACT_SUCCESS, constants.CREATE_CONTACT_FAIL],
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
      types: [constants.EDIT_CONTACT, constants.EDIT_CONTACT_SUCCESS, constants.EDIT_CONTACT_FAIL],
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
    types: [constants.SEARCH_CONTACTS, constants.SEARCH_CONTACTS_SUCCESS, constants.SEARCH_CONTACTS_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/search?query=${query}`, {
      authToken: auth.authToken,
    }),
  };
}

export function createTempContact(contact){
  return {
    type: constants.CREATE_TEMP_CONTACT,
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
      types: [constants.CREATE_COMPANY_CONTACT, constants.CREATE_COMPANY_CONTACT_SUCCESS, constants.CREATE_COMPANY_CONTACT_FAIL],
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
    type: constants.GET_CONTACTS_BY_COMPANY_SUCCESS,
    result: contacts,
  };
}

export function getContactDetail(id) {
  return (dispatch) => {
    dispatch({
      types: [constants.GET_CONTACT_DETAIL, constants.GET_CONTACT_DETAIL_SUCCESS, constants.GET_CONTACT_DETAIL_FAIL],
      promise: (client, auth) => client.api.get(`/contacts/detail?id=${id}`, {
        authToken: auth.authToken,
      }).then((contact)=> {
        if (contact.jobs && contact.jobs.length > 0) {
          dispatch(saveJobsByContactResult(contact.jobs, contact.id));
          dispatch(saveCompaniesResult(contact.companies));
        }
        return contact;
      }),
    });
  };
}

export function getMyFavoriteContacts() {
  return {
    types: [constants.GET_MY_FAVORITE_CONTACTS, constants.GET_MY_FAVORITE_CONTACTS_SUCCESS, constants.GET_MY_FAVORITE_CONTACTS_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/myFavoriteContacts`, {
      authToken: auth.authToken,
    }),
  };
}

export function createContactFavorite(contactId){
  return (dispatch) => {
    dispatch({
      types: [constants.CREATE_CONTACT_FAVORITE, constants.CREATE_CONTACT_FAVORITE_SUCCESS, constants.CREATE_CONTACT_FAVORITE_FAIL],
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
      types: [constants.DELETE_CONTACT_FAVORITE, constants.DELETE_CONTACT_FAVORITE_SUCCESS, constants.DELETE_CONTACT_FAVORITE_FAIL],
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
    type:constants.SET_CONTACT_CATEGORIES_LOCAL,
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
      type:constants.SET_PRIMARY,
      result:contactCategory,
      contactId,
    });
  };

}

export function saveContactCategory(contactId,contactCategory){
  return {
    types: [constants.EDIT_CONTACT_CATEGORY, constants.EDIT_CONTACT_CATEGORY_SUCCESS, constants.EDIT_CONTACT_CATEGORY_FAIL],
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
    types: [constants.CREATE_CONTACT_CATEGORY, constants.CREATE_CONTACT_CATEGORY_SUCCESS, constants.CREATE_CONTACT_CATEGORY_FAIL],
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
      type:constants.SET_EXPERIENCE,
      result:contactCategory,
      contactId,
      category,
    });
  };

}
