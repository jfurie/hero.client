import React from 'react';
import { Link } from 'react-router';
class HomePage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <h1>Hero.jobs</h1>
        <Link to='login'>Login</Link>
      </div>);
  }
}

export default HomePage;
