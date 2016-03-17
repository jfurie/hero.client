import Immutable from 'immutable';

export default function getContactDataFromState(state, contactId) {

  let contact = ((state.contacts.get('list').size > 0) ? (state.contacts.getIn(['list',contactId])) : (null));

  if (contact) {
    let jobsByContactIds = state.jobs.get('byContactId').get(contactId);
    let contactJobs = new Immutable.Map();
    if (jobsByContactIds) {
      contactJobs = state.jobs.get('list').filter(x => {
        return jobsByContactIds.indexOf(x.get('id')) > -1;
      });
    }

    contact = contact.set('jobs', contactJobs);
  }

  return contact;
}
