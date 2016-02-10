import {validate as validateJS} from 'validate.js';
import toState from './validator';

const constraints = {
  'name': {
    presence: true,
    length: {
      minimum: 2,
      message: 'must be at least 2 characters',
    },
  },
  'website': {
    presence: true,
  },
  'twitterHandle': {
    length: {
      minimum: 1,
      message: 'must be at least 1 characters',
    },
  },
  'facebookHandle': {
    length: {
      minimum: 1,
      message: 'must be at least 1 characters',
    },
  },
  'phone': {
    length: {
      minimum: 10,
      message: 'must be valid',
    },
  },
};

export default function validateCompany(company) {
  let errors = validateJS(company, constraints) || [];
  return toState(Object.keys(company), errors);
}
