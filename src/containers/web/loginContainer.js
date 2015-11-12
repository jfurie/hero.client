import React, {
  PropTypes
} from 'react';
import { login } from '../../modules/auth';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';


@connect(state => ({
  user: state.auth.user
}), {login, pushState})
export class LoginPage extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    onSubmit: PropTypes.func,
    pushState: PropTypes.func.isRequired
  }

  constructor () {
    super();
  }

  getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) { // login
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
    this.props.login(this.state.email, this.state.password);
  }
  handleChange (item, e) {
    let newState = {};
    newState[item] = e.target.value;
    this.setState(newState);
  }
  render () {
    return (
      <div>
        <h1>Login Form</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <fieldset>
            <legend>Login</legend>
            <div>
              <label htmlFor='email'>email</label>
              <input name='email' onChange={this
                .handleChange
                .bind(this, 'email')} type='text' placeholder='user@email.com'></input>
            </div>
            <div>
              <label htmlFor='password'>password</label>
              <input name='password' onChange={this
                .handleChange
                .bind(this, 'password')} type='password' placeholder='password1'></input>
            </div>
            <div>
              <input type='submit'></input>
            </div>
          </fieldset>
        </form>
        <Link to="restricted">Restricted</Link>
      </div>
    );
  }
}
