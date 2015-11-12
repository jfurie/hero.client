import React from 'react';
import { Link } from 'react-router';

class RestrictedPage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <h1>Restricted Area</h1>
        <img src='https://media.giphy.com/media/3QoWqgKgTYMG4/giphy.gif' />
        <Link to="login">Login</Link>
        <Link to="logout">Logout</Link>
      </div>);
  }
}

export default RestrictedPage;
