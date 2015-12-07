import Immutable from 'immutable';
const CREATE_CLIENT_CONTACT = 'hero.client/contacts/CREATE_CLIENT_CONTACT';
const CREATE_CLIENT_CONTACT_SUCCESS = 'hero.client/contacts/CREATE_CLIENT_CONTACT_SUCCESS';
const CREATE_CLIENT_CONTACT_FAIL = 'hero.client/contacts/CREATE_CLIENT_CONTACT_FAIL';

export function createClientContact(clientContact) {

  return {
    types: [CREATE_CLIENT_CONTACT, CREATE_CLIENT_CONTACT_SUCCESS, CREATE_CLIENT_CONTACT_FAIL],
    promise: (client, auth) =>new Promise(function(resolve, reject){
      //find current contact matching email address and master
      //if not found then create new contact (master)
      //create clientContact
      let container = require('./container');
      container = container;
      let contactPromise = client.api.post('/clientContact', {
        authToken: auth.authToken,
        data:clientContact,
      });
      contactPromise.then((res)=>{
        resolve(res);
      }).catch((ex)=> {
        reject(ex);
      });

    })
  }
}
