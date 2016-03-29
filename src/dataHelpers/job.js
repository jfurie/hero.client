import Immutable from 'immutable';

export default function getJobDataFromState(state, jobId) {
  let job = ((state.jobs.get('list').size > 0) ? (state.jobs.get('list').get(jobId)) : (null));

  if (job) {

    // candidates
    let jobCandidates = new Immutable.List();

    jobCandidates = state.candidates.list.filter(candidate =>{
      return candidate.get('jobId') == job.get('id');
    }).toList();

    job = job.set('candidates', jobCandidates);

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
    job = job.set('talentAdvocate', talentAdvocate);

    // location
    let location = state.locations.list.get(job.get('locationId'));
    job = job.set('location', location);

    job = job.set('isFavorited',state.favorites.get('list').find(x=>x.get('favorableId') == jobId) != null);

  }

  return job;
}
