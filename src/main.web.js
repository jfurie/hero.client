let React = require('react');
let ReactDOM = require('react-dom');
import {Provider} from 'react-redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';
import createStore from './stores/main';
import ApiClient from './utils/apiClient';
import FakeApiClient from './utils/fakeApiClient';
import LocalStorageClient from './utils/localStorageClient';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getRoutes from './routes.web';
import createHistory from 'history/lib/createBrowserHistory'
import useScroll from 'scroll-behavior/lib/useStandardScroll'

const history = useScroll(createHistory);
//import DevTools from './utils/devTools';
import Config from './utils/config';

injectTapEventPlugin();

let client = {};
client.api = new ApiClient({
  baseUrl: Config.get('apiBaseUrl'),
});

client.localStorage = new LocalStorageClient('auth');
client.fakeApi = new FakeApiClient(); // fake api

const store = createStore(reduxReactRouter, getRoutes, history, client, {},true);

class Root extends React.Component {

  render () {
    return (
      <div style={{}}>
        <Provider store={store}>
          <div>
            <ReduxRouter routes={getRoutes(store)} />
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
   var isSmart = (url.indexOf("http://") === -1 && url.indexOf("https://") === -1);
   if( isSmart ){
       alert('isSmart')
       document.addEventListener('deviceready', startApp, false);
   }
   else{
      startApp();
   }
