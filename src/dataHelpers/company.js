import Immutable from 'immutable';
const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';

export default function getCompanyDataFromState(state, companyId) {

  let company = ((state.companies.list.size > 0) ? (state.companies.list.get(companyId)) : (null));

  if (company) {

    // filter down company jobs

    let jobsByCompanyListIds = state.jobs.byCompanyId.get(companyId);
    let companyJobs = new Immutable.Map();
    let talentAdvocate = null;
    if (jobsByCompanyListIds) {
      companyJobs = state.jobs.list.filter(x => {
        return jobsByCompanyListIds.indexOf(x.get('id')) > -1;
      });
    }

    company = company.set('jobs', companyJobs);
    //filter clientAdvocate
    if(company){
      talentAdvocate = state.contacts.list.get(company.get('clientAdvocateId'));
      company = company.set('clientAdvocate',talentAdvocate);
    }
    //filter hero contacts
    let heroContactIds = state.contacts.byCompanyId.get(HEROCOMPANYID);
    let heroContacts = null;
    if(heroContactIds){
      heroContacts = state.contacts.list.filter(x =>{
        return heroContactIds.indexOf(x.get('id')) > -1;
      });
    }
    company = company.set('heroContacts',heroContacts);

    // filter down company notes
    let notesByCompanyListIds = state.notes.byCompanyId.get(companyId);
    let companyNotes = new Immutable.Map();

    if (notesByCompanyListIds) {
      companyNotes = state.notes.list.filter(x => {
        return notesByCompanyListIds.indexOf(x.get('id')) > -1;
      });
    }

    companyNotes = companyNotes.sort((a, b) => {
      return new Date(b.get('created')) - new Date(a.get('created'));
    });

    company = company.set('notes', companyNotes);

    //filter down company contacts

    let contactsByCompanyListIds = state.contacts.byCompanyId.get(companyId);
    let companyContacts = new Immutable.Map();

    if (contactsByCompanyListIds) {
      companyContacts = state.contacts.list.filter(x => {
        return contactsByCompanyListIds.indexOf(x.get('id')) > -1;
      });
    }

    company = company.set('contacts', companyContacts);

    // company location

    let location = null;
    if (company.get('location')) {
      location = ((state.locations.list.size > 0) ? (state.locations.list.get(company.get('location'))) : (null));
    }

    company = company.set('location', location);

  }

  return company;
}
