import React from 'react';
import { List } from 'material-ui';
import { ContactListItem } from '../../../components/web';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

@connect(() => (
{}), {pushState})
class ContactsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  _showContactDetails(contact) {
    this.props.pushState(null, `/contacts/${contact.get('id')}`);
  }

  render() {

    let { contacts, company, type } = this.props;

    let count = contacts.count();
    let ressourceName = 'Contact';

    if (count !== 1) {
      ressourceName += 's';
    }

    return (
      <List subheader={`${count} ${ressourceName}`}>
        {contacts.map((contact) => {
          return (
            <div>
              <ContactListItem onContactClick={this._showContactDetails.bind(this)} contact={contact} company={company} type={type} / >
            </div>
          );
        })}
      </List>
    );
  }
}

ContactsList.propTypes = {
  contacts: React.PropTypes.object.isRequired,
};

export default ContactsList;
