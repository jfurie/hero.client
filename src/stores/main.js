import thunk from 'redux-thunk';
import clientMiddleware from '../middleware/client-middleware';
import reducer from '../modules';
import persistState from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';
import createLogger from 'redux-logger';
import {
  createStore as _createStore, applyMiddleware, compose
}
from 'redux';

const storage = compose(
  filter(['auth','myProfile','contacts'])
)(adapter(window.localStorage));

export default function createStore(reduxReactRouter, getRoutes, createHistory, client, data, isDev) {
  const middleware = [thunk, clientMiddleware(client),createLogger()];
  let finalCreateStore;
  if (isDev) {

    finalCreateStore = compose(
      persistState(storage),
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
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
