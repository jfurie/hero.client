import Immutable from 'immutable';

const OPEN_NAV = 'hero.client/leftNav/OPEN_NAV';
const CLOSE_NAV = 'hero.client/leftNav/CLOSE_NAV';
const TOGGLE_NAV = 'hero.client/leftNav/TOGGLE_NAV';
const initialState = {
  list: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case OPEN_NAV:
    return {
      ...state,
      open:true,
    };
  case CLOSE_NAV: {
    return {
      ...state,
      open:false,
    };
  }
  case TOGGLE_NAV: {
    return {
      ...state,
      open:!state.open,
    };
  }
  default:
    return state;
  }
}

export function onNavOpen() {
  return {
    type: OPEN_NAV,
  };
}
export function onNavClose() {
  return {
    type: CLOSE_NAV,
  };
}
export function toggleNav() {
  return {
    type: TOGGLE_NAV,
  };
}
