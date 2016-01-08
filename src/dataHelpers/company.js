import Immutable from 'immutable';

export default function getCompanyDataFromState(state, companyId) {

  let company = ((state.companies.list.size > 0) ? (state.companies.list.get(companyId)) : (null));

  if (company) {

    // filter down company jobs

    let jobsByCompanyListIds = state.jobs.byCompanyId.get(companyId);
    let companyJobs = new Immutable.Map();

    if (jobsByCompanyListIds) {
      companyJobs = state.jobs.list.filter(x => {
        return jobsByCompanyListIds.indexOf(x.get('id')) > -1;
      });
    }

    company = company.set('jobs', companyJobs);

    //filter down company contacts

    let contactsByCompanyListIds = state.contacts.byCompanyId.get(companyId);
    let companyContacts = new Immutable.Map();

    if (jobsByCompanyListIds) {
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
