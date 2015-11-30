let React = require('react');
let ReactDOM = require('react-dom');
import {createHistory} from 'history';
import {Provider} from 'react-redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';
import createStore from './stores/main';
import ApiClient from './utils/apiClient';
import LocalStorageClient from './utils/localStorageClient';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import getRoutes from './routes.web';
// needed for 300ms issue  IOS https://github.com/zilverline/react-tap-event-plugin
// add a onTouchTap={this.handleTouchTap} handler. example on github page
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
let client = {};


client.api = new ApiClient({
  baseUrl: 'http://localhost:3000'
});

client.localStorage = new LocalStorageClient('auth');

const store = createStore(reduxReactRouter, getRoutes, createHistory, client, {},true);

// const component = (
//   <ReduxRouter routes={getRoutes(store)} />
// );

class Root extends React.Component {
  render () {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter routes={getRoutes(store)} />
        </Provider>
        <DebugPanel visibleOnLoad={false} top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}
ReactDOM.render(<Root/>, document.getElementById('app'));
