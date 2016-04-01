import { Schema, arrayOf } from 'normalizr';

let contact  = new Schema('contacts');
let user  = new Schema('users');
let company  = new Schema('companies');
let resource  = new Schema('resources');
let candidate  = new Schema('candidates');
let account  = new Schema('accounts');
let job = new Schema('jobs');
let location = new Schema('locations');
let note = new Schema('notes');
job.define({
  user,
  company,
  image:resource,
  contact,
  talentAdvocate:contact,
  candidates: arrayOf(candidate),
  account,
  location,
  notes: arrayOf(note),
});

export default {
  JOB:job,
  JOB_ARRAY:arrayOf(job)
}
