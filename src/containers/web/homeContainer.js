import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../components/web';

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
        <Header />
        {(user && user.email) ? (
          <p>hi {user.email}</p>
        ) : (
          <p>hi guest</p>
        )}
        <h1>HOME</h1>
      </div>);
  }
}

export default HomePage;
