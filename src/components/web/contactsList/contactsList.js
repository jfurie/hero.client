import React from 'react';
import { List } from 'material-ui';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ContactCardContainer from '../../../containers/web/contacts/contactCardContainer';
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

  favoriteContact(contact) {
    if (this.props.favoriteContact) {
      this.props.favoriteContact(contact);
    }
  }

  unfavoriteContact(contact) {
    if (this.props.unfavoriteContact) {
      this.props.unfavoriteContact(contact);
    }
  }

  render() {
    let { contacts, company, type } = this.props;

    let contactCount;

    if (Array.isArray(contacts)) {
      contactCount = contacts.length;
    }
    else {
      contactCount = contacts.size;
    }

    contacts = contacts.sort((a, b) => {
      return a.get('displayName').localeCompare(b.get('displayName'));
    });

    return (
      <List style={{backgroundColor: 'transparent'}} subheader={`${contactCount} Contact${(contactCount !== 1) ? ('s') : ('')}`}>
        {contacts.map((contact) => {
          return (
            <div>
              <ContactCardContainer
                  onContactClick={this._showContactDetails.bind(this)}
                  contactId={contact.get('id')}
                  company={company}
                  type={type}
                  favoriteContact={this.favoriteContact.bind(this)}
                  unfavoriteContact={this.unfavoriteContact.bind(this)}
              />
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
