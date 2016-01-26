import React from 'react';
import { connect } from 'react-redux';
import { Header, CandidatesList } from '../../../components/web';
import { getAllAccountCandidates } from '../../../modules/candidates';

function filterMyCandidates(candidates, auth) {

  let accountId = auth.authToken.accountInfo.account.id;

  let myCandidates = [];
  if (accountId && candidates && candidates.byAccountId && candidates.list) {
    if (candidates.byAccountId.size > 0) {
      candidates.byAccountId.get(accountId).forEach(function(candidateId) {
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
}), { getAllAccountCandidates })
class MyCandidatesPage extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getAllAccountCandidates(this.props.auth.authToken.accountInfo.account.id);
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
