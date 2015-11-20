import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Header } from '../../../components/web';

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

    return (
      <div>
        <Header />
        <h1>Your Settings: ({auth.user.email})</h1>

        {((auth.authToken.accountInfo.account && auth.authToken.accountInfo.account.name) ? (
          <p>You're part of the {auth.authToken.accountInfo.account.name} account. (<Link to="/settings/account">settings</Link>)</p>
        ) : (null))}

      </div>);
  }
}

export default SettingsHomePage;
