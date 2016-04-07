export default function getCandidateDataFromState(state, candidateId) {

  let candidate = state.candidates.list.size > 0 ? state.candidates.list.get(candidateId) : null;

  if (candidate) {
    let contact = state.contacts.get('list').get(candidate.get('contactId'));
    candidate = candidate.set('contact', contact);

    let job = state.jobs.get('list').get(candidate.get('jobId'));
    candidate = candidate.set('job', job);
  }

  return candidate;
}