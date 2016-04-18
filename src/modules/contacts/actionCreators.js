import { createCandidateFavorite, deleteCandidateFavorite, saveCandidateByContactResult } from '../candidates';
import { saveJobsByContactResult } from '../jobs';
import { getCompaniesByIdsIfNeeded, saveCompaniesResult } from '../companies';
import { getLocationsByIdsIfNeeded, saveLocationResult } from '../locations';
import * as constants from './constants';
import s3Uploader from '../../utils/s3Uploader';

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
        if(contactIds && contactIds.length >0){
          let filter= {where:{id:{inq:contactIds}}};
          let filterString = encodeURIComponent(JSON.stringify(filter));
          return client.api.get(`/contacts?filter=${filterString}`,{
            authToken: auth.authToken,
          });
        }
        else{
          return Promise.resolve([]);
        }
      }
    });
  };
}

export function getContactsByIdsIfNeeded(contactIds){
  return (dispatch, getState) => {
    var newContactIds =[];
    contactIds.map((contactId => {
      if(!getState().contacts.getIn(['list',contactId])){
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
      id,
      types: [constants.GET_CONTACT_DETAIL, constants.GET_CONTACT_DETAIL_SUCCESS, constants.GET_CONTACT_DETAIL_FAIL],
      promise: (client, auth) => client.api.get(`/contacts/detail?id=${id}`, {
        authToken: auth.authToken,
      }).then((contact)=> {
        if (contact.jobs && contact.jobs.length > 0) {
          dispatch(saveJobsByContactResult(contact.jobs, contact.id));
        }
        if (contact.companies && contact.companies.length > 0) {
          dispatch(saveCompaniesResult(contact.companies));
        }
        if (contact.location) {
          dispatch(saveLocationResult(contact.location));
        }
        return contact;
      }),
    });
  };
}

export function updateCoverImage(id, file) {
  return (dispatch) => {
    dispatch({
      id,
      types:[constants.UPDATE_COVER_IMAGE, constants.UPDATE_COVER_IMAGE_SUCCESS, constants.UPDATE_COVER_IMAGE_FAIL],
      promise: (client, auth) => {
        return s3Uploader(client,auth,'image',file,function(percent){
          dispatch({
            id,
            type: constants.UPDATE_COVER_IMAGE_PROGRESS,
            result: percent,
          });
        });
      },
    });
  };
}

export function updateAvatarImage(id, file) {
  return (dispatch) => {
    dispatch({
      id,
      types:[constants.UPDATE_AVATAR_IMAGE, constants.UPDATE_AVATAR_IMAGE_SUCCESS, constants.UPDATE_AVATAR_IMAGE_FAIL],
      promise: (client, auth) => {
        return s3Uploader(client,auth,'image',file,function(percent){
          dispatch({
            id,
            type: constants.UPDATE_AVATAR_IMAGE_PROGRESS,
            result: percent,
          });
        });
      },
    });
  };
}

export function getContactDetails(contactIds, include) {
  return (dispatch) => {
    let filter = {
      where: {
        id: {inq:contactIds},
      },
      include:[
        {
          relation:'companies',
          scope: {
            fields: ['id'],
          },
        },
        {
          relation:'coverImage',
        },
      ],
    };

    let filterString = encodeURIComponent(JSON.stringify(filter));

    dispatch({
      types: [constants.GET_CONTACT_DETAILS, constants.GET_CONTACT_DETAILS_SUCCESS, constants.GET_CONTACT_DETAILS_FAIL],
      promise: (client, auth) => client.api.get(`/contacts?filter=${filterString}`, {
        authToken: auth.authToken,
      }).then((contacts)=> {
        let companyIds = [];
        let locationIds = [];

        contacts.forEach(contact => {
          if (contact.locationId) {
            locationIds.push(contact.locationId);
          }

          if (include && include.indexOf('companies') > -1 && contact.companies) {
            contact.companies.map((company => {
              companyIds.push(company.id);
            }));
          }
        });

        dispatch(getCompaniesByIdsIfNeeded(companyIds));
        dispatch(getLocationsByIdsIfNeeded(locationIds));

        return contacts;
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
    promise: (client, auth) => client.api.put(`/contacts/${contactId}/categoryLinks/${contactCategory.id}`, {
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
    promise: (client, auth) => client.api.post(`/contacts/${contactId}/categoryLinks`, {
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

export function setFrameworks(contactId,contactCategory){
  return (dispatch) =>{
    if(contactCategory){
      if(contactCategory.toJSON){
        contactCategory = contactCategory.toJSON();
      }
    }
    dispatch({
      type:constants.SET_FRAMEWORKS,
      result:contactCategory,
      contactId,
    });
    dispatch(saveContactCategory(contactId, contactCategory));
  };
}

export function setExperience(contactId,contactCategory, category){
  return (dispatch, getState) => {
    if(contactCategory){
      if(contactCategory.toJSON){
        contactCategory = contactCategory.toJSON();
      }
    }
    let currentContact = getState().contacts.get('list').get(contactId);
    let _categoryLinks = currentContact.get('_categoryLinks');
    let currentContactCategory = _categoryLinks.find(x=>x.get('categoryId') == contactCategory.categoryId );
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

export function saveContactResult(contact){
  return {
    type: constants.GET_ONE_CONTACT_SUCCESS,
    result: contact,
  };
}

export function saveContactsResult(contacts){
  return {
    type: constants.GET_CONTACTS_SUCCESS,
    result: contacts,
  };
}
