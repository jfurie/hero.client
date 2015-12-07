import Immutable from 'immutable';

const GET_CONTACTS = 'hero.client/contacts/GET_CONTACTS';
const GET_CONTACTS_SUCCESS = 'hero.client/contacts/GET_CONTACTS_SUCCESS';
const GET_CONTACTS_FAIL = 'hero.client/contacts/GET_CONTACTS_FAIL';
const GET_CONTACTS_BY_COMPANY = 'hero.client/contacts/GET_CONTACTS_BY_COMPANY';
const GET_CONTACTS_BY_COMPANY_SUCCESS = 'hero.client/contacts/GET_CONTACTS_BY_COMPANY_SUCCESS';
const GET_CONTACTS_BY_COMPANY_FAIL = 'hero.client/contacts/GET_CONTACTS_BY_COMPANY_FAIL';
const CREATE_CONTACT = 'hero.client/contacts/CREATE_CONTACT';
const CREATE_CONTACT_SUCCESS = 'hero.client/contacts/CREATE_CONTACT_SUCCESS';
const CREATE_CONTACT_FAIL = 'hero.client/contacts/CREATE_CONTACT_FAIL';
const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
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
  case CREATE_CONTACT:
    return {
      ...state,
      creating:true,
      error:''
    };
  case CREATE_CONTACT_SUCCESS:
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;
    return {
      ...state,
      creating:false,
      error:'',
      currentId:action.result.id,
      list: state.list.mergeDeep(contactsMap),
    };
  case CREATE_CONTACT_FAIL:
    return {
      ...state,
      creating:false,
      error:'Error Creating Contact'
    };
  case GET_CONTACTS_BY_COMPANY_SUCCESS:
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
          result
        });
      }).catch((err)=>{
        reject(err);
      });

    }),
  };
}

export function createContact(contact) {
  return {
    types: [CREATE_CONTACT, CREATE_CONTACT_SUCCESS, CREATE_CONTACT_FAIL],
    promise: (client, auth) => client.api.post('/contacts', {
      authToken: auth.authToken,
      data:contact
    }),
  };
}
