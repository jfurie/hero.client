import React from 'react';
import {connect} from 'react-redux';
import {changePassword} from '../../modules/auth';
import {Header} from '../../components/web';
import {ChangePasswordForm} from '../../components/web';
import {pushState} from 'redux-router';
@connect(state => ({auth: state.auth}), {changePassword, pushState})
class HomePage extends React.Component {
  constructor() {
    super();
  }

  changePassword (password) {
    this.props.changePassword(password, this.props.location.query.token);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.auth.changingPassword == true && nextProps.auth.changingPassword == false && !nextProps.auth.changingPasswordError) {
      this.props.pushState(null, '/');
    }
  }

  render () {
    return(
      <div>
        <Header/>
        <div id="innerView">
          <h1>Welcome!</h1>
          <p>
            Please Enter a password for your account:
          </p>
          <ChangePasswordForm onPassword={this.changePassword.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default HomePage;
