import Immutable from 'immutable';

export default function getJobDataFromState(state, jobId) {
  let job = state.jobs.list.get(jobId) || null;
  let candidates = state.candidates || null;

  if (job) {
    let jobImage = job ? state.resources.list.get(job.get('imageId')) : new Immutable.Map();
    job = job.set('image', jobImage);

    // grab the candidates for this job
    let jobCandidates = [];
    if (candidates && candidates.byJobId && candidates.list) {
      if (candidates.byJobId.size > 0) {
        candidates.byJobId.get(jobId).forEach(function(candidateId) {
          let c = state.candidates.list.get(candidateId);
          if (c) {
            jobCandidates.push(c);
          }
        });
      }
    }

    job = job.set('candidates', jobCandidates);

  }

  return job;
}
