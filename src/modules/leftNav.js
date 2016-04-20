const OPEN_NAV = 'hero.client/leftNav/OPEN_NAV';
const CLOSE_NAV = 'hero.client/leftNav/CLOSE_NAV';
const TOGGLE_NAV = 'hero.client/leftNav/TOGGLE_NAV';
const DISABLE_SWIPE_OPEN = 'hero.client/leftNav/DISABLE_SWIPE_OPEN';
const ENABLE_SWIPE_OPEN = 'hero.client/leftNav/ENABLE_SWIPE_OPEN';

const initialState = {
  disableSwipeToOpen: false,
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
  case DISABLE_SWIPE_OPEN: {
    return {
      ...state,
      disableSwipeToOpen: true,
    };
  }
  case ENABLE_SWIPE_OPEN: {
    return {
      ...state,
      disableSwipeToOpen: false,
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

export function disableSwipeToOpen() {
  return {
    type: DISABLE_SWIPE_OPEN,
  };
}

export function enableSwipeToOpen() {
  return {
    type: ENABLE_SWIPE_OPEN,
  };
}
