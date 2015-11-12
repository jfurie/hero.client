import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

@connect(state => ({
  user: state.auth.user,
}))
class HomePage extends React.Component {
  constructor() {
    super();
  }
  render() {

    let {user} = this.props;

    return (
      <div>
          {(user && user.email) ? (
            <p>hi {user.email}</p>
          ) : (
            <p>hi guest</p>
          )}
        <h1>Hero.jobs</h1>
        <Link to="login">Login</Link>
      </div>);
  }
}

export default HomePage;
