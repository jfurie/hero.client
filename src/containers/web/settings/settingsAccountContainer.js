import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

@connect(state => ({
  authToken: state.auth.authToken,
}))
class SettingsHomePage extends React.Component {
  constructor() {
    super();
  }
  render() {

    let {authToken} = this.props;

    return (
      <div>
        <h1>Account Settings: ({authToken.accountInfo.account.name})</h1>

        {((authToken.accountInfo.roles.indexOf('admin') != -1) ? (
          <p>You're admin of this account</p>
        ) : (
          <p>You're not admin of this account</p>
        ))}

        <Link to="/"> back to home</Link>
      </div>);
  }
}

export default SettingsHomePage;
