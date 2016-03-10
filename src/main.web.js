let React = require('react');
let ReactDOM = require('react-dom');
import {Provider} from 'react-redux';
import {reduxReactRouter} from 'redux-router';
import { Router, browserHistory } from 'react-router';
import createStore from './stores/main';
import ApiClient from './utils/apiClient';
import FakeApiClient from './utils/fakeApiClient';
import LocalStorageClient from './utils/localStorageClient';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getRoutes from './routes.web';
import createHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import Immutable from 'immutable';
const history = useScroll(createHistory);
//import DevTools from './utils/devTools';
import Config from './utils/config';

function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}

injectTapEventPlugin({
  shouldRejectClick() {
    return is_touch_device();
  }
});

let client = {};
client.api = new ApiClient({
  baseUrl: Config.get('apiBaseUrl'),
});

client.localStorage = new LocalStorageClient('auth');
client.fakeApi = new FakeApiClient(); // fake api

const store = createStore(reduxReactRouter, getRoutes, history, client,Immutable.Map(),true);

class Root extends React.Component {

  render () {
    return (
      <div style={{}}>
        <Provider store={store}>
          <div>
            <Router history={browserHistory} routes={getRoutes(store)} />
            {/*<DevTools />*/}
          </div>
        </Provider>
      </div>
    );
  }
}
function startApp(){
  ReactDOM.render(<Root/>, document.getElementById('app'));
}
var url = document.URL;
let isSmart = (url.indexOf('http://') === -1 && url.indexOf('https://') === -1);
if( isSmart ){
  document.addEventListener('deviceready', startApp, false);
}
else{
  startApp();
}
