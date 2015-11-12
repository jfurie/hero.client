import thunk from 'redux-thunk';
import clientMiddleware from '../middleware/clientMiddleware';
import reducer from '../reducers';
import { devTools, persistState } from 'redux-devtools';
import {
  createStore as _createStore, applyMiddleware, compose
}

from 'redux';
export default function createStore(reduxReactRouter, getRoutes, createHistory, client, data, isDev) {
  const middleware = [thunk, clientMiddleware(client)];
  let finalCreateStore;
  if (isDev) {

    finalCreateStore = compose(
      applyMiddleware(...middleware),
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }
  finalCreateStore = reduxReactRouter({
    getRoutes, createHistory
  })(finalCreateStore);

  const store = finalCreateStore(reducer, data);
  return store;
}
