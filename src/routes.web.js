import Home from './containers/web/homeContainer';
import {LoginPage} from './containers/web/loginContainer';
import {IndexRoute, Route} from 'react-router';
import React from 'react';
export default () => {
  return (
    <Route path="/">
       <IndexRoute component={Home}/>
       <Route path="login" component={LoginPage} />
    </Route>
  );
};
