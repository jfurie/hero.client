import Immutable from 'immutable';

export default function getContactDataFromState(state, contactId) {

  let contact = ((state.contacts.get('list').size > 0) ? (state.contacts.getIn(['list',contactId])) : (null));

  if (contact) {
    // jobs
    let contactJobs = new Immutable.List();

    if (contact.has('jobs')) {
      let contactJobIds = [];
      contact.get('jobs').map((job => {
        contactJobIds.push(job.get('id'));
      }));

      if (contactJobIds) {
        contactJobs = state.jobs.get('list').filter(job => {
          return contactJobIds.indexOf(job.get('id')) > -1;
        }).toList();
      }
    }

    contact = contact.set('jobs', contactJobs);

    // companies
    let contactCompanies = new Immutable.List();

    if (contact.has('companies')) {
      let contactCompanyIds = [];
      contact.get('companies').map((company => {
        contactCompanyIds.push(company.get('id'));
      }));

      if (contactCompanyIds) {
        contactCompanies = state.companies.get('list').filter(company => {
          return contactCompanyIds.indexOf(company.get('id')) > -1;
        }).toList();
      }
    }


    contact = contact.set('companies', contactCompanies);

    //notes
    let contactNotes = new Immutable.List();
    contactNotes = state.notes.list.filter(note => {
      return note.get('notableId') == contact.get('id');
    }).toList();

    contactNotes = contactNotes.sort((a, b) => {
      return new Date(b.get('created')) - new Date(a.get('created'));
    });

    contact = contact.set('notes', contactNotes);

    // location
    let location = state.locations.list.get(contact.get('locationId'));
    contact = contact.set('location', location);

    // favorite
    contact = contact.set('isFavorited',state.favorites.get('list').find(x=>x.get('favorableId') == contactId) != null);
  }

  return contact;
}
