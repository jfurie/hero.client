import Immutable from 'immutable';

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
        companyJobIds.push(job.get('id'));
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
        companyNoteIds.push(note.get('id'));
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
        companyContactIds.push(contact.get('id'));
      }));

      if (companyContactIds) {
        companyContacts = state.contacts.get('list').filter(contact => {
          return companyContactIds.indexOf(contact.get('id')) > -1;
        }).toList();
      }
    }

    company = company.set('contacts', companyContacts);

    // clientAdvocateId
    let clientAdvocate = state.contacts.get('list').get(company.get('clientAdvocateId'));
    company = company.set('clientAdvocate', clientAdvocate);

    // location
    let location = state.locations.list.get(company.get('locationId'));
    company = company.set('location', location);
  }

  return company;
}
