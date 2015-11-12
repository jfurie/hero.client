import React, {
  PropTypes
} from 'react';

import { logout } from '../../reducers/auth';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';

@connect(state => ({
  user: state.auth.user
}), {logout, pushState})
export class LogoutPage extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
    onSubmit: PropTypes.func,
    pushState: PropTypes.func.isRequired
  }

  constructor () {
    super();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (this.props.user && !nextProps.user) { // logout
      this.props.pushState(null, '/');
    }
  }

  onSubmit (e) {
    e.preventDefault();
    this.props.logout();
  }
  // handleChange (item, e) {
  //   let newState = {};
  //   newState[item] = e.target.value;
  //   this.setState(newState);
  // }
  render () {
    return (
      <div>
        <h1>Logout</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <fieldset>
            <div>
              <button type='submit'>Logout</button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
