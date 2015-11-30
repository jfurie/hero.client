import React from 'react';
import { connect } from 'react-redux';
import { Header, ContactsList } from '../../../components/web';
import { getAllContacts } from '../../../modules/contacts';

@connect(state => ({
  contacts: state.contacts,
}), {getAllContacts})
class ContactListPage extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getAllContacts();
  }

  render() {

    let {contacts} = this.props;

    return (
      <div>
        <Header />
        <h1>Contacts ({contacts.list.count()})</h1>
        <ContactsList contacts={contacts.list} />
      </div>);
  }
}

export default ContactListPage;
