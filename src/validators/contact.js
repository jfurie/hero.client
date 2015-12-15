import {validate as validateJS} from 'validate.js';
import toState from './validator';

const constraints = {
  'firstName': {
    presence: true,
    length: {
      minimum: 2,
      message: 'must be at least 2 characters',
    },
  },
  'lastName': {
    presence: true,
    length: {
      minimum: 2,
      message: 'must be at least 2 characters',
    },
  },
  'email': {
    presence: true,
    email: true,
  },
  'phone': {
    format: {
      pattern: /^(\([0-9]{3}\)|[0-9]{3}) ([0-9]{3})-([0-9]{4})$/g,
      message: 'must be (XXX) YYY-ZZZZ',
    },
  },
};

export default function validateContact(contact) {
  let errors = validateJS(contact, constraints) || [];
  return toState(Object.keys(contact), errors);
}
