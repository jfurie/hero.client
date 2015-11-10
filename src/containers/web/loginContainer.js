import React, {
  PropTypes
} from 'react';
import * as authActions from '../../modules/auth';
import {connect} from 'react-redux';

@connect(state => ({
  user: state.auth.user
}), authActions)
export class LoginPage extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    onSubmit: PropTypes.func
  }
  constructor () {
    super();

  }
  onSubmit (e) {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props
        .onSubmit(this.state);
    }
    this.props
      .login(this.state.email, this.state.password);
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
        <form onSubmit={this
          .onSubmit
          .bind(this)}>
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
      </div>
    );
  }
}
