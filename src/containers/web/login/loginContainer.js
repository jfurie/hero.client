import React from 'react';
import { login, resetLoginError } from '../../../modules/auth';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import Config from '../../../utils/config';

import './loginContainer.scss';
import { RaisedButton, TextField, Styles, Snackbar } from 'material-ui';

const style = {
  error: {
    color: Styles.Colors.red400,
    textAlign: 'left',
  },
  signInButton: {
    width: '100%',
    marginBottom: '14px',
    marginTop: '50px',
    height: '50px',
  },
  linkedinButton: {
    width: '100%',
    height: '50px',
  },
};

@connect(state => ({
  user: state.auth.user,
  auth: state.auth,
}), {login, resetLoginError, pushState})
class LogoutPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userNameError: '',
      passwordError: '',
      loginError: false,
    };
  }
  componentDidMount(){
    if(this.props.auth.authToken){
      let param = this.getParameterByName('redirect');
      if (param) {
        param = param.replace('//', '/');
        this.props.pushState(null, param);
      } else {
        this.props.pushState(null, '/');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.authToken){
      //User is logged in
      let param = this.getParameterByName('redirect');

      if (param) {
        param = param.replace('//', '/');
        this.props.pushState(null, param);
      }
      else {
        this.props.pushState(null, '/');
      }
    }
    if (nextProps.auth && nextProps.auth.loginError) { // fail to log
      this.setState({
        loginError: true,
      });
    }
  }

  getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  onSubmit (e) {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state);
    }

    this.setState({
      userNameError: null,
      passwordError: null,
      loginError: false,
    });

    if (!this.state.email) {
      this.setState({
        userNameError: 'Login is required.',
      });
    }

    if (!this.state.password) {
      this.setState({
        passwordError: 'Password is required.',
      });
    }

    if (this.state.password && this.state.email) {
      this.props.login(this.state.email, this.state.password);
    }
  }

  handleLoginErrorClose () {
    this.setState({
      loginError: false,
    });

    this.props.resetLoginError();
  }

  linkedinConnect() {
    let url = `${Config.get('apiBaseUrl')}/auth/linkedin?redirect=${window.location.origin}`;
    window.location.replace(url);
  }

  handleChange (item, e) {
    let newState = {};
    newState[item] = e.target.value;
    this.setState(newState);
  }

  render () {
    return (
      <div>
        <div id="login-box" className="row center-xs center-md row-top">

          <form className="col-xs-10 col-md-4" onSubmit={this.onSubmit.bind(this)}>

            <img
                className="col-xs-4 col-md-3 loginLogo"
                src="/img/login-logo.png"
            />

            <TextField
                errorStyle={style.error}
                errorText={this.state.userNameError || ''}
                fullWidth
                hintText="Email Address"
                onChange={this.handleChange.bind(this, 'email')}
                underlineFocusStyle={{borderColor: Styles.Colors.blue800}}
                name="username"
            />

            <TextField
                errorStyle={style.error}
                errorText={this.state.passwordError || ''}
                fullWidth
                hintText="Password"
                onChange={this.handleChange.bind(this, 'password')}
                underlineFocusStyle={{borderColor: Styles.Colors.blue800}}
                type="password"
                name="password"
            />

            <RaisedButton
                label="Sign In"
                style={style.signInButton}
                type="submit"
            />

            <RaisedButton
                backgroundColor={Styles.Colors.blue800}
                label="Sign In with Linkedin"
                labelColor="#FFF"
                style={style.linkedinButton}
                onTouchTap={this.linkedinConnect.bind(this)}
            />

          </form>
        </div>

        <Snackbar
            action="ok"
            open={this.state.loginError}
            onRequestClose={this.handleLoginErrorClose.bind(this)}
            autoHideDuration={250000}
            message="Invalid email address or password."
            ref="snackbar"
            className="snackbar"
        />

      </div>
    );
  }
}

export default LogoutPage;
