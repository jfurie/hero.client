import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import { ContactListItem } from '../../../components/web';
import { createContactFavorite, deleteContactFavorite } from '../../../modules/favorites';

import getContactDataFromState from '../../../dataHelpers/contact';
@connect((state, props) => {
  let contactId = props.contactId;

  return {
    contact: getContactDataFromState(state, contactId),
  };
},{ pushState, createContactFavorite, deleteContactFavorite })
export default class ContactCardContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  openDetails() {
    let {contact} = this.props;

    this.props.pushState(null, `/contacts/${contact.get('id')}`);
  }

  favoriteContact() {
    let {contact} = this.props;

    this.props.createContactFavorite(contact.get('id'));
  }

  unfavoriteContact() {
    let {contact} = this.props;

    this.props.deleteContactFavorite(contact.get('id'));
  }

  render(){
    let {contact} = this.props;

    return (
      <ContactListItem
          onContactClick={this.openDetails.bind(this)}
          contact={contact}
          favoriteContact={this.favoriteContact.bind(this)}
          unfavoriteContact={this.unfavoriteContact.bind(this)}
      />
    );
  }
}
