import React from 'react';
import { connect } from 'react-redux';
import { Header, ContactsList } from '../../../components/web';
import { getMyContacts } from '../../../modules/contacts';

@connect(state => ({
  contacts: state.contacts,
  auth: state.auth,
}), { getMyContacts })
class MyCandidatesPage extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getMyContacts();
  }

  render() {

    let {contacts} = this.props;

    return (
      <div>
        <Header title={'Candidates'}/>
        <ContactsList contacts={contacts.myContactIds} />
      </div>);
  }
}

export default MyCandidatesPage;
