import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { List } from 'material-ui';
import { ContactListItem } from '../../../components/web';

@connect(() => (
{}), {pushState})
class CandidatesList extends React.Component {

  constructor(props) {
    super(props);
  }

  openDetails(candidate) {
    this.props.pushState(null, `/contacts/${candidate.get('id')}`);
  }

  render() {
    let { candidates } = this.props;

    let candidateCount;

    if (Array.isArray(candidates)) {
      candidateCount = candidates.length;
    }
    else {
      candidateCount = candidates.size;
    }

    return (
      <List style={{backgroundColor: 'transparent'}} subheader={`${candidateCount} Candidate${(candidateCount !== 1) ? ('s') : ('')}`}>
          {candidates.map((candidate, key) => {
            return (
              <ContactListItem key={key} contact={candidate.get('contact')} company={candidate.get('company')} onContactClick={this.openDetails.bind(this)}/>
            );
          })}
      </List>
    );
  }
}

export default CandidatesList;
