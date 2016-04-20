import Immutable from 'immutable';
import getJobDataFromState from './job';
export default function getContactDataFromState(state, contactId) {

  let contact = ((state.contacts.get('list').size > 0) ? (state.contacts.getIn(['list',contactId])) : (null));

  if (contact) {
    // jobs
    let contactJobs = new Immutable.List();

    if (contact.has('jobs')) {
      let contactJobIds = [];
      contact.get('jobs').map((job => {
        typeof job == 'string'? contactJobIds.push(job):contactJobIds.push(job.get('id'));
      }));

      if (contactJobIds) {
        contactJobs = state.jobs.get('list').filter(job => {
          return contactJobIds.indexOf(job.get('id')) > -1;
        }).toList();
      }
    }

    if(contactJobs && contactJobs.size > 0){
      contactJobs = contactJobs.map(job => getJobDataFromState(state,job.get('id')));
    }

    contact = contact.set('jobs', contactJobs);

    // companies
    let contactCompanies = new Immutable.List();

    if (contact.has('companies')) {
      let contactCompanyIds = [];
      contact.get('companies').map((company => {
        typeof company == 'string'? contactCompanyIds.push(company):contactCompanyIds.push(company.get('id'));
      }));

      if (contactCompanyIds) {
        contactCompanies = state.companies.get('list').filter(company => {
          return contactCompanyIds.indexOf(company.get('id')) > -1;
        }).toList();
      }
    }
    let coverImage = contact ? state.resources.list.get(contact.get('coverImageId')) : new Immutable.Map();
    contact = contact.set('coverImage', coverImage);
    let avatarImage = contact ? state.resources.list.get(contact.get('avatarImageId')) : new Immutable.Map();
    contact = contact.set('avatarImage', avatarImage);

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
