import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {

  render() {

    return (
      <div>
        <Link to="/">home</Link><span> | </span>
        <Link to="/login">login</Link><span> | </span>
        <Link to="/settings">settings</Link><span> | </span>
        <Link to="/contacts">contacts</Link><span> | </span>
        <Link to="/logout">logout</Link>
      </div>
    );
  }
}

export default Header;
