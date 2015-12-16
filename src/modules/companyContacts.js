
const CREATE_COMPANY_CONTACT = 'hero.client/contacts/CREATE_COMPANY_CONTACT';
const CREATE_COMPANY_CONTACT_SUCCESS = 'hero.client/contacts/CREATE_COMPANY_CONTACT_SUCCESS';
const CREATE_COMPANY_CONTACT_FAIL = 'hero.client/contacts/CREATE_COMPANY_CONTACT_FAIL';

export function createCompanyContact(companyId, contact) {
  return {
    types: [CREATE_COMPANY_CONTACT, CREATE_COMPANY_CONTACT_SUCCESS, CREATE_COMPANY_CONTACT_FAIL],
    promise: (client, auth) => new Promise(function(resolve, reject){
      //find current contact matching email address and master
      //if not found then create new contact (master)
      //create clientContact
      // let container = require('./container');
      // container = container;
      let contactPromise = client.api.post('/companyContacts', {
        authToken: auth.authToken,
        data: {
          companyId,
          contact,
        },
      });
      contactPromise.then((res)=>{
        resolve(res);
      }).catch((ex)=> {
        reject(ex);
      });
    }),
  };
}
