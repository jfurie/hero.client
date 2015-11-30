import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {RaisedButton} from 'material-ui';
@connect(state => ({user: state.auth.user}))
class HomePage extends React.Component {
  constructor() {
    super();
  }
  handleTouchTap(){
    alert('tapped');
  }
  render () {

    let {
      user
    } = this.props;

    return (
      <div>
        {(user && user.email)
          ? (
            <p>hi
              {user.email}</p>
          )
          : (
            <p>hi guest</p>
          )}
        <h1>Hero.jobs</h1>
        <RaisedButton onTouchTap={this.handleTouchTap.bind(this)} label="Default"></RaisedButton>
        <Link to="login">Login</Link>
      </div>
    );
  }
}

export default HomePage;
