let React = require('react');
let ReactDOM = require('react-dom');
import {Route} from 'react-router';
import {createHistory} from 'history';
import {createStore, compose, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {reduxReactRouter, routerStateReducer, ReduxRouter} from 'redux-router';
import {devTools} from 'redux-devtools';
import {DevTools, DebugPanel, LogMonitor} from 'redux-devtools/lib/react';

import HomePage from './components/web/Homepage';
import Login from './components/web/Login';

const reducer = combineReducers({router: routerStateReducer});
const store = compose(reduxReactRouter({createHistory}), devTools())
(createStore)
(reducer);

class Root extends React.Component {
  render () {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter>
            <Route path="/" component={HomePage}/>
            <Route path="/login" component={Login}/>
          </ReduxRouter>
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor}/>
        </DebugPanel>
      </div>
    );
  }
}
ReactDOM.render(
  <Root/>, document.getElementById('app'));
