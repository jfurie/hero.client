export default function toState(keys, errors) {

  let state = {};

  state.validationErrors = 0;

  keys.forEach((k) => {
    state[k] = '';
  });

  let errorFields = Object.keys(errors);

  errorFields.forEach((f) => {
    if (errors[f].length > 0) {
      state[f] = errors[f][0];
      state.validationErrors += errors[f].length;
    }
  });

  return state;
}
