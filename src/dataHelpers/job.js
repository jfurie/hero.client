import Immutable from 'immutable';

export default function getJobDataFromState(state, jobId) {
  let job = ((state.jobs.get('list').size > 0) ? (state.jobs.get('list').get(jobId)) : (null));

  if (job) {

    // candidates
    let jobCandidates = new Immutable.List();

    if (job.has('candidates')) {
      let jobCandidateIds = [];
      job.get('candidates').map((candidate => {
          jobCandidateIds.push(candidate.get('id'));
      }));

      if (jobCandidateIds) {
        jobCandidates = state.candidates.list.filter(candidate => {
          return jobCandidateIds.indexOf(candidate.get('id')) > -1;
        }).toList();
      }
    }

    job = job.set('candidates', jobCandidates);

    // notes
    let jobNotes = new Immutable.List();

    if (job.has('notes')) {
      let jobNoteIds = [];
      job.get('notes').map((note => {
          jobNoteIds.push(note.get('id'));
      }));

      if (jobNoteIds) {
        jobNotes = state.notes.list.filter(note => {
          return jobNoteIds.indexOf(note.get('id')) > -1;
        }).toList();
      }

      jobNotes = jobNotes.sort((a, b) => {
        return new Date(b.get('created')) - new Date(a.get('created'));
      });
    }

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
  }

  return job;
}
