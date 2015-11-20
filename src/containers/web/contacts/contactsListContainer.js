import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../../components/web';

@connect(state => ({
  user: state.auth.user,
}))
class ContactListPage extends React.Component {
  constructor() {
    super();
  }
  render() {

    return (
      <div>
        <Header />
        <h1>Contacts</h1>
      </div>);
  }
}

export default ContactListPage;
