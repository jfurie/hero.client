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

function convertToJS(paths) {
  const finalPaths = typeof paths === 'string'
    ? [paths]
    : paths;
  function convert(state, finalPaths){
    let newState = {};
    for(var key in state) {
      if(state.hasOwnProperty(key)) {
        if(finalPaths.indexOf(key) >-1){
          newState[key] = state[key].toJS();
        } else {
          newState[key] = state[key];
        }
      }
    }
    return newState;
  }
  return (storage) => ({
    ...storage,
    put: (key, state, callback) => {
      storage.put(key, convert(state, finalPaths), callback);
    },
  });
}
const storage = compose(
  convertToJS(['auth','myProfile','favorites','companies','contacts','jobs','publik']),
  filter(['auth','myProfile','favorites']),
)(adapter(window.localStorage));

export default function createStore(reduxReactRouter, getRoutes, createHistory, client, data, isDev) {
  const middleware = [thunk, clientMiddleware(client),createLogger({stateTransformer:state=>{
    let newState = {};
    for(let key in state) {
      if(state.hasOwnProperty(key)) {
        if(state[key] && state[key].toJS){
          newState[key] = state[key].toJS();
        } else {
          newState[key] = state[key];
        }
      }
    }
    return newState;
  }})];
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
