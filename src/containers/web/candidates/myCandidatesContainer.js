import React from 'react';
import { connect } from 'react-redux';
import { Header, CandidatesList } from '../../../components/web';
import { getAllContacts } from '../../../modules/contacts';

@connect(state => ({
  contacts: state.contacts,
}), {getAllContacts})
class MyCandidatesPage extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    let self = this;
    setTimeout(()=>{
      self.props.getAllContacts();
    },500);
  }

  render() {

    let {contacts} = this.props;

    return (
      <div>
        <Header title={'Candidates'}/>
        <CandidatesList candidates={contacts.list} />
      </div>);
  }
}

export default MyCandidatesPage;
