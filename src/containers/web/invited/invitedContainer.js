import React from 'react';
import {connect} from 'react-redux';
import {changePassword} from '../../../modules/auth';
import {ChangePasswordForm} from '../../../components/web';
import {pushState} from 'redux-router';

import Config from '../../../utils/config';

import { RaisedButton, Styles, Snackbar } from 'material-ui';
import './invitedContainer.scss';

const style = {
  linkedinButton: {
    width: '100%',
    height: '50px',
  },
};

@connect(state => ({
  auth: state.auth,
}), {changePassword, pushState})
class InvitedPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      errorMessage: null,
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.auth.get('changingPassword') == true && nextProps.auth.get('changingPassword') == false && !nextProps.auth.get('changingPasswordError')) {
      this.props.pushState(null, '/');
    }
  }

  showError(msg) {
    this.setState({
      error: true,
      errorMessage: msg,
    });
  }

  handleErrorClose() {
    this.setState({
      error: false,
      errorMessage: null,
    });
  }

  linkedinConnect() {
    //let auth = this.props.auth;
    if (this.props.location.query.token) {
      let url = Config.get('apiBaseUrl') + '/link/linkedin?redirect=' + window.location.origin + '&access_token=' + this.props.location.query.token;
      console.log(url);
      window.location.replace(url);
    } else {
      this.showError('You have not been invited!');
    }
  }

  changePassword(password) {
    this.props.changePassword(password, this.props.location.query.token);
  }

  render () {
    return (
      <div>
        <div id="invited-box" className="row center-xs center-md">
          <div className="col-xs-10">
            <h1>Welcome!</h1>
            <p>Please choose a password for your account.</p>
            <ChangePasswordForm onPassword={this.changePassword.bind(this)} onError={this.showError.bind(this)}/>
            <p className="or">or</p>
            <RaisedButton
                backgroundColor={Styles.Colors.blue800}
                label="Connect with Linkedin"
                labelColor="#FFF"
                style={style.linkedinButton}
                onTouchTap={this.linkedinConnect.bind(this)}
            />
          </div>
        </div>

        <Snackbar
            action="ok"
            open={this.state.error}
            onRequestClose={this.handleErrorClose.bind(this)}
            autoHideDuration={2500}
            message={(this.state.errorMessage) ? (this.state.errorMessage) : ('')}
        />

      </div>
    );
  }
}

export default InvitedPage;
