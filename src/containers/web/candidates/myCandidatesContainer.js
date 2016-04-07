import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Header, ContactsList } from '../../../components/web';
import { getMyCandidates } from '../../../modules/candidates';

import getContactDataFromState from '../../../dataHelpers/contact';

@connect((state) => {
  let contacts = new Immutable.Map();
  let contactsMap = {};
  state.candidates.list.forEach(candidate => {
    let contact = getContactDataFromState(state, candidate.get('contactId'));
    if (contact) {
      contactsMap[contact.get('id')] = contact;
    }
  });

  return {
    contacts: contacts.merge(contactsMap),
  };
}, { getMyCandidates })
class MyCandidatesPage extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getMyCandidates();
  }

  render() {
    let {contacts} = this.props;

    return (
      <div>
        <Header title={'Candidates'}/>
        <ContactsList
            contacts={contacts}
        />
      </div>);
  }
}

export default MyCandidatesPage;
