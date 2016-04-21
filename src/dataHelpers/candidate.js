export default function getCandidateDataFromState(state, candidateId) {

  let candidate = state.candidates.list.size > 0 ? state.candidates.list.get(candidateId) : null;

  if (candidate) {
    let contact = state.contacts.get('list').get(candidate.get('contactId'));
    if(contact && contact.get('avatarImageId')){
      let avatarImage = state.resources.list.get(contact.get('avatarImageId'));

      contact = contact.set('avatarImage',avatarImage);
    }
    if(contact && contact.get('companies')){
      let contactCompanies = contact.get('companies').map(function(company){
        if(typeof company == 'string'){
          return state.companies.get('list').get(company);
        } else{
          return state.companies.get('list').get(company.get('id'));
        }
      }).toList();
      contact = contact.set('companies',contactCompanies);
    }

    candidate = candidate.set('contact', contact);

    let job = state.jobs.get('list').get(candidate.get('jobId'));
    candidate = candidate.set('job', job);

    let company = state.companies.get('list').get(candidate.get('companyId'));
    candidate = candidate.set('company', company);
  }

  return candidate;
}
