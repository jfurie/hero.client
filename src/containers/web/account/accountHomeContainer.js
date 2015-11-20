import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

@connect(state => ({
  user: state.auth.user,
  authToken: state.auth.authToken,
}))
class AccountHomePage extends React.Component {
  constructor() {
    super();
  }
  render() {

    let {authToken} = this.props;

    return (
      <div>
        <h1>Account: {authToken.accountInfo.account.name}</h1>
        <Link to="/"> back to home</Link>
      </div>);
  }
}

export default AccountHomePage;
