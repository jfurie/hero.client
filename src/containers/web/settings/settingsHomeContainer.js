import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

@connect(state => ({
  auth: state.auth,
  // authToken: state.auth.authToken,
}))
class SettingsHomePage extends React.Component {
  constructor() {
    super();
  }
  render() {

    let {auth} = this.props;

    console.log(auth);

    return (
      <div>
        <h1>Your Settings: ({auth.user.email})</h1>

        {((auth.authToken.accountInfo.account && auth.authToken.accountInfo.account.name) ? (
          <p>You're part of the {auth.authToken.accountInfo.account.name} account. (<Link to="settings/account">setting</Link>)</p>
        ) : (null))}

        <Link to="/"> back to home</Link>
      </div>);
  }
}

export default SettingsHomePage;
