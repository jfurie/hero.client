import Immutable from 'immutable';

const GET_CONTACTS = 'hero.client/contacts/GET_CONTACTS';
const GET_CONTACTS_SUCCESS = 'hero.client/contacts/GET_CONTACTS_SUCCESS';
const GET_CONTACTS_FAIL = 'hero.client/contacts/GET_CONTACTS_FAIL';

const initialState = {
  list: new Immutable.Map(),
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
      list: state.list.mergeDeep(contactsMap),
    };
  }
  case GET_CONTACTS_FAIL:
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