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
    let self = this;
    setTimeout(()=>{
      self.props.getAllContacts();
    }, 500);
  }

  render() {

    let {contacts} = this.props;

    return (
      <div>
        <Header title="Contacts"/>
        {/*<h1>Contacts ({contacts.list.count()})</h1>*/}
        <div id="innerView">
          <ContactsList contacts={contacts.list} />
        </div>
      </div>);
  }
}

export default ContactListPage;
