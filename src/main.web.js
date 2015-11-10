let React = require('react');
let ReactDOM = require('react-dom');
import {createHistory} from 'history';
import {Provider} from 'react-redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';
import createStore from './stores';
import Client from './utils/apiClient';

import getRoutes from './routes.web';
let apiClient = new Client({
  baseUrl: 'http://localhost:3000'
});
const store = createStore(reduxReactRouter,getRoutes, createHistory, apiClient, {},true);

const component = (
  <ReduxRouter routes={getRoutes(store)} />
);

class Root extends React.Component {
  render () {
    return (
      <div>
        <Provider store={store}>
          {component}
        </Provider>
      </div>
    );
  }
}
ReactDOM.render(
  <Root/>, document.getElementById('app'));
