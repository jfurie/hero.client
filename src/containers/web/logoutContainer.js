import React from 'react';
import { logout } from '../../modules/auth';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header } from '../../components/web';

@connect(state => ({
  user: state.auth.user,
}), {logout, pushState})
class LogoutPage extends React.Component {

  constructor() {
    super();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user && !nextProps.user) { // logout
      this.props.pushState(null, '/');
    }
  }

  onSubmit (e) {
    e.preventDefault();
    this.props.logout();
  }

  render () {
    return (
      <div>
        <Header />
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

export default LogoutPage;
