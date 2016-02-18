import React from 'react';
import { connect } from 'react-redux';
import { Header, CandidatesList } from '../../../components/web';
import { getMyCandidates } from '../../../modules/contacts';

@connect(state => ({
  candidates: state.candidates,
  auth: state.auth,
}), { getMyCandidates })
class MyCandidatesPage extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getMyContacts();
  }

  render() {

    let {candidates} = this.props;

    return (
      <div>
        <Header title={'Candidates'}/>
        <CandidatesList contacts={candidates.myCandidateIds} />
      </div>);
  }
}

export default MyCandidatesPage;
