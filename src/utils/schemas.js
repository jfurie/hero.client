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
let favorite = new Schema('favorite');
contact.define({
  avatarImage: resource,
  coverImage:resource,
  companies:arrayOf(company),
  jobs: arrayOf(job),
  location,
  user,
});

candidate.define({
  contact,
  job,
});

company.define({
  image:resource,
  jobs: arrayOf(job),
  candidates:arrayOf(candidate),
  locations: arrayOf(location),
  user,
  clientAdvocate:contact,
  contacts:arrayOf(contact),
  notes:arrayOf(note),
  favorites:arrayOf(favorite),
});

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
  JOB_ARRAY:arrayOf(job),
  COMPANY: company,
  COMPANY_ARRAY:arrayOf(company),
  CONTACT:contact,
  CONTACT_ARRAY:arrayOf(contact)
};
