import React from 'react';
import { login } from '../../../modules/auth';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import './loginContainer.scss';

import { RaisedButton, TextField, Styles, Snackbar } from 'material-ui';

let style = {
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
}), {login, pushState})
class LogoutPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginError: '',
      passwordError: '',
    };
  }

  getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  componentWillReceiveProps(nextProps) {

    if (!this.props.user && !nextProps.user) { // fail to log
      this.refs.snackbar.show();
    } else if (!this.props.user && nextProps.user) { // login
      let param = this.getParameterByName('redirect');

      if (param) {
        param = param.replace('//', '/');
        this.props.pushState(null, param);
      }
      else {
        this.props.pushState(null, '/');
      }

    } else if (this.props.user && !nextProps.user) { // logout
      this.props.pushState(null, '/');
    }
  }

  onSubmit (e) {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state);
    }

    this.setState({
      loginError: null,
      passwordError: null,
    });

    if (!this.state.email) {
      this.setState({
        loginError: 'Login is required.',
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

  handleChange (item, e) {
    let newState = {};
    newState[item] = e.target.value;
    this.setState(newState);
  }

  render () {
    return (
      <div>
        <div id="login-box" className="row center-xs center-md">

          <form className="col-xs-10 col-md-4" onSubmit={this.onSubmit.bind(this)}>

            <img
                className="col-xs-4 col-md-3 loginLogo"
                src="/img/login-logo.png"
            />

            <TextField
                errorStyle={style.error}
                errorText={this.state.loginError || ''}
                fullWidth
                hintText="Login"
                onChange={this.handleChange.bind(this, 'email')}
                underlineFocusStyle={{borderColor: Styles.Colors.blue800}}
            />

            <TextField
                errorStyle={style.error}
                errorText={this.state.passwordError || ''}
                fullWidth
                hintText="Password"
                onChange={this.handleChange.bind(this, 'password')}
                underlineFocusStyle={{borderColor: Styles.Colors.blue800}}
                type="password"
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
            />

          </form>
        </div>

        <Snackbar
            action="ok"
            autoHideDuration={2500}
            message="Invalid username or password."
            ref="snackbar"
        />

      </div>
    );
  }
}

export default LogoutPage;