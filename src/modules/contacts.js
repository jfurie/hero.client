import Immutable from 'immutable';
import * as companyConstants from './companies/constants';
import * as jobConstants from './jobs/constants';
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

const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  queries: new Immutable.Map(),
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
      list: state.list.mergeDeep(contactsMap),
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
    contactsMap[action.result.id].saving = false;
    contactsMap[action.result.id].savingError = '';
    contactsMap[action.id] = contactsMap[action.result.id];
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
  case CREATE_CONTACT:
    return {
      ...state,
      creating:true,
      error: '',
    };
  case CREATE_CONTACT_SUCCESS:
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;
    contactsMap[action.result.id].saving = false;
    contactsMap[action.result.id].savingError = '';
    contactsMap[action.id] = contactsMap[action.result.id];
    return {
      ...state,
      saving:false,
      savingError:'',
      list:state.list.mergeDeep(contactsMap),
    };
  case CREATE_CONTACT_FAIL:
    return {
      ...state,
      creating: false,
      error: 'Error Creating Contact',
    };
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
      contactsMap[action.result.id].saving = false;
      contactsMap[action.result.id].savingError = '';
      contactsMap[action.id] = contactsMap[action.result.id];
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
    contactsMap = {};
    action.result.result.map((c) => {
      contactsMap[c.id] = c;
    });
    return {
      ...state,
      byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case CREATE_COMPANY_CONTACT_SUCCESS: {
    let byCompanyMap = {};
    let allCompanyContacts = state.byCompanyId.get(action.result.companyId) ? state.byCompanyId.get(action.result.companyId).toJS() : [];
    allCompanyContacts.push(action.result.contactId);
    byCompanyMap[action.result.companyId] = allCompanyContacts;

    return {
      ...state,
      byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
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
    if(action.result.clientAdvocate){
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
  return {
    id,
    types: [EDIT_CONTACT, EDIT_CONTACT_SUCCESS, EDIT_CONTACT_FAIL],
    promise: (client, auth) => client.api.put(`/contacts/${id}`, {
      authToken: auth.authToken,
      data:contact,
    }),
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
