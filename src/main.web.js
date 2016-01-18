let React = require('react');
let ReactDOM = require('react-dom');
import {createHistory} from 'history';
import {Provider} from 'react-redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';
import createStore from './stores/main';
import ApiClient from './utils/apiClient';
import FakeApiClient from './utils/fakeApiClient';
import LocalStorageClient from './utils/localStorageClient';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getRoutes from './routes.web';

import DevTools from './utils/devTools';
import Config from './utils/config';

injectTapEventPlugin();

let client = {};
client.api = new ApiClient({
  baseUrl: Config.get('apiBaseUrl'),
});

client.localStorage = new LocalStorageClient('auth');
client.fakeApi = new FakeApiClient(); // fake api

const store = createStore(reduxReactRouter, getRoutes, createHistory, client, {},true);

class Root extends React.Component {

  render () {
    return (
      <div style={{}}>
        <Provider store={store}>
          <div>
            <ReduxRouter routes={getRoutes(store)} />
            <DevTools />
          </div>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('app'));
