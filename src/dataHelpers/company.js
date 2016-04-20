
import Immutable from 'immutable';
import getContactDataFromState from './contact';

export default function getCompanyDataFromState(state, companyId) {

  let company = ((state.companies.get('list').size > 0) ? (state.companies.get('list').get(companyId)) : (null));

  if (company) {
    let isFavorited = false;

    if (state.favorites.get('list').filter(x => {
      return x.get('favorableId') == company.get('id');
    }).size > 0) {
      isFavorited = true;
    }

    company = company.set('isFavorited', isFavorited);

    let companyImage = company ? state.resources.list.get(company.get('imageId')) : new Immutable.Map();
    company = company.set('image', companyImage);

    // jobs
    let companyJobs = new Immutable.List();

    if (company.has('jobs')) {
      let companyJobIds = [];
      company.get('jobs').map((job => {
        companyJobIds.push(job);
      }));

      if (companyJobIds) {
        companyJobs = state.jobs.get('list').filter(job => {
          return companyJobIds.indexOf(job.get('id')) > -1;
        }).toList();
      }
    }

    company = company.set('jobs', companyJobs);

    // notes
    let companyNotes = new Immutable.List();

    if (company.has('notes')) {
      let companyNoteIds = [];
      company.get('notes').map((note => {
        companyNoteIds.push(note);
      }));

      if (companyNoteIds) {
        companyNotes = state.notes.list.filter(note => {
          return companyNoteIds.indexOf(note.get('id')) > -1;
        }).toList();
      }

      companyNotes = companyNotes.sort((a, b) => {
        return new Date(b.get('created')) - new Date(a.get('created'));
      });
    }

    company = company.set('notes', companyNotes);

    // contacts
    let companyContacts = new Immutable.List();

    if (company.has('contacts')) {
      let companyContactIds = [];
      company.get('contacts').map((contact => {
        companyContactIds.push(contact);
      }));

      if (companyContactIds) {
        companyContacts = state.contacts.get('list').filter(contact => {
          return companyContactIds.indexOf(contact.get('id')) > -1;
        }).toList();
        if(companyContacts){
          companyContacts = companyContacts.map(contact =>{
            return getContactDataFromState(state, contact.get('id'));
          });
        }
      }
    }

    company = company.set('contacts', companyContacts);

    // clientAdvocateId
    let clientAdvocate = state.contacts.get('list').get(company.get('clientAdvocateId'));
    if(clientAdvocate){
      let avatarImage = clientAdvocate ? state.resources.list.get(clientAdvocate.get('avatarImageId')) : new Immutable.Map();
      clientAdvocate = clientAdvocate.set('avatarImage', avatarImage);
    }
    company = company.set('clientAdvocate', clientAdvocate);
    let locations = state.locations.list.filter(x => {
      return x.get('locatableType') == 'company' && x.get('locatableId') == company.get('id');
    });

    let locationDefault = state.locations.list.get(company.get('locationId'));
    company = company.set('location', locationDefault);
    company = company.set('locations', locations);
  }

  return company;
}
