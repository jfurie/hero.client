import Immutable from 'immutable';

export default function getJobDataFromState(state, jobId) {
  let job = state.jobs.list.get(jobId) || null;

  if (job) {
    let jobImage = job ? state.resources.list.get(job.get('imageId')) : new Immutable.Map();
    job = job.set('image', jobImage);
  }

  return job;
}
