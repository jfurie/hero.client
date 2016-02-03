
const CREATE_COMPANY_CONTACT = 'hero.client/contacts/CREATE_COMPANY_CONTACT';
const CREATE_COMPANY_CONTACT_SUCCESS = 'hero.client/contacts/CREATE_COMPANY_CONTACT_SUCCESS';
const CREATE_COMPANY_CONTACT_FAIL = 'hero.client/contacts/CREATE_COMPANY_CONTACT_FAIL';
const GET_CONTACT_CREATED = 'hero.client/contacts/GET_CONTACT_CREATED';
const GET_CONTACT_CREATED_SUCCESS = 'hero.client/contacts/GET_CONTACT_CREATED_SUCCESS';
const GET_CONTACT_CREATED_FAIL = 'hero.client/contacts/GET_CONTACT_CREATED_FAIL';

function contactCreated(oringinalContactId, newContactId){
  return {
    id:oringinalContactId,
    types: [GET_CONTACT_CREATED, GET_CONTACT_CREATED_SUCCESS, GET_CONTACT_CREATED_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/${newContactId}`, {
      authToken: auth.authToken,
    }),
  };
}

export function createCompanyContact(companyId, contact, contactId) {
  var id = contactId;
  if(contact){
    id = contact.get('id');
    if(id && id.indexOf('tmp') > -1){
      contact = contact.remove('id');
    }
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
            contactId,
          },
        });
        contactPromise.then((res) => {
          resolve(res);
        }).catch((ex) => {
          reject(ex);
        });
      }).then((companyContact)=>{
        dispatch(contactCreated(id, companyContact.contactId));
        return companyContact;
      }),
    });
  };
}
