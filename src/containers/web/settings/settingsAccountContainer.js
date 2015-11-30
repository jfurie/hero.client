import React from 'react';
import { connect } from 'react-redux';
import { Header, UsersList, EmailForm } from '../../../components/web';
import { invite } from '../../../modules/users';

@connect(state => ({
  authToken: state.auth.authToken,
  users: state.users,
}), {invite})
class SettingsHomePage extends React.Component {

  constructor() {
    super();
  }

  componentWillReceiveProps(nextProps) {

    if (!this.props.users.inviteStatus && nextProps.users.inviteStatus === 'success') {
      alert('The invite has been successfully sent!');
    } else if (!this.props.users.inviteStatus && nextProps.users.inviteStatus === 'fail') {
      alert('Error while sending the invite. Please try again!');
    }
  }

  submitEmail(email) {
    this.props.invite(email, window.location.origin + '/invited');
  }

  render() {

    let {authToken} = this.props;

    let isAdmin = (authToken.accountInfo.roles.indexOf('admin') != -1);
    let accountName = authToken.accountInfo.account.name;

    let users = [{
      name: 'Joshua Furie',
    }, {
      name: 'Tom Albers',
    }, {
      name: 'Rameet Singh',
    }];

    return (
      <div>
        <Header />
        <h1>Account Settings: ({accountName})</h1>

        {((isAdmin) ? (
          <p>You're admin of this account</p>
        ) : (
          <p>You're not admin of this account</p>
        ))}

        <p>Users in this account:</p>
        <UsersList users={users} controls={isAdmin}/>

        {/* invite user */}

        {((isAdmin) ? (
          <div>
            <p>Invite someone to join the {accountName} account:</p>
            <EmailForm onEmail={this.submitEmail.bind(this)} submitText='Invite'/>
          </div>

        ) : (null))}

      </div>);
  }
}

export default SettingsHomePage;
