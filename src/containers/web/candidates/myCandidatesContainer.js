import React from 'react';
import { connect } from 'react-redux';
import { Header, CandidatesList } from '../../../components/web';
import { getAllUserCandidates } from '../../../modules/candidates';

function filterMyCandidates(candidates, auth) {

  let userId = auth.authToken.userId;

  // grab the candidates for this job
  let myCandidates = [];
  if (userId && candidates && candidates.byUserId && candidates.list) {
    if (candidates.byUserId.size > 0) {
      candidates.byUserId.get(userId).forEach(function(candidateId) {
        let c = candidates.list.get(candidateId);
        if (c) {
          myCandidates.push(c);
        }
      });
    }
  }

  return myCandidates;
}

@connect(state => ({
  candidates: filterMyCandidates(state.candidates, state.auth),
  auth: state.auth,
}), { getAllUserCandidates })
class MyCandidatesPage extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getAllUserCandidates(this.props.auth.authToken.userId);
  }

  render() {

    let {candidates} = this.props;

    return (
      <div>
        <Header title={'Candidates'}/>
        <CandidatesList candidates={candidates} />
      </div>);
  }
}

export default MyCandidatesPage;
