import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Header, ContactsList , ActionButton, ActionButtonItem } from '../../../components/web';
import { getMyCandidates } from '../../../modules/candidates';
import { Styles } from 'material-ui';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
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
  onContactSearchOpen() {
    this.refs.actionButtons.close();
    this.props.history.pushState(null,`/contacts/search`);
  }

  render() {
    let {contacts} = this.props;
    let actions = [
      <ActionButtonItem title={'Contact'} color={Styles.Colors.green500} itemTapped={this.onContactSearchOpen.bind(this)}>
        <ContentAdd />
      </ActionButtonItem>,
    ];
    return (
      <div>
        <Header title={'Candidates'}/>
        <ContactsList
            contacts={contacts}
        />
        <ActionButton ref="actionButtons" actions={actions}/>
      </div>);
  }
}

export default MyCandidatesPage;
