import React from 'react';
import { Link } from 'react-router';
//import * as authActions from '../../reducers/auth';

class HomePage extends React.Component {
  constructor() {
    super();
    //console.log('yo!');
  }
  render() {
    return (
      <div>
        <h1>Hero.jobs</h1>
        <Link to="login">Login</Link>
      </div>);
  }
}

export default HomePage;
