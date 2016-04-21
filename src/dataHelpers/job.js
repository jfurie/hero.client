import Immutable from 'immutable';
import getCandidateDataFromState from './candidate';

export function getJobCandidates(state, job){
  let jobCandidateIds = [];
  let jobCandidates = new Immutable.List();

  jobCandidateIds = state.candidates.list.filter(candidate =>{
    return candidate.get('jobId') == job.get('id');
  }).map(candidate => {
    return candidate.get('id');
  });

  jobCandidateIds.forEach(candidateId => {
    jobCandidates = jobCandidates.push(getCandidateDataFromState(state, candidateId));
  });

  return jobCandidates;
}

export default function getJobDataFromState(state, jobId) {
  let job = ((state.jobs.get('list').size > 0) ? (state.jobs.get('list').get(jobId)) : (null));

  if (job) {


    job = job.set('candidates', getJobCandidates(state,job));


    //company
    if(job.has('companyId')){
      let company =state.companies.get('list').get(job.get('companyId'));
      if(company){
        job = job.set('company',company);
      }
    }
    // notes
    let jobNotes = new Immutable.List();
    jobNotes = state.notes.list.filter(note => {
      return note.get('notableId') == job.get('id');
    }).toList();

    jobNotes = jobNotes.sort((a, b) => {
      return new Date(b.get('created')) - new Date(a.get('created'));
    });

    job = job.set('notes', jobNotes);

    // image
    let jobImage = state.resources.list.get(job.get('imageId')) || new Immutable.Map();
    job = job.set('image', jobImage);

    // contact
    let contact = state.contacts.get('list').get(job.get('contactId'));
    job = job.set('contact', contact);

    // talentAdvocate
    let talentAdvocate = state.contacts.get('list').get(job.get('talentAdvocateId'));
    if(talentAdvocate && talentAdvocate.get('avatarImageId')){
      let avatarImage = state.resources.list.get(talentAdvocate.get('avatarImageId'));
      talentAdvocate = talentAdvocate.set('avatarImage',avatarImage);
    }
    if(talentAdvocate && talentAdvocate.get('companies')){
      let talentAdvocateCompanies = talentAdvocate.get('companies').map(function(company){
        if(typeof company == 'string'){
          return state.companies.get('list').get(company);
        } else{
          return state.companies.get('list').get(company.get('id'));
        }
      }).toList();
      talentAdvocate = talentAdvocate.set('companies',talentAdvocateCompanies);
    }
    job = job.set('talentAdvocate', talentAdvocate);

    // location
    let location = state.locations.list.get(job.get('locationId'));
    job = job.set('location', location);

    job = job.set('isFavorited',state.favorites.get('list').find(x=>x.get('favorableId') == jobId) != null);

  }

  return job;
}
