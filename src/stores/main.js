import thunk from 'redux-thunk';
import clientMiddleware from '../middleware/client-middleware';
import { persistState } from 'redux-devtools';
import reducer from '../modules';

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
      window.devToolsExtension ? window.devToolsExtension() : f => f,
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
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
