import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Header } from '../../components/web';

@connect(state => ({ type: state.router.location.query.type }))
class ErrorPage extends React.Component {
  constructor() {
    super();
  }
  render() {

    let {type} = this.props;

    return (
      <div>
        <Header />
        <div id='innerView'>
          <h1>Error!</h1>
          {(type && type == 'access') ? (
            <p>Your doesn't have the suffisent permissions to access this page.</p>
          ) : (
            <p>An error occured.</p>
          )}
          <Link to="/"> back to home</Link>
        </div>
      </div>);
  }
}

export default ErrorPage;
