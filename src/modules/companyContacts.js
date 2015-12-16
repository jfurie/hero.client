
const CREATE_COMPANY_CONTACT = 'hero.client/contacts/CREATE_COMPANY_CONTACT';
const CREATE_COMPANY_CONTACT_SUCCESS = 'hero.client/contacts/CREATE_COMPANY_CONTACT_SUCCESS';
const CREATE_COMPANY_CONTACT_FAIL = 'hero.client/contacts/CREATE_COMPANY_CONTACT_FAIL';
const GET_ONE_CONTACT = 'hero.client/contacts/GET_ONE_CONTACT';
const GET_ONE_CONTACT_SUCCESS = 'hero.client/contacts/GET_ONE_CONTACT_SUCCESS';
const GET_ONE_CONTACT_FAIL = 'hero.client/contacts/GET_ONE_CONTACT_FAIL';

function getOneContact(contactId) {
  return {
    types: [GET_ONE_CONTACT, GET_ONE_CONTACT_SUCCESS, GET_ONE_CONTACT_FAIL],
    promise: (client, auth) => client.api.get(`/contacts/${contactId}`, {
      authToken: auth.authToken,
    }),
  };
}

export function createCompanyContact(companyId, contact) {
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
