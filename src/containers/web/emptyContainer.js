import React from 'react';
import { connect } from 'react-redux';

@connect(state => ({ type: state.router.location.query.type }))
class Empty extends React.Component {
  constructor() {
    super();
  }
  render() {

    return (
      <div>
      </div>);
  }
}

export default Empty;
