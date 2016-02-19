import Immutable from 'immutable';

export default function getContactDataFromState(state, contactId) {

  let contact = ((state.contacts.list.size > 0) ? (state.contacts.list.get(contactId)) : (null));

  if (contact) {
    let jobsByContactIds = state.jobs.byContactId.get(contactId);
    let contactJobs = new Immutable.Map();
    if (jobsByContactIds) {
      contactJobs = state.jobs.list.filter(x => {
        return jobsByContactIds.indexOf(x.get('id')) > -1;
      });
    }

    contact = contact.set('jobs', contactJobs);
  }

  return contact;
}
