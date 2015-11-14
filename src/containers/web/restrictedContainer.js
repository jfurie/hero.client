import React from 'react';
import { Header } from '../../components/web';

class RestrictedPage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Header />
        <h1>Restricted Area</h1>
        <img src='https://media.giphy.com/media/3QoWqgKgTYMG4/giphy.gif' />
      </div>);
  }
}

export default RestrictedPage;
